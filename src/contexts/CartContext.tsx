import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

type Product = Database['public']['Tables']['products']['Row']
type CartItem = Database['public']['Tables']['cart_items']['Row'] & {
  product: Product
}

interface CartContextType {
  items: CartItem[]
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  totalPrice: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchCartItems = async () => {
    if (!user) {
      setItems([])
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)

      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [user])

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      toast.error('Please sign in to add items to cart')
      return
    }

    try {
      // Check if item already exists in cart
      const existingItem = items.find(item => item.product_id === productId)
      
      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          })

        if (error) throw error
        await fetchCartItems()
        toast.success('Added to cart! 🛒')
      }
    } catch (error: any) {
      toast.error('Failed to add item to cart')
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      await fetchCartItems()
      toast.success('Item removed from cart')
    } catch (error: any) {
      toast.error('Failed to remove item')
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error
      await fetchCartItems()
    } catch (error: any) {
      toast.error('Failed to update quantity')
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error
      setItems([])
      toast.success('Cart cleared')
    } catch (error: any) {
      toast.error('Failed to clear cart')
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    loading,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
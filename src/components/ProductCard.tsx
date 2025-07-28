import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Database } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart')
      return
    }
    await addToCart(product.id)
  }

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image_url || ''}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay buttons */}
        <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            className="bg-white text-red-500 p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Age badge */}
        {product.age_range && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
            {product.age_range}
          </div>
        )}

        {/* Stock indicator */}
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Only {product.stock_quantity} left!
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-500 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-red-500">
              ${product.price}
            </span>
            <span className="text-sm text-gray-500">
              In stock: {product.stock_quantity}
            </span>
          </div>

          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="bg-gradient-to-r from-red-500 to-yellow-400 text-white px-6 py-3 rounded-full font-medium hover:from-red-600 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>

      {/* Mickey Mouse decoration */}
      <div className="absolute top-2 left-2 opacity-10 group-hover:opacity-30 transition-opacity">
        <div className="w-8 h-8 bg-black rounded-full relative">
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-black rounded-full"></div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-black rounded-full"></div>
        </div>
      </div>
    </motion.div>
  )
}
import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { supabase, Database } from './lib/supabase'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Header from './components/Header'
import Hero from './components/Hero'
import CategoryFilter from './components/CategoryFilter'
import ProductCard from './components/ProductCard'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
      setFilteredProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  // Filter products based on category and search
  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header onSearch={handleSearch} />
          <Hero />
          
          <main className="container mx-auto px-4 py-12">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* Results Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {searchQuery ? `Search results for "${searchQuery}"` : 
                 selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 
                 'All Products'}
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} magical items found
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-t-2xl"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-black rounded-full relative">
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-black rounded-full"></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-black rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search or browse different categories to find the magical items you're looking for!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center relative">
                <div className="w-10 h-10 bg-white rounded-full"></div>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-black rounded-full"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-black rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Mickey's Magical Store</h3>
              <p className="text-yellow-200 mb-6">Where dreams come true for kids everywhere!</p>
              <p className="text-sm opacity-75">© 2024 Mickey's Magical Store. All rights reserved.</p>
            </div>
          </footer>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              },
            }}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
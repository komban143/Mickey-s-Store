import React, { useState } from 'react'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import AuthModal from './AuthModal'
import CartSidebar from './CartSidebar'

interface HeaderProps {
  onSearch: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <>
      <motion.header 
        className="bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 shadow-xl relative overflow-hidden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Mickey Mouse ears decoration */}
        <div className="absolute top-0 left-10 w-8 h-8 bg-black rounded-full transform -translate-y-4"></div>
        <div className="absolute top-0 right-10 w-8 h-8 bg-black rounded-full transform -translate-y-4"></div>
        
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-black rounded-full"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-black rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">Mickey's Store</h1>
                <p className="text-yellow-200 text-sm">Magical Shopping for Kids</p>
              </div>
            </motion.div>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for magical items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-4 pr-12 rounded-full border-2 border-white bg-white/90 focus:bg-white focus:outline-none focus:border-yellow-300 text-gray-800 placeholder-gray-500"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-red-600 p-2 rounded-full transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">Hi, {user.email?.split('@')[0]}!</span>
                  <button
                    onClick={() => signOut()}
                    className="bg-white text-red-500 px-4 py-2 rounded-full font-medium hover:bg-yellow-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-red-500 px-6 py-2 rounded-full font-medium hover:bg-yellow-100 transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </motion.button>
              )}

              <motion.button
                onClick={() => setShowCartSidebar(true)}
                className="relative bg-white text-red-500 p-3 rounded-full hover:bg-yellow-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={totalItems}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden bg-white text-red-500 p-2 rounded-full"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for magical items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 pr-12 rounded-full border-2 border-white bg-white/90 focus:bg-white focus:outline-none focus:border-yellow-300 text-gray-800 placeholder-gray-500"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-red-600 p-2 rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              className="absolute top-0 right-0 w-80 h-full bg-gradient-to-b from-red-500 to-yellow-400 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-white text-xl font-bold">Menu</h3>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="bg-white text-red-500 p-2 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {user ? (
                    <>
                      <div className="text-white mb-4">
                        <p className="font-medium">Hi, {user.email?.split('@')[0]}!</p>
                      </div>
                      <button
                        onClick={() => {
                          signOut()
                          setShowMobileMenu(false)
                        }}
                        className="w-full bg-white text-red-500 py-3 rounded-full font-medium hover:bg-yellow-100 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthModal(true)
                        setShowMobileMenu(false)
                      }}
                      className="w-full bg-white text-red-500 py-3 rounded-full font-medium hover:bg-yellow-100 transition-colors flex items-center justify-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowCartSidebar(true)
                      setShowMobileMenu(false)
                    }}
                    className="w-full bg-white text-red-500 py-3 rounded-full font-medium hover:bg-yellow-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart ({totalItems})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
    </>
  )
}
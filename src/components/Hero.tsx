import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, Gift } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-red-500 via-yellow-400 to-pink-500 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white rounded-full opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * 600,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, -50, null],
              x: [null, Math.random() * 100 - 50, null],
              rotate: 360
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Mickey's
              <br />
              <span className="text-yellow-300">Magical</span>
              <br />
              Store
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/90 mb-8 max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover enchanting toys, clothes, and accessories that bring Disney magic to life for your little ones!
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="bg-white text-red-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-100 transition-colors flex items-center justify-center space-x-2 shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Start Shopping</span>
              </motion.button>
              
              <motion.button
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-500 transition-colors flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gift className="w-5 h-5" />
                <span>Gift Cards</span>
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div
              className="flex flex-wrap gap-6 mt-12 justify-center md:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Star, text: 'Premium Quality' },
                { icon: Gift, text: 'Free Gift Wrap' },
                { icon: ShoppingBag, text: 'Fast Shipping' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-white">
                  <feature.icon className="w-5 h-5 text-yellow-300" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Mickey Mouse Illustration */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Main Mickey Head */}
              <motion.div
                className="w-64 h-64 bg-black rounded-full mx-auto relative shadow-2xl"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Mickey Ears */}
                <div className="absolute -top-16 -left-16 w-24 h-24 bg-black rounded-full shadow-xl"></div>
                <div className="absolute -top-16 -right-16 w-24 h-24 bg-black rounded-full shadow-xl"></div>
                
                {/* Mickey Face */}
                <div className="absolute inset-8 bg-yellow-200 rounded-full flex items-center justify-center">
                  {/* Eyes */}
                  <div className="absolute top-12 left-12 w-8 h-8 bg-black rounded-full"></div>
                  <div className="absolute top-12 right-12 w-8 h-8 bg-black rounded-full"></div>
                  
                  {/* Nose */}
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-black rounded-full"></div>
                  
                  {/* Smile */}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-16 h-8 border-4 border-black border-t-0 rounded-b-full"></div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6 bg-yellow-300 rounded-full shadow-lg"
                  style={{
                    top: `${20 + (i * 60)}%`,
                    left: `${10 + (i % 2) * 80}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                    rotate: 360
                  }}
                  transition={{
                    duration: 2 + (i * 0.5),
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
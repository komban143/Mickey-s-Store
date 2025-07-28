import React from 'react'
import { motion } from 'framer-motion'
import { Database } from '../lib/supabase'

type Category = Database['public']['Tables']['categories']['Row']

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <div className="w-6 h-6 bg-red-500 rounded-full mr-3 relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full"></div>
        </div>
        Shop by Category
      </h2>
      
      <div className="flex flex-wrap gap-3">
        <motion.button
          onClick={() => onCategoryChange(null)}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-red-500 to-yellow-400 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Items
        </motion.button>
        
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-red-500 to-yellow-400 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
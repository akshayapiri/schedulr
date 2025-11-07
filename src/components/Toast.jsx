import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

/**
 * Toast Component
 * Displays temporary notification messages at the top of the screen
 * Automatically dismisses after 3 seconds
 * 
 * @param {string} message - The message to display
 * @param {string} type - Type of toast ('success' or 'error')
 * @param {Function} onClose - Callback when toast is dismissed
 */
export default function Toast({ message, type = 'success', onClose }) {
  const { theme } = useTheme()

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -50, x: '-50%' }}
        className={`fixed top-20 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl ${
          type === 'success'
            ? theme === 'dark'
              ? 'bg-green-600 text-white'
              : 'bg-green-500 text-white'
            : theme === 'dark'
            ? 'bg-red-600 text-white'
            : 'bg-red-500 text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{type === 'success' ? '✓' : '✕'}</span>
          <p className="font-racing font-semibold">{message}</p>
          <button
            onClick={onClose}
            className="ml-2 text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

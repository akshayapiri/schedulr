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

  const isSuccess = type === 'success'
  const iconName = isSuccess ? 'check_circle' : 'error'
  const baseClasses = isSuccess
    ? theme === 'dark'
      ? 'bg-emerald-600 text-emerald-50'
      : 'bg-emerald-500 text-white'
    : theme === 'dark'
    ? 'bg-rose-600 text-rose-50'
    : 'bg-rose-500 text-white'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -50, x: '-50%' }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        className={`fixed top-20 left-1/2 z-[100] shadow-2xl rounded-2xl px-5 py-3 ${baseClasses}`}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-rounded text-2xl" aria-hidden="true">{iconName}</span>
          <p className="font-racing font-semibold tracking-wide">{message}</p>
          <button
            onClick={onClose}
            className="ml-2 bg-white/10 hover:bg-white/20 rounded-full p-1 transition"
            aria-label="Dismiss notification"
            type="button"
          >
            <span className="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

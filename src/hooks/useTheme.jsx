import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'schedulr-theme'

function initializeTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
  } catch (error) {
    // localStorage might be unavailable (e.g., during tests);
    // fall through to return default theme.
  }
  return 'light'
}

function applyThemeToDocument(theme) {
  const html = document.documentElement
  const body = document.body

  if (theme === 'dark') {
    html.classList.add('dark')
    body.classList.add('dark')
  } else {
    html.classList.remove('dark')
    body.classList.remove('dark')
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const initial = initializeTheme()
    applyThemeToDocument(initial)
    return initial
  })

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (error) {
      // Ignore write errors (e.g., storage full or unavailable).
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Custom hook for accessing theme (light/dark mode)
 * Persists theme preference in localStorage via ThemeProvider
 *
 * @returns {Object} { theme, toggleTheme } - Current theme and toggle function
 */
export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}


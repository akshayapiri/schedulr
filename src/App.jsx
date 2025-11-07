import React, { useState, useEffect } from 'react'
import TimetableGrid from './components/TimetableGrid'
import ClassModal from './components/ClassModal'
import Header from './components/Header'
import Toast from './components/Toast'
import ClassDetailsModal from './components/ClassDetailsModal'
import { useTheme } from './hooks/useTheme'
import { useLocalStorage } from './hooks/useLocalStorage'
import { detectOverlaps } from './utils/overlapDetection'
import { AnimatePresence } from 'framer-motion'

/**
 * Main App Component
 * Schedulr - Weekly Timetable Application
 * 
 * Features:
 * - Add, edit, and delete classes with subject, teacher, room, and time
 * - Weekly grid view (Monday-Sunday, 8AM-8PM)
 * - Overlap detection with red highlighting
 * - Light/dark mode toggle
 * - LocalStorage persistence
 * - JSON export/import
 * - Mobile-responsive design with stacked day view
 * - Smooth animations with Framer Motion
 */
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DEFAULT_COLORS = ['#4C586B', '#C1A27F', '#5F6977', '#8B5CF6', '#EF4444']

function App() {
  const { theme, toggleTheme } = useTheme()
  
  /**
   * Sample data to populate the timetable on first load
   * This data is only used if localStorage is empty (first-time users)
   * Once the user adds/edits classes, their data is saved to localStorage
   */
  const sampleData = [
    {
      id: '1',
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      color: DEFAULT_COLORS[0],
      description: ''
    },
    {
      id: '2',
      subject: 'Physics',
      teacher: 'Prof. Johnson',
      day: 'Monday',
      startTime: '11:00',
      endTime: '12:30',
      color: DEFAULT_COLORS[1],
      description: ''
    },
    {
      id: '3',
      subject: 'Chemistry',
      teacher: 'Dr. Williams',
      day: 'Wednesday',
      startTime: '09:00',
      endTime: '10:30',
      color: DEFAULT_COLORS[2],
      description: ''
    },
    {
      id: '4',
      subject: 'English Literature',
      teacher: 'Ms. Davis',
      day: 'Tuesday',
      startTime: '14:00',
      endTime: '15:30',
      color: DEFAULT_COLORS[3],
      description: ''
    },
    {
      id: '5',
      subject: 'Computer Science',
      teacher: 'Mr. Brown',
      day: 'Thursday',
      startTime: '10:00',
      endTime: '11:30',
      color: DEFAULT_COLORS[4],
      description: ''
    },
    {
      id: '6',
      subject: 'History',
      teacher: 'Dr. Miller',
      day: 'Friday',
      startTime: '13:00',
      endTime: '14:30',
      color: DEFAULT_COLORS[0],
      description: ''
    }
  ]
  
  // State management with localStorage persistence
  // If localStorage is empty, sampleData will be used as initial value
  const [classes, setClasses] = useLocalStorage('schedulr-timetable', sampleData)
  const [savedTimetables, setSavedTimetables] = useLocalStorage('schedulr-saved-timetables', [])
  
  // UI state
  const [selectedClass, setSelectedClass] = useState(null) // Class being edited (null when adding new)
  const [isModalOpen, setIsModalOpen] = useState(false) // Modal visibility
  const [overlaps, setOverlaps] = useState(new Set()) // Set of overlapping class IDs
  const [toast, setToast] = useState({ message: '', type: 'success' }) // Toast notification
  const [detailsClass, setDetailsClass] = useState(null)

  /**
   * Detect overlapping classes whenever the classes array changes
   * Overlapping classes will be highlighted in red
   */
  useEffect(() => {
    const overlapSet = detectOverlaps(classes)
    setOverlaps(overlapSet)
  }, [classes])

  /**
   * Open modal to add a new class
   */
  const handleAddClass = () => {
    setDetailsClass(null)
    setSelectedClass(null)
    setIsModalOpen(true)
  }

  /**
   * Open modal to edit an existing class
   * @param {Object} classItem - The class to edit
   */
  const handleEditClass = (classItem) => {
    setDetailsClass(null)
    setSelectedClass(classItem)
    setIsModalOpen(true)
  }

  /**
   * Save a new or updated class
   * @param {Object} classData - The class data from the form
   */
  const handleSaveClass = (classData) => {
    if (selectedClass) {
      // Update existing class
      setClasses(prev => prev.map(c => c.id === selectedClass.id ? { ...classData, id: selectedClass.id } : c))
      setToast({ message: 'Class updated successfully!', type: 'success' })
    } else {
      // Add new class with unique ID
      setClasses(prev => [...prev, { ...classData, id: Date.now().toString() }])
      setToast({ message: 'Class added successfully!', type: 'success' })
    }
    setIsModalOpen(false)
    setSelectedClass(null)
  }

  /**
   * Delete a class by ID
   * @param {string} id - The ID of the class to delete
   */
  const handleDeleteClass = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id))
    setToast({ message: 'Class deleted successfully!', type: 'success' })
    setDetailsClass((prev) => (prev && prev.id === id ? null : prev))
  }

  const handleSelectClass = (classItem) => {
    setDetailsClass(classItem)
  }

  const handleCloseDetails = () => {
    setDetailsClass(null)
  }

  const handleDuplicateClass = (classItem) => {
    const { id: _ignored, ...rest } = classItem
    const duplicated = { ...rest, id: Date.now().toString() }
    setClasses(prev => [...prev, duplicated])
    setToast({ message: 'Class duplicated successfully!', type: 'success' })
  }

  const handleMoveClass = (classId, updates) => {
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, ...updates } : c))
    setDetailsClass(prev => (prev && prev.id === classId ? { ...prev, ...updates } : prev))
  }

  /**
   * Export timetable data as JSON file
   */
  const handleExport = () => {
    const dataStr = JSON.stringify(classes, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'schedulr-timetable.json'
    link.click()
    URL.revokeObjectURL(url)
    setToast({ message: 'Timetable exported successfully!', type: 'success' })
  }

  /**
   * Import timetable data from JSON file
   * @param {Event} event - File input change event
   */
  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const raw = JSON.parse(e.target.result)
          let importedArray = []

          if (Array.isArray(raw)) {
            importedArray = raw
          } else if (raw && typeof raw === 'object') {
            if (Array.isArray(raw.classes)) {
              importedArray = raw.classes
            } else if (Array.isArray(raw.data)) {
              importedArray = raw.data
            }
          }

          if (!Array.isArray(importedArray) || importedArray.length === 0) {
            setToast({ message: 'Invalid file format', type: 'error' })
            return
          }

          const normalized = importedArray
            .map((item, index) => {
              if (!item || typeof item !== 'object') return null
              const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
              return {
                id: item.id || Date.now().toString() + index,
                subject: item.subject || 'Untitled Class',
                teacher: item.teacher || '',
                day: DAYS.includes(item.day) ? item.day : 'Monday',
                startTime: item.startTime || '09:00',
                endTime: item.endTime || '10:00',
                color,
                description: item.description || ''
              }
            })
            .filter(Boolean)

          if (normalized.length === 0) {
            setToast({ message: 'No valid classes found in file', type: 'error' })
            return
          }

          setClasses(normalized)
          setToast({ message: 'Timetable imported successfully!', type: 'success' })
        } catch (error) {
          setToast({ message: 'Error importing file: ' + error.message, type: 'error' })
        }
      }
      reader.readAsText(file)
    }
    event.target.value = ''
  }

  /**
   * Create a new timetable (saves current one if it has classes)
   */
  const handleNewTimetable = () => {
    if (classes.length === 0) {
      // If no classes, just start fresh
      setClasses([])
      setToast({ message: 'New empty timetable created!', type: 'success' })
      return
    }

    // Save current timetable before clearing
    const timestamp = new Date().toISOString()
    const dateStr = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    
    const savedTimetable = {
      id: timestamp,
      name: `Timetable ${dateStr}`,
      classes: classes,
      savedAt: timestamp
    }

    const updatedSaved = [...savedTimetables, savedTimetable]
    setSavedTimetables(updatedSaved)
    
    // Clear current timetable
    setClasses([])
    
    setToast({ message: `Timetable saved as "${savedTimetable.name}"! Starting a new timetable.`, type: 'success' })
  }

  /**
   * Load a saved timetable
   * @param {Array} timetableClasses - The classes from the saved timetable
   * @param {string} timetableName - The name of the timetable
   */
  const handleLoadTimetable = (timetableClasses, timetableName) => {
    setClasses(timetableClasses)
    setToast({ message: `Loaded "${timetableName}"`, type: 'success' })
  }

  /**
   * Delete a saved timetable
   * @param {string} timetableId - The ID of the timetable to delete
   */
  const handleDeleteTimetable = (timetableId) => {
    setSavedTimetables(savedTimetables.filter(t => t.id !== timetableId))
    setToast({ message: 'Timetable deleted successfully!', type: 'success' })
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onAddClass={handleAddClass}
        onExport={handleExport}
        onImport={handleImport}
      />

      <main className="main-content">
        <div className="container">
          <TimetableGrid
            classes={classes}
            overlaps={overlaps}
            onSelectClass={handleSelectClass}
            onDuplicateClass={handleDuplicateClass}
            onDeleteClass={handleDeleteClass}
            onMoveClass={handleMoveClass}
          />
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <ClassModal
            classData={selectedClass}
            existingClasses={classes}
            onSave={handleSaveClass}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedClass(null)
            }}
          />
        )}
      </AnimatePresence>

      <ClassDetailsModal
        classData={detailsClass}
        isOpen={Boolean(detailsClass)}
        onClose={handleCloseDetails}
        onEdit={handleEditClass}
        onDuplicate={handleDuplicateClass}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  )
}

export default App
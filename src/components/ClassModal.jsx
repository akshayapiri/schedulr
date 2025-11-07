import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const EMPTY_FORM = {
  subject: '',
  teacher: '',
  day: 'Monday',
  startTime: '09:00',
  endTime: '10:00',
  color: '#4C586B',
  description: ''
}

export default function ClassModal({ classData, existingClasses, onSave, onClose }) {
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    if (classData) {
      setFormData({
        subject: classData.subject || '',
        teacher: classData.teacher || '',
        day: classData.day || 'Monday',
        startTime: classData.startTime || '09:00',
        endTime: classData.endTime || '10:00',
        color: classData.color || '#4C586B',
        description: classData.description || ''
      })
    } else {
      setFormData(EMPTY_FORM)
    }
  }, [classData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teacher' ? value : value
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (formData.startTime >= formData.endTime) {
      return
    }
    onSave(formData)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay show"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          onClick={(event) => event.stopPropagation()}
          className="modal"
        >
          <div className="modal-header">
            <h2>{classData ? 'Edit Class' : 'Add New Class'}</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Subject Name *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g., Mathematics"
              />
            </div>

            <div className="form-group">
              <label>Teacher (optional)</label>
              <input
                type="text"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                placeholder="e.g., Dr. Smith"
              />
            </div>

            <div className="form-group">
              <label>Day *</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
              >
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  min="08:00"
                  max="20:00"
                />
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  min="08:00"
                  max="20:00"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any notes or details about this class"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {classData ? 'Update Class' : 'Add Class'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

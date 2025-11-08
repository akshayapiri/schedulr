import React, { memo } from 'react'
import { motion } from 'framer-motion'

const hexToRgb = (hex) => {
  if (!hex) return null
  let normalized = hex.replace('#', '')
  if (normalized.length === 3) {
    normalized = normalized.split('').map(char => char + char).join('')
  }
  if (normalized.length !== 6) return null
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}

const getReadableTextColor = (hex) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return undefined
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.6 ? '#2F3145' : '#FDE9CF'
}

const applyAlpha = (hex, alpha) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return undefined
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

const springTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 22,
  mass: 0.7
}

/**
 * ClassBlock Component
 * Displays a class as a colored block on the timetable
 * Shows subject, teacher, room, and time information
 * Highlights in red if overlapping with another class
 * 
 * @param {Object} classItem - The class data to display
 * @param {number} top - Top position in pixels (desktop only)
 * @param {number} left - Left position as percentage (desktop only)
 * @param {number} width - Width as percentage (desktop only)
 * @param {number} height - Height in pixels (desktop only)
 * @param {boolean} isOverlapping - Whether this class overlaps with another
 * @param {Function} onEdit - Callback when class is clicked to edit
 * @param {Function} onDelete - Callback when delete button is clicked
 * @param {boolean} isMobile - Whether to render in mobile view
 */
function ClassBlock({
  classItem,
  top,
  left,
  width,
  height,
  isOverlapping,
  onSelect,
  onDuplicate,
  onDelete,
  isMobile = false,
  onDragStart,
  dragPosition,
  isDragging
}) {
  const backgroundColor = classItem.color
  const textColor = backgroundColor ? getReadableTextColor(backgroundColor) : undefined
  const borderColor = backgroundColor ? applyAlpha(backgroundColor, 0.55) : undefined
  const baseShadow = backgroundColor
    ? `0 18px 36px -18px ${applyAlpha(textColor === '#FDE9CF' ? '#000000' : '#242D4C', textColor === '#FDE9CF' ? 0.55 : 0.2)}`
    : undefined

  const hoverAnimation = isDragging ? {} : { translateY: -4, scale: 1.02 }

  if (isMobile) {
    const mobileStyle = {
      background: backgroundColor || undefined,
      color: textColor || undefined,
      borderColor: borderColor,
      boxShadow: baseShadow
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        transition={springTransition}
        whileHover={{ translateY: -6, scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        className={`mobile-class-card ${isOverlapping ? 'overlapping' : ''}`}
        style={mobileStyle}
        onClick={() => onSelect(classItem)}
      >
        <div className="mobile-class-header">
          <div className="mobile-class-title-row">
            <div className="mobile-class-title">{classItem.subject}</div>
            <span className="mobile-class-day-badge">{classItem.day.slice(0, 3)}</span>
          </div>
          <div className="mobile-class-actions">
            <button
              className="class-block-duplicate"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate(classItem)
              }}
              title="Duplicate"
              type="button"
            >
              <span className="material-symbols-rounded" aria-hidden="true">content_copy</span>
            </button>
            <button
              className="class-block-delete"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(classItem.id)
              }}
              title="Delete"
              type="button"
            >
              <span className="material-symbols-rounded" aria-hidden="true">delete</span>
            </button>
          </div>
        </div>

        <div className="mobile-class-details">
          {classItem.teacher && (
            <div className="mobile-class-info">
              <span className="material-symbols-rounded mobile-class-icon" aria-hidden="true">person</span>
              <span>{classItem.teacher}</span>
            </div>
          )}
          <div className="mobile-class-info">
            <span className="material-symbols-rounded mobile-class-icon" aria-hidden="true">schedule</span>
            <span>{classItem.startTime} - {classItem.endTime}</span>
          </div>
          {classItem.description && (
            <div className="mobile-class-info">
              <span className="material-symbols-rounded mobile-class-icon" aria-hidden="true">notes</span>
              <span>{classItem.description}</span>
            </div>
          )}
        </div>

        {isOverlapping && (
          <div className="mobile-class-warning">
            <span className="material-symbols-rounded" aria-hidden="true">warning</span>
            <span>Time conflict detected!</span>
          </div>
        )}
      </motion.div>
    )
  }

  const style = {
    top: dragPosition ? `${dragPosition.top}px` : `${top}px`,
    left: dragPosition ? `${dragPosition.leftPercent}%` : `${left}%`,
    width: `calc(${width}% - 8px)`,
    height: `${height}px`,
    pointerEvents: 'auto',
    background: backgroundColor || undefined,
    color: textColor || undefined,
    borderColor: borderColor,
    boxShadow: baseShadow
  }

  if (isDragging) {
    style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3)'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={springTransition}
      whileHover={hoverAnimation}
      whileTap={{ scale: 0.98 }}
      className={`class-block ${isOverlapping ? 'overlapping' : ''} ${isDragging ? 'dragging' : ''}`}
      style={style}
      onClick={() => onSelect(classItem)}
      onPointerDown={(event) => {
        if (event.target.closest('button')) {
          return
        }
        if (onDragStart) {
          onDragStart(event, classItem)
        }
      }}
    >
      <div className="class-block-header">
        <div className="class-block-title">{classItem.subject}</div>
        <div className="class-block-actions">
          <button
            className="class-block-duplicate"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(classItem)
            }}
            title="Duplicate"
            type="button"
          >
            <span className="material-symbols-rounded" aria-hidden="true">content_copy</span>
          </button>
          <button
            className="class-block-delete"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(classItem.id)
            }}
            title="Delete"
            type="button"
          >
            <span className="material-symbols-rounded" aria-hidden="true">delete</span>
          </button>
        </div>
      </div>

      {classItem.teacher && (
        <div className="class-block-teacher">
          <span className="material-symbols-rounded class-block-icon" aria-hidden="true">person</span>
          <span>{classItem.teacher}</span>
        </div>
      )}

      {classItem.description && (
        <div className="class-block-description">
          <span className="material-symbols-rounded class-block-icon" aria-hidden="true">notes</span>
          <span>{classItem.description}</span>
        </div>
      )}

      <div className="class-block-time">
        <span className="material-symbols-rounded class-block-icon" aria-hidden="true">schedule</span>
        <span>{classItem.startTime} - {classItem.endTime}</span>
      </div>
    </motion.div>
  )
}

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.classItem === nextProps.classItem &&
    prevProps.top === nextProps.top &&
    prevProps.left === nextProps.left &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.isOverlapping === nextProps.isOverlapping &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.onDuplicate === nextProps.onDuplicate &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.dragPosition === nextProps.dragPosition
  )
}

export default memo(ClassBlock, arePropsEqual)

import React from 'react'

const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${period}`
}

export default function ClassDetailsModal({
  classData,
  isOpen,
  onClose,
  onEdit,
  onDuplicate
}) {
  if (!isOpen || !classData) {
    return null
  }

  return (
    <div className="modal-overlay show" onClick={() => onClose()}>
      <div className="modal details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{classData.subject}</h2>
          <button className="modal-close" onClick={() => onClose()} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="details-section">
            <div className="details-item">
              <span className="details-label">Subject:</span>
              <span className="details-value">{classData.subject}</span>
            </div>

            {classData.teacher && (
              <div className="details-item">
                <span className="details-label">Teacher:</span>
                <span className="details-value">{classData.teacher}</span>
              </div>
            )}

            <div className="details-item">
              <span className="details-label">Day:</span>
              <span className="details-value">{classData.day}</span>
            </div>

            <div className="details-item">
              <span className="details-label">Time:</span>
              <span className="details-value">
                {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => {
              onDuplicate(classData)
              onClose()
            }}
          >
            Duplicate
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onEdit(classData)
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => onClose()}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}


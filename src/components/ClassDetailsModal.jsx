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
            <span className="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="details-section">
            <div className="details-item">
              <span className="details-label">Subject</span>
              <span className="details-value">{classData.subject}</span>
            </div>

            {classData.teacher && (
              <div className="details-item">
                <span className="details-label">Teacher</span>
                <span className="details-value">{classData.teacher}</span>
              </div>
            )}

            <div className="details-item">
              <span className="details-label">Day</span>
              <span className="details-value">{classData.day}</span>
            </div>

            <div className="details-item">
              <span className="details-label">Time</span>
              <span className="details-value">
                {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
              </span>
            </div>

            {classData.description && (
              <div className="details-item">
                <span className="details-label">Notes</span>
                <span className="details-value details-description">{classData.description}</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary btn-with-icon"
            onClick={() => {
              onDuplicate(classData)
              onClose()
            }}
            type="button"
          >
            <span className="material-symbols-rounded" aria-hidden="true">content_copy</span>
            <span className="btn-label">Duplicate</span>
          </button>
          <button
            className="btn btn-primary btn-with-icon"
            onClick={() => {
              onEdit(classData)
            }}
            type="button"
          >
            <span className="material-symbols-rounded" aria-hidden="true">edit</span>
            <span className="btn-label">Edit</span>
          </button>
          <button
            className="btn btn-cancel btn-with-icon"
            onClick={() => onClose()}
            type="button"
          >
            <span className="material-symbols-rounded" aria-hidden="true">close</span>
            <span className="btn-label">Close</span>
          </button>
        </div>
      </div>
    </div>
  )
}


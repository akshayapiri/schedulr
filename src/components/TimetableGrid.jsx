import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import ClassBlock from './ClassBlock'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)

const START_MINUTES = HOURS[0] * 60
const TOTAL_MINUTES = HOURS.length * 60

const minutesToTime = (totalMinutes) => {
  const clamped = Math.max(0, totalMinutes)
  const hours = Math.floor(clamped / 60)
  const minutes = clamped % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const getHourPosition = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return ((hours - HOURS[0]) * 60 + minutes) / 60
}

const getClassHeight = (startTime, endTime) => {
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  return (endMinutes - startMinutes) / 60
}

export default function TimetableGrid({ classes, overlaps, onSelectClass, onDuplicateClass, onDeleteClass, onMoveClass }) {
  const classesByDay = useMemo(() => {
    const map = new Map()
    DAYS.forEach(day => {
      map.set(day, [])
    })
    classes.forEach(classItem => {
      const list = map.get(classItem.day) || []
      list.push(classItem)
      map.set(classItem.day, list)
    })
    return map
  }, [classes])

  const sortedClassesForMobile = useMemo(() => {
    return classes
      .map(item => ({ ...item, dayIndex: DAYS.indexOf(item.day) }))
      .sort((a, b) => {
        if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex
        return a.startTime.localeCompare(b.startTime)
      })
  }, [classes])

  const gridRef = useRef(null)
  const blocksRef = useRef(null)
  const [dragInfo, setDragInfo] = useState(null)

  useLayoutEffect(() => {
    if (!gridRef.current || !blocksRef.current) return
    const headerCell = gridRef.current.querySelector('.grid-header')
    if (!headerCell) return
    const headerHeight = headerCell.getBoundingClientRect().height
    blocksRef.current.style.top = `${headerHeight}px`
    blocksRef.current.style.height = `calc(100% - ${headerHeight}px)`
  }, [classes])

  const containerHeight = blocksRef.current ? blocksRef.current.getBoundingClientRect().height : HOURS.length * 60
  const minuteHeight = containerHeight / HOURS.length
  const blockWidthPercent = 100 / DAYS.length

  const handleClassDragStart = (event, classItem, dayIndex) => {
    if (event.button !== undefined && event.button !== 0) return
    if (!blocksRef.current) return

    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch (error) {
        // ignore unsupported pointer capture
      }
    }

    const containerRect = blocksRef.current.getBoundingClientRect()
    const blockRect = event.currentTarget.getBoundingClientRect()

    const minuteHeightLocal = containerRect.height / HOURS.length
    const blockHeight = getClassHeight(classItem.startTime, classItem.endTime) * minuteHeightLocal
    const blockWidth = containerRect.width / DAYS.length
    const durationMinutes = getClassHeight(classItem.startTime, classItem.endTime) * 60

    const meta = {
      classItem,
      dayIndex,
      containerRect,
      minuteHeight: minuteHeightLocal,
      blockHeight,
      blockWidth,
      offsetX: event.clientX - blockRect.left,
      offsetY: event.clientY - blockRect.top,
      durationMinutes,
      initialTop: blockRect.top - containerRect.top,
      initialLeft: blockRect.left - containerRect.left,
      latestTop: blockRect.top - containerRect.top,
      latestDayIndex: dayIndex,
      moved: false
    }

    setDragInfo({
      id: classItem.id,
      top: meta.latestTop,
      leftPercent: ((blockRect.left - containerRect.left) / containerRect.width) * 100
    })

    const handlePointerMove = (moveEvent) => {
      moveEvent.preventDefault()
      let newTop = moveEvent.clientY - meta.containerRect.top - meta.offsetY
      let newLeft = moveEvent.clientX - meta.containerRect.left - meta.offsetX

      newTop = Math.max(0, Math.min(newTop, meta.containerRect.height - meta.blockHeight))
      newLeft = Math.max(0, Math.min(newLeft, meta.containerRect.width - meta.blockWidth))

      if (!meta.moved) {
        const moveDistance = Math.hypot(newTop - meta.initialTop, newLeft - meta.initialLeft)
        if (moveDistance > 3) {
          meta.moved = true
        }
      }

      meta.latestTop = newTop
      meta.latestDayIndex = Math.min(DAYS.length - 1, Math.max(0, Math.round(newLeft / meta.blockWidth)))

      const leftPercent = (newLeft / meta.containerRect.width) * 100
      setDragInfo(prev => (prev && prev.id === classItem.id) ? { ...prev, top: newTop, leftPercent } : prev)
    }

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
      setDragInfo(null)

      if (!meta.moved) {
        onSelectClass(meta.classItem)
        return
      }

      const maxStart = TOTAL_MINUTES - meta.durationMinutes
      let minutesFromStart = (meta.latestTop / meta.minuteHeight) * 60
      minutesFromStart = Math.max(0, Math.min(maxStart, minutesFromStart))
      const quantized = Math.round(minutesFromStart / 5) * 5
      const startMinutes = START_MINUTES + quantized
      const endMinutes = Math.min(START_MINUTES + TOTAL_MINUTES, startMinutes + meta.durationMinutes)

      const newDay = DAYS[meta.latestDayIndex]

      onMoveClass(meta.classItem.id, {
        day: newDay,
        startTime: minutesToTime(startMinutes),
        endTime: minutesToTime(endMinutes)
      })
    }

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }

  const isDragging = (classId) => dragInfo && dragInfo.id === classId

  return (
    <>
      <div className="timetable-wrapper desktop-view">
        <div ref={gridRef} className="timetable-grid">
          <div className="grid-header time-header" />
          {DAYS.map(day => (
            <div key={`header-${day}`} className="grid-header day-header">
              {day.slice(0, 3)}
            </div>
          ))}

          {HOURS.map(hour => (
            <React.Fragment key={`row-${hour}`}>
              <div className="time-slot">{hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}</div>
              {DAYS.map(day => (
                <div key={`${day}-${hour}`} className="grid-cell" />
              ))}
            </React.Fragment>
          ))}
        </div>

        <div ref={blocksRef} id="classBlocksContainer" className="class-blocks-container">
          {DAYS.map((day, dayIndex) => {
            const dayClasses = classesByDay.get(day) || []
            return dayClasses.map((classItem) => {
              const top = getHourPosition(classItem.startTime) * minuteHeight
              const height = getClassHeight(classItem.startTime, classItem.endTime) * minuteHeight
              const leftPercent = dayIndex * blockWidthPercent
              const isOverlapping = overlaps.has(classItem.id)

              const dragging = isDragging(classItem.id)
              const dragPosition = dragging ? dragInfo : null

              return (
                <ClassBlock
                  key={classItem.id}
                  classItem={classItem}
                  top={top}
                  left={leftPercent}
                  width={blockWidthPercent}
                  height={height}
                  isOverlapping={isOverlapping}
                  onSelect={onSelectClass}
                  onDuplicate={onDuplicateClass}
                  onDelete={onDeleteClass}
                  onDragStart={(event, item) => handleClassDragStart(event, item, dayIndex)}
                  dragPosition={dragPosition}
                  isDragging={dragging}
                />
              )
            })
          })}
        </div>
      </div>

      <div className="mobile-view">
        {sortedClassesForMobile.length === 0 ? (
          <div className="mobile-empty-state">
            <p className="empty-state-text">No classes scheduled</p>
            <p className="empty-state-hint">Tap "+ Add Class" to get started!</p>
          </div>
        ) : (
          <div className="mobile-classes-container">
            {sortedClassesForMobile.map(classItem => (
              <ClassBlock
                key={`mobile-${classItem.id}`}
                classItem={classItem}
                isOverlapping={overlaps.has(classItem.id)}
                onSelect={onSelectClass}
                onDuplicate={onDuplicateClass}
                onDelete={onDeleteClass}
                isMobile
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

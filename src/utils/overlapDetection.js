/**
 * Detect overlapping classes in the timetable
 * Two classes overlap if they are on the same day and their time ranges intersect
 * 
 * @param {Array} classes - Array of class objects with day, startTime, endTime, and id
 * @returns {Set} Set of class IDs that overlap with at least one other class
 */
export function detectOverlaps(classes) {
  const overlaps = new Set()
  
  /**
   * Convert time string (HH:MM) to minutes since midnight
   * @param {string} time - Time in HH:MM format
   * @returns {number} Minutes since midnight
   */
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Group classes by day for efficient overlap checking
  const classesByDay = {}
  classes.forEach(cls => {
    if (!classesByDay[cls.day]) {
      classesByDay[cls.day] = []
    }
    classesByDay[cls.day].push(cls)
  })

  // Check for overlaps within each day
  Object.values(classesByDay).forEach(dayClasses => {
    // Compare each class with every other class on the same day
    for (let i = 0; i < dayClasses.length; i++) {
      for (let j = i + 1; j < dayClasses.length; j++) {
        const class1 = dayClasses[i]
        const class2 = dayClasses[j]
        
        const start1 = timeToMinutes(class1.startTime)
        const end1 = timeToMinutes(class1.endTime)
        const start2 = timeToMinutes(class2.startTime)
        const end2 = timeToMinutes(class2.endTime)
        
        // Check if time ranges overlap: start1 < end2 && end1 > start2
        if ((start1 < end2 && end1 > start2)) {
          overlaps.add(class1.id)
          overlaps.add(class2.id)
        }
      }
    }
  })

  return overlaps
}

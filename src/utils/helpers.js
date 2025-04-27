
export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Get time of day based on current hour
export const getTimeOfDay = () => {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  if (hour < 21) return 'Evening'
  return 'Before Bed'
}

// Calculate streak of consecutive days where all medications were taken
export const calculateStreak = (medications) => {
  if (!medications.length) return 0
  
  // Get today's date for comparison
  const today = new Date().toISOString().split('T')[0]
  
  // Track days to check
  let dayCount = 0
  let streak = 0
  
  // Check up to 30 days of history
  while (dayCount < 30) {
    // Create date to check
    const date = new Date()
    date.setDate(date.getDate() - dayCount)
    const dateStr = date.toISOString().split('T')[0]
    
  
    if (dateStr === today) {
      dayCount++
      continue
    }

    const allTaken = medications.every(med => {
      const dayRecord = (med.history || []).find(h => h.date === dateStr)
      return dayRecord && dayRecord.consumed
    })
    
    if (allTaken) {
      streak++
      dayCount++
    } else {
      break
    }
  }
  
  return streak
}
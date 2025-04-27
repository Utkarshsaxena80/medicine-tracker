import { createContext, useState, useEffect, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'

const MedicationContext = createContext()

export const useMedications = () => useContext(MedicationContext)

export const MedicationProvider = ({ children }) => {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedMedications = localStorage.getItem('medications')
    if (storedMedications) {
      setMedications(JSON.parse(storedMedications))
    }
    setLoading(false)
  }, [])

  // Save medications to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('medications', JSON.stringify(medications))
    }
  }, [medications, loading])

  useEffect(() => {
    const resetMedicationsAtMidnight = () => {
      const now = new Date()
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0, 0, 0 // midnight
      )
      
      const msUntilMidnight = night.getTime() - now.getTime()
      
      const resetTimer = setTimeout(() => {
        // Update history for all medications first
        setMedications(prevMeds => {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const dateStr = yesterday.toISOString().split('T')[0]
          
          return prevMeds.map(med => {
            // Add yesterday's status to history
            const history = [...(med.history || [])]
            const existingEntry = history.find(h => h.date === dateStr)
            
            if (!existingEntry) {
              history.push({
                date: dateStr,
                consumed: med.consumedToday
              })
            }
            
            // Keep only last 30 days
            const sortedHistory = history
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 30)
            
            return {
              ...med,
              consumedToday: false,
              history: sortedHistory
            }
          })
        })
        
        // Schedule next reset
        resetMedicationsAtMidnight()
      }, msUntilMidnight)
      
      return () => clearTimeout(resetTimer)
    }
    
    const cleanup = resetMedicationsAtMidnight()
    return cleanup
  }, [])

  // Add a new medication
  const addMedication = (medication) => {
    const today = new Date().toISOString().split('T')[0]
    
    const newMedication = {
      id: uuidv4(),
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      timeOfDay: medication.timeOfDay,
      startDate: medication.startDate,
      endDate: medication.indefinite ? null : medication.endDate,
      indefinite: medication.indefinite,
      consumedToday: false,
      history: [{ date: today, consumed: false }],
      createdAt: new Date().toISOString(),
      active: true
    }
    
    setMedications([newMedication, ...medications])
  }

  // Update medication consumed status for today
  const toggleConsumed = (id) => {
    setMedications(medications.map(medication => {
      if (medication.id !== id) return medication
      
      // Check if medication is active based on dates
      const today = new Date().toISOString().split('T')[0]
      const startDate = new Date(medication.startDate)
      const endDate = medication.endDate ? new Date(medication.endDate) : null
      const currentDate = new Date(today)
      
      // If medication hasn't started or has ended, don't allow toggling
      if (currentDate < startDate || (endDate && currentDate > endDate)) {
        return medication
      }
      
      return { 
        ...medication, 
        consumedToday: !medication.consumedToday,
        history: updateHistory(medication)
      }
    }))
  }
  
  // Helper function to update history when toggling consumption
  const updateHistory = (medication) => {
    const today = new Date().toISOString().split('T')[0]
    const history = [...(medication.history || [])]
    
    // Find today's entry if it exists
    const todayIndex = history.findIndex(h => h.date === today)
    
    // If today's entry exists, update it
    if (todayIndex >= 0) {
      history[todayIndex] = {
        ...history[todayIndex],
        consumed: !medication.consumedToday
      }
    } else {
      // Otherwise add a new entry for today
      history.push({
        date: today,
        consumed: !medication.consumedToday
      })
    }
    
    return history
  }

  // Delete a medication
  const deleteMedication = (id) => {
    setMedications(medications.filter(medication => medication.id !== id))
  }

  // Get consumption stats
  const getStats = () => {
    if (medications.length === 0) return { adherenceRate: 0, streak: 0 }
    
    const today = new Date().toISOString().split('T')[0]
    
    // Get active medications (within date range)
    const activeMeds = medications.filter(med => {
      const currentDate = new Date(today)
      const startDate = new Date(med.startDate)
      const endDate = med.endDate ? new Date(med.endDate) : null
      
      return currentDate >= startDate && (!endDate || currentDate <= endDate)
    })
    
    // Calculate today's adherence rate
    const totalMeds = activeMeds.length
    const consumedMeds = activeMeds.filter(med => med.consumedToday).length
    const adherenceRate = totalMeds > 0 ? (consumedMeds / totalMeds) * 100 : 0
    
    // Calculate streak
    let streak = 0
    const dates = []
    
    // Generate array of past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }
    
    // Calculate perfect days (all medications taken)
    for (const date of dates) {
      // Skip today as it's still in progress
      if (date === today) continue
      
      const medsForDate = medications.filter(med => {
        const checkDate = new Date(date)
        const startDate = new Date(med.startDate)
        const endDate = med.endDate ? new Date(med.endDate) : null
        
        return checkDate >= startDate && (!endDate || checkDate <= endDate)
      })
      
      if (medsForDate.length === 0) continue
      
      const perfectDay = medsForDate.every(med => {
        const dayRecord = (med.history || []).find(h => h.date === date)
        return dayRecord && dayRecord.consumed
      })
      
      if (perfectDay) {
        streak++
      } else {
        break
      }
    }
    
    return { adherenceRate, streak }
  }

  const value = {
    medications,
    loading,
    addMedication,
    toggleConsumed,
    deleteMedication,
    getStats
  }

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  )
}
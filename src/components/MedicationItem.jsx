import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMedications } from '../context/MedicationContext'
import { FaCheck, FaTrash, FaClock, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa'

const MedicationItem = ({ medication }) => {
  const { toggleConsumed, deleteMedication } = useMedications()
  const [showConfirm, setShowConfirm] = useState(false)
  
  // Find adherence percentage from history (last 7 days)
  const getAdherencePercentage = () => {
    if (!medication.history || medication.history.length === 0) return 0
    
    const last7Days = medication.history.slice(0, 7)
    const takenCount = last7Days.filter(day => day.consumed).length
    return Math.round((takenCount / last7Days.length) * 100)
  }
  
  const adherencePercentage = getAdherencePercentage()
  
  // Determine if medication is active based on dates
  const isActive = () => {
    const today = new Date()
    const startDate = new Date(medication.startDate)
    const endDate = medication.endDate ? new Date(medication.endDate) : null
    
    return today >= startDate && (!endDate || today <= endDate)
  }
  
  // Determine the color based on adherence
  const getAdherenceColor = () => {
    if (adherencePercentage >= 80) return 'bg-success-50 text-success-700'
    if (adherencePercentage >= 50) return 'bg-warning-50 text-warning-700'
    return 'bg-error-50 text-error-700'
  }
  
  const handleToggleConsumed = () => {
    if (isActive()) {
      toggleConsumed(medication.id)
    }
  }
  
  const handleDelete = () => {
    if (showConfirm) {
      deleteMedication(medication.id)
    } else {
      setShowConfirm(true)
    }
  }
  
  const active = isActive()
  
  return (
    <div className={`card transition-all duration-300 ${
      !active ? 'opacity-50' : medication.consumedToday ? 'border-success-500 bg-success-50/30' : ''
    }`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{medication.name}</h3>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${
                !active ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' :
                medication.consumedToday 
                  ? 'bg-success-500 text-white' 
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
              onClick={handleToggleConsumed}
              disabled={!active}
            >
              <FaCheck />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${
                showConfirm
                  ? 'bg-error-500 text-white'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
              onClick={handleDelete}
            >
              <FaTrash />
            </motion.button>
          </div>
        </div>
        
        {showConfirm && (
          <div className="mb-3 text-sm p-2 bg-error-50 text-error-700 rounded-lg">
            <p>Delete this medication? This cannot be undone.</p>
            <div className="flex justify-end mt-1 gap-2">
              <button 
                className="text-xs px-2 py-1 rounded bg-white"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="text-xs px-2 py-1 rounded bg-error-500 text-white"
                onClick={() => deleteMedication(medication.id)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
        
        <div className="text-sm text-neutral-600 mb-2">{medication.dosage}</div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="pill bg-neutral-100 text-neutral-700 flex items-center gap-1">
            <FaClock className="text-xs" /> {medication.frequency}
          </div>
          <div className="pill bg-neutral-100 text-neutral-700 flex items-center gap-1">
            <FaCalendarAlt className="text-xs" /> {medication.timeOfDay}
          </div>
        </div>
        
        <div className="text-xs text-neutral-500 flex flex-col gap-1 mt-3">
          <div className="flex items-center gap-1">
            <FaInfoCircle />
            <span>Duration:</span>
            <span className="pill bg-neutral-100 text-neutral-700">
              {medication.startDate} - {medication.indefinite ? 'Ongoing' : medication.endDate}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <FaInfoCircle />
            <span>7-day adherence:</span>
            <span className={`pill ${getAdherenceColor()}`}>
              {adherencePercentage}%
            </span>
          </div>
          
          {!active && (
            <div className="mt-1 pill bg-neutral-100 text-neutral-500">
              {new Date() < new Date(medication.startDate) 
                ? 'Not started yet'
                : 'Treatment completed'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MedicationItem
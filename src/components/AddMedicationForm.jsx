import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMedications } from '../context/MedicationContext'
import { FaTimes } from 'react-icons/fa'

const AddMedicationForm = ({ onClose }) => {
  const { addMedication } = useMedications()
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    timeOfDay: 'Morning',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    indefinite: true
  })
  const [errors, setErrors] = useState({})
  
  const frequencies = ['Daily', 'Twice Daily', 'Weekly', 'Monthly', 'As Needed']
  const timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Before Bed', 'With Meals']
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Clear end date when switching to indefinite
      endDate: type === 'checkbox' && checked ? '' : prev.endDate
    }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required'
    }
    
    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required'
    }
    
    if (!formData.indefinite && !formData.endDate) {
      newErrors.endDate = 'End date is required when not indefinite'
    }
    
    if (!formData.indefinite && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      addMedication(formData)
      onClose()
    }
  }
  
  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Medication</h2>
        <button 
          className="text-neutral-500 hover:text-neutral-700 p-1"
          onClick={onClose}
        >
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="label">Medication Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
            placeholder="e.g., Aspirin, Vitamin D"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error-500">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="dosage" className="label">Dosage</label>
          <input
            type="text"
            id="dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            className={`input ${errors.dosage ? 'border-error-500 focus:ring-error-500' : ''}`}
            placeholder="e.g., 81mg, 1 tablet"
          />
          {errors.dosage && (
            <p className="mt-1 text-sm text-error-500">{errors.dosage}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="frequency" className="label">Frequency</label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="input"
          >
            {frequencies.map(freq => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="timeOfDay" className="label">Time of Day</label>
          <select
            id="timeOfDay"
            name="timeOfDay"
            value={formData.timeOfDay}
            onChange={handleChange}
            className="input"
          >
            {timesOfDay.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="startDate" className="label">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="input"
          />
        </div>
        
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="indefinite"
              checked={formData.indefinite}
              onChange={handleChange}
              className="rounded text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700">Take indefinitely</span>
          </label>
        </div>
        
        {!formData.indefinite && (
          <div className="mb-6">
            <label htmlFor="endDate" className="label">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`input ${errors.endDate ? 'border-error-500 focus:ring-error-500' : ''}`}
              min={formData.startDate}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-error-500">{errors.endDate}</p>
            )}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancel
          </motion.button>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
          >
            Add Medication
          </motion.button>
        </div>
      </form>
    </div>
  )
}

export default AddMedicationForm
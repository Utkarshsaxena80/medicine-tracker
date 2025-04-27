import { motion, AnimatePresence } from 'framer-motion'
import { useMedications } from '../context/MedicationContext'
import MedicationItem from './MedicationItem'
import { FaMeh } from 'react-icons/fa'

const MedicationList = () => {
  const { medications, loading } = useMedications()
  
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-neutral-200 rounded w-48 mb-4"></div>
          <div className="h-32 bg-neutral-200 rounded w-full max-w-md"></div>
        </div>
      </div>
    )
  }
  
  if (medications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-10"
      >
        <FaMeh className="mx-auto text-4xl text-neutral-400 mb-4" />
        <h3 className="text-xl font-medium text-neutral-600 mb-2">No medications added yet</h3>
        <p className="text-neutral-500">Add a medication to get started tracking your health.</p>
      </motion.div>
    )
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-800 mb-4">Your Medications</h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {medications.map((medication, index) => (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <MedicationItem medication={medication} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MedicationList
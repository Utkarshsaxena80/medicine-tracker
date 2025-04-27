import { motion } from 'framer-motion'
import { useMedications } from '../context/MedicationContext'
import MedicationChart from './MedicationChart'
import { FaPills, FaPlus, FaCalendarCheck, FaFireAlt } from 'react-icons/fa'

const Dashboard = ({ onAddClick }) => {
  const { medications, getStats } = useMedications()
  const { adherenceRate, streak } = getStats()
  
  // Calculate counts
  const totalMeds = medications.length
  const consumedMeds = medications.filter(med => med.consumedToday).length
  const remainingMeds = totalMeds - consumedMeds
  
  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <motion.h2 
          className="text-2xl font-bold text-neutral-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Dashboard
        </motion.h2>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center gap-2"
          onClick={onAddClick}
        >
          <FaPlus /> Add Medication
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard 
          icon={<FaPills />}
          title="Medications"
          value={`${consumedMeds}/${totalMeds}`}
          description={`${remainingMeds} remaining today`}
          color="bg-primary-500"
          delay={0.1}
        />
        
        <StatsCard 
          icon={<FaCalendarCheck />}
          title="Adherence"
          value={`${Math.round(adherenceRate)}%`}
          description="of today's medications"
          color="bg-secondary-500"
          delay={0.2}
        />
        
        <StatsCard 
          icon={<FaFireAlt />}
          title="Streak"
          value={streak}
          description={streak === 1 ? "day" : "days"}
          color="bg-accent-500"
          delay={0.3}
        />
      </div>
      
      <div className="card p-4">
        <h3 className="text-lg font-semibold mb-4">Recent History</h3>
        <MedicationChart />
      </div>
    </div>
  )
}

const StatsCard = ({ icon, title, value, description, color, delay }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`p-3 rounded-lg ${color} text-white mb-3`}>
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-medium text-neutral-700 mb-1">{title}</h3>
        <div className="flex items-baseline">
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
          <p className="ml-2 text-sm text-neutral-500">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard
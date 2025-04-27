import { motion } from 'framer-motion'
import { FaPills } from 'react-icons/fa'

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaPills className="text-white text-2xl" />
          <h1 className="text-white text-xl font-semibold">MediTrack</h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/80 text-sm">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>
      </div>
    </header>
  )
}

export default Header
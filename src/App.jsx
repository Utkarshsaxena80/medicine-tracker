import { useState, useEffect } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import MedicationList from './components/MedicationList'
import AddMedicationForm from './components/AddMedicationForm'
import { MedicationProvider } from './context/MedicationContext'
import { motion } from 'framer-motion'

function App() {
  const [showAddForm, setShowAddForm] = useState(false)
  
  return (
    <MedicationProvider>
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-5xl">
          <Dashboard onAddClick={() => setShowAddForm(true)} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <MedicationList />
          </motion.div>
          
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowAddForm(false)
              }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <AddMedicationForm onClose={() => setShowAddForm(false)} />
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </MedicationProvider>
  )
}

export default App
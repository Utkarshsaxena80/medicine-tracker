import { useMedications } from '../context/MedicationContext'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const MedicationChart = () => {
  const { medications } = useMedications()
  
  // If no medications, show placeholder
  if (!medications.length) {
    return (
      <div className="h-60 flex items-center justify-center bg-neutral-50 rounded-lg">
        <p className="text-neutral-500">Add medications to see your history chart</p>
      </div>
    )
  }
  
  // Get dates for the last 7 days
  const getLast7Days = () => {
    const dates = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }
  
  const dates = getLast7Days()
  
  // Format dates for display (e.g., "Mon", "Tue")
  const formattedDates = dates.map(date => {
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    return day
  })
  
  // Calculate adherence percentage for each day
  const adherenceData = dates.map(date => {
    const totalMeds = medications.length
    
    // For today, use consumedToday
    if (date === new Date().toISOString().split('T')[0]) {
      const consumedToday = medications.filter(med => med.consumedToday).length
      return (consumedToday / totalMeds) * 100
    }
    
    // For other days, check history
    const medsConsumed = medications.filter(med => {
      const dayEntry = (med.history || []).find(h => h.date === date)
      return dayEntry && dayEntry.consumed
    }).length
    
    return totalMeds > 0 ? (medsConsumed / totalMeds) * 100 : 0
  })
  
  const chartData = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Adherence %',
        data: adherenceData,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => `${value}%`
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: context => `Adherence: ${Math.round(context.raw)}%`
        }
      }
    }
  }
  
  return (
    <div className="h-60">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default MedicationChart
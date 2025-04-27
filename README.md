# MediTrack - Medication Tracking Application

MediTrack is a modern, user-friendly web application for tracking daily medication intake. Built with React and featuring a clean, intuitive interface, it helps users maintain their medication schedule and monitor their adherence.

![MediTrack Interface](https://images.pexels.com/photos/4021808/pexels-photo-4021808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- **Medication Management**
  - Add and remove medications
  - Set medication schedules (daily, weekly, monthly)
  - Specify dosage and timing
  - Set treatment duration with start/end dates
  - Track indefinite medications

- **Daily Tracking**
  - Mark medications as taken
  - Visual indicators for taken/pending medications
  - Automatic reset at midnight
  - Treatment period validation

- **Analytics**
  - 7-day adherence history
  - Adherence rate calculation
  - Streak tracking for consistent intake
  - Visual charts for progress monitoring

- **User Interface**
  - Clean, modern design
  - Responsive layout
  - Smooth animations
  - Intuitive controls

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Chart.js
- Framer Motion
- Local Storage for data persistence

## Project Structure

```
src/
├── components/         # React components
├── context/           # React context for state management
├── utils/             # Helper functions
└── assets/            # Static assets
```

## Key Components

- **Dashboard**: Overview of medication stats and charts
- **MedicationList**: List of all medications with status
- **AddMedicationForm**: Form for adding new medications
- **MedicationChart**: Visual representation of adherence

## Data Storage

The application uses browser's Local Storage for data persistence. Medication data is automatically saved and loaded between sessions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

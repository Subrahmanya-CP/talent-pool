import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CandidateDetails from './pages/CandidateDetails'
import Analytics from './pages/Analytics'
import JobMatch from './pages/JobMatch'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidate/:id" element={<CandidateDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/job-match" element={<JobMatch />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

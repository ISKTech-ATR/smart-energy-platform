import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Landing from './pages/Landing.jsx'
import DetailPage from './pages/DetailPage.jsx'
import Login from './pages/Login.jsx'
import BrandLogo from './components/BrandLogo.jsx'
import { useAuth } from './auth.jsx'
import { ELECTRICITY_CARDS, FUEL_CARDS, THERMAL_CARDS } from './data/mock.js'

function Shell() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="app">
      <div className="brand">
        <div className="brand-plate">
          <BrandLogo variant="mark" />
        </div>
      </div>
      <Header />
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

const electricityTrail = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Energy', to: '/energy' },
  { label: 'Electricity' },
]
const fuelTrail = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Energy', to: '/energy' },
  { label: 'Fuel' },
]
const thermalTrail = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Energy', to: '/energy' },
  { label: 'Thermal' },
]

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Shell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/energy" element={<Landing trail={electricityTrail} cards={ELECTRICITY_CARDS} />} />
        <Route path="/energy/electricity" element={<Landing trail={electricityTrail} cards={ELECTRICITY_CARDS} />} />
        <Route path="/fuel" element={<Landing trail={fuelTrail} cards={FUEL_CARDS} />} />
        <Route path="/thermal" element={<Landing trail={thermalTrail} cards={THERMAL_CARDS} />} />
        <Route path="/detail/:metricKey" element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

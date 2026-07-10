import { NavLink } from 'react-router-dom'
import Icon from './Icons.jsx'

const NAV = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/energy', icon: 'energy', label: 'Energy' },
  { to: '/fuel', icon: 'fuel', label: 'Fuel' },
  { to: '/thermal', icon: 'thermal', label: 'Thermal' },
]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <Icon name={n.icon} />
          <span>{n.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

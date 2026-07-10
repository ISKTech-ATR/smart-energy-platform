import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icons.jsx'
import { useAuth } from '../auth.jsx'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const doLogout = () => {
    setOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="header">
      <h1>Smart Energy &amp; Digital Building Enablement</h1>

      <div className="header-right">
        <button className="header-icon" title="Notifications">
          <Icon name="bell" size={20} />
          <span className="badge">3</span>
        </button>

        <div className="user" onClick={() => setOpen((o) => !o)}>
          <div className="meta">
            <div className="name">{user?.name || 'Admin User'}</div>
            <div className="sub">{user?.building || 'Building 01'}</div>
          </div>
          <div className="avatar">
            <Icon name="user" size={22} />
          </div>
          <span className="chev">
            <Icon name="chevron-down" size={18} />
          </span>
        </div>

        {open && (
          <>
            <div className="menu-backdrop" onClick={() => setOpen(false)} />
            <div className="user-menu">
              <div className="user-menu-head">
                <div className="avatar sm">
                  <Icon name="user" size={18} />
                </div>
                <div>
                  <div className="name">{user?.name}</div>
                  <div className="sub">{user?.email}</div>
                </div>
              </div>
              <div className="user-menu-item">
                <Icon name="user" size={16} /> Profile
              </div>
              <div className="user-menu-item">
                <Icon name="gear" size={16} /> Settings
              </div>
              <div className="user-menu-item">
                <Icon name="building" size={16} /> Switch Building
              </div>
              <div className="user-menu-sep" />
              <div className="user-menu-item danger" onClick={doLogout}>
                <Icon name="logout" size={16} /> Sign Out
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

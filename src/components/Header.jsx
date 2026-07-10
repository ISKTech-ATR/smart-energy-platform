import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icons.jsx'
import Modal from './Modal.jsx'
import { useAuth } from '../auth.jsx'
import { ALERTS } from '../data/mock.js'

const BUILDINGS = ['Building 01', 'Building 02', 'Gateway Kiaramas', 'All Buildings']
const SETTINGS_KEY = 'se_settings'
const sevIcon = { critical: 'alert', warning: 'alert', info: 'check' }

export default function Header() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unread, setUnread] = useState(ALERTS.length)
  const [modal, setModal] = useState(null) // 'profile' | 'settings' | 'building'

  // profile / settings working state
  const [nameDraft, setNameDraft] = useState(user?.name || '')
  const [settings, setSettings] = useState(() => {
    try {
      return { compact: false, emailAlerts: true, autoRefresh: true, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }
    } catch {
      return { compact: false, emailAlerts: true, autoRefresh: true }
    }
  })

  // apply compact density globally so the toggle has a real effect
  useEffect(() => {
    document.body.classList.toggle('compact', !!settings.compact)
  }, [settings.compact])

  const doLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }
  const openNotif = () => {
    setNotifOpen((o) => !o)
    setUnread(0)
  }
  const openModal = (m) => {
    setMenuOpen(false)
    if (m === 'profile') setNameDraft(user?.name || '')
    setModal(m)
  }
  const saveSettings = (next) => {
    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  }

  return (
    <header className="header">
      <h1>Smart Energy &amp; Digital Building Enablement</h1>

      <div className="header-right">
        {/* Notifications */}
        <div className="notif-wrap">
          <button className="header-icon" title="Notifications" onClick={openNotif}>
            <Icon name="bell" size={20} />
            {unread > 0 && <span className="badge">{unread}</span>}
          </button>
          {notifOpen && (
            <>
              <div className="menu-backdrop" onClick={() => setNotifOpen(false)} />
              <div className="notif-menu">
                <div className="notif-head">
                  <span>Notifications</span>
                  <button onClick={() => setNotifOpen(false)}>Mark all read</button>
                </div>
                <div className="notif-list">
                  {ALERTS.map((a) => (
                    <div className={`notif-row ${a.severity}`} key={a.id}>
                      <span className="notif-ico">
                        <Icon name={sevIcon[a.severity] || 'alert'} size={15} />
                      </span>
                      <div>
                        <div className="notif-title">{a.title}</div>
                        <div className="notif-detail">{a.detail}</div>
                        <div className="notif-time">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User */}
        <div className="user" onClick={() => setMenuOpen((o) => !o)}>
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

        {menuOpen && (
          <>
            <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
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
              <div className="user-menu-item" onClick={() => openModal('profile')}>
                <Icon name="user" size={16} /> Profile
              </div>
              <div className="user-menu-item" onClick={() => openModal('settings')}>
                <Icon name="gear" size={16} /> Settings
              </div>
              <div className="user-menu-item" onClick={() => openModal('building')}>
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

      {/* ---- Modals ---- */}
      {modal === 'profile' && (
        <Modal
          title="Profile"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn ghost" onClick={() => setModal(null)}>Cancel</button>
              <button
                className="btn primary"
                onClick={() => {
                  updateUser({ name: nameDraft.trim() || user.name })
                  setModal(null)
                }}
              >
                Save
              </button>
            </>
          }
        >
          <label className="field">
            Display name
            <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
          </label>
          <label className="field">
            Email
            <input value={user?.email || ''} disabled />
          </label>
          <div className="kv-row">
            <span>Role</span>
            <span className="chip up">{user?.role || 'Administrator'}</span>
          </div>
          <div className="kv-row">
            <span>Building</span>
            <span>{user?.building}</span>
          </div>
        </Modal>
      )}

      {modal === 'settings' && (
        <Modal title="Settings" onClose={() => setModal(null)} footer={<button className="btn primary" onClick={() => setModal(null)}>Done</button>}>
          <Toggle label="Compact density" hint="Tighter spacing across the app" checked={settings.compact} onChange={(v) => saveSettings({ ...settings, compact: v })} />
          <Toggle label="Email alerts" hint="Send critical alerts to your email" checked={settings.emailAlerts} onChange={(v) => saveSettings({ ...settings, emailAlerts: v })} />
          <Toggle label="Auto-refresh data" hint="Refresh dashboards every 60s" checked={settings.autoRefresh} onChange={(v) => saveSettings({ ...settings, autoRefresh: v })} />
        </Modal>
      )}

      {modal === 'building' && (
        <Modal title="Switch Building" onClose={() => setModal(null)}>
          <div className="building-list">
            {BUILDINGS.map((b) => (
              <button
                key={b}
                className={'building-item' + (user?.building === b ? ' active' : '')}
                onClick={() => {
                  updateUser({ building: b })
                  setModal(null)
                }}
              >
                <Icon name="building" size={18} />
                <span>{b}</span>
                {user?.building === b && <Icon name="check" size={16} />}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </header>
  )
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div className="toggle-field" onClick={() => onChange(!checked)}>
      <div>
        <div className="toggle-label">{label}</div>
        {hint && <div className="toggle-hint">{hint}</div>}
      </div>
      <div className={'switch' + (checked ? ' on' : '')}>
        <span />
      </div>
    </div>
  )
}

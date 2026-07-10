import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import Icon from './Icons.jsx'
import { ZONE_HEX } from '../data/mock.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const tipStyle = { background: '#0a1020', border: '1px solid #1c2740', borderRadius: 10 }

// Year-over-year monthly comparison (this year vs last year).
export function YoYCompare({ peak, unit, title = 'MONTHLY COMPARISON (YoY)' }) {
  let a = Math.round(peak * 100) + 7
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const base = Math.max(peak, 6)
  const data = MONTHS.map((m, i) => {
    const season = 0.7 + Math.sin((i / 12) * Math.PI * 2) * 0.25
    const cur = Math.round(base * season * (0.85 + rand() * 0.4))
    return { month: m, 'This Year': cur, 'Last Year': Math.round(cur * (1.05 + rand() * 0.18)) }
  })
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>{title}</h3>
        <span className="pill">{unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -10 }}>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: 'var(--border)' }} fontSize={10} interval={0} />
          <YAxis tickLine={false} axisLine={false} width={36} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={tipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Last Year" fill="#3a4a66" radius={[3, 3, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="This Year" fill="#2b7fff" radius={[3, 3, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Compact performance summary card list.
export function PerformanceSummary({ items }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>PERFORMANCE SUMMARY</h3>
      </div>
      <div className="perf-list">
        {items.map((it) => (
          <div className="perf-row" key={it.label}>
            <span className="perf-label">{it.label}</span>
            <span className="perf-val" style={{ color: it.color || 'var(--text)' }}>
              {it.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const statusClass = (s) => {
  const k = String(s).toLowerCase()
  if (k === 'online' || k === 'optimal') return 'ok'
  if (k === 'warning' || k === 'normal') return k === 'warning' ? 'warn' : 'ok'
  if (k === 'offline' || k === 'critical') return 'bad'
  return 'ok'
}

const sevIcon = { critical: 'alert', warning: 'alert', info: 'check' }

export function StatStrip({ stats }) {
  return (
    <div className="stat-strip">
      {stats.map((s) => (
        <div className="stat-cell" key={s.label}>
          <div className="stat-cell-label">{s.label}</div>
          <div className="stat-cell-val">
            {s.val}
            <span>{s.unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function AlertsPanel({ alerts, title = 'ACTIVE ALERTS' }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>{title}</h3>
        <span className="pill">{alerts.length}</span>
      </div>
      <div className="alert-list">
        {alerts.map((a) => (
          <div className={`alert-row ${a.severity}`} key={a.id}>
            <span className="alert-ico">
              <Icon name={sevIcon[a.severity] || 'alert'} size={16} />
            </span>
            <div className="alert-body">
              <div className="alert-title">{a.title}</div>
              <div className="alert-detail">{a.detail}</div>
            </div>
            <div className="alert-time">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DeviceList({ devices }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>METER &amp; DEVICE STATUS</h3>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Zone</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id}>
              <td className="mono">{d.id}</td>
              <td>{d.zone}</td>
              <td>{d.type}</td>
              <td>
                <span className={`status-dot ${statusClass(d.status)}`} />
                {d.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ReadingsTable({ rows }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>RECENT READINGS</h3>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Zone</th>
            <th>Reading</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="mono">{r.time}</td>
              <td>{r.zone}</td>
              <td>
                {r.value} {r.unit}
              </td>
              <td>
                <span className={`status-dot ${statusClass(r.status)}`} />
                {r.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function HourlyChart({ data, accent = '#2b7fff', title = 'HOURLY BREAKDOWN' }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>{title}</h3>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="hour" tickLine={false} axisLine={{ stroke: 'var(--border)' }} interval={2} fontSize={10} />
          <YAxis tickLine={false} axisLine={false} width={36} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ background: '#0a1020', border: '1px solid #1c2740', borderRadius: 10 }} />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} fill={accent} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ZoneTablePanel({ rows, activeZone = 'All', onZoneClick }) {
  const clickable = typeof onZoneClick === 'function'
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>ZONE PERFORMANCE</h3>
        {clickable && <span className="pill">click a row to filter</span>}
      </div>
      <table className={'data-table' + (clickable ? ' clickable' : '')}>
        <thead>
          <tr>
            <th>Zone</th>
            <th>Consumption</th>
            <th>Cost</th>
            <th>CO₂</th>
            <th>Efficiency</th>
            <th>Status</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.zone}
              className={activeZone === r.zone ? 'row-active' : ''}
              onClick={clickable ? () => onZoneClick(activeZone === r.zone ? 'All' : r.zone) : undefined}
            >
              <td>
                <span className="swatch-sm" style={{ background: ZONE_HEX[r.zone] }} />
                {r.zone}
              </td>
              <td>{r.consumption} kWh</td>
              <td>{r.cost} MYR</td>
              <td>{r.co2} t</td>
              <td>{r.efficiency}%</td>
              <td>
                <span className={`status-dot ${statusClass(r.status)}`} />
                {r.status}
              </td>
              <td className="up">{r.trend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TopConsumers({ rows }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>TOP CONSUMERS</h3>
      </div>
      <div className="consumer-list">
        {rows.map((r) => (
          <div className="consumer-row" key={r.name}>
            <div className="consumer-top">
              <span>{r.name}</span>
              <span className="mono">
                {r.value} {r.unit}
              </span>
            </div>
            <div className="consumer-bar">
              <div className="consumer-fill" style={{ width: `${r.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DeviceSummaryPanel({ summary }) {
  const items = [
    { label: 'Online', value: summary.online, cls: 'ok' },
    { label: 'Warning', value: summary.warning, cls: 'warn' },
    { label: 'Offline', value: summary.offline, cls: 'bad' },
  ]
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>SYSTEM STATUS</h3>
        <span className="pill">{summary.total} devices</span>
      </div>
      <div className="status-grid">
        {items.map((it) => (
          <div className="status-cell" key={it.label}>
            <div className={`status-num ${it.cls}`}>{it.value}</div>
            <div className="status-lbl">{it.label}</div>
          </div>
        ))}
      </div>
      <div className="uptime">
        <div className="uptime-bar">
          <div className="uptime-fill" style={{ width: `${(summary.online / summary.total) * 100}%` }} />
        </div>
        <span>{Math.round((summary.online / summary.total) * 100)}% operational</span>
      </div>
    </div>
  )
}

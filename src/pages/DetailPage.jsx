import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Breadcrumb from '../components/Breadcrumb.jsx'
import TimeSeriesChart from '../components/TimeSeriesChart.jsx'
import ZoneMap from '../components/ZoneMap.jsx'
import SplitPanel from '../components/SplitPanel.jsx'
import Icon from '../components/Icons.jsx'
import { Gauge } from '../components/Analytics.jsx'
import {
  StatStrip,
  HourlyChart,
  AlertsPanel,
  ReadingsTable,
  DeviceList,
  YoYCompare,
  PerformanceSummary,
} from '../components/Panels.jsx'
import { METRICS, ALERTS } from '../data/mock.js'

const ACCENT_HEX = { green: '#8ec63f', amber: '#e0a458', cyan: '#3fc8d6' }

export default function DetailPage() {
  const { metricKey } = useParams()
  const [zone, setZone] = useState('Zone A')
  const m = METRICS[metricKey]
  if (!m) return <Navigate to="/energy" replace />

  // Zone selection: scale the primary chart + KPIs to the picked zone's share.
  const splitA = m.split.find((s) => s.zone === 'Zone A')?.value || 1
  const splitSel = m.split.find((s) => s.zone === zone)?.value || splitA
  const zoneFactor = splitSel / splitA
  const zoneLetter = zone.slice(-1)
  const chartTitle = m.zoneTitle.replace(/ZONE\s+[A-C]/i, `ZONE ${zoneLetter}`)
  const zoneSeries = m.series.map((d) => ({ ...d, value: Math.max(0, Math.round(d.value * zoneFactor)) }))
  const zoneKpis = m.kpis.map((k) => {
    const n = parseFloat(k.val)
    return Number.isNaN(n) ? k : { ...k, val: String(Math.max(0, Math.round(n * zoneFactor))) }
  })

  const trail = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Energy', to: '/energy' },
    { label: m.parent, to: m.parentPath },
    { label: m.title },
  ]

  // metric-scoped alerts: prefer ones naming this metric, then pad to 3 with recent alerts
  const first = m.title.split(' ')[0].toLowerCase()
  const matched = ALERTS.filter(
    (a) => a.title.toLowerCase().includes(first) || a.detail.toLowerCase().includes(first),
  )
  const metricAlerts = [...matched, ...ALERTS.filter((a) => !matched.includes(a))].slice(0, 3)

  const peak = m.series[m.series.length - 1]?.value || 12

  // 12-month cost breakdown for this metric (seeded)
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const costBase = parseFloat(m.kpis.find((k) => k.icon === 'wallet')?.val) || 8
  let seed = Math.round(costBase * 100) + peak + 5
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const costMonthly = MONTHS.map((mo, i) => {
    const season = 0.75 + Math.sin(((i - 2) / 12) * Math.PI * 2) * 0.28
    return { month: mo, cost: Math.max(1, Math.round((costBase / 2) * season * (0.8 + rand() * 0.5))) }
  })

  const gauges = [
    { label: 'System Efficiency', value: 88 + Math.round(rand() * 6), unit: '%', color: '#8ec63f' },
    { label: 'Power Factor', value: 93 + Math.round(rand() * 5), unit: '%', color: '#2b7fff' },
    { label: 'Load Factor', value: 60 + Math.round(rand() * 14), unit: '%', color: '#e0a458' },
  ]

  const perfItems = [
    { label: 'Peak demand', value: `${peak} ${m.seriesUnit}` },
    { label: 'Average load', value: `${Math.round(peak * 0.42)} ${m.seriesUnit}` },
    { label: 'Load factor', value: '68%' },
    { label: 'System efficiency', value: '91%', color: '#8ec63f' },
    { label: 'vs Target', value: '-6%', color: '#5fd35f' },
    { label: 'vs Last year', value: '-8.4%', color: '#5fd35f' },
    { label: 'Data quality', value: '99.2%', color: '#8ec63f' },
    { label: 'Uptime (30d)', value: '99.9%', color: '#8ec63f' },
  ]

  return (
    <>
      <Breadcrumb trail={trail} />

      {/* --- Overview: matches the reference screenshots --- */}
      <div className="detail-grid">
        <div className="kpi-col">
          {zoneKpis.map((k) => (
            <div className="kpi-card" key={k.label}>
              <div className="kpi-head">
                <div className="kpi-icon">
                  <Icon name={k.icon} size={22} />
                </div>
                {k.label}
              </div>
              <div className="kpi-val">{k.val}</div>
              <div className="kpi-unit">{k.unit}</div>
              <div className="kpi-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        <div>
          <TimeSeriesChart series={zoneSeries} title={chartTitle} accent={m.accent} />
          <div className="detail-bottom">
            <ZoneMap activeZone={zone} onSelect={setZone} />
            <SplitPanel title={m.splitTitle} data={m.split} />
          </div>
        </div>
      </div>

      <div className="section-divider">
        <span>Detailed Analytics</span>
      </div>

      <StatStrip stats={m.stats} />

      {/* Second analysis row */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <HourlyChart
          data={m.hourly}
          accent={ACCENT_HEX[m.accent] || '#8ec63f'}
          title={`HOURLY BREAKDOWN (${m.seriesUnit})`}
        />
        <AlertsPanel alerts={metricAlerts} title="ZONE ALERTS" />
      </div>

      {/* Efficiency gauges + 12-month cost */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>OPERATIONAL EFFICIENCY</h3>
          </div>
          <div className="gauge-row">
            {gauges.map((g) => (
              <Gauge key={g.label} {...g} />
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>12-MONTH COST</h3>
            <span className="pill">MYR</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={costMonthly} margin={{ top: 10, right: 12, bottom: 0, left: -10 }}>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: 'var(--border)' }} fontSize={10} interval={0} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ background: '#0a1020', border: '1px solid #1c2740', borderRadius: 10 }} />
              <Bar dataKey="cost" fill="#8ec63f" radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* YoY comparison + performance summary */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <YoYCompare peak={peak} unit={m.seriesUnit} />
        <PerformanceSummary items={perfItems} />
      </div>

      {/* Tables row */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <ReadingsTable rows={m.readings} />
        <DeviceList devices={m.devices} />
      </div>
    </>
  )
}

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Breadcrumb from '../components/Breadcrumb.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import { KpiSpark, Donut, Gauge } from '../components/Analytics.jsx'
import { ZoneTablePanel, AlertsPanel, TopConsumers } from '../components/Panels.jsx'
import { METRICS, ALERTS } from '../data/mock.js'

const PALETTE = ['#2b7fff', '#8ec63f', '#e0a458', '#3fc8d6', '#a06bff']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const ZONES = ['Zone A', 'Zone B', 'Zone C']
const tip = { background: '#0a1020', border: '1px solid #1c2740', borderRadius: 10 }
const num = (v) => (typeof v === 'number' ? v : parseFloat(v) || 0)
const kpiVal = (m, icon) => num(m.kpis.find((k) => k.icon === icon)?.val)

function makeRng(seed) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// deterministic monthly series scaled to a yearly total (seasonal + noise + anomaly)
function monthly(seed, total) {
  const r = makeRng(seed)
  return MONTHS.map((m, i) => {
    const season = 0.75 + Math.sin(((i - 2) / 12) * Math.PI * 2) * 0.28
    const noise = 0.8 + r() * 0.45
    let v = (total / 6) * season * noise
    if (r() < 0.12) v *= 1.3
    return Math.max(1, Math.round(v))
  })
}

function sparkGen(seed, up) {
  const r = makeRng(seed)
  let v = 45
  return Array.from({ length: 16 }, (_, i) => {
    v += (r() - (up ? 0.4 : 0.6)) * 18
    if (r() < 0.12) v += (r() - 0.5) * 30
    v = Math.max(6, Math.min(94, v))
    return { i, v: Math.round(v) }
  })
}

export default function Landing({ trail, cards }) {
  const metrics = cards.map((k) => METRICS[k])
  const category = trail[trail.length - 1].label
  const unit = metrics[0]?.summary.primary.unit || ''
  const rng = makeRng(category.length * 131 + cards.length * 17 + 3)
  const gauss = () => (rng() + rng() + rng() - 1.5) / 1.5

  // ---- aggregates ----
  const totalPrimary = metrics.reduce((s, m) => s + num(m.summary.primary.val), 0)
  const totalCo2 = metrics.reduce((s, m) => s + kpiVal(m, 'co2'), 0)
  const totalCost = metrics.reduce((s, m) => s + kpiVal(m, 'wallet'), 0)
  const avgEff = 84 + Math.round(gauss() * 4)

  const summary = [
    { label: `Total ${category}`, val: totalPrimary, unit, color: '#2b7fff' },
    { label: 'Carbon Footprint', val: totalCo2, unit: 'tCO₂', color: '#3fc8d6' },
    { label: 'Estimated Cost', val: totalCost, unit: 'MYR', color: '#8ec63f' },
    { label: 'Monitored Sources', val: metrics.length * 3, unit: 'points', color: '#e0a458' },
  ]

  // ---- KPI sparkline cards ----
  const kpiCards = [
    { key: 'tot', label: `Total ${category}`, value: totalPrimary, unit, icon: 'bolt', delta: '+4.1%', up: true, color: '#2b7fff', spark: sparkGen(11, true) },
    { key: 'cost', label: 'Estimated Cost', value: totalCost, unit: 'MYR', icon: 'wallet', delta: '-2.4%', up: false, color: '#8ec63f', spark: sparkGen(22, false) },
    { key: 'co2', label: 'Carbon Footprint', value: totalCo2, unit: 'tCO₂', icon: 'co2', delta: '-3.0%', up: false, color: '#3fc8d6', spark: sparkGen(33, false) },
    { key: 'eff', label: 'Avg Efficiency', value: avgEff, unit: '%', icon: 'gauge', delta: '+1.9%', up: true, color: '#e0a458', spark: sparkGen(44, true) },
  ]

  // ---- monthly consumption trend (stacked by source) ----
  const series = metrics.map((m, i) => ({ key: m.title, color: PALETTE[i % PALETTE.length], data: monthly(1000 + i * 7, num(m.summary.primary.val)) }))
  const trend = MONTHS.map((mo, mi) => {
    const row = { month: mo }
    series.forEach((s) => (row[s.key] = s.data[mi]))
    return row
  })

  // ---- monthly cost trend (stacked by source) ----
  const costSeries = metrics.map((m, i) => ({ key: m.title, color: PALETTE[i % PALETTE.length], data: monthly(5000 + i * 9, kpiVal(m, 'wallet')) }))
  const costTrend = MONTHS.map((mo, mi) => {
    const row = { month: mo }
    costSeries.forEach((s) => (row[s.key] = s.data[mi]))
    return row
  })

  // ---- contribution donut + source comparison ----
  const contribution = metrics.map((m, i) => ({ name: m.title, value: num(m.summary.primary.val), color: PALETTE[i % PALETTE.length] }))
  const contribTotal = contribution.reduce((s, d) => s + d.value, 0) || 1
  const contributionPct = contribution.map((d) => ({ ...d, value: Math.round((d.value / contribTotal) * 100) }))
  const comparison = metrics.map((m, i) => ({ name: m.title.split(' ')[0], value: num(m.summary.primary.val), color: PALETTE[i % PALETTE.length] }))

  // ---- per-zone breakdown for this category ----
  const grandSplit = metrics.reduce((s, m) => s + m.split.reduce((z, x) => z + x.value, 0), 0) || 1
  const zoneTable = ZONES.map((z, i) => {
    const zoneSplit = metrics.reduce((s, m) => s + (m.split.find((x) => x.zone === z)?.value || 0), 0)
    const share = zoneSplit / grandSplit
    const eff = 93 - i * 6 + Math.round(gauss() * 2)
    return {
      zone: z,
      consumption: Math.max(1, Math.round(totalPrimary * share)),
      cost: Math.max(1, Math.round(totalCost * share)),
      co2: Math.max(1, Math.round(totalCo2 * share)),
      efficiency: eff,
      status: eff >= 90 ? 'Optimal' : eff >= 83 ? 'Normal' : 'Warning',
      trend: `+${2 + i * 3}%`,
    }
  })

  // ---- category gauges ----
  const gauges = [
    { label: 'System Efficiency', value: avgEff, unit: '%', color: '#8ec63f' },
    { label: 'Power Factor', value: 93 + Math.round(rng() * 4), unit: '%', color: '#2b7fff' },
    { label: 'Utilisation', value: 58 + Math.round(rng() * 14), unit: '%', color: '#e0a458' },
  ]

  // ---- top consumers per source ----
  const topConsumers = metrics
    .map((m, i) => ({ name: m.title, value: num(m.summary.primary.val), unit, pct: Math.round((num(m.summary.primary.val) / (Math.max(...metrics.map((x) => num(x.summary.primary.val))) || 1)) * 100) }))
    .sort((a, b) => b.value - a.value)

  // ---- category alerts ----
  const words = metrics.flatMap((m) => m.title.toLowerCase().split(' '))
  const matched = ALERTS.filter((a) => words.some((w) => w.length > 3 && (a.title.toLowerCase().includes(w) || a.detail.toLowerCase().includes(w))))
  const catAlerts = [...matched, ...ALERTS.filter((a) => !matched.includes(a))].slice(0, 4)

  return (
    <>
      <Breadcrumb trail={trail} />

      {/* --- Overview: matches the reference screenshots --- */}
      <div className="page-frame">
        <div className="cards-row">
          {cards.map((key) => (
            <SummaryCard key={key} metric={METRICS[key]} />
          ))}
        </div>
      </div>

      <div className="section-divider">
        <span>Detailed Analytics</span>
      </div>

      {/* category summary strip */}
      <div className="cat-summary">
        {summary.map((s) => (
          <div className="cat-cell" key={s.label}>
            <div className="cat-bar" style={{ background: s.color }} />
            <div>
              <div className="cat-label">{s.label}</div>
              <div className="cat-val">
                {s.val.toLocaleString()}
                <span>{s.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* KPI sparkline cards */}
      <div className="kpi-row-4">
        {kpiCards.map((t) => (
          <KpiSpark key={t.key} tile={t} value={t.value} />
        ))}
      </div>

      {/* trend + contribution */}
      <div className="grid-2-1" style={{ marginTop: 22 }}>
        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>12-MONTH {category.toUpperCase()} TREND</h3>
            <span className="pill">Stacked · {unit}</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend} margin={{ top: 10, right: 16, bottom: 6, left: -8 }}>
              <defs>
                {series.map((s, i) => (
                  <linearGradient key={i} id={`lg-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0.04} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: 'var(--border)' }} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {series.map((s, i) => (
                <Area key={s.key} type="monotone" dataKey={s.key} stackId="1" stroke={s.color} fill={`url(#lg-${i})`} strokeWidth={1.6} isAnimationActive={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <Donut data={contributionPct} title="CONTRIBUTION" />
      </div>

      {/* cost trend + gauges */}
      <div className="grid-2-1" style={{ marginTop: 22 }}>
        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>12-MONTH COST TREND</h3>
            <span className="pill">Stacked · MYR</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={costTrend} margin={{ top: 10, right: 16, bottom: 6, left: -4 }}>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: 'var(--border)' }} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} width={44} />
              <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {costSeries.map((s, i) => (
                <Bar key={s.key} dataKey={s.key} stackId="c" fill={s.color} isAnimationActive={false} radius={i === costSeries.length - 1 ? [3, 3, 0, 0] : 0} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>OPERATIONAL EFFICIENCY</h3>
          </div>
          <div className="gauge-row" style={{ gridTemplateColumns: '1fr', gap: 8 }}>
            {gauges.map((g) => (
              <Gauge key={g.label} {...g} />
            ))}
          </div>
        </div>
      </div>

      {/* source comparison */}
      <div className="panel" style={{ marginTop: 22 }}>
        <div className="panel-head">
          <h3 style={{ fontSize: 18 }}>SOURCE COMPARISON ({unit})</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={comparison} margin={{ top: 10, right: 16, bottom: 6, left: -8 }}>
            <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: 'var(--border)' }} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={tip} />
            <Bar dataKey="value" radius={[5, 5, 0, 0]} isAnimationActive={false}>
              {comparison.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* zone breakdown + alerts */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <ZoneTablePanel rows={zoneTable} />
        <AlertsPanel alerts={catAlerts} title={`${category.toUpperCase()} ALERTS`} />
      </div>

      {/* top consumers */}
      <div style={{ marginTop: 22 }}>
        <TopConsumers rows={topConsumers} />
      </div>
    </>
  )
}

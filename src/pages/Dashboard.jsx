import { useState, useRef, useEffect } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Icon from '../components/Icons.jsx'
import { AlertsPanel, ZoneTablePanel, TopConsumers, DeviceSummaryPanel } from '../components/Panels.jsx'
import { KpiSpark, Donut, Gauge, Heatmap, TargetsPanel, InsightsPanel } from '../components/Analytics.jsx'
import { ALERTS, ZONE_TABLE, TOP_CONSUMERS, DEVICE_SUMMARY } from '../data/mock.js'
import { exportDashboardCSV, exportDashboardPDF } from '../utils/exporters.js'
import {
  PERIODS,
  PERIOD_FACTOR,
  KPI_TILES,
  TREND_BY_PERIOD,
  SOURCE_MIX,
  COST_BREAKDOWN,
  COST_CATEGORIES,
  EMISSIONS,
  LOAD_PROFILE,
  PEAK_HOUR,
  HEATMAP,
  GAUGES,
  TARGETS,
  BENCHMARKS,
  INSIGHTS,
  ZONE_SHARES,
  PREV_RATIO,
} from '../data/analytics.js'

const ZONE_HEX = { 'Zone A': '#d7e9a0', 'Zone B': '#8ec63f', 'Zone C': '#2b7fff' }
const COST_HEX = { HVAC: '#2b7fff', Lighting: '#8ec63f', 'EV Charging': '#e0a458', 'Plug Loads': '#3fc8d6', 'Common Services': '#a06bff' }
const ZONES = ['Zone A', 'Zone B', 'Zone C']
const tip = { background: '#0a1020', border: '1px solid #1c2740', borderRadius: 10 }

export default function Dashboard() {
  const [period, setPeriod] = useState('Month')
  const [zone, setZone] = useState('All') // drill-down filter
  const [compare, setCompare] = useState(false) // vs previous period
  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const factor = PERIOD_FACTOR[period]
  const zoneShare = zone === 'All' ? 1 : ZONE_SHARES[zone]
  const zoneKeys = zone === 'All' ? ZONES : [zone]

  // Consumption trend transformed by zone filter + comparison overlay
  const baseTrend = TREND_BY_PERIOD[period]
  const trend = baseTrend.map((row) => {
    const o = { label: row.label }
    zoneKeys.forEach((z) => (o[z] = row[z]))
    if (compare) {
      const total = zoneKeys.reduce((s, z) => s + row[z], 0)
      o['Prev period'] = Math.round(total * PREV_RATIO)
    }
    return o
  })

  // KPI values (period + zone scaled)
  const kpiValues = KPI_TILES.map((t) => {
    const v = Math.round(t.base * (t.periodScaled ? factor : 1) * (t.flow ? zoneShare : 1))
    return { ...t, value: v }
  })

  const doCSV = () => {
    exportDashboardCSV({
      period,
      zone,
      compare,
      kpis: kpiValues.map((k) => ({ label: k.label, value: k.value, unit: k.unit, delta: k.delta })),
      zoneTable: ZONE_TABLE,
      trend,
    })
    setExportOpen(false)
  }
  const doPDF = () => {
    setExportOpen(false)
    setTimeout(exportDashboardPDF, 50)
  }

  return (
    <>
      <div className="dash-topbar">
        <Breadcrumb trail={[{ label: 'Home', to: '/dashboard' }, { label: 'Analytics Dashboard' }]} />
        <div className="dash-controls">
          <div className="zone-filter">
            <button className={zone === 'All' ? 'active' : ''} onClick={() => setZone('All')}>
              All Zones
            </button>
            {ZONES.map((z) => (
              <button key={z} className={zone === z ? 'active' : ''} onClick={() => setZone(z)}>
                {z}
              </button>
            ))}
          </div>

          <button
            className={'toggle-btn' + (compare ? ' on' : '')}
            onClick={() => setCompare((c) => !c)}
            title="Overlay previous period"
          >
            <Icon name="trend-up" size={15} /> Compare
          </button>

          <div className="period-tabs">
            {PERIODS.map((p) => (
              <button key={p} className={p === period ? 'active' : ''} onClick={() => setPeriod(p)}>
                {p}
              </button>
            ))}
          </div>

          <div className="export-wrap" ref={exportRef}>
            <button className="export-btn" onClick={() => setExportOpen((o) => !o)}>
              <Icon name="download" size={15} /> Export
              <Icon name="chevron-down" size={14} />
            </button>
            {exportOpen && (
              <div className="export-menu">
                <div className="export-item" onClick={doCSV}>
                  <Icon name="sheet" size={15} /> Export CSV
                </div>
                <div className="export-item" onClick={doPDF}>
                  <Icon name="file" size={15} /> Print / PDF
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(zone !== 'All' || compare) && (
        <div className="filter-banner">
          {zone !== 'All' && (
            <span className="filter-tag">
              <span className="swatch-sm" style={{ background: ZONE_HEX[zone] }} /> {zone}
              <button onClick={() => setZone('All')}>✕</button>
            </span>
          )}
          {compare && (
            <span className="filter-tag">
              Comparing vs previous {period.toLowerCase()}
              <button onClick={() => setCompare(false)}>✕</button>
            </span>
          )}
        </div>
      )}

      {/* KPI sparkline cards */}
      <div className="kpi-spark-grid">
        {kpiValues.map((t) => (
          <KpiSpark key={t.key} tile={t} value={t.value} />
        ))}
      </div>

      {/* Trend (stacked) + Source mix donut */}
      <div className="grid-2-1">
        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>
              CONSUMPTION TREND {zone === 'All' ? 'BY ZONE' : `— ${zone}`} ({period})
            </h3>
            <span className="pill">{compare ? 'vs prev · kWh' : 'Stacked · kWh'}</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={trend} margin={{ top: 10, right: 16, bottom: 6, left: -8 }}>
              <defs>
                {Object.entries(ZONE_HEX).map(([z, c]) => (
                  <linearGradient key={z} id={`z-${z.replace(' ', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c} stopOpacity={0.55} />
                    <stop offset="100%" stopColor={c} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: 'var(--border)' }} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {zoneKeys.map((z) => (
                <Area key={z} type="monotone" dataKey={z} stackId="1" stroke={ZONE_HEX[z]} fill={`url(#z-${z.replace(' ', '')})`} strokeWidth={1.6} isAnimationActive={false} />
              ))}
              {compare && (
                <Line name="Prev period" type="monotone" dataKey="Prev period" stroke="#9fb0c7" strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <Donut data={SOURCE_MIX} title="ENERGY SOURCE MIX" />
      </div>

      {/* Cost breakdown + Emissions forecast */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>COST BREAKDOWN BY CATEGORY</h3>
            <span className="pill">MYR · 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={COST_BREAKDOWN} margin={{ top: 10, right: 16, bottom: 6, left: -4 }}>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: 'var(--border)' }} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} width={48} />
              <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {COST_CATEGORIES.map((c) => (
                <Bar key={c} dataKey={c} stackId="c" fill={COST_HEX[c]} isAnimationActive={false} radius={c === 'Common Services' ? [3, 3, 0, 0] : 0} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>EMISSIONS TREND &amp; FORECAST</h3>
            <span className="pill">tCO₂ · target 42</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={EMISSIONS} margin={{ top: 10, right: 16, bottom: 6, left: -8 }}>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: 'var(--border)' }} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine y={42} stroke="#8ec63f" strokeDasharray="5 4" label={{ value: 'Target', fill: '#8ec63f', fontSize: 11, position: 'insideTopRight' }} />
              <Line name="Actual" type="monotone" dataKey="actual" stroke="#2b7fff" strokeWidth={2.4} dot={false} isAnimationActive={false} />
              <Line name="Forecast" type="monotone" dataKey="forecast" stroke="#e0a458" strokeWidth={2.4} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Load profile + Heatmap */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <div className="panel">
          <div className="panel-head">
            <h3 style={{ fontSize: 18 }}>24-HOUR LOAD PROFILE</h3>
            <span className="pill">
              <Icon name="trend-up" size={13} /> Peak {PEAK_HOUR.load} kW @ {PEAK_HOUR.hour}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={LOAD_PROFILE} margin={{ top: 10, right: 16, bottom: 6, left: -8 }}>
              <defs>
                <linearGradient id="loadg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e0574d" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#e0574d" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={{ stroke: 'var(--border)' }} interval={3} fontSize={10} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tip} />
              <ReferenceLine y={240} stroke="#e0574d" strokeDasharray="5 4" label={{ value: 'Contracted 240 kW', fill: '#e0574d', fontSize: 10, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey="load" stroke="#e0574d" strokeWidth={2} fill="url(#loadg)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <Heatmap data={HEATMAP} />
      </div>

      {/* Efficiency gauges */}
      <div className="panel" style={{ marginTop: 22 }}>
        <div className="panel-head">
          <h3 style={{ fontSize: 18 }}>OPERATIONAL EFFICIENCY</h3>
        </div>
        <div className="gauge-row">
          {GAUGES.map((g) => (
            <Gauge key={g.label} {...g} />
          ))}
        </div>
      </div>

      {/* Targets + Insights */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <TargetsPanel targets={TARGETS} benchmarks={BENCHMARKS} />
        <InsightsPanel items={INSIGHTS} />
      </div>

      {/* Zone table + alerts */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <ZoneTablePanel rows={ZONE_TABLE} activeZone={zone} onZoneClick={setZone} />
        <AlertsPanel alerts={ALERTS} />
      </div>

      {/* Consumers + system status */}
      <div className="dash-lower" style={{ marginTop: 22 }}>
        <TopConsumers rows={TOP_CONSUMERS} />
        <DeviceSummaryPanel summary={DEVICE_SUMMARY} />
      </div>
    </>
  )
}

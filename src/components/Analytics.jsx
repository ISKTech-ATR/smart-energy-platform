import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import Icon from './Icons.jsx'

// ---- KPI card with sparkline ----
export function KpiSpark({ tile, value }) {
  return (
    <div className="kpi-spark">
      <div className="kpi-spark-top">
        <span className="kpi-spark-icon" style={{ color: tile.color }}>
          <Icon name={tile.icon} size={18} />
        </span>
        <span className={'chip ' + (tile.up ? 'up' : 'down')}>{tile.delta}</span>
      </div>
      <div className="kpi-spark-label">{tile.label}</div>
      <div className="kpi-spark-val">
        {value.toLocaleString()}
        <span>{tile.unit}</span>
      </div>
      <div className="kpi-spark-chart">
        <ResponsiveContainer width="100%" height={38}>
          <AreaChart data={tile.spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`sp-${tile.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tile.color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={tile.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={tile.color} strokeWidth={1.6} fill={`url(#sp-${tile.key})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ---- Donut with center total + legend ----
export function Donut({ data, title }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>{title}</h3>
      </div>
      <div className="donut-body">
        <div className="donut-chart">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <div className="donut-total">{total}%</div>
            <div className="donut-sub">mix</div>
          </div>
        </div>
        <div className="donut-legend">
          {data.map((d) => (
            <div className="donut-legend-row" key={d.name}>
              <span className="swatch-sm" style={{ background: d.color }} />
              <span className="dl-name">{d.name}</span>
              <span className="dl-val mono">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- SVG arc gauge ----
export function Gauge({ label, value, unit, color }) {
  const r = 46
  const circ = Math.PI * r // half circle
  const off = circ * (1 - value / 100)
  return (
    <div className="gauge">
      <svg viewBox="0 0 120 70" width="100%">
        <path d="M10 62 A46 46 0 0 1 110 62" fill="none" stroke="var(--border)" strokeWidth="9" strokeLinecap="round" />
        <path
          d="M10 62 A46 46 0 0 1 110 62"
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={off}
        />
      </svg>
      <div className="gauge-val" style={{ color }}>
        {value}
        <span>{unit}</span>
      </div>
      <div className="gauge-lbl">{label}</div>
    </div>
  )
}

// ---- Consumption heatmap (day x hour) ----
function heatColor(v) {
  // 0..100 → dark to bright green/amber
  if (v < 20) return 'rgba(43,127,255,0.10)'
  if (v < 40) return 'rgba(63,200,214,0.35)'
  if (v < 60) return 'rgba(142,198,63,0.55)'
  if (v < 80) return 'rgba(224,164,88,0.75)'
  return 'rgba(224,87,77,0.9)'
}
export function Heatmap({ data }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>CONSUMPTION HEATMAP</h3>
        <span className="pill">kWh intensity · day × hour</span>
      </div>
      <div className="heatmap">
        <div className="heat-hours">
          <span />
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} className="heat-hour-lbl">
              {h % 6 === 0 ? `${h}h` : ''}
            </span>
          ))}
        </div>
        {data.map((row) => (
          <div className="heat-row" key={row.day}>
            <span className="heat-day">{row.day}</span>
            {row.hours.map((v, h) => (
              <span key={h} className="heat-cell" style={{ background: heatColor(v) }} title={`${row.day} ${h}:00 — ${v}`} />
            ))}
          </div>
        ))}
        <div className="heat-legend">
          <span>Low</span>
          {[10, 30, 50, 70, 90].map((v) => (
            <span key={v} className="heat-swatch" style={{ background: heatColor(v) }} />
          ))}
          <span>High</span>
        </div>
      </div>
    </div>
  )
}

// ---- Targets progress ----
export function TargetsPanel({ targets, benchmarks }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>TARGETS &amp; BENCHMARKS</h3>
      </div>
      <div className="targets">
        {targets.map((t) => (
          <div className="target-row" key={t.label}>
            <div className="target-head">
              <span>{t.label}</span>
              <span className="mono">
                {t.current} / {t.target} {t.unit}
              </span>
            </div>
            <div className="uptime-bar">
              <div
                className="uptime-fill"
                style={{ width: `${(t.current / t.target) * 100}%`, background: t.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="bench-grid">
        {benchmarks.map((b) => (
          <div className="bench-cell" key={b.label}>
            <div className={'bench-val ' + (b.good ? 'good' : 'bad')}>{b.value}</div>
            <div className="bench-lbl">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- AI insights ----
const insightIcon = { anomaly: 'alert', saving: 'leaf', forecast: 'trend-up', peak: 'gauge' }
export function InsightsPanel({ items }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>INSIGHTS &amp; ANOMALIES</h3>
        <span className="pill">Auto-detected</span>
      </div>
      <div className="insight-list">
        {items.map((it, i) => (
          <div className={`insight-row ${it.type}`} key={i}>
            <span className="insight-ico">
              <Icon name={insightIcon[it.type] || 'alert'} size={16} />
            </span>
            <div>
              <div className="insight-title">{it.title}</div>
              <div className="insight-text">{it.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

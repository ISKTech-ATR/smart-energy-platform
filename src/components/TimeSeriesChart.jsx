import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const PERIODS = ['This Day', 'Last Week', 'Last Month', 'Last Year']

// Scale the base "This Day" series to fake other periods.
function scale(series, factor) {
  return series.map((d) => ({ ...d, value: Math.round(d.value * factor) }))
}

const ACCENTS = {
  green: { stroke: '#8ec63f', fill: '#8ec63f' },
  amber: { stroke: '#e0a458', fill: '#e0a458' },
  cyan: { stroke: '#3fc8d6', fill: '#3fc8d6' },
}

export default function TimeSeriesChart({ series, title, accent = 'green', height = 300 }) {
  const [period, setPeriod] = useState('This Day')
  const factor = { 'This Day': 1, 'Last Week': 1.4, 'Last Month': 1.8, 'Last Year': 2.3 }[period]
  const data = scale(series, factor)
  const c = ACCENTS[accent] || ACCENTS.green

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        <div className="period-tabs">
          {PERIODS.map((p) => (
            <button key={p} className={p === period ? 'active' : ''} onClick={() => setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
          <defs>
            <linearGradient id={`grad-${accent}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.fill} stopOpacity={0.5} />
              <stop offset="100%" stopColor={c.fill} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="short" tickLine={false} axisLine={{ stroke: 'var(--border)' }} minTickGap={40} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip
            formatter={(v) => [v, 'Value']}
            labelStyle={{ color: '#9fb0c7' }}
            contentStyle={{ background: '#0a1020', border: '1px solid #1c2740', borderRadius: 10 }}
          />
          <Area
            type="stepAfter"
            dataKey="value"
            stroke={c.stroke}
            strokeWidth={2}
            fill={`url(#grad-${accent})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

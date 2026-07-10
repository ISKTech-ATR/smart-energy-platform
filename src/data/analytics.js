// Analytics dataset for the Dashboard. Deterministic (seeded) so values are
// stable across re-renders. All mock — swap for a real analytics API later.

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rnd = mulberry32(20260709)
const jitter = (base, spread) => Math.round(base + (rnd() - 0.5) * spread)

// ---- Period-aware consumption trend (stacked by zone) ----
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WEEK_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function trendSeries(labels, scale) {
  return labels.map((l, i) => {
    const weekend = /Sat|Sun/i.test(l) ? 0.6 : 1
    const wave = 1 + Math.sin((i / labels.length) * Math.PI * 1.5) * 0.15
    const z = (mult) => {
      let v = scale * mult * weekend * wave * (0.8 + rnd() * 0.42)
      if (rnd() < 0.1) v *= 1.25 + rnd() * 0.3 // occasional spike
      return Math.max(1, Math.round(v))
    }
    return { label: l, 'Zone A': z(0.7), 'Zone B': z(0.92), 'Zone C': z(1.12) }
  })
}

export const TREND_BY_PERIOD = {
  Week: trendSeries(DAY_LABELS, 20),
  Month: trendSeries(WEEK_LABELS, 120),
  Quarter: trendSeries(MONTH_LABELS.slice(4, 7), 520),
  Year: trendSeries(MONTH_LABELS, 560),
}

export const PERIODS = ['Week', 'Month', 'Quarter', 'Year']
export const PERIOD_FACTOR = { Week: 0.25, Month: 1, Quarter: 3, Year: 12 }

// ---- KPI tiles with sparklines ----
function spark(seed, up = true) {
  const r = mulberry32(seed)
  let v = 40
  return Array.from({ length: 16 }, (_, i) => {
    v += (r() - (up ? 0.38 : 0.6)) * 20 // larger steps → jaggier
    if (r() < 0.12) v += (r() - 0.5) * 34 // occasional jump
    v = Math.max(6, Math.min(94, v))
    return { i, v: Math.round(v) }
  })
}

export const KPI_TILES = [
  { key: 'consumption', label: 'Total Consumption', base: 5820, unit: 'kWh', icon: 'bolt', delta: '+4.2%', up: true, color: '#2b7fff', spark: spark(1, true), flow: true, periodScaled: true },
  { key: 'peak', label: 'Peak Demand', base: 214, unit: 'kW', icon: 'trend-up', delta: '+1.8%', up: true, color: '#e0574d', spark: spark(2, true), flow: true, periodScaled: false },
  { key: 'cost', label: 'Energy Cost', base: 3120, unit: 'MYR', icon: 'wallet', delta: '-2.1%', up: false, color: '#8ec63f', spark: spark(3, false), flow: true, periodScaled: true },
  { key: 'carbon', label: 'Carbon Emissions', base: 54, unit: 'tCO₂', icon: 'co2', delta: '-3.1%', up: false, color: '#3fc8d6', spark: spark(4, false), flow: true, periodScaled: true },
  { key: 'renewable', label: 'Renewable Share', base: 34, unit: '%', icon: 'leaf', delta: '+6.0%', up: true, color: '#8ec63f', spark: spark(5, true), flow: false, periodScaled: false },
  { key: 'intensity', label: 'Energy Intensity', base: 118, unit: 'kWh/m²', icon: 'gauge', delta: '-1.4%', up: false, color: '#e0a458', spark: spark(6, false), flow: false, periodScaled: false },
]

// Zone shares (drill-down scaling) and previous-period ratio (comparison mode)
export const ZONE_SHARES = { 'Zone A': 0.25, 'Zone B': 0.36, 'Zone C': 0.39 }
export const PREV_RATIO = 0.9 // previous period ≈ 90% of current (used for compare overlay)

// ---- Source mix (donut) ----
export const SOURCE_MIX = [
  { name: 'Electricity', value: 42, color: '#2b7fff' },
  { name: 'Solar', value: 18, color: '#8ec63f' },
  { name: 'Natural Gas', value: 22, color: '#e0a458' },
  { name: 'Chilled Water', value: 12, color: '#3fc8d6' },
  { name: 'Auto Fuel', value: 6, color: '#a06bff' },
]

// ---- Cost breakdown by category over 6 months (stacked bar) ----
const COST_CATS = ['HVAC', 'Lighting', 'EV Charging', 'Plug Loads', 'Common Services']
export const COST_BREAKDOWN = MONTH_LABELS.slice(1, 7).map((m, i) => ({
  month: m,
  HVAC: jitter(1400 + i * 40, 300),
  Lighting: jitter(620, 150),
  'EV Charging': jitter(380 + i * 30, 120),
  'Plug Loads': jitter(520, 140),
  'Common Services': jitter(300, 90),
}))
export const COST_CATEGORIES = COST_CATS

// ---- Emissions actual + forecast + target (composed) ----
export const EMISSIONS = MONTH_LABELS.map((m, i) => {
  const actual = i <= 6 ? Math.round(58 - i * 1.6 + (rnd() - 0.5) * 8 + (rnd() < 0.2 ? 5 : 0)) : null
  const forecast = i >= 6 ? Math.round(58 - i * 1.9) : null
  return { month: m, actual, forecast, target: 42 }
})

// ---- 24h load profile: overnight base, morning + evening peaks, noise ----
export const LOAD_PROFILE = Array.from({ length: 24 }, (_, h) => {
  const morning = Math.exp(-((h - 9) ** 2) / 7)
  const evening = Math.exp(-((h - 19) ** 2) / 5)
  let f = 0.2 + morning * 0.72 + evening * 0.95
  f *= 0.9 + (rnd() - 0.5) * 0.3
  if (rnd() < 0.06) f *= 1.2 // spike
  return { hour: `${String(h).padStart(2, '0')}:00`, load: Math.max(20, Math.round(30 + f * 190)) }
})
export const PEAK_HOUR = LOAD_PROFILE.reduce((a, b) => (b.load > a.load ? b : a))

// ---- Consumption heatmap (7 days x 24 hours) ----
export const HEATMAP = DAY_LABELS.map((day, d) => ({
  day,
  hours: Array.from({ length: 24 }, (_, h) => {
    const work = h >= 8 && h <= 19 && d < 5
    const base = work ? 55 + Math.sin(((h - 8) / 11) * Math.PI) * 40 : 12
    return Math.max(4, Math.min(100, Math.round(base + (rnd() - 0.5) * 18)))
  }),
}))

// ---- Efficiency gauges ----
export const GAUGES = [
  { label: 'System Efficiency', value: 91, unit: '%', color: '#8ec63f' },
  { label: 'Power Factor', value: 96, unit: '%', color: '#2b7fff' },
  { label: 'Load Factor', value: 68, unit: '%', color: '#e0a458' },
]

// ---- Targets / benchmarks ----
export const TARGETS = [
  { label: 'Annual energy target', current: 68, target: 100, unit: '% of budget used', color: '#2b7fff' },
  { label: 'Carbon reduction goal', current: 42, target: 50, unit: '% reduced', color: '#8ec63f' },
  { label: 'Renewable adoption', current: 34, target: 50, unit: '% share', color: '#3fc8d6' },
]

export const BENCHMARKS = [
  { label: 'vs Last Year', value: '-8.4%', good: true },
  { label: 'vs Portfolio Avg', value: '-3.2%', good: true },
  { label: 'vs Industry Median', value: '+2.1%', good: false },
]

// ---- AI insights / anomalies ----
export const INSIGHTS = [
  { type: 'anomaly', title: 'Unusual off-hours load in Zone C', text: 'Consumption 22% above baseline between 01:00–04:00 for 3 nights. Possible HVAC schedule fault.' },
  { type: 'saving', title: 'Lighting optimisation opportunity', text: 'Zone B lighting runs at 100% during daylight. Daylight harvesting could save ~1,900 kWh/yr.' },
  { type: 'forecast', title: 'On track to beat annual target', text: 'Projected year-end consumption 8.4% under budget at current trend.' },
  { type: 'peak', title: 'Peak demand approaching threshold', text: 'Peak hit 214 kW (89% of 240 kW contracted). Load-shift EV charging to off-peak to avoid penalty.' },
]

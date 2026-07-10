// Central mock dataset for the Smart Energy & Digital Building Enablement Platform.
// Values mirror the proposal screenshots (Building 01, Zones A/B/C).

export const ZONE_COLORS = {
  'Zone A': 'var(--zone-a)',
  'Zone B': 'var(--zone-b)',
  'Zone C': 'var(--zone-c)',
}
export const ZONE_HEX = {
  'Zone A': '#d7e9a0',
  'Zone B': '#8ec63f',
  'Zone C': '#2b7fff',
}

// Seeded RNG so noisy data stays stable across re-renders.
function makeRng(seed) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Realistic time series: rising baseline + mean-reverting noise + occasional spikes.
function ramp(peak, points = 30) {
  const out = []
  const base = new Date(2026, 6, 8, 14, 6, 0).getTime()
  const rnd = makeRng(Math.round(peak * 1000) + points + 7)
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5 // ~bell-shaped noise
  let level = peak * (0.3 + rnd() * 0.15)
  for (let i = 0; i < points; i++) {
    const t = new Date(base + i * 30 * 1000)
    const p = i / (points - 1)
    const baseline = peak * (0.28 + p * 0.5)
    level += (baseline - level) * 0.35 + gauss() * peak * 0.13
    if (rnd() < 0.09) level += gauss() * peak * 0.28 // sporadic spike / drop
    level = Math.max(peak * 0.04, Math.min(peak * 1.18, level))
    out.push({
      time: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      short: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(level),
    })
  }
  return out
}

export const METRICS = {
  'building-consumption': {
    key: 'building-consumption',
    group: 'Energy',
    parent: 'Electricity',
    parentPath: '/energy/electricity',
    title: 'Building Consumption',
    zoneTitle: 'ZONE A - BUILDING',
    icon: 'building',
    accent: 'green',
    summary: {
      primary: { val: 33, unit: 'kWh', label: 'Total Consumed This Year' },
      secondary: { val: 7, unit: 'tCO2', label: 'Generated This Year' },
    },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '2', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '4', unit: 'MYR', sub: 'This Year' },
      { icon: 'bolt', label: 'Power Used', val: '10', unit: 'kWh', sub: 'This Year' },
    ],
    splitTitle: 'ENERGY SPLIT (kWh)',
    split: [
      { zone: 'Zone A', value: 25 },
      { zone: 'Zone B', value: 36 },
      { zone: 'Zone C', value: 40 },
    ],
    miniBars: [
      { zone: 'Zone A', value: 18 },
      { zone: 'Zone B', value: 32 },
      { zone: 'Zone C', value: 50 },
    ],
    series: ramp(6),
    seriesUnit: 'kWh',
  },
  'ev-charge': {
    key: 'ev-charge',
    group: 'Energy',
    parent: 'Electricity',
    parentPath: '/energy/electricity',
    title: 'EV Charge',
    zoneTitle: 'ZONE A - EV CHARGE',
    icon: 'ev',
    accent: 'green',
    summary: {
      primary: { val: 32, unit: 'kWh', label: 'Total Consumed This Year' },
      secondary: { val: 6, unit: 'tCO2', label: 'Generated This Year' },
    },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '5', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '10', unit: 'MYR', sub: 'This Year' },
      { icon: 'bolt', label: 'Power Used', val: '24', unit: 'kWh', sub: 'This Year' },
    ],
    splitTitle: 'ENERGY SPLIT (kWh)',
    split: [
      { zone: 'Zone A', value: 27 },
      { zone: 'Zone B', value: 34 },
      { zone: 'Zone C', value: 39 },
    ],
    miniBars: [
      { zone: 'Zone A', value: 13 },
      { zone: 'Zone B', value: 34 },
      { zone: 'Zone C', value: 53 },
    ],
    series: ramp(24),
    seriesUnit: 'kWh',
  },
  'solar-generation': {
    key: 'solar-generation',
    group: 'Energy',
    parent: 'Electricity',
    parentPath: '/energy/electricity',
    title: 'Solar Generation',
    zoneTitle: 'ZONE A - SOLAR GENERATION',
    icon: 'solar',
    accent: 'amber',
    summary: {
      primary: { val: 33, unit: 'kWh', label: 'Produced This Year' },
      secondary: { val: 16, unit: 'tCO2', label: 'Saved This Year' },
    },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '16', unit: 'Tonnes', sub: 'Saved This Year' },
      { icon: 'wallet', label: 'Estimated Savings', val: '21', unit: 'MYR', sub: 'This Year' },
      { icon: 'bolt', label: 'Power Generated', val: '33', unit: 'kWh', sub: 'This Year' },
    ],
    splitTitle: 'GENERATION SPLIT (kWh)',
    split: [
      { zone: 'Zone A', value: 30 },
      { zone: 'Zone B', value: 33 },
      { zone: 'Zone C', value: 37 },
    ],
    miniBars: [
      { zone: 'Zone A', value: 13 },
      { zone: 'Zone B', value: 34 },
      { zone: 'Zone C', value: 53 },
    ],
    series: ramp(30),
    seriesUnit: 'kWh',
  },
  'natural-gas': {
    key: 'natural-gas',
    group: 'Fuel',
    parent: 'Fuel',
    parentPath: '/fuel',
    title: 'Natural Gas',
    zoneTitle: 'ZONE A - NATURAL GAS',
    icon: 'flame',
    accent: 'amber',
    summary: {
      primary: { val: 112, unit: 'Liter', label: 'Total Used This Year' },
      secondary: { val: 22, unit: 'tCO2', label: 'Produced This Year' },
    },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '22', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '45', unit: 'MYR', sub: 'This Year' },
      { icon: 'drop', label: 'Total Liter', val: '112', unit: 'Liter', sub: 'This Year' },
    ],
    splitTitle: 'GAS SPLIT (kWh)',
    split: [
      { zone: 'Zone A', value: 37 },
      { zone: 'Zone B', value: 32 },
      { zone: 'Zone C', value: 31 },
    ],
    miniBars: [
      { zone: 'Zone A', value: 37 },
      { zone: 'Zone B', value: 32 },
      { zone: 'Zone C', value: 31 },
    ],
    series: ramp(42),
    seriesUnit: 'Liter',
  },
  'automotive-fuels': {
    key: 'automotive-fuels',
    group: 'Fuel',
    parent: 'Fuel',
    parentPath: '/fuel',
    title: 'Automotive Fuels',
    zoneTitle: 'ZONE A - AUTOMOTIVE FUELS',
    icon: 'fuelpump',
    accent: 'amber',
    summary: {
      primary: { val: 45, unit: 'Liter', label: 'Total Used This Year' },
      secondary: { val: 9, unit: 'tCO2', label: 'Produced This Year' },
    },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '9', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '18', unit: 'MYR', sub: 'This Year' },
      { icon: 'drop', label: 'Total Liter', val: '45', unit: 'Liter', sub: 'This Year' },
    ],
    splitTitle: 'FUEL SPLIT (kWh)',
    split: [
      { zone: 'Zone A', value: 34 },
      { zone: 'Zone B', value: 28 },
      { zone: 'Zone C', value: 38 },
    ],
    miniBars: [
      { zone: 'Zone A', value: 34 },
      { zone: 'Zone B', value: 28 },
      { zone: 'Zone C', value: 38 },
    ],
    series: ramp(41),
    seriesUnit: 'Liter',
  },
  'chilled-water': {
    key: 'chilled-water',
    group: 'Thermal',
    parent: 'Thermal',
    parentPath: '/thermal',
    title: 'Chilled Water',
    zoneTitle: 'ZONE A - CHILLED WATER',
    icon: 'snow',
    accent: 'cyan',
    summary: {
      primary: { val: 128, unit: 'RTh', label: 'Total Cooling This Year' },
      secondary: { val: 11, unit: 'tCO2', label: 'Produced This Year' },
    },
    kpis: [
      { icon: 'co2', label: 'Tonnes CO2', val: '11', unit: 'Tonnes', sub: 'Produced This Year' },
      { icon: 'wallet', label: 'Estimated Cost', val: '38', unit: 'MYR', sub: 'This Year' },
      { icon: 'snow', label: 'Cooling Load', val: '128', unit: 'RTh', sub: 'This Year' },
    ],
    splitTitle: 'COOLING SPLIT (RTh)',
    split: [
      { zone: 'Zone A', value: 41 },
      { zone: 'Zone B', value: 29 },
      { zone: 'Zone C', value: 30 },
    ],
    miniBars: [
      { zone: 'Zone A', value: 41 },
      { zone: 'Zone B', value: 29 },
      { zone: 'Zone C', value: 30 },
    ],
    series: ramp(38),
    seriesUnit: 'RTh',
  },
}

// Landing cards
export const ELECTRICITY_CARDS = ['building-consumption', 'ev-charge', 'solar-generation']
export const FUEL_CARDS = ['natural-gas', 'automotive-fuels']
export const THERMAL_CARDS = ['chilled-water']

// Zone map pin positions (percentage of container)
export const MAP_PINS = [
  { zone: 'Zone A', x: 30, y: 30, color: '#8ec63f' },
  { zone: 'Zone C', x: 66, y: 40, color: '#e0574d' },
  { zone: 'Zone B', x: 44, y: 62, color: '#e0574d' },
]

// Dashboard rollups
export const DASHBOARD = {
  tiles: [
    { label: 'Total Electricity', val: '65', unit: 'kWh', icon: 'bolt', trend: '+4.2%', up: true },
    { label: 'Solar Generated', val: '33', unit: 'kWh', icon: 'solar', trend: '+12%', up: true },
    { label: 'Total CO2', val: '54', unit: 'Tonnes', icon: 'co2', trend: '-3.1%', up: false },
    { label: 'Est. Cost', val: '115', unit: 'MYR', icon: 'wallet', trend: '-1.8%', up: false },
  ],
  mix: [
    { name: 'Electricity', value: 65 },
    { name: 'Natural Gas', value: 112 },
    { name: 'Auto Fuel', value: 45 },
    { name: 'Chilled Water', value: 128 },
  ],
  trend: ramp(64, 30),
}

// ---------- Enriched data for detail-heavy views ----------

const STATUS_POOL = ['Normal', 'Optimal', 'Normal', 'Warning', 'Normal']
const ZONES = ['Zone A', 'Zone B', 'Zone C']

// Realistic daily load: overnight base, morning + evening peaks, lunch dip, noise.
function hourly(peak) {
  const rnd = makeRng(Math.round(peak * 777) + 13)
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5
  return Array.from({ length: 24 }, (_, h) => {
    const morning = Math.exp(-((h - 9) ** 2) / 7)
    const evening = Math.exp(-((h - 19) ** 2) / 5)
    let f = 0.12 + morning * 0.72 + evening * 0.9
    f *= 0.85 + gauss() * 0.22
    if (rnd() < 0.06) f *= 1.3
    return { hour: `${String(h).padStart(2, '0')}h`, value: Math.max(1, Math.round(peak * f)) }
  })
}

function readings(peak, unit) {
  const rows = []
  const base = new Date(2026, 6, 8, 14, 0, 0).getTime()
  const rnd = makeRng(Math.round(peak * 311) + 29)
  for (let i = 0; i < 8; i++) {
    const t = new Date(base - i * 15 * 60 * 1000)
    rows.push({
      time: t.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      zone: ZONES[i % 3],
      value: Math.max(1, Math.round(peak * (0.28 + rnd() * 0.95))),
      unit,
      status: STATUS_POOL[(i * 3) % STATUS_POOL.length],
    })
  }
  return rows
}

// Attach derived detail fields to every metric (keeps mock data DRY).
Object.values(METRICS).forEach((m) => {
  const peak = m.series[m.series.length - 1]?.value || 12
  const pre = m.key.replace(/[^a-z]/g, '').slice(0, 3).toUpperCase()
  m.hourly = hourly(peak)
  m.readings = readings(peak, m.seriesUnit)
  m.stats = [
    { label: 'Peak Demand', val: peak, unit: m.seriesUnit },
    { label: 'Average Load', val: Math.round(peak * 0.42), unit: m.seriesUnit },
    { label: 'Load Factor', val: 68, unit: '%' },
    { label: 'System Efficiency', val: 91, unit: '%' },
    { label: 'vs Target', val: '-6', unit: '%', good: true },
  ]
  m.devices = [
    { id: `MTR-${pre}-A1`, zone: 'Zone A', type: 'Smart Meter', status: 'Online' },
    { id: `MTR-${pre}-B2`, zone: 'Zone B', type: 'Smart Meter', status: 'Online' },
    {
      id: `SNS-${pre}-C3`,
      zone: 'Zone C',
      type: 'IoT Sensor',
      status: m.key === 'ev-charge' ? 'Offline' : 'Online',
    },
  ]
})

export const ALERTS = [
  { id: 1, severity: 'critical', title: 'Zone C EV charger offline', detail: 'SNS-EV-C3 stopped reporting data', time: '2 min ago' },
  { id: 2, severity: 'warning', title: 'Zone A consumption above target', detail: '+12% vs monthly target', time: '26 min ago' },
  { id: 3, severity: 'warning', title: 'Natural gas usage spike', detail: 'Zone A rose +18% in the last hour', time: '1 hr ago' },
  { id: 4, severity: 'info', title: 'Solar generation peak reached', detail: '33 kWh — new daily high', time: '2 hr ago' },
  { id: 5, severity: 'info', title: 'Monthly report generated', detail: 'June sustainability report ready', time: '5 hr ago' },
]

export const ZONE_TABLE = [
  { zone: 'Zone A', consumption: 25, cost: 4, co2: 2, efficiency: 92, status: 'Optimal', trend: '+3%' },
  { zone: 'Zone B', consumption: 36, cost: 6, co2: 3, efficiency: 88, status: 'Normal', trend: '+5%' },
  { zone: 'Zone C', consumption: 40, cost: 7, co2: 2, efficiency: 79, status: 'Warning', trend: '+9%' },
]

export const DEVICE_SUMMARY = { online: 42, offline: 2, warning: 3, total: 44 }

export const TOP_CONSUMERS = [
  { name: 'HVAC — Zone C', value: 18, unit: 'kWh', pct: 90 },
  { name: 'Lighting — Zone B', value: 12, unit: 'kWh', pct: 60 },
  { name: 'EV Charging — Zone A', value: 10, unit: 'kWh', pct: 50 },
  { name: 'Lifts & Escalators', value: 8, unit: 'kWh', pct: 40 },
  { name: 'Common Services', value: 6, unit: 'kWh', pct: 30 },
]

export const SUSTAINABILITY = {
  carbonIntensity: 0.42, // tCO2 / MWh
  renewableShare: 34, // %
  target: 50,
  savedTrees: 128,
}


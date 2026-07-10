// Client-side exporters — no external libraries, CSP-safe.

function triggerDownload(filename, content, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function csvRow(cells) {
  return cells
    .map((c) => {
      const s = String(c ?? '')
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    })
    .join(',')
}

// Build a multi-section CSV from the current dashboard state.
export function exportDashboardCSV({ period, zone, compare, kpis, zoneTable, trend }) {
  const lines = []
  lines.push(csvRow(['Smart Energy & Digital Building Enablement — Analytics Export']))
  lines.push(csvRow(['Building', 'Building 01']))
  lines.push(csvRow(['Period', period]))
  lines.push(csvRow(['Zone filter', zone]))
  lines.push(csvRow(['Comparison', compare ? 'vs previous period' : 'off']))
  lines.push('')

  lines.push(csvRow(['KPI', 'Value', 'Unit', 'Change']))
  kpis.forEach((k) => lines.push(csvRow([k.label, k.value, k.unit, k.delta])))
  lines.push('')

  lines.push(csvRow(['Zone', 'Consumption (kWh)', 'Cost (MYR)', 'CO2 (t)', 'Efficiency (%)', 'Status', 'Trend']))
  zoneTable.forEach((r) => lines.push(csvRow([r.zone, r.consumption, r.cost, r.co2, r.efficiency, r.status, r.trend])))
  lines.push('')

  const zoneKeys = Object.keys(trend[0]).filter((k) => k !== 'label')
  lines.push(csvRow(['Consumption Trend', ...zoneKeys]))
  trend.forEach((row) => lines.push(csvRow([row.label, ...zoneKeys.map((z) => row[z] ?? '')])))

  const stamp = '2026-07-09'
  triggerDownload(`analytics-${period.toLowerCase()}-${stamp}.csv`, lines.join('\n'), 'text/csv;charset=utf-8')
}

// Print-to-PDF via the browser (print CSS formats the page for A4).
export function exportDashboardPDF() {
  window.print()
}

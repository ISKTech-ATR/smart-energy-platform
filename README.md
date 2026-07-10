# Smart Energy & Digital Building Enablement Platform

A working prototype of the dashboard described in the IS IKHLAS SUCI proposal
**"Smart Energy & Digital Building Enablement Platform"** (prepared for ERAY
Construction Sdn. Bhd.). It implements the UI shown in the proposal screenshots:
real-time energy visibility across zones for a building portfolio, unified under a
single dark-themed operations console.

## What it covers

Maps directly to the proposal's Project Scope (energy dashboards, role-based views,
zone-level monitoring, source split):

| Area | Sidebar | Pages |
|------|---------|-------|
| Analytics overview | **Dashboard** | Interactive period filter (Week/Month/Quarter/Year), 6 KPI sparkline cards, stacked consumption trend, source-mix donut, cost breakdown, emissions trend + forecast vs target, 24h load profile, day×hour heatmap, efficiency gauges, targets/benchmarks, auto-detected insights, zone table, alerts, top consumers, system status |

**Dashboard interactions**
- **Drill-down** — filter the whole dashboard by zone via the zone selector *or* by clicking a row in the Zone Performance table. KPIs, the trend, and the title all rescale to the selected zone; a removable filter tag shows the active state.
- **Comparison mode** — the *Compare* toggle overlays a dashed "previous period" line on the consumption trend.
- **Export** — the *Export* button offers **CSV** (a multi-section download: context, KPIs, zone table, trend — reflecting the current filters) and **Print / PDF** (browser print-to-PDF with dedicated print CSS that hides the chrome and lays out A4 landscape).
| Electricity | **Energy** | Landing (Building Consumption / EV Charge / Solar Generation) + detail pages |
| Fuel | **Fuel** | Landing (Natural Gas / Automotive Fuels) + detail pages |
| Thermal / HVAC | **Thermal** | Landing (Chilled Water) + detail page |

Each **detail page** reproduces the proposal layout:
- Left KPI column — Tonnes CO₂, Estimated Cost (MYR), Power/Volume used
- Main time-series chart with **This Day / Last Week / Last Month / Last Year** tabs
- Zone Map (self-contained schematic, no external tiles)
- Zone Split bar chart with Zone A / B / C legend

## Tech stack

- **React 18** + **Vite 5** (SPA, `react-router-dom`)
- **Recharts** for all charts
- Pure CSS design system (`src/index.css`) — dark navy theme, blue/green accents
- All data is mock (`src/data/mock.js`) — ready to swap for a live BMS/EMS/IoT API

## Branding / ERAY logo

The platform is branded for **ERAY Construction Sdn. Bhd.** The logo shows on the
login screen (full lockup) and the sidebar (mark), and is the favicon.

A bundled SVG interpretation ships by default (`public/eray-logo.svg` full,
`public/eray-mark.svg` mark). To use the **exact official artwork**, drop the raster
files into `public/` and they are picked up automatically (no code change):

| Drop this file | Used for |
|----------------|----------|
| `public/eray-logo.png` | Login screen (full logo) |
| `public/eray-mark.png` | Sidebar + a square favicon crop |

`BrandLogo` tries the PNG first and falls back to the SVG if it isn't there.

## Run it

```bash
cd smart-energy-platform
npm install
npm run dev      # http://localhost:5175
```

Build for production:

```bash
npm run build && npm run preview
```

## Structure

```
src/
  App.jsx              # routes + app shell
  index.css            # design system / theme
  data/mock.js         # all metrics, zones, KPIs, series
  components/
    Sidebar, Header, Breadcrumb
    Icons.jsx          # inline SVG icon set
    SummaryCard.jsx    # landing cards
    TimeSeriesChart.jsx# area chart + period tabs
    ZoneBars.jsx       # zone split bars
    SplitPanel.jsx     # "ENERGY SPLIT (kWh)" panel
    ZoneMap.jsx        # schematic zone map
  pages/
    Dashboard.jsx
    Landing.jsx        # Electricity / Fuel / Thermal grids
    DetailPage.jsx     # reusable metric detail view
```

## Wiring to real data

Replace the objects in `src/data/mock.js` with API responses. Each metric key
(`building-consumption`, `ev-charge`, `solar-generation`, `natural-gas`,
`automotive-fuels`, `chilled-water`) drives a `/detail/:metricKey` route, so adding
a new monitored source is a matter of adding one entry plus a card reference.

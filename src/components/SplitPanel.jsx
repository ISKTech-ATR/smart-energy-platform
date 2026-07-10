import ZoneBars from './ZoneBars.jsx'
import { ZONE_HEX } from '../data/mock.js'

// The "ENERGY SPLIT (kWh)" style panel: chart on a black inset + legend at right.
export default function SplitPanel({ title, data }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>{title}</h3>
      </div>
      <div className="split-body">
        <div className="chart-inset">
          <ZoneBars data={data} height={190} />
        </div>
        <div className="split-legend">
          {data.map((d) => (
            <div className="legend-row" key={d.zone} style={{ color: ZONE_HEX[d.zone] }}>
              <span className="swatch" style={{ background: ZONE_HEX[d.zone] }} />
              {d.zone.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

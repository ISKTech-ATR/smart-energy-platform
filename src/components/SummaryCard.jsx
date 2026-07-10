import { useNavigate } from 'react-router-dom'
import Icon from './Icons.jsx'
import ZoneBars from './ZoneBars.jsx'
import { ZONE_HEX } from '../data/mock.js'

export default function SummaryCard({ metric }) {
  const navigate = useNavigate()
  return (
    <div className="summary-card" onClick={() => navigate(`/detail/${metric.key}`)}>
      <div className="big-icon">
        <Icon name={metric.icon} size={92} />
      </div>
      <h2>{metric.title}</h2>

      <div className="stat">
        <span className="val">{metric.summary.primary.val}</span>
        <span className="unit">{metric.summary.primary.unit}</span>
        <div className="label">{metric.summary.primary.label}</div>
      </div>
      <div className="stat">
        <span className="val">{metric.summary.secondary.val}</span>
        <span className="unit">{metric.summary.secondary.unit}</span>
        <div className="label">{metric.summary.secondary.label}</div>
      </div>

      <div className="legend-mini">
        <div className="legend-list">
          <div className="legend-title">Legend</div>
          {metric.miniBars.map((b) => (
            <div className="legend-row" key={b.zone}>
              <span className="swatch" style={{ background: ZONE_HEX[b.zone] }} />
              {b.zone}
            </div>
          ))}
        </div>
        <div className="chart-inset">
          <ZoneBars data={metric.miniBars} height={140} />
        </div>
      </div>
    </div>
  )
}

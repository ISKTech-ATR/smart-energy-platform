import { Link, useNavigate } from 'react-router-dom'
import Icon from './Icons.jsx'

// trail: array of { label, to? } — last item rendered as current.
export default function Breadcrumb({ trail }) {
  const navigate = useNavigate()
  return (
    <div className="breadcrumb">
      <div className="back" onClick={() => navigate(-1)} title="Back">
        <Icon name="chevron-left" size={18} />
      </div>
      {trail.map((item, i) => {
        const last = i === trail.length - 1
        return (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {last ? (
              <span className="current">{item.label}</span>
            ) : item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
            {!last && <span className="sep">›</span>}
          </span>
        )
      })}
    </div>
  )
}

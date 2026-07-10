import { MAP_PINS } from '../data/mock.js'

// Stylised dark schematic "zone map" (no external tiles — CSP-safe, self-contained).
export default function ZoneMap() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 style={{ fontSize: 18 }}>ZONE MAP</h3>
      </div>
      <div className="map-wrap">
        <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
          <rect width="600" height="300" fill="#0f1626" />
          {/* roads */}
          <path d="M0 235 L600 210" stroke="#1d2942" strokeWidth="16" fill="none" />
          <path d="M120 0 L150 300" stroke="#1d2942" strokeWidth="10" fill="none" />
          <path d="M470 0 L500 300" stroke="#1d2942" strokeWidth="8" fill="none" />
          {/* building blocks */}
          {[
            [70, 60, 120, 70],
            [220, 40, 90, 60],
            [360, 70, 110, 80],
            [90, 150, 150, 70],
            [300, 160, 120, 60],
            [470, 150, 90, 70],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#141d31" stroke="#233150" />
          ))}
          {/* zone A footprint highlight */}
          <rect x="150" y="55" width="80" height="55" rx="6" fill="rgba(142,198,63,0.18)" stroke="#8ec63f" />
          <text x="8" y="292" fill="#3c4a66" fontSize="11" fontWeight="600">Jalan PJU 8/8A</text>
        </svg>
        {MAP_PINS.map((p) => (
          <div className="map-pin" key={p.zone} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <span>{p.zone}</span>
            <span className="dot" style={{ background: p.color }} />
          </div>
        ))}
        <div className="map-controls">
          <button>+</button>
          <button>−</button>
        </div>
      </div>
    </div>
  )
}

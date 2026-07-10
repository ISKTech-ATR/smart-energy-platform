// Minimal inline SVG icon set matching the proposal screenshots.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Icon = ({ name, size = 24 }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24' }
  switch (name) {
    case 'dashboard':
      return (
        <svg {...p} {...S}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'energy':
    case 'bolt':
      return (
        <svg {...p} fill="currentColor" stroke="none" viewBox="0 0 24 24">
          <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
        </svg>
      )
    case 'fuel':
    case 'fuelpump':
      return (
        <svg {...p} {...S}>
          <rect x="4" y="3" width="9" height="18" rx="1" />
          <path d="M4 9h9" />
          <path d="M13 7l3 3v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-8l-3-3" />
        </svg>
      )
    case 'thermal':
      return (
        <svg {...p} {...S}>
          <path d="M10 13V5a2 2 0 1 1 4 0v8a4 4 0 1 1-4 0z" />
        </svg>
      )
    case 'building':
      return (
        <svg {...p} fill="currentColor" stroke="none" viewBox="0 0 24 24">
          <path d="M3 21V8l6-3v3l6-3v16H3zm2-2h4v-2H5v2zm0-4h4v-2H5v2zm0-4h4V9H5v2zm6 8h6V8l-6 3v8zm2-2h2v-2h-2v2zm0-4h2v-2h-2v2z" />
        </svg>
      )
    case 'ev':
      return (
        <svg {...p} {...S}>
          <rect x="5" y="3" width="9" height="18" rx="1.5" />
          <path d="M9 8l-1.5 3H10l-1.5 3" fill="none" />
          <path d="M14 8h2.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 1.5 1.5A1.5 1.5 0 0 0 21 16v-5l-2-2" />
        </svg>
      )
    case 'solar':
      return (
        <svg {...p} {...S}>
          <circle cx="12" cy="5" r="2.2" />
          <path d="M12 1.5v1.3M17 3.5l-.9.9M20 8h-1.3M4 8H2.7M7.9 4.4 7 3.5" />
          <path d="M5 21l1.5-9h11L19 21z" />
          <path d="M4.5 17h15M9.5 12l-.7 9M14.5 12l.7 9" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...p} {...S}>
          <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s0 2 1.5 2S12 8 12 3z" />
        </svg>
      )
    case 'snow':
      return (
        <svg {...p} {...S}>
          <path d="M12 2v20M4.5 6.5 12 12l7.5-5.5M4.5 17.5 12 12l7.5 5.5M2 12h20" />
        </svg>
      )
    case 'co2':
      return (
        <svg {...p} {...S}>
          <path d="M3 15a4 4 0 1 0 0-4 5 5 0 1 0-1 8h12a3 3 0 1 0 0-6" />
          <text x="9.5" y="18.5" fontSize="6" fill="currentColor" stroke="none" fontWeight="700">CO2</text>
        </svg>
      )
    case 'wallet':
      return (
        <svg {...p} {...S}>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <circle cx="16.5" cy="13.5" r="1" fill="currentColor" />
        </svg>
      )
    case 'drop':
      return (
        <svg {...p} {...S}>
          <path d="M12 3s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10z" />
        </svg>
      )
    case 'chevron-left':
      return (
        <svg {...p} {...S}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      )
    case 'chevron-down':
      return (
        <svg {...p} {...S}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      )
    case 'user':
      return (
        <svg {...p} {...S}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...p} {...S}>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
      )
    case 'gear':
      return (
        <svg {...p} {...S}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...p} {...S}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      )
    case 'alert':
      return (
        <svg {...p} {...S}>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      )
    case 'check':
      return (
        <svg {...p} {...S}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...p} {...S}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      )
    case 'trend-up':
      return (
        <svg {...p} {...S}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M17 7h4v4" />
        </svg>
      )
    case 'gauge':
      return (
        <svg {...p} {...S}>
          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M12 14l3-3" />
          <path d="M4 18a9 9 0 1 1 16 0" />
        </svg>
      )
    case 'leaf':
      return (
        <svg {...p} {...S}>
          <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 8-4 12-9 12z" />
          <path d="M4 20c4-4 6-6 9-7" />
        </svg>
      )
    case 'download':
      return (
        <svg {...p} {...S}>
          <path d="M12 3v12" />
          <path d="M7 11l5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      )
    case 'sheet':
      return (
        <svg {...p} {...S}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M4 9h16M4 15h16M10 3v18" />
        </svg>
      )
    case 'file':
      return (
        <svg {...p} {...S}>
          <path d="M14 3v5h5" />
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M8 13h8M8 17h8" />
        </svg>
      )
    default:
      return null
  }
}

export default Icon

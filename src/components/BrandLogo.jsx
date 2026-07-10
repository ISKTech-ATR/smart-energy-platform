import { useState } from 'react'

// Renders the ERAY logo. Prefers a real raster the user drops in
// (public/eray-logo.png or public/eray-mark.png); otherwise falls back to
// the bundled SVG interpretation.
export default function BrandLogo({ variant = 'mark', className, alt = 'ERAY Construction Sdn. Bhd.' }) {
  const base = import.meta.env.BASE_URL // '/' in dev, '/smart-energy-platform/' on Pages
  const png = base + (variant === 'full' ? 'eray-logo.png' : 'eray-mark.png')
  const svg = base + (variant === 'full' ? 'eray-logo.svg' : 'eray-mark.svg')
  const [src, setSrc] = useState(png)
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (src !== svg) setSrc(svg)
      }}
    />
  )
}

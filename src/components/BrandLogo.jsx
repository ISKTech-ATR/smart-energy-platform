import { useState } from 'react'

// Renders the ERAY logo. Prefers a real raster the user drops in
// (public/eray-logo.png or public/eray-mark.png); otherwise falls back to
// the bundled SVG interpretation.
export default function BrandLogo({ variant = 'mark', className, alt = 'ERAY Construction Sdn. Bhd.' }) {
  const png = variant === 'full' ? '/eray-logo.png' : '/eray-mark.png'
  const svg = variant === 'full' ? '/eray-logo.svg' : '/eray-mark.svg'
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

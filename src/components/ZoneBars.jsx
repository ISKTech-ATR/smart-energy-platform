import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts'
import { ZONE_HEX } from '../data/mock.js'

// Compact zone bar chart on a black inset (matches the mini charts in cards).
export default function ZoneBars({ data, height = 150 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 18, right: 18, bottom: 0, left: 0 }} barCategoryGap="22%">
        <XAxis dataKey="zone" hide />
        <YAxis hide domain={[0, 'dataMax + 10']} />
        <Bar dataKey="value" radius={[3, 3, 0, 0]} isAnimationActive={false}>
          {data.map((d) => (
            <Cell key={d.zone} fill={ZONE_HEX[d.zone]} />
          ))}
          <LabelList
            dataKey="value"
            position="bottom"
            fill="#0b0f18"
            fontWeight="800"
            fontSize={13}
            content={({ x, y, width, value, index }) => (
              <g>
                <rect
                  x={x + width / 2 - 16}
                  y={height - 26}
                  width={32}
                  height={20}
                  rx={3}
                  fill={ZONE_HEX[data[index].zone]}
                />
                <text
                  x={x + width / 2}
                  y={height - 12}
                  textAnchor="middle"
                  fill="#0b0f18"
                  fontWeight="800"
                  fontSize={13}
                >
                  {value}
                </text>
              </g>
            )}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

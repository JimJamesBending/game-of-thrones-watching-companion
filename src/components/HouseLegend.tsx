import { houses } from '../data/houses'
import type { HouseId } from '../data/types'

export function HouseLegend({ houseIds }: { houseIds: HouseId[] }) {
  if (!houseIds.length) {
    return <div className="graph-empty">No houses have been tagged for this episode yet.</div>
  }

  return (
    <div className="house-list">
      {houseIds.map((id) => {
        const house = houses[id]
        return (
          <article className="house-card" key={id}>
            <span className="house-swatch" style={{ '--house-color': house.color } as React.CSSProperties} />
            <div>
              <strong>{house.name}</strong>
              <p>
                {[house.seat, house.words].filter(Boolean).join(' | ') || 'Known group in this episode'}
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

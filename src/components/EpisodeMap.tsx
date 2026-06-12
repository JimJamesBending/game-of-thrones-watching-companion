import type { EpisodeContent, EpisodeLocation } from '../data/types'

export function EpisodeMap({ episode }: { episode: EpisodeContent }) {
  if (!episode.locations.length) {
    return <div className="graph-empty">No place data has been curated for this episode yet.</div>
  }

  const locationById = new Map(episode.locations.map((location) => [location.id, location]))

  return (
    <div className="map-wrap">
      <div className="map-board" role="img" aria-label="Schematic Westeros and Essos episode map">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path
            className="landmass"
            d="M42 3 C31 11 30 24 35 35 C24 49 30 63 42 73 C36 84 42 95 54 98 C61 87 63 77 58 66 C66 54 63 43 55 32 C59 20 55 8 42 3 Z"
          />
          <path
            className="landmass"
            d="M78 45 C69 49 67 58 72 66 C68 74 73 85 84 87 C94 81 96 68 91 58 C94 51 88 43 78 45 Z"
          />
          {episode.routes.map((route) => {
            const from = locationById.get(route.from)
            const to = locationById.get(route.to)
            if (!from || !to) return null
            return <RouteLine key={route.id} from={from} to={to} />
          })}
        </svg>

        {episode.locations.map((location) => (
          <div
            key={location.id}
            className="map-pin"
            style={{ '--x': location.x, '--y': location.y } as React.CSSProperties}
          >
            <span className="pin-dot" aria-hidden="true" />
            <span className="pin-label">{location.name}</span>
          </div>
        ))}
      </div>

      <div className="place-list">
        {episode.locations.map((location) => (
          <article className="place-card" key={location.id}>
            <strong>{location.name}</strong>
            <p>{location.region}</p>
            <p>{location.known}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function RouteLine({ from, to }: { from: EpisodeLocation; to: EpisodeLocation }) {
  const midX = (from.x + to.x) / 2
  const midY = Math.min(from.y, to.y) - 8

  return (
    <path
      className="route-line"
      d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
    />
  )
}

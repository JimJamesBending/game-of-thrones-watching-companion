import type { EpisodeContent, EpisodeLocation } from '../data/types'
import { knownWorldMap } from '../data/image-assets'

export function EpisodeMap({ episode }: { episode: EpisodeContent }) {
  const originGroups = groupOrigins(episode)

  if (!episode.locations.length && !originGroups.length) {
    return <div className="graph-empty">No place data has been curated for this episode yet.</div>
  }

  const locationById = new Map(episode.locations.map((location) => [location.id, location]))

  return (
    <div className="map-wrap">
      <div className="map-board" role="img" aria-label="Westeros and Essos episode map with place pins">
        {knownWorldMap ? <img className="map-image" src={knownWorldMap} alt="" /> : null}
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

        {originGroups.map((group) => (
          <div
            key={group.key}
            className="origin-pin"
            style={{ '--x': group.x, '--y': group.y } as React.CSSProperties}
            aria-label={`${group.name}: ${group.characters.map((character) => character.short).join(', ')}`}
          >
            <span className="origin-stack" aria-hidden="true">
              {group.characters.slice(0, 4).map((character) => (
                <span key={character.id}>{initials(character.short)}</span>
              ))}
            </span>
            <span className="origin-label">{group.name}</span>
          </div>
        ))}
      </div>

      <div className="place-list">
        {episode.locations.map((location) => (
          <article className="place-card" key={location.id}>
            {location.image ? <img className="place-image" src={location.image} alt="" /> : null}
            <strong>{location.name}</strong>
            <p>{location.region}</p>
            <p>{location.known}</p>
          </article>
        ))}

        {originGroups.length ? (
          <article className="place-card origin-summary">
            <strong>Character origins</strong>
            <p>House or home markers for people shown in this episode.</p>
            <div className="origin-list">
              {originGroups.slice(0, 8).map((group) => (
                <span key={group.key}>
                  {group.name}: {group.characters.slice(0, 3).map((character) => character.short).join(', ')}
                  {group.characters.length > 3 ? ` +${group.characters.length - 3}` : ''}
                </span>
              ))}
            </div>
          </article>
        ) : null}
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

function groupOrigins(episode: EpisodeContent) {
  const groups = new Map<
    string,
    {
      key: string
      name: string
      region: string
      x: number
      y: number
      characters: EpisodeContent['characters']
    }
  >()

  for (const character of episode.characters) {
    if (!character.origin) continue

    const key = `${character.origin.name}-${character.origin.region}`
    const existing = groups.get(key)
    if (existing) {
      existing.characters.push(character)
    } else {
      groups.set(key, {
        key,
        name: character.origin.name,
        region: character.origin.region,
        x: character.origin.x,
        y: character.origin.y,
        characters: [character],
      })
    }
  }

  return [...groups.values()].sort((a, b) => b.characters.length - a.characters.length)
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

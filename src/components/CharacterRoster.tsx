import { houses } from '../data/houses'
import type { EpisodeContent } from '../data/types'

export function CharacterRoster({ episode }: { episode: EpisodeContent }) {
  if (!episode.characters.length) {
    return <div className="graph-empty">No character cards have been curated for this episode yet.</div>
  }

  return (
    <div className="roster-grid">
      {[...episode.characters]
        .sort((a, b) => a.sortName.localeCompare(b.sortName))
        .map((character) => {
          const house = houses[character.house]
          const bornHouse = character.bornHouse ? houses[character.bornHouse] : undefined

          return (
            <article className="roster-card" key={character.id}>
              <div className="roster-avatar" style={{ '--house-color': house.color } as React.CSSProperties}>
                {character.portrait ? <img src={character.portrait} alt="" /> : initials(character.short)}
              </div>
              <div>
                <strong>{character.name}</strong>
                <p>{character.known}</p>
                <div className="roster-meta">
                  <span>{house.name}</span>
                  {bornHouse ? <span>Born {bornHouse.name}</span> : null}
                  {character.actor ? <span>{character.actor}</span> : null}
                </div>
              </div>
            </article>
          )
        })}
    </div>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

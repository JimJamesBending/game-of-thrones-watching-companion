import { Handle, Position, useStore, type Node, type NodeProps } from '@xyflow/react'
import { houses } from '../data/houses'
import type { Character } from '../data/types'

export type CharacterNodeData = Character & Record<string, unknown>
export type CharacterFlowNode = Node<CharacterNodeData, 'character'>

const zoomSelector = (state: { transform: [number, number, number] }) => state.transform[2]

export function CharacterNode({ data }: NodeProps<CharacterFlowNode>) {
  const zoom = useStore(zoomSelector)
  const house = houses[data.house]
  const compact = zoom < 0.55
  const detailed = zoom > 0.98

  return (
    <article
      className={compact ? 'character-node compact' : 'character-node'}
      style={{ '--house-color': house.color } as React.CSSProperties}
      aria-label={`${data.name}, ${house.name}`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-portrait" aria-hidden="true">
        {data.portrait ? <img src={data.portrait} alt="" /> : initials(data.short)}
      </div>
      {!compact ? (
        <div className="node-copy">
          <span className="node-name">{data.short}</span>
          <span className="node-house">{house.name}</span>
          {detailed ? <p className="node-detail">{data.known}</p> : null}
          {detailed && data.tags?.length ? (
            <div className="node-tags">
              {data.tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <Handle type="source" position={Position.Bottom} />
    </article>
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

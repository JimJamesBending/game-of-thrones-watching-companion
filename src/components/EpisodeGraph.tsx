import { useMemo } from 'react'
import dagre from '@dagrejs/dagre'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { houses } from '../data/houses'
import type { EpisodeContent, RelationshipKind } from '../data/types'
import { CharacterNode, type CharacterFlowNode, type CharacterNodeData } from './CharacterNode'

const nodeTypes = { character: CharacterNode }

const edgeColor: Record<RelationshipKind, string> = {
  blood: '#d2d7d3',
  marriage: '#c8a451',
  betrothal: '#d48b75',
  ward: '#78a7ae',
  serves: '#9dbf88',
  knows: '#95a2b4',
  secret: '#c16d68',
  conflict: '#cf483e',
}

export function EpisodeGraph({ episode }: { episode: EpisodeContent }) {
  const { nodes, edges } = useMemo(() => buildFlow(episode), [episode])

  if (!nodes.length) {
    return <div className="graph-empty">No graph data has been curated for this episode yet.</div>
  }

  return (
    <div className="graph-shell">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.16, duration: 500 }}
        minZoom={0.25}
        maxZoom={1.75}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        onlyRenderVisibleElements
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="rgba(244,238,224,0.18)" />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => houses[node.data.house as keyof typeof houses]?.color ?? '#8e9698'}
          nodeStrokeColor="rgba(244, 238, 224, 0.55)"
          bgColor="rgba(10, 14, 16, 0.88)"
          maskColor="rgba(244, 238, 224, 0.08)"
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

function buildFlow(episode: EpisodeContent): {
  nodes: CharacterFlowNode[]
  edges: Edge[]
} {
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: 'TB', ranksep: 82, nodesep: 42, edgesep: 18, marginx: 28, marginy: 28 })

  const nodes: CharacterFlowNode[] = episode.characters.map((character) => {
    const node: CharacterFlowNode = {
      id: character.id,
      type: 'character',
      data: character as CharacterNodeData,
      position: { x: 0, y: 0 },
    }
    graph.setNode(character.id, { width: 232, height: 104 })
    return node
  })

  const characterIds = new Set(episode.characters.map((character) => character.id))

  const edges: Edge[] = episode.relationships
    .filter((relationship) => characterIds.has(relationship.source) && characterIds.has(relationship.target))
    .map((relationship) => {
      graph.setEdge(relationship.source, relationship.target)
      return {
        id: relationship.id,
        source: relationship.source,
        target: relationship.target,
        type: 'smoothstep',
        label: relationship.label,
        className: `edge-${relationship.kind}`,
        style: {
          stroke: edgeColor[relationship.kind],
          strokeWidth: relationship.kind === 'blood' || relationship.kind === 'marriage' ? 2.4 : 2,
        },
        labelStyle: {
          fill: '#f4eee0',
          fontSize: 11,
          fontWeight: 700,
        },
        labelBgStyle: {
          fill: 'rgba(9, 13, 14, 0.86)',
          fillOpacity: 1,
        },
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 4,
        interactionWidth: 18,
      }
    })

  dagre.layout(graph)

  return {
    nodes: nodes.map((node) => {
      const layoutNode = graph.node(node.id)
      return {
        ...node,
        position: {
          x: layoutNode.x - 116,
          y: layoutNode.y - 52,
        },
      }
    }),
    edges,
  }
}

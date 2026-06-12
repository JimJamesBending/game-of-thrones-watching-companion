import { useMemo } from 'react'
import dagre from '@dagrejs/dagre'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type CoordinateExtent,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { houses } from '../data/houses'
import type { EpisodeContent, Relationship, RelationshipKind } from '../data/types'
import { CharacterNode, type CharacterFlowNode, type CharacterNodeData } from './CharacterNode'

const nodeTypes = { character: CharacterNode }
const NODE_WIDTH = 336
const NODE_HEIGHT = 208
const VIEW_PADDING_X = 360
const VIEW_PADDING_Y = 280
const FIT_VIEW_OPTIONS = { padding: 0.08, duration: 500, minZoom: 0.64, maxZoom: 1.08 }
const layoutKinds = new Set<RelationshipKind>(['blood', 'recognized', 'marriage', 'betrothal', 'ward'])

const edgeColor: Record<RelationshipKind, string> = {
  blood: '#d2d7d3',
  recognized: '#d9b86a',
  marriage: '#c8a451',
  betrothal: '#d48b75',
  ward: '#78a7ae',
  serves: '#9dbf88',
  knows: '#95a2b4',
  secret: '#c16d68',
  conflict: '#cf483e',
}

export function EpisodeGraph({ episode }: { episode: EpisodeContent }) {
  const { nodes, edges, extent } = useMemo(() => buildFlow(episode), [episode])

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
        fitViewOptions={FIT_VIEW_OPTIONS}
        translateExtent={extent}
        nodeExtent={extent}
        minZoom={0.24}
        maxZoom={1.55}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        elevateNodesOnSelect={false}
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
        <Controls showInteractive={false} fitViewOptions={FIT_VIEW_OPTIONS} />
      </ReactFlow>
    </div>
  )
}

function buildFlow(episode: EpisodeContent): {
  nodes: CharacterFlowNode[]
  edges: Edge[]
  extent: CoordinateExtent
} {
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({
    rankdir: 'TB',
    ranksep: 148,
    nodesep: 96,
    edgesep: 42,
    marginx: 96,
    marginy: 96,
    acyclicer: 'greedy',
    ranker: 'network-simplex',
  })

  const nodes: CharacterFlowNode[] = episode.characters.map((character) => {
    const node: CharacterFlowNode = {
      id: character.id,
      type: 'character',
      data: character as CharacterNodeData,
      position: { x: 0, y: 0 },
    }
    graph.setNode(character.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    return node
  })

  const characterIds = new Set(episode.characters.map((character) => character.id))
  const validRelationships = episode.relationships.filter(
    (relationship) => characterIds.has(relationship.source) && characterIds.has(relationship.target),
  )
  const layoutRelationships = getLayoutRelationships(validRelationships)

  layoutRelationships.forEach((relationship) => {
    graph.setEdge(relationship.source, relationship.target, layoutEdgeOptions(relationship.kind))
  })

  const edges: Edge[] = validRelationships.map((relationship) => ({
    id: relationship.id,
    source: relationship.source,
    target: relationship.target,
    type: 'smoothstep',
    label: compactLabel(relationship.label),
    className: `edge-${relationship.kind}`,
    style: {
      stroke: edgeColor[relationship.kind],
      strokeWidth: relationship.kind === 'blood' || relationship.kind === 'marriage' ? 2.35 : 1.9,
    },
    labelStyle: {
      fill: '#f4eee0',
      fontSize: 10,
      fontWeight: 760,
    },
    labelBgStyle: {
      fill: 'rgba(9, 13, 14, 0.96)',
      fillOpacity: 1,
    },
    labelBgPadding: [5, 3],
    labelBgBorderRadius: 4,
    interactionWidth: 18,
  }))

  dagre.layout(graph)

  const laidOutNodes = nodes.map((node) => {
    const layoutNode = graph.node(node.id)
    return {
      ...node,
      position: {
        x: layoutNode.x - NODE_WIDTH / 2,
        y: layoutNode.y - NODE_HEIGHT / 2,
      },
    }
  })

  return { nodes: laidOutNodes, edges, extent: getGraphExtent(laidOutNodes) }
}

function getLayoutRelationships(relationships: Relationship[]) {
  const primaryRelationships = relationships.filter((relationship) => layoutKinds.has(relationship.kind))
  if (primaryRelationships.length >= 2) return primaryRelationships
  return relationships
}

function layoutEdgeOptions(kind: RelationshipKind) {
  if (kind === 'blood' || kind === 'marriage') return { weight: 6, minlen: 1 }
  if (kind === 'recognized') return { weight: 5, minlen: 1 }
  if (kind === 'betrothal' || kind === 'ward') return { weight: 4, minlen: 1 }
  if (kind === 'serves') return { weight: 2, minlen: 2 }
  return { weight: 1, minlen: 2 }
}

function getGraphExtent(nodes: CharacterFlowNode[]): CoordinateExtent {
  const left = Math.min(...nodes.map((node) => node.position.x))
  const top = Math.min(...nodes.map((node) => node.position.y))
  const right = Math.max(...nodes.map((node) => node.position.x + NODE_WIDTH))
  const bottom = Math.max(...nodes.map((node) => node.position.y + NODE_HEIGHT))

  return [
    [left - VIEW_PADDING_X, top - VIEW_PADDING_Y],
    [right + VIEW_PADDING_X, bottom + VIEW_PADDING_Y],
  ]
}

function compactLabel(label: string) {
  if (label.length <= 26) return label
  return `${label.slice(0, 23).trim()}...`
}

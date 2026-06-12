import type { HouseId, RelationshipKind } from './types'

export const houses: Record<
  HouseId,
  { name: string; color: string; words?: string; seat?: string }
> = {
  arryn: {
    name: 'House Arryn',
    color: '#7fb6c8',
    words: 'As High as Honor',
    seat: 'The Eyrie',
  },
  baratheon: {
    name: 'House Baratheon',
    color: '#d6aa3e',
    words: 'Ours is the Fury',
    seat: "King's Landing / Storm's End",
  },
  dothraki: {
    name: 'Dothraki khalasar',
    color: '#b47045',
    seat: 'Across the Narrow Sea',
  },
  greyjoy: {
    name: 'House Greyjoy',
    color: '#7d8356',
    words: 'We Do Not Sow',
    seat: 'Pyke',
  },
  lannister: {
    name: 'House Lannister',
    color: '#a83e3b',
    words: 'Hear Me Roar!',
    seat: 'Casterly Rock',
  },
  mormont: {
    name: 'House Mormont',
    color: '#6a8b5f',
    seat: 'Bear Island',
  },
  'night-watch': {
    name: "Night's Watch",
    color: '#8e9698',
    seat: 'The Wall',
  },
  stark: {
    name: 'House Stark',
    color: '#8e9ca3',
    words: 'Winter Is Coming',
    seat: 'Winterfell',
  },
  targaryen: {
    name: 'House Targaryen',
    color: '#c14e46',
    words: 'Fire and Blood',
    seat: 'Exiled',
  },
  tully: {
    name: 'House Tully',
    color: '#4f86a6',
    words: 'Family, Duty, Honor',
    seat: 'Riverrun',
  },
  independent: {
    name: 'Independent / city power',
    color: '#9f8d72',
  },
}

export const relationCopy: { kind: RelationshipKind; label: string }[] = [
  { kind: 'blood', label: 'Blood family' },
  { kind: 'marriage', label: 'Marriage' },
  { kind: 'betrothal', label: 'Promised marriage' },
  { kind: 'ward', label: 'Ward / foster / household' },
  { kind: 'serves', label: 'Serves or sworn role' },
  { kind: 'knows', label: 'Knows / social link' },
  { kind: 'secret', label: 'Hidden from most characters' },
  { kind: 'conflict', label: 'Threat or harm' },
]

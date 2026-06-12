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
  bolton: {
    name: 'House Bolton',
    color: '#9a4d58',
    seat: 'The Dreadfort',
  },
  clegane: {
    name: 'House Clegane',
    color: '#7a6b56',
    seat: 'The Westerlands',
  },
  dothraki: {
    name: 'Dothraki khalasar',
    color: '#b47045',
    seat: 'Across the Narrow Sea',
  },
  'free-folk': {
    name: 'Free Folk',
    color: '#9fb6b6',
    seat: 'North of the Wall',
  },
  frey: {
    name: 'House Frey',
    color: '#687e8c',
    seat: 'The Twins',
  },
  greyjoy: {
    name: 'House Greyjoy',
    color: '#7d8356',
    words: 'We Do Not Sow',
    seat: 'Pyke',
  },
  karstark: {
    name: 'House Karstark',
    color: '#697b84',
    seat: 'Karhold',
  },
  lannister: {
    name: 'House Lannister',
    color: '#a83e3b',
    words: 'Hear Me Roar!',
    seat: 'Casterly Rock',
  },
  manderly: {
    name: 'House Manderly',
    color: '#5f8c9a',
    seat: 'White Harbor',
  },
  martell: {
    name: 'House Martell',
    color: '#c78039',
    words: 'Unbowed, Unbent, Unbroken',
    seat: 'Sunspear',
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
  reed: {
    name: 'House Reed',
    color: '#6c8d69',
    seat: 'Greywater Watch',
  },
  royce: {
    name: 'House Royce',
    color: '#7d9aa1',
    seat: 'Runestone',
  },
  targaryen: {
    name: 'House Targaryen',
    color: '#c14e46',
    words: 'Fire and Blood',
    seat: 'Exiled',
  },
  tarly: {
    name: 'House Tarly',
    color: '#6e9259',
    seat: 'Horn Hill',
  },
  tyrell: {
    name: 'House Tyrell',
    color: '#78a75a',
    words: 'Growing Strong',
    seat: 'Highgarden',
  },
  tully: {
    name: 'House Tully',
    color: '#4f86a6',
    words: 'Family, Duty, Honor',
    seat: 'Riverrun',
  },
  umber: {
    name: 'House Umber',
    color: '#7d6f65',
    seat: 'Last Hearth',
  },
  independent: {
    name: 'Independent / city power',
    color: '#9f8d72',
  },
}

export const relationCopy: { kind: RelationshipKind; label: string }[] = [
  { kind: 'blood', label: 'Blood family' },
  { kind: 'recognized', label: 'Recognized family' },
  { kind: 'marriage', label: 'Marriage' },
  { kind: 'betrothal', label: 'Promised marriage' },
  { kind: 'ward', label: 'Ward / foster / household' },
  { kind: 'serves', label: 'Serves or sworn role' },
  { kind: 'knows', label: 'Knows / social link' },
  { kind: 'secret', label: 'Hidden from most characters' },
  { kind: 'conflict', label: 'Threat or harm' },
]

export type EpisodeStatus = 'curated' | 'scraped' | 'scaffold'

export type HouseId =
  | 'arryn'
  | 'baratheon'
  | 'bolton'
  | 'clegane'
  | 'dothraki'
  | 'free-folk'
  | 'frey'
  | 'greyjoy'
  | 'karstark'
  | 'lannister'
  | 'manderly'
  | 'martell'
  | 'mormont'
  | 'night-watch'
  | 'reed'
  | 'royce'
  | 'stark'
  | 'targaryen'
  | 'tarly'
  | 'tyrell'
  | 'tully'
  | 'umber'
  | 'independent'

export type RelationshipKind =
  | 'blood'
  | 'recognized'
  | 'marriage'
  | 'betrothal'
  | 'ward'
  | 'serves'
  | 'knows'
  | 'secret'
  | 'conflict'

export type Character = {
  id: string
  name: string
  sortName: string
  actor?: string
  house: HouseId
  bornHouse?: HouseId
  title?: string
  short: string
  known: string
  aliases?: string[]
  tags?: string[]
  portrait?: string
  origin?: CharacterOrigin
}

export type CharacterOrigin = {
  name: string
  region: string
  x: number
  y: number
  reason: string
}

export type Relationship = {
  id: string
  source: string
  target: string
  kind: RelationshipKind
  label: string
  note?: string
}

export type EpisodeLocation = {
  id: string
  name: string
  region: string
  x: number
  y: number
  known: string
  image?: string
}

export type MapRoute = {
  id: string
  from: string
  to: string
  label: string
}

export type SourceLink = {
  label: string
  url: string
}

export type EpisodeContent = {
  id: string
  season: number
  episode: number
  title: string
  status: EpisodeStatus
  spoilerBoundary: string
  summary: string
  houses: HouseId[]
  characters: Character[]
  relationships: Relationship[]
  locations: EpisodeLocation[]
  routes: MapRoute[]
  sources: SourceLink[]
}

export type EpisodeIndexItem = Pick<
  EpisodeContent,
  'id' | 'season' | 'episode' | 'title'
>

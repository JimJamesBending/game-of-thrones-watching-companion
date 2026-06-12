import { writeFile } from 'node:fs/promises'

const LANCASTER_EPISODES_URL =
  'https://raw.githubusercontent.com/jeffreylancaster/game-of-thrones/master/data/episodes.json'
const LANCASTER_CHARACTERS_URL =
  'https://raw.githubusercontent.com/jeffreylancaster/game-of-thrones/master/data/characters.json'
const TVMAZE_EPISODES_URL = 'https://api.tvmaze.com/shows/82/episodes'

const MAX_CHARACTERS_PER_EPISODE = 70
const MAX_EDGES_PER_EPISODE = 130

const houseMap = {
  Arryn: 'arryn',
  Baratheon: 'baratheon',
  Bolton: 'bolton',
  Clegane: 'clegane',
  Dothraki: 'dothraki',
  Frey: 'frey',
  Greyjoy: 'greyjoy',
  Karstark: 'karstark',
  Lannister: 'lannister',
  Manderly: 'manderly',
  Martell: 'martell',
  Mormont: 'mormont',
  Reed: 'reed',
  Royce: 'royce',
  Stark: 'stark',
  Targaryen: 'targaryen',
  Tarly: 'tarly',
  Tyrell: 'tyrell',
  Tully: 'tully',
  Umber: 'umber',
}

const suffixHouse = [
  ['Stark', 'stark'],
  ['Baratheon', 'baratheon'],
  ['Lannister', 'lannister'],
  ['Targaryen', 'targaryen'],
  ['Greyjoy', 'greyjoy'],
  ['Tully', 'tully'],
  ['Arryn', 'arryn'],
  ['Tyrell', 'tyrell'],
  ['Martell', 'martell'],
  ['Bolton', 'bolton'],
  ['Frey', 'frey'],
  ['Mormont', 'mormont'],
  ['Tarly', 'tarly'],
  ['Karstark', 'karstark'],
  ['Umber', 'umber'],
  ['Clegane', 'clegane'],
  ['Royce', 'royce'],
  ['Reed', 'reed'],
]

const characterHouseOverride = {
  'Jon Snow': 'stark',
  'Khal Drogo': 'dothraki',
  Qotho: 'dothraki',
  Rakharo: 'dothraki',
  Kovarro: 'dothraki',
  Irri: 'dothraki',
  Jhiqui: 'dothraki',
  'Tormund Giantsbane': 'free-folk',
  Ygritte: 'free-folk',
  Orell: 'free-folk',
  Mance: 'free-folk',
  'Mance Rayder': 'free-folk',
  'Alliser Thorne': 'night-watch',
  'Jeor Mormont': 'night-watch',
  'Maester Aemon': 'night-watch',
  Grenn: 'night-watch',
  Pypar: 'night-watch',
  Eddison: 'night-watch',
  'Eddison Tollett': 'night-watch',
}

const originByHouse = {
  arryn: origin('The Eyrie', 'The Vale', 57, 47, 'House seat'),
  baratheon: origin("Storm's End", 'The Stormlands', 56, 78, 'House seat'),
  bolton: origin('The Dreadfort', 'The North', 53, 25, 'House seat'),
  clegane: origin('The Westerlands', 'The Westerlands', 37, 63, 'House lands'),
  dothraki: origin('The Dothraki Sea', 'Essos', 88, 55, 'Known homeland'),
  'free-folk': origin('North of the Wall', 'Far North', 48, 8, 'Known homeland'),
  frey: origin('The Twins', 'The Riverlands', 45, 51, 'House seat'),
  greyjoy: origin('Pyke', 'The Iron Islands', 33, 51, 'House seat'),
  karstark: origin('Karhold', 'The North', 52, 23, 'House seat'),
  lannister: origin('Casterly Rock', 'The Westerlands', 36, 62, 'House seat'),
  manderly: origin('White Harbor', 'The North', 53, 34, 'House seat'),
  martell: origin('Sunspear', 'Dorne', 58, 88, 'House seat'),
  mormont: origin('Bear Island', 'The North', 38, 25, 'House seat'),
  'night-watch': origin('The Wall', 'Northern border', 47, 17, 'Sworn order'),
  reed: origin('Greywater Watch', 'The Neck', 44, 43, 'House seat'),
  royce: origin('Runestone', 'The Vale', 58, 47, 'House seat'),
  stark: origin('Winterfell', 'The North', 47, 31, 'House seat'),
  targaryen: origin('Dragonstone', 'The Crownlands', 61, 67, 'Ancestral seat'),
  tarly: origin('Horn Hill', 'The Reach', 46, 82, 'House seat'),
  tyrell: origin('Highgarden', 'The Reach', 43, 78, 'House seat'),
  tully: origin('Riverrun', 'The Riverlands', 44, 57, 'House seat'),
  umber: origin('Last Hearth', 'The North', 49, 22, 'House seat'),
}

const locationCoords = {
  'North of the Wall': [48, 8],
  'The Wall': [47, 17],
  'The North': [47, 31],
  'The Shivering Sea': [68, 19],
  'The Vale': [57, 47],
  'The Iron Islands': [33, 51],
  'The Sunset Sea': [18, 68],
  'The Westerlands': [36, 62],
  'The Riverlands': [44, 55],
  'The Narrow Sea': [68, 61],
  'The Crownlands': [54, 69],
  'The Stormlands': [56, 78],
  'The Reach': [43, 79],
  Dorne: [58, 88],
  Pentos: [82, 62],
  Braavos: [78, 40],
  'The Summer Sea': [72, 92],
  Volantis: [84, 78],
  Valyria: [88, 82],
  'The Dothraki Sea': [88, 55],
  Meereen: [92, 72],
  Yunkai: [90, 76],
  Astapor: [88, 80],
  'Vaes Dothrak': [90, 50],
  'The Red Waste': [88, 66],
  Qarth: [94, 86],
}

const subLocationCoords = {
  'Castle Black': [47, 17],
  'The Haunted Forest': [48, 8],
  Hardhome: [50, 6],
  Winterfell: [47, 31],
  'Outside Winterfell': [47, 32],
  'The Dreadfort': [53, 25],
  'Last Hearth': [49, 22],
  'Bear Island': [38, 25],
  'The Eyrie': [57, 47],
  Runestone: [58, 47],
  Pyke: [33, 51],
  'Casterly Rock': [36, 62],
  'The Twins': [45, 51],
  Riverrun: [44, 57],
  Harrenhal: [49, 58],
  Dragonstone: [61, 67],
  "King's Landing": [54, 69],
  "Storm's End": [56, 78],
  Highgarden: [43, 78],
  'Horn Hill': [46, 82],
  Oldtown: [42, 86],
  'Tower of Joy': [55, 86],
  'The Water Gardens': [59, 88],
  'Dothraki Camp': [88, 55],
  'Slaver\'s Bay': [89, 78],
}

async function main() {
  const [episodePayload, characterPayload, tvmazeEpisodes] = await Promise.all([
    fetchJson(LANCASTER_EPISODES_URL),
    fetchJson(LANCASTER_CHARACTERS_URL),
    fetchJson(TVMAZE_EPISODES_URL),
  ])

  const episodes = episodePayload.episodes
  const characters = new Map()

  for (const character of characterPayload.characters) {
    if (!characters.has(character.characterName)) {
      characters.set(character.characterName, character)
    }
  }

  const tvmazeByEpisode = new Map(
    tvmazeEpisodes.map((episode) => [`s${pad2(episode.season)}e${pad2(episode.number)}`, episode]),
  )

  const generated = {}

  for (const episode of episodes) {
    const id = `s${pad2(episode.seasonNum)}e${pad2(episode.episodeNum)}`
    generated[id] = buildEpisode(episode, characters, tvmazeByEpisode.get(id))
  }

  const source = `import type { EpisodeContent } from './types'

// Auto-generated by scripts/import-internet-data.mjs.
// Do not edit this file by hand; update the importer or curated overrides instead.
export const scrapedEpisodes = ${JSON.stringify(generated, null, 2)} satisfies Record<string, EpisodeContent>
`

  await writeFile(new URL('../src/data/generated-episodes.ts', import.meta.url), source)
  console.log(`Generated ${Object.keys(generated).length} scraped episode records.`)
}

function buildEpisode(episode, characters, tvmazeEpisode) {
  const characterStats = collectCharacterStats(episode)
  const selectedNames = [...characterStats.entries()]
    .sort((a, b) => b[1].scenes - a[1].scenes || a[0].localeCompare(b[0]))
    .slice(0, MAX_CHARACTERS_PER_EPISODE)
    .map(([name]) => name)

  const selectedNameSet = new Set(selectedNames)
  const idByName = new Map(selectedNames.map((name) => [name, slug(name)]))

  const episodeCharacters = selectedNames.map((name) => {
    const source = characters.get(name)
    const house = getHouseId(name, source)
    const houseText = sourceHouseName(source)
    const actor = getActor(source)
    const stats = characterStats.get(name)
    const topPlaces = [...stats.locations.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([place]) => place)
    const origin = originByHouse[house]

    return {
      id: slug(name),
      name,
      sortName: sortName(name),
      ...(actor ? { actor } : {}),
      house,
      short: shortName(name),
      known: [
        `Seen in ${stats.scenes} scene${stats.scenes === 1 ? '' : 's'} in this episode.`,
        topPlaces.length ? `Main episode place${topPlaces.length === 1 ? '' : 's'}: ${topPlaces.join(', ')}.` : '',
        houseText ? `Affiliation from source data: ${houseText}.` : '',
        actor ? `Played by ${actor}.` : '',
      ]
        .filter(Boolean)
        .join(' '),
      tags: [
        `${stats.scenes} scene${stats.scenes === 1 ? '' : 's'}`,
        ...topPlaces.slice(0, 1),
        houseText || undefined,
      ].filter(Boolean),
      ...(origin ? { origin } : {}),
    }
  })

  const relationships = buildCoAppearanceEdges(episode, selectedNameSet, idByName)
  const locations = buildLocations(episode)
  const routes = buildRoutes(episode, locations)
  const houses = [...new Set(episodeCharacters.map((character) => character.house))].filter(Boolean)
  const tvMazeDetails = tvmazeEpisode
    ? ` TVMaze lists the original airdate as ${tvmazeEpisode.airdate || 'unknown'} and runtime as ${tvmazeEpisode.runtime || 'unknown'} minutes.`
    : ''

  return {
    id: `s${pad2(episode.seasonNum)}e${pad2(episode.episodeNum)}`,
    season: episode.seasonNum,
    episode: episode.episodeNum,
    title: episode.episodeTitle,
    status: 'scraped',
    spoilerBoundary: `Auto-generated from scene data for Season ${episode.seasonNum}, Episode ${episode.episodeNum}. It only uses characters and places listed for this episode, but family labels still need human spoiler review.`,
    summary: `Auto-imported scene guide with ${episodeCharacters.length} prominent on-screen characters, ${relationships.length} scene co-appearance links, and ${locations.length} places.${tvMazeDetails}`,
    houses,
    characters: episodeCharacters,
    relationships,
    locations,
    routes,
    sources: [
      {
        label: 'Jeffrey Lancaster Game of Thrones scene dataset',
        url: 'https://github.com/jeffreylancaster/game-of-thrones',
      },
      {
        label: 'TVMaze Game of Thrones API',
        url: 'https://www.tvmaze.com/api',
      },
    ],
  }
}

function collectCharacterStats(episode) {
  const stats = new Map()

  for (const scene of episode.scenes || []) {
    const names = uniqueSceneNames(scene).filter((name) => !isNoiseCharacter(name))
    const place = scene.subLocation || scene.location

    for (const name of names) {
      if (!stats.has(name)) {
        stats.set(name, { scenes: 0, locations: new Map() })
      }
      const entry = stats.get(name)
      entry.scenes += 1
      if (place) {
        entry.locations.set(place, (entry.locations.get(place) || 0) + 1)
      }
    }
  }

  return stats
}

function buildCoAppearanceEdges(episode, selectedNameSet, idByName) {
  const pairCounts = new Map()

  for (const scene of episode.scenes || []) {
    const names = uniqueSceneNames(scene)
      .filter((name) => selectedNameSet.has(name))
      .sort((a, b) => a.localeCompare(b))

    for (let i = 0; i < names.length; i += 1) {
      for (let j = i + 1; j < names.length; j += 1) {
        const key = `${names[i]}|||${names[j]}`
        pairCounts.set(key, (pairCounts.get(key) || 0) + 1)
      }
    }
  }

  return [...pairCounts.entries()]
    .map(([key, count]) => {
      const [sourceName, targetName] = key.split('|||')
      return { sourceName, targetName, count }
    })
    .filter((edge) => edge.count > 1)
    .sort((a, b) => b.count - a.count || a.sourceName.localeCompare(b.sourceName))
    .slice(0, MAX_EDGES_PER_EPISODE)
    .map((edge) => ({
      id: `seen-${idByName.get(edge.sourceName)}-${idByName.get(edge.targetName)}`,
      source: idByName.get(edge.sourceName),
      target: idByName.get(edge.targetName),
      kind: 'knows',
      label: `seen together x${edge.count}`,
    }))
}

function buildLocations(episode) {
  const counts = new Map()
  for (const scene of episode.scenes || []) {
    const name = scene.subLocation || scene.location
    if (!name) continue
    const key = `${name}|||${scene.location}`
    counts.set(key, (counts.get(key) || 0) + 1)
  }

  return [...counts.entries()]
    .map(([key, count]) => {
      const [name, region] = key.split('|||')
      const [x, y] = coordinates(region, name)
      return {
        id: slug(`${region}-${name}`),
        name,
        region,
        x,
        y,
        known: `Shown in ${count} scene${count === 1 ? '' : 's'} in this episode.`,
      }
    })
    .sort((a, b) => {
      const countA = counts.get(`${a.name}|||${a.region}`) || 0
      const countB = counts.get(`${b.name}|||${b.region}`) || 0
      return countB - countA || a.name.localeCompare(b.name)
    })
    .slice(0, 10)
}

function buildRoutes(episode, locations) {
  const locationIds = new Set(locations.map((location) => location.id))
  const routes = []
  let previous
  let routeIndex = 0

  for (const scene of episode.scenes || []) {
    const name = scene.subLocation || scene.location
    if (!name) continue
    const id = slug(`${scene.location}-${name}`)
    if (!locationIds.has(id) || id === previous) continue
    if (previous) {
      routes.push({
        id: `route-${routeIndex}-${previous}-${id}`,
        from: previous,
        to: id,
        label: 'Episode scene move',
      })
      routeIndex += 1
    }
    previous = id
    if (routes.length >= 8) break
  }

  return routes
}

function getHouseId(name, source) {
  if (characterHouseOverride[name]) return characterHouseOverride[name]

  const rawHouse = Array.isArray(source?.houseName) ? source.houseName[0] : source?.houseName
  if (rawHouse && houseMap[rawHouse]) return houseMap[rawHouse]

  for (const [suffix, house] of suffixHouse) {
    if (name.endsWith(suffix)) return house
  }

  return 'independent'
}

function sourceHouseName(source) {
  if (!source?.houseName) return undefined
  return Array.isArray(source.houseName) ? source.houseName.join(' / ') : source.houseName
}

function getActor(source) {
  if (source?.actorName) return source.actorName
  if (source?.actors?.length) return source.actors[0].actorName
  return undefined
}

function coordinates(region, name) {
  return subLocationCoords[name] || locationCoords[region] || [50, 50]
}

function uniqueSceneNames(scene) {
  return [
    ...new Set(
      (scene.characters || [])
        .map((character) => character.name)
        .filter(Boolean),
    ),
  ]
}

function isNoiseCharacter(name) {
  return /^(Man|Woman|Guard|Soldier|Child|Girl|Boy|Whore|Prostitute|Nobleman|Noblewoman|Servant|Merchant|Priest|Priestess|Voice)( #?\d+)?$/i.test(
    name,
  )
}

function origin(name, region, x, y, reason) {
  return { name, region, x, y, reason }
}

function shortName(name) {
  return name.replace(/^Ser\s+/, '').replace(/^King\s+/, '').replace(/^Queen\s+/, '')
}

function sortName(name) {
  const parts = name.split(/\s+/)
  if (parts.length < 2) return name
  return `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(' ')}`
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function pad2(value) {
  return String(value).padStart(2, '0')
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'game-of-thrones-watching-companion-importer',
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return response.json()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

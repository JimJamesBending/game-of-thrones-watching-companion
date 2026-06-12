import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const publicDir = resolve(rootDir, 'public')
const sourceFile = resolve(rootDir, 'src/data/image-assets.ts')
const attributionFile = resolve(rootDir, 'docs/IMAGE_SOURCES.md')

const userAgent =
  'got-watching-companion-image-import/0.1 (https://github.com/JimJamesBending/game-of-thrones-watching-companion)'

const characterSeeds = [
  { characterId: 'ned-stark', actor: 'Sean Bean', wikidataId: 'Q191104' },
  { characterId: 'catelyn-stark', actor: 'Michelle Fairley', wikidataId: 'Q262898' },
  { characterId: 'robb-stark', actor: 'Richard Madden', wikidataId: 'Q510848' },
  { characterId: 'sansa-stark', actor: 'Sophie Turner', wikidataId: 'Q240573' },
  { characterId: 'arya-stark', actor: 'Maisie Williams', wikidataId: 'Q234363' },
  { characterId: 'bran-stark', actor: 'Isaac Hempstead Wright', wikidataId: 'Q967656' },
  { characterId: 'rickon-stark', actor: 'Art Parkinson', wikidataId: 'Q15069989' },
  { characterId: 'jon-snow', actor: 'Kit Harington' },
  { characterId: 'benjen-stark', actor: 'Joseph Mawle' },
  { characterId: 'robert-baratheon', actor: 'Mark Addy' },
  { characterId: 'cersei-lannister', actor: 'Lena Headey' },
  { characterId: 'jaime-lannister', actor: 'Nikolaj Coster-Waldau' },
  { characterId: 'tyrion-lannister', actor: 'Peter Dinklage' },
  { characterId: 'joffrey-baratheon', actor: 'Jack Gleeson' },
  { characterId: 'myrcella-baratheon', actor: 'Aimee Richardson' },
  { characterId: 'tommen-baratheon', actor: 'Callum Wharry' },
  { characterId: 'jon-arryn', actor: 'John Standing' },
  { characterId: 'theon-greyjoy', actor: 'Alfie Allen' },
  { characterId: 'daenerys-targaryen', actor: 'Emilia Clarke' },
  { characterId: 'viserys-targaryen', actor: 'Harry Lloyd' },
  { characterId: 'khal-drogo', actor: 'Jason Momoa' },
  { characterId: 'jorah-mormont', actor: 'Iain Glen' },
  { characterId: 'illyrio-mopatis', actor: 'Roger Allam' },
]

const mediaSeeds = [
  {
    id: 'known-world-map',
    kind: 'map',
    localName: 'known-world-map',
    directory: 'maps',
    commonsFile: 'Westeros Map.png',
    label: 'Westeros map',
  },
  {
    id: 'winterfell',
    kind: 'place',
    localName: 'winterfell-castle-ward',
    directory: 'places',
    search: 'Castle Ward Game of Thrones Winterfell',
    label: 'Winterfell filming-location image',
  },
  {
    id: 'beyond-wall',
    kind: 'place',
    localName: 'beyond-wall-tollymore',
    directory: 'places',
    search: 'Tollymore Forest Park Northern Ireland',
    label: 'Beyond the Wall forest reference image',
  },
  {
    id: 'the-wall',
    kind: 'place',
    localName: 'the-wall-iceland',
    directory: 'places',
    search: 'Vatnajokull Iceland glacier',
    label: 'The Wall icy landscape reference image',
  },
  {
    id: 'kings-landing',
    kind: 'place',
    localName: 'kings-landing-mdina',
    directory: 'places',
    search: 'Mdina Gate Malta',
    label: "King's Landing filming-location image",
  },
  {
    id: 'pento',
    kind: 'place',
    localName: 'pentos-verdala',
    directory: 'places',
    search: 'Verdala Palace Malta',
    label: 'Pentos filming-location image',
  },
  {
    id: 'dothraki-camp',
    kind: 'place',
    localName: 'dothraki-camp-azure-window',
    directory: 'places',
    search: 'Azure Window Gozo',
    label: 'Dothraki wedding filming-location image',
  },
]

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms))

async function main() {
  await mkdir(resolve(publicDir, 'images/portraits'), { recursive: true })
  await mkdir(resolve(publicDir, 'images/maps'), { recursive: true })
  await mkdir(resolve(publicDir, 'images/places'), { recursive: true })

  const portraitEntries = []
  const mediaEntries = []

  for (const seed of characterSeeds) {
    const entry = await importCharacterPortrait(seed)
    if (entry) portraitEntries.push(entry)
    await delay(850)
  }

  for (const seed of mediaSeeds) {
    const entry = await importMedia(seed)
    if (entry) mediaEntries.push(entry)
    await delay(450)
  }

  await writeImageAssets([...portraitEntries, ...mediaEntries])
  await writeAttributions([...portraitEntries, ...mediaEntries])

  console.log(`Imported ${portraitEntries.length} portraits and ${mediaEntries.length} map/place images.`)
}

async function importCharacterPortrait(seed) {
  const imageFile = await getWikidataImage(seed)
  if (!imageFile) {
    console.warn(`No Commons image found for ${seed.actor}`)
    return undefined
  }

  const image = await getCommonsImageInfo(imageFile)
  if (!image) {
    console.warn(`No Commons image info found for ${imageFile}`)
    return undefined
  }

  return downloadImage({
    ...seed,
    kind: 'portrait',
    id: seed.characterId,
    label: seed.actor,
    localName: seed.characterId,
    directory: 'portraits',
    image,
  })
}

async function importMedia(seed) {
  const imageFile = seed.commonsFile ?? (await searchCommonsFile(seed.search))
  if (!imageFile) {
    console.warn(`No Commons file found for ${seed.label}`)
    return undefined
  }

  const image = await getCommonsImageInfo(imageFile)
  if (!image) {
    console.warn(`No Commons image info found for ${imageFile}`)
    return undefined
  }

  return downloadImage({ ...seed, image })
}

async function getWikidataImage(seed) {
  const id = seed.wikidataId ?? (await searchWikidataEntity(seed.actor))
  if (!id) return undefined

  const url = `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`
  const json = await fetchJson(url)
  return json.entities?.[id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value
}

async function searchWikidataEntity(search) {
  const params = new URLSearchParams({
    action: 'wbsearchentities',
    search,
    language: 'en',
    format: 'json',
    limit: '5',
    origin: '*',
  })
  const json = await fetchJson(`https://www.wikidata.org/w/api.php?${params}`)
  const actorHit = json.search?.find((item) => /actor|actress/i.test(item.description ?? ''))
  return (actorHit ?? json.search?.[0])?.id
}

async function searchCommonsFile(search) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: search,
    gsrlimit: '1',
    prop: 'imageinfo',
    iiprop: 'url|mime|size|extmetadata',
    iiurlwidth: '1100',
    format: 'json',
    origin: '*',
  })
  const json = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
  const page = Object.values(json.query?.pages ?? {})[0]
  return page?.title?.replace(/^File:/, '')
}

async function getCommonsImageInfo(fileName) {
  const params = new URLSearchParams({
    action: 'query',
    titles: `File:${fileName}`,
    prop: 'imageinfo',
    iiprop: 'url|mime|size|extmetadata',
    iiurlwidth: '900',
    format: 'json',
    origin: '*',
  })
  const json = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`)
  const page = Object.values(json.query?.pages ?? {})[0]
  const image = page?.imageinfo?.[0]
  if (!image) return undefined

  return {
    title: page.title.replace(/^File:/, ''),
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${page.title.replace(/^File:/, '').replaceAll(' ', '_')}`,
    downloadUrl: image.thumburl ?? image.url,
    mime: image.thumbmime ?? image.mime,
    license: cleanMetadata(image.extmetadata?.LicenseShortName?.value) || cleanMetadata(image.extmetadata?.UsageTerms?.value),
    licenseUrl: cleanMetadata(image.extmetadata?.LicenseUrl?.value),
    artist: cleanMetadata(image.extmetadata?.Artist?.value),
    credit: cleanMetadata(image.extmetadata?.Credit?.value),
  }
}

async function downloadImage(seed) {
  const extension = extensionFor(seed.image.mime, seed.image.downloadUrl)
  const publicPath = `images/${seed.directory}/${seed.localName}${extension}`
  const outputPath = resolve(publicDir, publicPath)

  if (!existsSync(outputPath)) {
    const response = await fetch(seed.image.downloadUrl, { headers: { 'User-Agent': userAgent } })
    if (!response.ok) throw new Error(`Failed to download ${seed.image.downloadUrl}: ${response.status}`)
    await writeFile(outputPath, Buffer.from(await response.arrayBuffer()))
  }

  return {
    id: seed.id,
    kind: seed.kind,
    label: seed.label,
    localPath: publicPath,
    commonsFile: seed.image.title,
    sourceUrl: seed.image.sourceUrl,
    license: seed.image.license || 'See Commons source',
    licenseUrl: seed.image.licenseUrl,
    artist: seed.image.artist || seed.image.credit || 'Wikimedia Commons contributor',
    characterId: seed.characterId,
  }
}

function extensionFor(mime, url) {
  if (mime === 'image/png') return '.png'
  if (mime === 'image/webp') return '.webp'
  if (mime === 'image/svg+xml') return '.svg'
  if (mime === 'image/jpeg') return '.jpg'
  const extension = extname(new URL(url).pathname)
  return extension || '.jpg'
}

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': userAgent, Accept: 'application/json' } })
    const text = await response.text()
    if (response.ok) {
      try {
        return JSON.parse(text)
      } catch (error) {
        if (attempt === 4) throw error
      }
    }

    await delay(1000 * attempt)
  }

  throw new Error(`Failed to fetch JSON from ${url}`)
}

function cleanMetadata(value) {
  if (!value) return undefined
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

async function writeImageAssets(entries) {
  const portraitEntries = entries.filter((entry) => entry.kind === 'portrait')
  const placeEntries = entries.filter((entry) => entry.kind === 'place')
  const mapEntry = entries.find((entry) => entry.kind === 'map')

  const attributionsSource = JSON.stringify(entries, null, 2).replace(
    /"localPath": "([^"]+)"/g,
    (_, path) => `"localPath": asset(${JSON.stringify(path)})`,
  )
  const source = [
    '// Generated by scripts/import-commons-images.mjs',
    'const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`',
    '',
    'export type ImageAttribution = {',
    '  id: string',
    "  kind: 'portrait' | 'map' | 'place'",
    '  label: string',
    '  localPath: string',
    '  commonsFile: string',
    '  sourceUrl: string',
    '  license: string',
    '  licenseUrl?: string',
    '  artist: string',
    '  characterId?: string',
    '}',
    '',
    `export const portraitByCharacterId: Record<string, string> = ${objectToAssetRecord(
      Object.fromEntries(portraitEntries.map((entry) => [entry.characterId, entry.localPath])),
    )}`,
    '',
    `export const locationImageById: Record<string, string> = ${objectToAssetRecord(
      Object.fromEntries(placeEntries.map((entry) => [entry.id, entry.localPath])),
    )}`,
    '',
    `export const knownWorldMap = ${mapEntry ? `asset(${JSON.stringify(mapEntry.localPath)})` : 'undefined'}`,
    '',
    `export const imageAttributions: ImageAttribution[] = ${attributionsSource}`,
    '',
  ].join('\n')

  await writeFile(sourceFile, source)
}

function objectToAssetRecord(record) {
  const lines = Object.entries(record)
    .map(([key, value]) => `  ${JSON.stringify(key)}: asset(${JSON.stringify(value)}),`)
    .join('\n')
  return `{\n${lines}\n}`
}

async function writeAttributions(entries) {
  const previous = existsSync(attributionFile) ? await readFile(attributionFile, 'utf8') : ''
  const header = `# Image Sources\n\nGenerated by \`npm run import:images\`. Images are downloaded from Wikimedia Commons/Wikidata-backed Commons media and stored in \`public/images/\` for the fan companion site.\n\n`
  const body = entries
    .map((entry) => {
      const license = entry.licenseUrl ? `[${entry.license}](${entry.licenseUrl})` : entry.license
      return `- ${entry.label} (${entry.kind}): [${entry.commonsFile}](${entry.sourceUrl}) by ${entry.artist}; ${license}. Local file: \`${entry.localPath}\`.`
    })
    .join('\n')

  if (previous === `${header}${body}\n`) return
  await writeFile(attributionFile, `${header}${body}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

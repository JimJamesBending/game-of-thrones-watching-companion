import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const publicDir = resolve(rootDir, 'public')
const sourceFile = resolve(rootDir, 'src/data/character-images.ts')
const attributionFile = resolve(rootDir, 'docs/CHARACTER_IMAGE_SOURCES.md')
const userAgent = 'got-watching-companion-character-image-import/0.1 (private local fan companion)'

const seeds = [
  { id: 'ned-stark', label: 'Eddard Stark', file: 'Eddard 1x01.jpg' },
  { id: 'catelyn-stark', label: 'Catelyn Stark', file: 'Catelyn 1x01.jpg' },
  { id: 'robb-stark', label: 'Robb Stark', file: 'Lord Robb in Winterfell.png' },
  { id: 'sansa-stark', label: 'Sansa Stark', file: 'SansaStarkS1Promo.png' },
  { id: 'arya-stark', label: 'Arya Stark', file: 'Winter is Coming arya closer look.png' },
  { id: 'bran-stark', label: 'Bran Stark', file: 'Bran and Summer s1 in winterfell.png' },
  { id: 'rickon-stark', label: 'Rickon Stark', file: 'Rickon Stark s1 having fun.jpg' },
  { id: 'jon-snow', label: 'Jon Snow', file: 'Winter is Coming Tyrion and Jon.jpg' },
  { id: 'benjen-stark', label: 'Benjen Stark', file: 'Winter is Coming Ned and Benjen.jpg' },
  { id: 'lyanna-stark', label: 'Lyanna Stark', file: 'Winter is Coming Robert crypt.jpg' },
  { id: 'robert-baratheon', label: 'Robert Baratheon', file: 'Robert at Winterfell.jpg' },
  { id: 'cersei-lannister', label: 'Cersei Lannister', file: 'Cersei 1x01.jpg' },
  {
    id: 'jaime-lannister',
    label: 'Jaime Lannister',
    file: 'Jaime-lannister-1x01-winter-is-coming-jaime-lannister-23125077-1280-720.jpg',
  },
  { id: 'tyrion-lannister', label: 'Tyrion Lannister', file: 'Winter is Coming Tyrion and Ros.png' },
  { id: 'joffrey-baratheon', label: 'Joffrey Baratheon', file: 'Winter is Coming joffrey looks at sansa.jpg' },
  { id: 'myrcella-baratheon', label: 'Myrcella Baratheon', file: 'Winter is Coming Myrcella Tommen intro.jpg' },
  { id: 'tommen-baratheon', label: 'Tommen Baratheon', file: 'Winter is Coming Myrcella Tommen intro.jpg' },
  { id: 'jon-arryn', label: 'Jon Arryn', file: 'Jon Arryn funeral bier.jpg' },
  { id: 'lysa-arryn', label: 'Lysa Arryn', file: 'Lysa Arryn infobox.jpg' },
  { id: 'theon-greyjoy', label: 'Theon Greyjoy', file: 'Jon, Robb and Theon 1x01.png' },
  { id: 'daenerys-targaryen', label: 'Daenerys Targaryen', file: 'Daenerys and Viserys.jpg' },
  { id: 'viserys-targaryen', label: 'Viserys Targaryen', file: 'Viserys & Illyrio 1x01.png' },
  { id: 'khal-drogo', label: 'Khal Drogo', file: 'Drogo 1x01.jpg' },
  { id: 'jorah-mormont', label: 'Jorah Mormont', file: 'JorahGiftToDaenerysSeason1.PNG' },
  { id: 'illyrio-mopatis', label: 'Illyrio Mopatis', file: 'Viserys & Illyrio 1x01.png' },
]

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms))

async function main() {
  await mkdir(resolve(publicDir, 'images/characters'), { recursive: true })

  const entries = []
  for (const seed of seeds) {
    const image = await getFandomImageInfo(seed.file)
    if (!image) {
      console.warn(`No Fandom image info found for ${seed.file}`)
      continue
    }
    entries.push(await downloadImage(seed, image))
    await delay(250)
  }

  await writeSource(entries)
  await writeAttribution(entries)
  console.log(`Imported ${entries.length} character images.`)
}

async function getFandomImageInfo(fileName) {
  const params = new URLSearchParams({
    action: 'query',
    titles: `File:${fileName}`,
    prop: 'imageinfo',
    iiprop: 'url|mime|size|extmetadata',
    iiurlwidth: '900',
    format: 'json',
    origin: '*',
  })
  const json = await fetchJson(`https://gameofthrones.fandom.com/api.php?${params}`)
  const page = Object.values(json.query?.pages ?? {})[0]
  const image = page?.imageinfo?.[0]
  if (!image) return undefined

  return {
    title: page.title.replace(/^File:/, ''),
    sourceUrl: image.descriptionurl,
    downloadUrl: image.thumburl ?? image.url,
    mime: image.thumbmime ?? image.mime,
  }
}

async function downloadImage(seed, image) {
  const extension = extensionFor(image.mime, image.downloadUrl)
  const localPath = `images/characters/${seed.id}${extension}`
  const outputPath = resolve(publicDir, localPath)

  if (!existsSync(outputPath)) {
    const response = await fetch(image.downloadUrl, { headers: { 'User-Agent': userAgent } })
    if (!response.ok) throw new Error(`Failed to download ${image.downloadUrl}: ${response.status}`)
    await writeFile(outputPath, Buffer.from(await response.arrayBuffer()))
  }

  return {
    id: seed.id,
    label: seed.label,
    localPath,
    fandomFile: image.title,
    sourceUrl: image.sourceUrl,
    knownByEpisode: 's01e01',
  }
}

function extensionFor(mime, url) {
  if (mime === 'image/png') return '.png'
  if (mime === 'image/webp') return '.webp'
  if (mime === 'image/jpeg') return '.jpg'
  const extension = extname(new URL(url).pathname)
  return extension || '.jpg'
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'User-Agent': userAgent, Accept: 'application/json' } })
  const text = await response.text()
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status} ${text.slice(0, 200)}`)
  return JSON.parse(text)
}

async function writeSource(entries) {
  const record = Object.fromEntries(entries.map((entry) => [entry.id, entry.localPath]))
  const lines = Object.entries(record)
    .map(([key, value]) => `  ${JSON.stringify(key)}: asset(${JSON.stringify(value)}),`)
    .join('\n')

  const source = [
    '// Generated by scripts/import-fandom-character-images.mjs',
    'const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`',
    '',
    'export type CharacterImageSource = {',
    '  id: string',
    '  label: string',
    '  localPath: string',
    '  fandomFile: string',
    '  sourceUrl: string',
    '  knownByEpisode: string',
    '}',
    '',
    `export const characterImageById: Record<string, string> = {\n${lines}\n}`,
    '',
    `export const characterImageSources: CharacterImageSource[] = ${JSON.stringify(entries, null, 2).replace(
      /"localPath": "([^"]+)"/g,
      (_, path) => `"localPath": asset(${JSON.stringify(path)})`,
    )}`,
    '',
  ].join('\n')

  await writeFile(sourceFile, source)
}

async function writeAttribution(entries) {
  const header = `# Character Image Sources\n\nGenerated by \`npm run import:character-images\`. These S1-safe character images are downloaded from Game of Thrones Wiki / Fandom file pages and stored in \`public/images/characters/\` for the now-private fan companion repo.\n\n`
  const body = entries
    .map(
      (entry) =>
        `- ${entry.label}: [${entry.fandomFile}](${entry.sourceUrl}); known by ${entry.knownByEpisode}. Local file: \`${entry.localPath}\`.`,
    )
    .join('\n')

  await writeFile(attributionFile, `${header}${body}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})


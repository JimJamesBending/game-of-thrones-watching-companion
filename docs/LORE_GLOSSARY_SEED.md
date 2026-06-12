# Lore Glossary Seed

Use this as the starting list for the glossary, places, weapons, objects, and visual lore tiles. Every entry must be rewritten as original spoiler-safe copy and gated by episode before it appears in the app.

## Rules

- Add `knownByEpisode` to every entry.
- Add `firstSeenEpisode` when the show first introduces the term, object, or place.
- Keep `known` limited to what a viewer knows by the end of that episode.
- Do not use future ownership, future titles, future alliances, future deaths, or future parentage.
- Every image must use the shared image metadata shape:

```ts
type ImageAsset = {
  src: string
  alt: string
  sourceType: 'licensed' | 'public-domain' | 'generated' | 'user-provided' | 'placeholder'
  sourceUrl?: string
  license?: string
  attribution?: string
  knownByEpisode: string
}
```

Do not commit scraped copyrighted stills or publicity photos unless the rights are clear. For a public page, prefer generated illustrations, user-provided images, public-domain textures, licensed assets, or symbolic placeholders.

## Suggested Types

```ts
type LoreCategory =
  | 'house'
  | 'group'
  | 'title'
  | 'institution'
  | 'culture'
  | 'religion'
  | 'place'
  | 'weapon'
  | 'object'
  | 'creature'
  | 'term'

type LoreEntry = {
  id: string
  name: string
  category: LoreCategory
  short: string
  known: string
  knownByEpisode: string
  firstSeenEpisode: string
  tags: string[]
  relatedCharacterIds: string[]
  relatedHouseIds: string[]
  relatedPlaceIds: string[]
  image?: ImageAsset
  sources: SourceLink[]
}
```

## Terms And Institutions

- Hand of the King
- Small Council
- Kingsguard
- Night's Watch
- Maester
- Raven
- Ward
- Bastard surname conventions by region
- Lord Paramount
- Warden of the North
- King in the North
- Khal
- Khalasar
- Khaleesi
- Bloodrider
- Sellsword
- Faceless Men
- Wildlings / Free Folk
- White Walkers
- Wights
- Old Gods
- Weirwood trees
- Faith of the Seven
- Ironborn
- Drowned God
- Wildfire
- Valyrian steel
- Dragonglass
- Greyscale
- Guest right
- Trial by combat
- Trial by seven
- Right of conquest
- Hostage
- Liege lord
- Bannerman
- Oathbreaker
- Bastard
- Heir
- Regent
- Queen regent
- Lord Commander
- First Ranger
- Master of Coin
- Master of Whisperers
- Grand Maester
- High Septon
- Septa
- Sept
- Brother of the Night's Watch
- Ranger
- Steward
- Builder

## Places

- Winterfell
- King's Landing
- The Wall
- Castle Black
- Beyond the Wall
- The Haunted Forest
- Dragonstone
- Casterly Rock
- Pyke
- Riverrun
- The Eyrie
- Highgarden
- Storm's End
- Sunspear
- Dorne
- Harrenhal
- The Twins
- Oldtown
- Braavos
- Pentos
- Vaes Dothrak
- Qarth
- Astapor
- Yunkai
- Meereen
- Hardhome
- The Dreadfort
- Bear Island
- Craster's Keep
- The Fist of the First Men
- The Riverlands
- The Reach
- The Westerlands
- The Crownlands
- The North
- The Iron Islands
- The Vale
- The Stormlands
- Slaver's Bay
- The Narrow Sea
- The Kingsroad
- Moat Cailin
- The Trident
- The Red Keep
- The Sept of Baelor
- Flea Bottom
- The Dragonpit
- The Great Sept
- The House of Black and White
- The Water Gardens
- The Citadel

## Weapons

- Ice
- Needle
- Longclaw
- Oathkeeper
- Widow's Wail
- Heartsbane
- Catspaw dagger
- Dragonglass dagger
- Dragonglass spearhead
- Dothraki arakh
- Wildfire
- Scorpion
- Robert's warhammer
- Dawn
- Lightbringer, only as a belief or prophecy when an episode has introduced it

## Objects And Symbols

- Dragon eggs
- Hand of the King pin
- Iron Throne
- Weirwood heart tree
- Direwolf pups
- Raven scrolls
- House banners
- Wildfire jars
- Valyrian steel links or notes
- Faceless Men coin
- The horn and dragonglass cache
- Seven-pointed star
- Driftwood crown symbolism
- White raven
- Obsidian / dragonglass cache
- Chain at Blackwater Bay
- King's Landing map table
- Painted table
- The Iron Bank ledger concept
- Maester chain
- King's decree
- Royal seal
- Poisoned wine, only when episode-safe

## House And Group Visual Tiles

- House Stark
- House Baratheon
- House Lannister
- House Targaryen
- House Tully
- House Arryn
- House Greyjoy
- House Tyrell
- House Martell
- House Bolton
- House Frey
- House Mormont
- House Tarly
- House Clegane
- Night's Watch
- Dothraki khalasar
- Free Folk
- Faith of the Seven
- Faceless Men
- Second Sons
- Unsullied
- Sons of the Harpy
- Brotherhood Without Banners
- Kingsguard
- Small Council
- Maesters of the Citadel

## Per-Entry Checklist

- Name is the name known at that episode.
- Category is correct.
- Copy is original and short.
- No future spoiler has slipped in.
- Image has legal status and alt text.
- Sources are attached.
- Related characters, houses, and places are linked.
- Entry appears only on or after `knownByEpisode`.


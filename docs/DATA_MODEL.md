# Data Model

All companion content lives in `src/data/`. The UI is intentionally driven by typed episode objects so curation can continue without redesigning components.

## Episode Index

`src/data/episodes.ts` contains every route in `episodeIndex`. This powers the selector and scaffold pages.

Curated episodes are imported into `curatedEpisodes`:

```ts
const curatedEpisodes: Record<string, EpisodeContent> = {
  [episodeS01E01.id]: episodeS01E01,
}
```

When a route is not curated, the app returns a scaffold with no graph data and a clear "curation needed" message.

## Episode File

Create one file per episode:

```txt
src/data/episode-s01e02.ts
src/data/episode-s01e03.ts
```

Each file exports one `EpisodeContent` object:

```ts
export const episodeS01E02: EpisodeContent = {
  id: 's01e02',
  season: 1,
  episode: 2,
  title: 'The Kingsroad',
  status: 'curated',
  spoilerBoundary: 'Known only after finishing Season 1, Episode 2.',
  summary: 'Original spoiler-safe summary.',
  houses: ['stark', 'baratheon'],
  characters: [],
  relationships: [],
  locations: [],
  routes: [],
  sources: [],
}
```

## Character Fields

- `id`: stable kebab-case id used by relationships.
- `name`: full display name.
- `sortName`: roster sorting key.
- `actor`: optional actor name.
- `house`: current visible house/group affiliation for this episode.
- `bornHouse`: optional birth house where useful and already known.
- `title`: optional title known by this episode.
- `short`: compact node label.
- `known`: spoiler-safe memory note.
- `aliases`: optional names.
- `tags`: short chips for the zoomed-in node.
- `portrait`: optional public path or licensed URL.

## Relationship Fields

- `id`: stable unique id.
- `source`: character id.
- `target`: character id.
- `kind`: one of `blood`, `marriage`, `betrothal`, `ward`, `serves`, `knows`, `secret`, or `conflict`.
- `label`: short edge label.
- `note`: optional private curation note.

The graph uses Dagre to lay out nodes automatically, then React Flow renders the interactive canvas.

## House Fields

House metadata lives in `src/data/houses.ts`. Add a new house/group there before using it in episode content.

Use houses for noble houses and for practical groups such as the Night's Watch or the Dothraki khalasar when those group identities help viewers.

## Location Fields

- `id`: stable kebab-case id.
- `name`: visible place name.
- `region`: broad region.
- `x`, `y`: percentage coordinates on the schematic map.
- `known`: spoiler-safe place note.

Route objects connect location ids with a short label.

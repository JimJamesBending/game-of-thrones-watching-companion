# Game of Thrones Watching Companion

A spoiler-safe watching companion for people who struggle to remember names, houses, relationships, and places while watching Game of Thrones.

The public site is configured for GitHub Pages at:

https://jimjamesbending.github.io/game-of-thrones-watching-companion/

## Current Coverage

- All 73 episode routes exist in the episode selector.
- Season 1, Episode 1, "Winter Is Coming", is hand-curated as the proof-of-system for family relationships.
- The other 72 episodes are auto-generated from public scene data with characters, co-appearance links, episode places, and character-origin map icons.
- Auto-generated pages are marked as imported data because family relationships still need human spoiler review.

## What It Does

- One route per episode.
- Spoiler boundary per page: each page should only include knowledge available by the end of that episode.
- Interactive relationship graph with pan, zoom, minimap, and fit controls.
- Level-of-detail graph nodes: zoomed out shows face/initial markers; zoomed in reveals names, houses, notes, and tags.
- Relationship styling:
  - Solid lines: blood and marriage.
  - Dashed lines: non-blood/non-marriage links such as ward, service, acquaintance, secret, conflict, or betrothal.
- House color key.
- Schematic map and place-name layer for each episode.
- Character-origin icons on the map when a house/home origin can be inferred.
- Character cards for name memory.

## Local Development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Updating Episodes

Start here:

- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)
- [docs/DATA_MODEL.md](docs/DATA_MODEL.md)
- [docs/TECH_RESEARCH.md](docs/TECH_RESEARCH.md)
- [docs/SCRAPE_SOURCES.md](docs/SCRAPE_SOURCES.md)
- [docs/DESIGNER_PROMPT.md](docs/DESIGNER_PROMPT.md)
- [docs/LORE_GLOSSARY_SEED.md](docs/LORE_GLOSSARY_SEED.md)

The short version:

1. Add a new `src/data/episode-sXXeYY.ts` file.
2. Fill characters, relationships, houses, locations, and sources.
3. Import it in `src/data/episodes.ts`.
4. Add it to `curatedEpisodes`.
5. Run `npm run typecheck`, `npm run lint`, and `npm run build`.

To refresh the auto-imported all-episode scene data:

```bash
npm run import:internet
```

## Image Policy

The app supports portraits through each character's `portrait` field. Do not commit scraped HBO stills or copyrighted publicity photos unless you have the right to use them. Use original, licensed, public-domain, or user-provided images. If no portrait is supplied, the UI shows a house-colored initials avatar.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, builds the Vite app, and deploys `dist/` to GitHub Pages.

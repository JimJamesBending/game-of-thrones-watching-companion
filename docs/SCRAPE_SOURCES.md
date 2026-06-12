# Scrape Sources

The generated all-episode content comes from public structured data, not from copied wiki prose.

## Used

- Jeffrey Lancaster's Game of Thrones dataset: https://github.com/jeffreylancaster/game-of-thrones
  - Used for per-episode scene characters and locations.
  - The repository explicitly warns that some visualizations contain spoilers, so this app only imports scene data for the selected episode page.
- TVMaze API: https://www.tvmaze.com/api
  - Used for public episode metadata checks such as airdate/runtime.

## Intentionally Not Used As Public Assets

- IMDb/Amazon/HBO/Fandom character image URLs in scraped data.
- HBO stills, publicity photos, or wiki-hosted character images.

The app can display portraits, but public assets should be original, licensed, public-domain, or user-provided with permission.

## Generated File

Run:

```bash
npm run import:internet
```

This rewrites `src/data/generated-episodes.ts`.

Generated records are useful for coverage, names, places, and co-appearance graph links. They are not a substitute for human spoiler review of family relationships.

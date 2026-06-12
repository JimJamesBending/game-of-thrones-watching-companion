# Tech Research

The app is designed as a static site so it can be public, low-maintenance, and hosted on GitHub Pages.

## Selected Stack

- Vite + React + TypeScript for a fast static app with a small maintenance footprint.
- React Router hash routes so episode pages work on GitHub Pages without server rewrites.
- React Flow for the pan/zoom relationship graph, custom nodes, controls, minimap, and viewport-aware detail changes.
- Dagre for automatic graph layout.
- Plain CSS tokens for a custom visual system with no heavy UI framework.
- GitHub Actions + GitHub Pages for deployment.
- Public scene data importer for all-episode coverage.

## Why React Flow

React Flow is built around rendering nodes and edges and already includes the interaction primitives this project needs: dragging the viewport, zooming, controls, minimap, and custom React nodes.

Relevant docs:

- React Flow component API: https://reactflow.dev/api-reference/react-flow
- React Flow contextual zoom example: https://reactflow.dev/examples/interaction/contextual-zoom
- React Flow Dagre layout example: https://reactflow.dev/examples/layout/dagre

The contextual zoom example is the key fit for level of detail. It shows using the zoom value to decide what a node renders. This app uses that pattern so zoomed-out nodes become compact face/initial markers and zoomed-in nodes show memory notes.

## Why Dagre

Family and relationship graphs should not require hand-positioning every node for every episode. Dagre gives a quick hierarchical layout and integrates cleanly with React Flow. It is not perfect for every dense political graph, but it is a good first layout engine and can be replaced with ELK later if we need compound house grouping or larger graph constraints.

## Why GitHub Pages

The user asked for a public page and a repo. GitHub Pages is enough because the app is static and the content is bundled at build time.

Relevant docs:

- Vite static deployment guide: https://vite.dev/guide/static-deploy
- GitHub Pages custom Actions publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Vite requires the `base` path to match the repository path for project pages. This repo uses:

```ts
base: '/game-of-thrones-watching-companion/'
```

## Source Research

The first episode seed was cross-checked with public episode/cast references, then rewritten as original spoiler-safe memory notes.

Useful source starting points:

- HBO Game of Thrones series page: https://www.hbo.com/game-of-thrones
- HBO S1E1 episode page: https://www.hbo.com/game-of-thrones/season-1/1-winter-is-coming
- Rotten Tomatoes S1E1 cast list: https://www.rottentomatoes.com/tv/game_of_thrones/s01/e01/cast-and-crew
- A Wiki of Ice and Fire S1E1 page: https://awoiaf.westeros.org/index.php/Winter_Is_Coming

Fan wikis can expose future spoilers. Use them cautiously and only for the current episode boundary.

## Future Improvements

- Add search/filter inside the graph.
- Add a "before watching" and "after watching" toggle for each episode.
- Add source-attributed portrait packs once rights are clear.
- Move generated episode records to per-episode JSON files if the bundle grows beyond comfortable static-site size.
- Move content to JSON or MDX if non-developers will update it often.
- Add visual regression screenshots for desktop and mobile.

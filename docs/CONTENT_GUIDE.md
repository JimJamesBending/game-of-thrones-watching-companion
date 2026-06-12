# Content Guide

This project is only useful if it is strict about spoilers. Treat every episode page as a memory aid for someone who has just finished that episode and has not seen anything later.

## Spoiler Boundary

For each episode, include:

- What a viewer has seen by the end of the episode.
- What a careful viewer can reasonably infer from the episode.
- Earlier information from prior episodes.

Do not include:

- Later reveals, deaths, parentage, alliances, betrayals, or titles.
- Book-only information unless the show has already established it.
- Wiki summaries copied into the app. Write concise original notes.

Use this mental test: "Could a first-time viewer know this without watching the next episode?" If not, leave it out.

## Source Priority

Use multiple sources, then verify against the episode itself where possible.

1. The episode as watched.
2. Official HBO episode pages and official cast pages.
3. Carefully checked cast listings such as IMDb or Rotten Tomatoes.
4. Fan wikis only for cross-checking names, spellings, and house context. They often contain spoilers, so do not browse past the episode section unless you are intentionally curating later pages.

Record sources in the `sources` array for each episode file.

## Relationship Rules

Use the smallest truthful relationship set needed for comprehension.

- `blood`: parent, child, sibling, acknowledged blood family, or publicly understood blood relation.
- `marriage`: current or past marriage known by this episode.
- `betrothal`: promised or proposed marriage.
- `ward`: ward, foster child, hostage-like household position, or raised in another household.
- `serves`: sworn role, employment, military command, household role, or political office.
- `knows`: useful social connection where no stronger type applies.
- `secret`: a connection known to the viewer but hidden from most characters.
- `conflict`: threat, harm, capture, accusation, or direct opposition.

Solid lines are reserved for `blood` and `marriage`. All other relationship kinds render dashed or dotted.

## Map Rules

The map is schematic, not an official Westeros map. This avoids copyrighted map art and keeps the UI readable while watching.

For each `EpisodeLocation`:

- `name`: place name shown on the map.
- `region`: broad region, for example "The North" or "Across the Narrow Sea".
- `x` and `y`: percentage coordinates on the schematic board.
- `known`: what the viewer needs to remember about that place by this episode.

For each `MapRoute`:

- Use only movements or story links visible or discussed in this episode.
- Keep route labels short.

## Portrait Rules

The public repo should not bundle scraped HBO stills or copyrighted publicity images by default.

Allowed:

- Original portraits you create.
- User-provided images the user has the right to publish.
- Properly licensed images with attribution handled in docs.
- Public-domain images.

Add image files under `public/portraits/` and reference them as:

```ts
portrait: '/game-of-thrones-watching-companion/portraits/ned-stark.jpg'
```

If a character has no portrait, leave `portrait` blank. The app will render a house-colored initials avatar.

## Episode Update Checklist

1. Watch or rewatch the episode.
2. List only characters who matter for name/family/place confusion.
3. Add houses represented in the episode.
4. Add relationships that clarify family, marriage, service, wards, secrets, conflict, or acquaintance.
5. Add locations and routes.
6. Add sources.
7. Read the page as if you have never seen the next episode.
8. Run `npm run typecheck`, `npm run lint`, and `npm run build`.

## Auto-Generated Episodes

All non-curated episodes are generated from public scene data. These pages are useful for:

- who appears in the episode
- who shares scenes
- places shown in the episode
- house/home origin icons where inferable

They are not final family trees. Before marking an episode as fully curated, review each relationship and replace generic co-appearance links with precise blood, marriage, ward, service, conflict, or secret links.

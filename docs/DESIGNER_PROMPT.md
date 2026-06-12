# ChatGPT Designer Prompt

Copy this prompt into ChatGPT Designer when redesigning the watching companion.

```text
You are redesigning a public, spoiler-safe Game of Thrones watching companion for a viewer who gets confused by names, houses, family trees, locations, and similar-looking characters. Do not make a marketing landing page. The first screen must be the actual working companion.

Core job:
Create an image-heavy episode companion where every page is scoped to one episode and only shows information known by the end of that episode. The user must be able to understand who a character is, what house or group they belong to, where they are from, who they are linked to, and what important places, terms, weapons, and objects have been introduced so far.

Hard spoiler rule:
Every character fact, relationship, map note, glossary entry, weapon, object, title, house description, and image caption must have a knownByEpisode field such as "s01e01". Never reveal deaths, parentage, betrayals, romances, allegiances, locations, titles, or object ownership before the episode where the viewer could know it.

Do not mess this up:
- Do not use the current dark green/burgundy theme.
- Do not make a generic medieval brown, grey, slate, parchment, or fantasy UI.
- Do not make a text-heavy wiki clone.
- Do not hide the useful app behind a hero page.
- Do not let the graph pan infinitely or zoom so far that the user loses the content.
- Do not let graph nodes overlap each other, graph labels overlap cards, or edge labels sit on top of faces/text.
- Do not use unlicensed scraped HBO, IMDb, Fandom, Amazon, or publicity images in a public repo. Use licensed, public-domain, generated, or user-provided images with source and attribution fields.

Desired aesthetic:
Build a beautiful cinematic atlas and noble-house dossier. It should feel like a premium visual reference desk: image-led, clear, tactile, and fast to scan. Use a restrained dark foundation, bright readable text, and house-color accents, but avoid a one-note palette. Let portraits, map fragments, house sigils, object thumbnails, and place images carry the visual weight. The signature move should be an "episode evidence board": portraits, relationship graph, map pins, and lore tiles feel connected without becoming cluttered.

Layout:
- Use a compact top episode bar with season/episode controls and icon anchors. Do not use a left sidebar; content space is more important.
- The first functional content after the episode summary must be a near full-viewport relationship/family canvas.
- Use a full-width content stack on desktop:
  - Relationship graph first, with as much viewport height as possible.
  - Map below the graph, wide and readable, paired with the house/relationship key where space allows.
  - Character roster below, with large image-led cards.
  - Glossary, weapons, objects, and places can follow as full-width bands or dense repeated-item grids.
- On tablet/mobile, keep the top controls compact, then show graph, map, roster, and glossary in a clean single column.
- Do not put cards inside cards. Use cards for repeated items only.
- Every fixed-format area needs stable dimensions so labels, images, buttons, and hover states do not resize the layout.

Graph requirements:
- Use React Flow or an equivalent graph canvas.
- Graph pan and zoom must be bounded with translate extents around the laid-out graph.
- Provide fit-view, zoom-in, zoom-out, minimap, and reset controls.
- Minimum zoom must keep the graph recoverable. Maximum zoom must not create chaotic overlap.
- Node size must be stable. Zooming in can reveal details, but the physical card box must not grow and collide with neighbors.
- Use level of detail:
  - Far zoom: portrait or initials and house color only.
  - Mid zoom: name, house, title, and relationship lines.
  - Near zoom: spoiler-safe memory note, tags, actor, origin, and source.
- Solid lines mean confirmed blood or marriage.
- Public/legal/acknowledged family that should not be asserted as biological must use a separate recognized-family edge style.
- Dashed lines mean recognized family or non-blood/non-marriage connections such as ward, service, conflict, acquaintance, political bargain, secret, betrothal, or alliance.
- Edge labels should be short, legible, and never cover node text or faces.
- Structural family relationships should drive layout more than weaker "knows" edges.
- Related family members should sit near each other. Spouses, siblings, parents, and children should be visually grouped in a way that makes sense.

Map requirements:
- Include a map panel for each episode with place pins and route lines.
- Include character-origin icons where known, grouped by place if several people come from the same location.
- Pins need icons, labels, hover/focus notes, and source attribution.
- Places must be episode-gated. Do not label a place with future political status or future character movement.
- Map should support zoom/pan or at minimum a large readable schematic with dense labels that do not collide.

Image-heavy content requirements:
- Every major character should have a portrait slot beside their name.
- Every house/group should have a visual mark, banner, sigil placeholder, or generated crest.
- Every major place should have a thumbnail or generated location illustration.
- Every iconic weapon/object should have an image tile or generated prop illustration.
- Glossary entries should include a thumbnail or symbolic image, not just text.
- Image metadata must include sourceType, sourceUrl, license, attribution, alt text, and knownByEpisode.
- If no legal image exists, use a generated illustration or a house-colored placeholder with the initials/sigil.

Glossary and lore content:
Create a glossary section that is filtered by the selected episode. It should cover:
- Houses and groups.
- Titles and institutions.
- Religions and cultures.
- Places.
- Iconic weapons.
- Important objects and symbols.
- Repeated phrases and political terms.

Terms and institutions to include when episode-safe:
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
- Khal, khalasar, khaleesi, and bloodrider
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

Places to include when episode-safe:
- Winterfell
- King's Landing
- The Wall
- Castle Black
- Beyond the Wall
- Dragonstone
- Casterly Rock
- Pyke
- Riverrun
- The Eyrie
- Highgarden
- Storm's End
- Dorne / Sunspear
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

Iconic weapons and objects to include when episode-safe:
- Ice
- Needle
- Longclaw
- Oathkeeper
- Widow's Wail
- Heartsbane
- Catspaw dagger
- Dragonglass dagger
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
- The Faith's seven-pointed star
- The Drowned God's driftwood crown symbolism
- White raven
- Obsidian / dragonglass cache

Required data model additions:
Design the UI around structured content, not hard-coded text. Add or plan these types:
- LoreEntry: id, name, category, short, known, knownByEpisode, firstSeenEpisode, tags, image, sources.
- ArtifactEntry: id, name, kind, ownerCharacterIds, associatedHouseIds, known, knownByEpisode, image, sources.
- PlaceEntry: id, name, region, x, y, known, knownByEpisode, image, sources.
- ImageAsset: src, alt, sourceType, sourceUrl, license, attribution, knownByEpisode.
- SourceLink: label, url, accessedAt, notes.
- Relationship.kind must distinguish `blood` from `recognized`; do not use `blood` for public cover stories, presumed parentage, or episode-safe household claims.

Interaction requirements:
- Search across characters, actors, houses, places, weapons, objects, and glossary terms.
- Filters for House, Region, Relationship Type, and Lore Category.
- Click a character to highlight graph links, roster card, map origin, and glossary mentions.
- Click a place to show all known characters from or currently associated with it.
- Include clear "known by end of this episode" copy.
- Include imported-data warnings for pages generated from public scene data but not yet hand-reviewed.

Accessibility:
- All images need meaningful alt text unless decorative.
- Keyboard users must be able to navigate the episode rail, graph controls, roster, map pins, and glossary.
- Focus states must be visible.
- Text contrast must pass WCAG AA.
- Motion must respect prefers-reduced-motion.
- No essential information may be color-only. Use line style, icon, and text labels as well as color.

Deliverables:
- A complete responsive visual design for the existing React app.
- CSS/design tokens for color, typography, spacing, radius, shadows, and states.
- Component specs for graph nodes, edge labels, roster cards, map pins, lore cards, glossary entries, image treatment, filters, and empty/imported states.
- Desktop, tablet, and mobile layouts.
- A sample episode page using S1E1 with character portraits/place imagery/object tiles represented by legal placeholders if needed.
- A QA checklist specifically checking graph extents, node overlap, label collisions, image attribution, spoiler boundaries, and mobile readability.
```

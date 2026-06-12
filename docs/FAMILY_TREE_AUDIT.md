# Family Tree Audit

This is a spoiler-bearing curation note for maintainers. Episode pages must still obey the selected episode boundary.

## Current Scope

- `src/data/episode-s01e01.ts` is the only curated episode with explicit family-tree relationships.
- `src/data/generated-episodes.ts` currently contains generated scene/co-appearance links only; every generated relationship is `knows`.
- Do not treat generated episode graphs as final family trees until each relationship has been reviewed.

## Sources Checked

- Rachel Wiles, `rachelwiles/GoT-Check`: Prolog parent facts and family rules. The README says it is accurate through Season 7 and full of spoilers.
- Matthias Huber and Steffen Kuehne, `stekhn/got-relationships`: episode-ranged relationship chart with link types such as parent, child, sibling, married, ally, enemy, and love.
- Luke Phelan, `web-of-westeros` plus `api-wow`: graph-database family tree seed data.
- Shirin Glander, "Network analysis of Game of Thrones family ties": independent network analysis using mother, father, and spouse edge types, built from Kaggle data plus manually checked wiki sources.

## Decisions

- `blood` now means biological or explicitly established blood family only.
- `recognized` means publicly presented, acknowledged, legal, or household family where the page should not assert biological certainty.
- For S01E01, Eddard -> Jon and Robert -> Joffrey/Myrcella/Tommen are `recognized`, not `blood`.
- Do not add later biological-parent reveals to early episode pages. For S01E01, keep the viewer-safe public relationship but avoid making the legend claim a true blood tie.

## S01E01 Comparison Notes

- Stark parent edges for Robb, Sansa, Arya, Bran, and Rickon match GoT-Check parent facts and the episode-ranged relationship chart.
- Eddard and Catelyn's marriage matches the relationship chart and Web of Westeros seed.
- Eddard and Benjen as siblings match the relationship chart and are implied by GoT-Check's shared-parent facts.
- Eddard and Lyanna as siblings are implied by GoT-Check's shared-parent facts.
- Jon's relationship to Eddard is intentionally `recognized`; full-series family datasets do not agree that this is a biological edge.
- Robert and Cersei's marriage matches the relationship chart and Web of Westeros seed.
- Robert's relationship to Cersei's children is intentionally `recognized`; sources that model biological parentage conflict with a plain `blood` edge.
- Cersei as mother of Joffrey, Myrcella, and Tommen is supported by all checked biological/tree sources.
- Cersei, Jaime, and Tyrion sibling edges match checked sources.
- Catelyn and Lysa as sisters match the relationship chart and are supported by Web of Westeros/Tully family seed data.
- Jon Arryn and Lysa's marriage matches Web of Westeros seed data.
- Daenerys and Viserys as siblings match GoT-Check and the relationship chart.
- Daenerys and Drogo's S01E01 marriage matches the relationship chart and Web of Westeros seed.

## Source Caveats

- GoT-Check and Web of Westeros contain full-series spoilers; use them for private validation, not page copy.
- Web of Westeros seed data has at least one apparent Stark-family inconsistency, so prefer corroborated facts over a single edge in that source.
- The relationship chart intentionally includes public/social and biological-style links; do not import its `parent` labels blindly into `blood`.

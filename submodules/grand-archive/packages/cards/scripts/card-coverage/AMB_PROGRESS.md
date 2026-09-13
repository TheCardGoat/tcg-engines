# AMB acceptance coverage

Complete acceptance accountability for Grand Archive set AMB.
`coverage.json` is the source-derived authority for per-card and per-ability
statuses.

## Current result

- Canonical cards: **239/239 complete**.
- Printed abilities: **415/415 covered** (384 proven + 31 centrally covered).
- Direct card-behavior proofs: **384**.
- Centrally covered intrinsic keywords: **31**.
- Untested abilities: **0**.

Centrally covered rows are exact, unconditional, parameter-free intrinsic
keyword paragraphs whose engine-owned suites are explicitly enabled in
`central-keywords.ts`. Direct `@covers` evidence always wins. Restricted,
parameterized, grouped, granted, used, custom-zone, or otherwise card-specific
keyword text remains accountable to its card test and is never auto-exempted.

Negative coverage tests in `src/card-coverage-central-keywords.test.ts` prove
AMB Pride, Link, Class Bonus Floating Memory, Class Bonus Ranged, Class Bonus
Stealth, damage-restricted Cleave, and named Lineage stay card-specific.

ALC remains complete at 210/210 cards and 400/400 abilities.

## Reproduce

From `packages/cards`:

```sh
vp run coverage:cards:write
vp test src/card-coverage-central-keywords.test.ts --run
vp test src/cards/AMB --run
```

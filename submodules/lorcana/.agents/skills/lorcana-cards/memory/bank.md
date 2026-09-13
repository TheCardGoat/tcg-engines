# Lorcana Cards Memory Bank

Schema: [`schema.md`](./schema.md). Demoted/expired entries: [`archive.md`](./archive.md).

## Guardrails

- **G-01**: Resolve the exact card file and test file before editing. Why: avoid acting on a generated stub or stale legacy file. Applies: every card task.
- **G-02**: Probe engine support before declaring a gap. Why: most "gaps" are authoring drift from current DSL. Applies: any card with `missingImplementation: true` or a failing behavior test.
- **G-03**: Treat active Bun tests as the only source of truth, not commented Jest history. Why: legacy comments rot and mislead. Applies: when picking reference examples.
- **G-04**: A test asserting only `missingImplementation`, `missingTests`, or empty `abilities` is not coverage. Why: hides regressions and inflates green metrics. Applies: review and authoring.
- **G-05**: If the same engine gap blocks 2+ cards in one batch, stop and fix shared support first. Why: repeated per-card workarounds calcify. Applies: batch implementation work.
- **G-06**: Use authoritative server state for hidden-zone, under-card, facedown-ink, or chooser-projection assertions. Why: client snapshots can be optimistically successful. Applies: tests touching hidden zones.
- **G-07**: Enchanted/epic variants share `canonicalId` and must have abilities identical to the base card. Why: drift breaks Shift and reprint logic. Applies: variant authoring.

## Promoted Rules

### PR-01 — actions-and-locations-as-syntax-references

- **claim**: Actions are the most mature DSL surface; locations are second. Items are mixed; characters are least reliable.
- **scope**: Picking reference examples for new card authoring.
- **evidence**: O-2026-03-14, O-2026-03-15-engine-first, set-001/002/003/004/005 item batches all required corrections starting from non-action templates.
- **verification**: `rg -l 'missingImplementation: true' packages/lorcana/lorcana-cards/src/cards/<SET>/<TYPE>` — current counts: actions 2/340, locations 0/87, items 125/204, characters 1569/1936.
- **last_checked**: 2026-04-27

### PR-02 — may-enter-play-exerted-two-ability-shape

- **claim**: "May enter play exerted" is two abilities — a static `restriction: "may-enter-play-exerted"` plus a triggered ability gated by `condition: { type: "is-exerted" }`.
- **scope**: Character authoring with optional exerted entry.
- **evidence**: `012/characters/078-lord-macguffin-clever-swordsman.ts`, set-012 batch (2026-04-21), engine-first proof (2026-03-15).
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/012/characters/078-lord-macguffin-clever-swordsman.test.ts`
- **last_checked**: 2026-04-27

### PR-03 — printed-cost-vs-discounted-cost-for-triggers

- **claim**: Trigger eligibility checks like "cost X or less" must filter against printed cost, not discounted play cost.
- **scope**: Authoring triggered abilities with cost predicates.
- **evidence**: O-2026-03-15-nested-play-bodyguard, Stitch–Rock Star case via Lantern.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/001/items/033-lantern.test.ts`
- **last_checked**: 2026-04-27

### PR-04 — that-card-needs-trigger-ref-and-zone

- **claim**: Card text using "that card from your <zone>" must use `source: { ref: "trigger-subject", zones: ["<zone>"] }`. Plain `source: "<zone>"` lets the resolver pick unrelated cards; plain `ref` without `zones` ignores zone movement.
- **scope**: Triggered abilities referencing a specific prior card identity.
- **evidence**: O-2026-03-27-that-card-zone-lock (Belle Snowfield Strategist), CR `6.1.11`/`6.1.11.1`.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/011/characters/158-belle-snowfield-strategist.test.ts`
- **last_checked**: 2026-08-01

### PR-05 — optional-no-legal-targets-still-bags

- **claim**: A triggered optional ability whose later target choice has zero legal candidates still enters the bag and resolves with no effect. Do not author or assert it as suppressed.
- **scope**: Triggered optional abilities with chosen-target effects.
- **evidence**: O-2026-03-27-optional-no-legal (Be Prepared multi-trigger), CR `6.2.2`, `6.2.9`, `1.7.7`.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/triggered-abilities/index.ts` and `bun test packages/lorcana/lorcana-simulator/src/testing/triggered-abilities/multiple-triggers.test.ts`
- **last_checked**: 2026-04-27

### PR-06 — turn-owner-not-priority-holder

- **claim**: `passTurn` and similar turn-ownership checks must derive turn owner from OTP + completed turns, not from priority holder. Priority can transfer to opponents during opponent-choice bag flows without changing turn ownership.
- **scope**: Engine work on turn transitions and opponent-choice triggered effects on the active player's turn.
- **evidence**: O-2026-03-28-turn-owner-vs-priority, Cursed Merfolk repro, CR `1.3.4.1`, `3.4.2`, `7.7.4.5`.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/runtime-moves/moves/turn/pass-turn.test.ts`
- **last_checked**: 2026-08-01

### PR-07 — set-counts (current-state)

- **claim**: Migration state by card type — actions 340 defs / 2 missing; locations 87 / 0; items 204 / 125; characters 1936 / 1569.
- **scope**: Sizing batches and choosing reference surfaces.
- **evidence**: Migration audit 2026-04-21.
- **verification**: `rg -l 'missingImplementation: true' packages/lorcana/lorcana-cards/src/cards/<TYPE>/ | wc -l`
- **last_checked**: 2026-04-21

## Candidates

### C-04 — team-name-shift-targets

- **pattern**: A team card whose Shift reminder text names alternatives must use `shift("Name A or Name B", cost)` rather than plain `shift(cost)`, which only permits an exact same-name base.
- **hits**: 2 (most recent: 2026-07-15)
- **promote_when**: ≥3 distinct team cards need the explicit alternative-name target.
- **demote_at**: 2026-09-13


## Observations

Recent observations move to `archive.md` after 30 days unless they back a Candidate or Promoted Rule. The full prior log lives in [`archive.md`](./archive.md).

### O-2026-08-01-selected-target-name-ampersand

- **signal**: Darkwing's Chair Set's `selfReplacement` condition `selected-target-name: "Darkwing Duck"` used exact `getCardName === name` equality, so choosing "Darkwing Duck & Launchpad" only removed 2 damage instead of 4. Engine now routes that condition through `cardHasName` (CR 5.2.6.1 + aliases). Simulator amount-selection UI had the same gap on card labels and now splits `" & "` name halves.
- **impact**: Future "named X" self-replacement / amount-cap reports involving team ampersand cards should check `selected-target-name` paths for exact string equality before reauthoring the card. Also benefits Stolen Scimitar's same condition.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/011/items/168-darkwings-chair-set.test.ts"`; `bun test --cwd packages/lorcana/lorcana-simulator "./src/lib/features/simulator/model/resolution-amount-selection.test.ts"`
- **candidate_for**: new

### O-2026-08-01-start-of-turn-ready-choice

- **signal**: A `ready-only-one-character` start-of-turn restriction cannot choose the first eligible character by play-zone order; when multiple characters can ready, the turn transition must suspend with a chooser-owned projected target selection and resume after that selection resolves.
- **impact**: Future Ready-step restrictions that limit rather than prohibit readying should reuse the pending-effect projection path so the affected player retains the printed choice and the simulator receives legal candidates.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/011/characters/053-marshmallow-cranky-climber.test.ts packages/lorcana/lorcana-engine/src/runtime-moves/moves/turn/pass-turn.test.ts`
- **candidate_for**: new

### O-2026-07-13-team-name-shift-targets

- **signal**: Winnie the Pooh & Piglet - Hunny Mages was authored with plain `shift(3)`, so Shift only targeted exact same-name cards instead of the printed Winnie the Pooh or Piglet bases. Existing set 13 examples use structured `shift("Name A or Name B", cost)` for team cards with either-name Shift.
- **impact**: Future ampersand/team-name Shift reports should compare the ability helper's structured target string against printed reminder text before changing engine target resolution.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/013/characters/062-winnie-the-pooh-piglet-hunny-mages.test.ts`; `bun run --cwd packages/lorcana/lorcana-cards check-types`
- **candidate_for**: new

### O-2026-07-15-carl-russell-shift-targets

- **signal**: Carl Fredricksen & Russell - Intrepid Explorers likewise used plain `shift(4)`, which rejected the printed Carl Fredricksen or Russell bases. `shift("Carl Fredricksen or Russell", 4)` uses the existing named-alternative resolver, and regression tests now cover both bases. Darkwing Duck & Launchpad already used this shape and passes both target cases.
- **impact**: Reinforces that team-name Shift defects are card-authoring drift, not an engine support gap, when the named-alternative resolver is already present.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/013/characters/098-carl-fredricksen-russell-intrepid-explorers.test.ts packages/lorcana/lorcana-cards/src/cards/013/characters/165-darkwing-duck-launchpad-st-canards-finest.test.ts`; `bun run --cwd packages/lorcana/lorcana-cards check-types`
- **candidate_for**: C-04

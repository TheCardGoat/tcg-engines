# FAB Hero Special UI

Design + validation package for **hero-specific simulator chrome** beyond the
universal Flesh and Blood playmat.

## Why this exists

Many FAB heroes need UI that is not “just life and hand”:

- **Dromai** — Ash tokens + dragon allies + material under dragons
- **Levia** — blood-debt readout on banished (not a hero counter pool)
- **Chi heroes** (Nuu / Enigma / Zen) — chi asset
- **Boltyn / Prism** — soul under the hero
- …and dozens more (see catalog)

This folder is the **source of truth for UX acceptance** until engine-backed
visual fixtures can fully seed every special system.

## Files

| File                    | Audience    | Purpose                                       |
| ----------------------- | ----------- | --------------------------------------------- |
| `modules.ts`            | UX + eng    | Shared UI modules (implement once)            |
| `catalog.ts`            | UX + eng    | Per-hero requirements, tiers, modules, tokens |
| `textFixtures.ts`       | UX + QA     | ASCII board builders (visual targets)         |
| `text-fixtures.md`      | UX review   | Generated dump of every ASCII board           |
| `UX_HANDOFF.md`         | UX engineer | Generated table: hero → must show → modules   |
| `heroSpecialUi.test.ts` | CI          | Completeness + verifies committed markdown    |
| `index.ts`              | eng         | Public exports                                |

## Browser visual fixtures (live play surface)

With the multi-game simulator running (`pnpm run dev` from agnostic-simulator):

| URL                                                                       | What                                       |
| ------------------------------------------------------------------------- | ------------------------------------------ |
| http://127.0.0.1:5193/flesh-and-blood/simulator/tests                     | Catalog — filter group **Hero special UI** |
| http://127.0.0.1:5193/flesh-and-blood/simulator/tests/hero-special-dromai | Dromai: Ash + dragons                      |
| http://127.0.0.1:5193/flesh-and-blood/simulator/tests/hero-special-levia  | Levia: blood-debt banished                 |
| http://127.0.0.1:5193/flesh-and-blood/simulator/tests/hero-special-zen    | Zen: chi + Crouching Tiger                 |
| http://127.0.0.1:5193/flesh-and-blood/simulator/tests/hero-special-boltyn | Boltyn: soul count                         |

Scenario ids: `hero-special-<catalogId>` from `catalog.ts` (e.g. `hero-special-chane`).

The catalog remains the expansion inventory. Signature this-turn conditions use
the production **Hero Signal Edge**: an active-only dock attached to the hero
card that opens details without reserving a dashboard row or moving any zone.
Legacy catalog boards remain acceptance references for systems not yet migrated.

## How to use (UX engineer)

1. Read **`UX_HANDOFF.md`** for the checklist per hero.
2. Implement the **shared modules** in `modules.ts`; use `hero-signal-edge` for
   hero-native signature conditions and do not add another status dashboard.
3. Open the matching **browser fixture** (above) and/or **ASCII board** in `text-fixtures.md`.
4. Treat every labeled region / badge / stack as a **must-render** acceptance item.
5. For product priority: ship **Tier A** first (signature identity UI), then Tier B.

## How to use (engine / board eng)

1. Compose projection fields from `catalog.ts` modules.
2. Prefer shared systems (`permanent-token-stacks`, `banished-blood-debt`, `asset-bar-chi`, …).
3. When a system is engine-ready, add an engine-backed scenario in `engineScenarios.ts`
   and keep this text fixture as the UX acceptance twin.

## Regenerate docs

```bash
# from agnostic-simulator
pnpm --filter multi-game-simulator generate:hero-special-ui-docs
```

CI compares the committed Markdown to the TypeScript source of truth. Run the
generator and commit the two updated Markdown files whenever fixture data changes.

## Tier guide

| Tier  | Meaning                                                        |
| ----- | -------------------------------------------------------------- |
| **A** | Dedicated special UI; identity is incomplete without it        |
| **B** | One clear extra system (arsenal orientation, intimidate, etc.) |
| **C** | Baseline playmat only (omitted from catalog)                   |

## Related

- Zone / layout plan: `../PLAN.md`
- Engine-backed scenarios: `../engineScenarios.ts`
- Rules: `submodules/flesh-and-blood/.agents/skills/fab-rules/`

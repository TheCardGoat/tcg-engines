# One Piece Card Parser Pipeline Analysis

Principal-level assessment of the scrape → normalize → parse → card-definition
pipeline, with measured coverage and the path to consistent ability DSL for
every One Piece card.

## Scope

| Layer | Owner path | Role |
| --- | --- | --- |
| Scraper | `tools/op-card-parser/src/scrapers/optcg-api.ts` | Fetch raw print data from optcgapi.com |
| Normalizer | `tools/op-card-parser/src/normalizer.ts` | Map raw fields to `OPCard` metadata |
| Effect parser | `tools/op-card-parser/src/effect-parser/*` | Printed English text → `CardEffects` DSL |
| Card format | `packages/types` + `packages/cards` | Checked-in definitions + i18n |
| Audit tooling | `tools/op-card-parser/scripts/*` | Exact-match inventories and audits |

Engine execution is intentionally out of scope for this analysis. The gate for
DSL consistency is: **fresh `buildCardEffects(printedText)` equals the checked-in
`effects` block** for every card with ability text (and is empty for vanillas).

## Pipeline architecture

```
optcgapi.com
    │ scrapeSetList / scrapeCards
    ▼
RawOPCard  (stringy API fields, NULL sentinels, mixed separators)
    │ normalize()
    ▼
OPCard metadata  (colors, cost, traits, keywords-only effects, i18n)
    │ buildCardEffects(effectText)   ← generation scripts / audits
    ▼
CardEffects DSL  (keywords, effects[], permanentEffects[], replacementEffects[])
    │ write into packages/cards/**/*.ts
    ▼
Checked-in card definitions
```

### Scraper

- Single source: `https://www.optcgapi.com/api`.
- Rate-limited (`RateLimiter(1)`).
- Thin: no HTML scrape, no errata cross-check, no multi-source reconciliation.
- Strengths: stable JSON, simple set iteration.
- Gaps:
  - Text quality varies (missing newlines, errata notes, curly braces `{Trait}`
    vs `[Trait]` vs `"Trait"`, circled DON costs `①`, disclaimer tails).
  - Traits sometimes arrive concatenated (`"Straw Hat Crew Supernovas"`).
  - Alternate arts / promos / reprints need careful identity mapping later
    (`printings[]`, `canonicalId`).

### Normalizer

- Maps colors, attributes, rarities, traits, set ids, and identity fields.
- Extracts `[Trigger]` clauses and **innate keyword brackets only**.
- **Does not** call `buildCardEffects`. Full ability DSL is applied by
  generate/audit scripts, not at normalize time.
- Implication: re-scraping alone never refreshes structured abilities.

### Effect parser

Multi-stage NLP-lite pipeline:

1. `parseEffectText` — strip errata/reminders, split segments, parse bracket
   prefix chains (triggers, DON!! gates, once-per-turn, costs).
2. `parseInlineCondition` / condition parsers — leading `If …,` clauses.
3. `parseActions` orchestrator — sentence/clause split + specialized action
   parsers (DON, field, movement, search, life, keywords, restrictions, …).
4. `buildCardEffects` — assemble `EffectBlock`s, permanents, replacements,
   deck-building rules; drop segments with zero parsed actions.

DSL types live in `packages/types/src/effect/*` and are intentionally rich
(discriminated unions for actions, costs, conditions, targets).

### Final card format

Each definition is a typed object (`CharacterCard` / `EventCard` / …) with:

- Identity: `id`, `canonicalId`, `slug`, `printings[]`
- Gameplay stats: cost/power/life/counter/attribute/color/traits
- Dual text: `effect` (+ optional `trigger`) and `i18n.en.effect`
- Structured ability: `effects?: CardEffects`

Consistency rule used by inventories:

```
stable(card.effects) === stable(buildCardEffects(printedEnglishText))
```

## Coverage snapshot (current — goal complete)

Measured by loading every definition and re-running `buildCardEffects`, then
confirming via `inventory:characters|events|stages|leaders -- --write`.

| Card type | Definitions | Exact match | Vanilla | Empty parser | Exact % |
| --- | ---: | ---: | ---: | ---: | ---: |
| Character | 1768 | 1567 text + 201 vanilla | 201 | **0** | **100%** |
| Event | 351 | 351 | 0 | **0** | **100%** |
| Stage | 44 | 44 | 0 | **0** | **100%** |
| Leader | 123 | 123 | 0 | **0** | **100%** |

All four inventories report `mismatch=0`. Printed-text cards with empty
`buildCardEffects` output: **0**.

### Historical mismatch taxonomy

Closed during this campaign (kept for regression context):

1. **Empty parser output** — dual Leader attack/attacked, start-of-turn narrative
   activation, variable DON rest-and-scale, trait hand-trash triggers, total
   Character-cost gates, mixed DON!!/Character set-active.
2. **Structural drift** — condition placement, cost defaults, trigger aliases,
   `anyOf.filters` vs `groups` — resolved by parser alignment + regenerating
   checked-in `effects` from `buildCardEffects`.
3. **Stale definitions** — regenerated after grammar landings.

## Improvements landed

Grammar closures with focused regression tests
(`tests/effect-parser/empty-parser-grammar-gaps.test.ts`):

| Family | Example text | Fix |
| --- | --- | --- |
| Named permanent keyword | `If you have a [Sarfunkel], this Character gains [Blocker].` | Condition without zone noun |
| Stage field presence | `If you have [Merry Go] on your field…` | Named Stage on field |
| Attribute Leader DON | `Give … to your "Slash" attribute Leader` | `attribute` filter on giveDon |
| Reversed give DON | `Give this Leader or 1 of your Characters up to 1 rested DON!!` | Reversed giveDon order |
| Pronoun continuation | `Set … as active. It gains +1000 power…` | Split + previousActionTargets |
| Circled DON cost | `① (You may rest…)` | restDon for ①–⑩ |
| Mixed DON/trait rest | `Rest … DON!! cards or {Animal} or {SMILE} type Characters…` | Mixed-zone target |
| Compound set active | Characters + Leader / Characters + DON!! | Pre-split compound setActive |
| Dual Leader attack | `When this Leader attacks or is attacked…` | Dual triggers + trash-for-power |
| Start of turn narrative | `This effect can be activated at the start of your turn…` | `startOfYourTurn` + optional |
| Total Character cost | `If the total cost of your Characters is 5 or more…` | `zoneValueTotal` + cost-area If peel |
| Life reveal play | `Reveal 1 … Life … "Supernovas" type Character…` | `revealFromLife` trait branch |
| Hand trash by trait | `When a card is trashed … by your "Navy" type card's effect…` | `whenCardsTrashedFromHandByEffect` |
| Rest DON for power | `rest any number of your DON!! cards. For every…` | `restDonForPower` |
| Active DON count | `you have N or less active DON!! cards` | Canonical `activeDonCount` |
| Double `[Trigger]` prefix | `trigger` field already tagged | `joinPrintedAbilityText` strips then re-tags once |
| Diable Jambe Main | `Select … cannot activate [Blocker] if that … attacks` | `grantKeyword` unblockable on selection |
| `[Blocker] Characters` filter | was name/innate keyword | `hasKeyword: blocker`; not innate keyword |
| Event or Stage hand trash | AND category filters | `anyOf` groups |

Tooling:

- `vp run inventory:leaders` — Leader inventory alongside Characters/Events/Stages
- Full inventory regeneration after material parser work
- Parser suite: **100 files / 1230 tests** + `vp check` green

## Maintenance path (post-100%)

1. **New sets**: scrape → generate with `buildCardEffects` → run four inventories;
   fail CI on any empty-parser or mismatch.
2. **Grammar first**: when a new printed family fails, fix the parser + focused
   test before regenerating definitions.
3. **Optional pipeline hardening**:
   - Wire full parse into `normalize()` so scrape never ships keywords-only.
   - Centralize text hygiene (braces, curly quotes, disclaimer tails).
   - Prefer `anyOf.filters` for single-filter trait ORs; keep `groups` for
     multi-filter AND branches.

## Success criteria

- [x] Characters: ≥ 99% exact match (vanillas included as pass) — **100%**
- [x] Events: ≥ 99% exact match — **100%**
- [x] Stages: maintain 100%
- [x] Leaders: ≥ 99% exact match — **100%**
- [x] Zero cards with non-empty printed text and empty `buildCardEffects`
- [x] Inventories regenerated for all four types
- [x] `vp test` + `vp check` green in `tools/op-card-parser`

## Known non-goals (for this track)

- Engine legality / prompt wiring (separate from DSL consistency)
- Perfect official-errata HTML scrape (API text is the current source of truth)
- Multilingual ability DSL (English printed text only)

## Operational commands

```bash
cd submodules/one-piece/tools/op-card-parser
vp test run
vp check
vp run inventory:characters -- --write
vp run inventory:events -- --write
vp run inventory:stages -- --write
vp run inventory:leaders -- --write
vp run audit:character -- OP01-013
vp run audit:event -- OP01-026
vp run audit:stage -- OP02-024
```

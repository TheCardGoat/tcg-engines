# Lorcana Card Common Issues

Use this file to triage broken or misleading card work across all card types.

## False-Green Signals

- The card has a `.test.ts` file, but the file is empty.
- The test file is entirely commented legacy Jest/TestEngine content.
- The test only checks one keyword such as Bodyguard, Support, Ward, or Evasive.
- Client-side success is reported, but authoritative state did not change correctly.
- A generated stub looks complete structurally, but the missing flags are still true.

Treat those as migration debt, not proof that the card is healthy.

## Frequent Failure Modes

- Wrong owner scope: `you`, `opponent`, `each player`, and chooser-relative text were mapped incorrectly.
- The wrong ability type was used:
  - action text authored as activated/item/location logic
  - activated item/location logic authored like post-play action text
- A multi-clause effect was flattened when it needed `sequence`.
- A follow-up clause re-selected a new card instead of reusing `target: { ref: "previous-target" }`.
- `selector: "all"` was authored without `count: "all"`.
- Optional target counts were authored with ad hoc booleans instead of `count: { upTo: N }`.
- Card targets used `filters` instead of `filter`, or a `target-query` used `filter` instead of `filters`.
- A discard effect that needs a chosen hand card omitted `from: "hand"`.
- Under-card or hidden-zone tests used static definitions instead of runtime card identity.
- A generated placeholder was mistaken for a trustworthy implementation.
- A parser/generator gap was mistaken for a one-card authoring problem.
- A runtime gap was papered over in the card file instead of leaving `missingImplementation: true`.
- "May enter play exerted" was modeled as a single ability instead of the required two-ability pattern (static + triggered with `is-exerted` condition).
- Enchanted/epic variants had different abilities than their base card — they should be identical.
- `condition: { type: "is-exerted" }` was omitted on triggered abilities that require the character to be exerted.
- "Counts as named X for Shift" was modeled as a keyword instead of a static `property-modification` effect.
- Trigger `on: "OPPONENT_CHARACTERS"` was confused with `on: "OPPONENT"` (the latter is for player events like discard).

## Card-Type-Specific Traps

### Actions

- Pre-play restrictions or costs were faked as post-play action effects.
- A real modal effect was authored as two unrelated clauses instead of `choice`.
- `or` behavior was authored like free player choice when branch legality should force the remaining option.

### Characters

- Keyword-only tests were mistaken for full ability coverage.
- Triggered ability comments were left in place without any executable Bun test.
- Replacement-like or rules-hook behavior was modeled as a loose static buff with the wrong timing window.

### Items

- Cost timing was wrong because self-banish or discard was modeled inside the effect instead of the activation cost.
- `activateAbility(...)` legality was never checked, so a test only proved that the file compiles.

### Locations

- "While here" behavior was modeled like an action or one-shot effect.
- Character movement assertions checked only board presence, not location membership.

## Triage Order

1. Confirm the printed text and card type.
2. Confirm whether the current file is really implemented or still marked missing.
3. Confirm whether the test file is active, partial, or legacy-only.
4. Compare against a small number of live references from the same card type.
5. Decide whether the problem is:
   - card authoring
   - engine/runtime support
   - generated stub quality
   - placeholder or misleading test coverage
6. Only then edit code.

## What To Trust

- Active Bun tests in mature surfaces:
  - actions
  - locations
  - some items
- Live helper usage in `@tcg/lorcana-engine/testing`
- Semantic matchers such as:
  - `toHaveZoneCounts(...)`
  - `toHaveKeyword(...)`
  - `toBeAtLocation(...)`

## What Not To Trust Blindly

- Commented `LEGACY IMPLEMENTATION` blocks
- Empty numbered `.test.ts` files
- Keyword-smoke tests as full behavior proof
- Optimistic client success on chooser, under-card, or hidden-zone paths
- Generated card stubs that have not been backed by live coverage

## Fast Verification

```bash
rg -n "LEGACY IMPLEMENTATION|It\\.skip|Describe\\.skip" packages/lorcana/lorcana-cards/src/cards/<SET> -g '*.test.ts'
bun test --cwd packages/lorcana/lorcana-cards "./src/cards/<SET>/<TYPE>/<NUMBER>-<card-slug>.test.ts"
bun run --cwd packages/lorcana/lorcana-cards check-types
```

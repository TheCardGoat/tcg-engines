# Lorcana Card Patterns

Use this file as the short companion to [`SKILL.md`](./SKILL.md).

It is a quick-reference matrix, not the full workflow.

## Safest Reference Order

1. The exact card file and test file you are touching.
2. Active examples from the same card type.
3. Current engine helpers and semantic matchers already used by migrated tests.
4. Migration docs that actually exist in `packages/lorcana/lorcana-cards/docs`.

Default maturity order:

- `actions`: safest
- `locations`: also safe
- `items`: mixed
- `characters`: least reliable overall

## Fast Triage

Before using any file as a reference, check:

```bash
rg -n "missingImplementation|missingTests" packages/lorcana/lorcana-cards/src/cards/<SET>
rg -n "LEGACY IMPLEMENTATION|It\\.skip|Describe\\.skip" packages/lorcana/lorcana-cards/src/cards/<SET> -g '*.test.ts'
```

Interpretation:

- active Bun test: good reference
- keyword-smoke-only test: partial reference
- empty `.test.ts`: not coverage
- commented legacy Jest file: historical note only

## Card Definition DSL Reference

### Keyword Helpers (`src/helpers/abilities/`)

Import and use directly in `abilities` arrays:

| Helper | Import | Example |
|--------|--------|---------|
| Rush | `rush` | `abilities: [rush]` |
| Ward | `ward` | `abilities: [ward]` |
| Evasive | `evasive` | `abilities: [evasive]` |
| Bodyguard | `bodyguard` | `abilities: [bodyguard]` |
| Support | `support` | `abilities: [support]` |
| Reckless | `reckless` | `abilities: [reckless]` |
| Alert | `alert` | `abilities: [alert]` |
| Vanish | `vanish` | `abilities: [vanish]` |
| Resist +N | `resist(N)` | `abilities: [resist(1)]` |
| Challenger +N | `challenger(N)` | `abilities: [challenger(3)]` |
| Singer N | `singer(N)` | `abilities: [singer(5)]` |
| Shift N | `shift(N)` | `abilities: [shift(5)]` |
| Shift(target, N) | `shift(target, N)` | `abilities: [shift("Chip or Dale", 5)]` |
| Boost N | `boost(N)` | `abilities: [boost(2)]` |
| Sing Together N | `singTogether(N)` | `abilities: [singTogether(5)]` |

### Ability Type Quick Reference

| `type` | Key Fields | Use When |
|--------|-----------|----------|
| `"keyword"` | `keyword`, `value?`, `cost?` | Keywords (use helpers when possible) |
| `"triggered"` | `trigger`, `effect`, `condition?` | When/Whenever/At triggers |
| `"activated"` | `cost`, `effect`, `restrictions?` | Cost-based abilities ({E}, ink, etc.) |
| `"static"` | `effect`, `condition?` | Continuous/conditional/aura effects |
| `"action"` | `effect`, `alternativeCost?` | Action card effects |
| `"replacement"` | `replaces`, `replacement`, `condition?` | Replace one effect with another |

### Common Trigger Patterns

| Printed Text | `trigger` Value |
|-------------|----------------|
| "When you play this character" | `{ event: "play", on: "SELF", timing: "when" }` |
| "Whenever this character quests" | `{ event: "quest", on: "SELF", timing: "whenever" }` |
| "Whenever this character challenges" | `{ event: "challenge", on: "SELF", timing: "whenever" }` |
| "When this character is banished" | `{ event: "banish", on: "SELF", timing: "when" }` |
| "When this character is banished in a challenge" | `{ event: "banish", on: "SELF", timing: "when", restrictions: [{ type: "in-challenge" }] }` |
| "Whenever another character is banished" | `{ event: "banish", on: "OTHER_CHARACTERS", timing: "whenever" }` |
| "Whenever another character is banished in a challenge" | `{ event: "banish-in-challenge", on: "SELF", timing: "whenever" }` or `{ event: "banish", on: "OTHER_CHARACTERS", timing: "whenever", restrictions: [{ type: "in-challenge" }] }` |
| "Whenever an opposing character challenges" | `{ event: "challenge", on: "OPPONENT_CHARACTERS", timing: "whenever" }` |
| "Whenever you remove damage" | `{ event: "remove-damage", on: "YOU", timing: "whenever" }` |
| "Whenever a character quests while here" | `{ event: "quest", on: "CHARACTERS_HERE", timing: "whenever" }` |
| "Whenever you draw a card" | `{ event: "draw", on: "YOU", timing: "whenever" }` |
| "At the start of your turn" | `{ event: "start-turn", on: "SELF", timing: "at" }` |

### Common Condition Patterns

| Printed Text | `condition` Value |
|-------------|------------------|
| "While this character is exerted" | `{ type: "is-exerted" }` |
| "If you used Shift to play it" | `{ type: "used-shift" }` |
| "If you have no cards in your hand" | `{ type: "resource-count", what: "cards-in-hand", controller: "you", comparison: "equal", value: 0 }` |
| "If a Hero character is in play" | `{ type: "has-character-count", controller: "any", comparison: "greater-or-equal", count: 1, classification: "Hero" }` |
| "If you have another Super character" | `{ type: "has-character-count", controller: "you", comparison: "greater-or-equal", count: 1, classification: "Super", excludeSelf: true }` |
| "If you played a character this turn" | `{ type: "turn-metric", metric: "played-character-with-classification", comparison: { operator: "gte", value: 1 } }` |
| "If you removed damage this turn" | `{ type: "turn-metric", metric: "damage-removed-by-player", comparison: { operator: "gte", value: 1 } }` |
| "While you have a Villain character in play" | `{ type: "has-character-count", controller: "you", comparison: "greater-or-equal", count: 1, classification: "Villain" }` |
| Combined (AND) | `{ type: "and", conditions: [...] }` |
| Combined (OR) | `{ type: "or", conditions: [...] }` |

### Common Effect Patterns

| Printed Text | `effect` Value |
|-------------|---------------|
| "Gain 1 lore" | `{ amount: 1, type: "gain-lore" }` |
| "Deal 2 damage to chosen character" | `{ type: "deal-damage", amount: 2, target: "CHOSEN_CHARACTER" }` |
| "Exert chosen opposing character" | `{ type: "exert", target: { selector: "chosen", count: 1, owner: "opponent", cardTypes: ["character"], zones: ["play"] } }` |
| "Ready chosen character" | `{ type: "ready", target: { selector: "chosen", count: 1, owner: "any", zones: ["play"], cardTypes: ["character"] } }` |
| "Remove up to 2 damage" | `{ type: "remove-damage", amount: 2, target: ..., upTo: true }` |
| "Draw a card" | `{ amount: 1, target: "CONTROLLER", type: "draw" }` |
| "Your characters gain Resist +1" | `{ type: "gain-keyword", keyword: "Resist", value: 1, target: "YOUR_CHARACTERS" }` |
| "Chosen character gains Challenger +3 this turn" | `{ type: "gain-keyword", keyword: "Challenger", value: 3, duration: "this-turn", target: { selector: "chosen", ... } }` |
| "Opponents can't play actions" | `{ type: "restriction", restriction: "cant-play-actions", target: "OPPONENTS" }` |
| "Can't be challenged" | `{ type: "restriction", restriction: "cant-be-challenged", target: ... }` |
| "May enter play exerted" | `{ type: "restriction", restriction: "may-enter-play-exerted", target: "SELF" }` |
| "Counts as named X for Shift" | `{ type: "property-modification", property: "name", operation: "add-alias", value: "Syndrome", target: "SELF" }` |
| "You may [effect]" | `{ type: "optional", chooser: "CONTROLLER", effect: { ... } }` |
| "Do A, then do B" | `{ type: "sequence", steps: [{ ... A }, { ... B }] }` |
| "Gain lore equal to damage removed" | `{ amount: { type: "trigger-amount" }, type: "gain-lore" }` |
| "+2 strength and +1 lore" | `{ type: "sequence", steps: [{ type: "modify-stat", stat: "strength", modifier: 2, target: "SELF" }, { type: "modify-stat", stat: "lore", modifier: 1, target: "SELF" }] }` |

### "May enter play exerted" Pattern

Two abilities: a static allowing the choice + a triggered ability for the benefit:

```ts
abilities: [
  { id: "X-1", name: "NAME", type: "static",
    effect: { type: "restriction", restriction: "may-enter-play-exerted", target: "SELF" } },
  { id: "X-2", name: "NAME", type: "triggered",
    trigger: { event: "play", on: "SELF", timing: "when" },
    condition: { type: "is-exerted" },
    effect: { /* the benefit */ } },
]
```

Reference: `012/characters/078-lord-macguffin-clever-swordsman.ts`

### Enchanted/Epic Variants

Share `canonicalId` with base card. Copy identical abilities. Use `reprints: ["set12-NNN"]` pointing to the base card number.

### Target Reference Shortcuts

- String: `"SELF"`, `"CHOSEN_CHARACTER"`, `"CHOSEN_DAMAGED_CHARACTER"`, `"YOUR_CHARACTERS"`, `"CONTROLLER"`, `"OPPONENTS"`, `"CHARACTERS_HERE"`
- Reference: `{ ref: "previous-target" }`, `{ ref: "selected-first" }`, `{ ref: "attacker" }`, `{ selector: "all", count: 1, reference: "trigger-subject" }`

### Duration Values

`"this-turn"`, `"until-start-of-next-turn"`, `"their-next-turn"`, or omitted for permanent static effects.

## Authoring Patterns By Card Type

### Actions

- Use `abilities: [{ type: "action", effect: ... }]`.
- Prefer built-in effect nodes over ad hoc layering.
- Use `sequence` when clause order matters.
- Use `choice` for true modal selection.
- Use `or` when an illegal branch must fall through to the remaining legal branch.
- Reuse earlier choices with `target: { ref: "previous-target" }`.
- Use `target-query` with `reference: "selected-first"` or `reference: "revealed-first"` when later logic inspects earlier choices.
- Use `count: "all"` with `selector: "all"`.
- Use `count: { upTo: N }` for optional target counts.
- Use `zones: ["limbo"]` plus an `under-parent` filter for under-card work.

### Characters

- Keyword-only cards can stay simple, but do not mistake keyword tests for full behavior coverage.
- Triggered abilities should use current multiplayer flows and authoritative turn sequencing.
- Activated character abilities usually follow the same `activateAbility(...)` test surface as items.
- Static/replacement-like text often needs semantic assertions instead of direct state poking.
- If the file is still a generator stub with `missingImplementation: true`, treat it as backlog, not as style guidance.
- "May enter play exerted" uses two abilities (static + triggered), see pattern above.
- Shift + triggered abilities use `shift(N)` helper plus inline triggered objects.
- "Counts as named X" uses static with `property-modification` effect.
- Conditional stat boosts ("While you have X, gets +Y") use static with condition + modify-stat.
- "Can't be challenged" restrictions use static with condition + `cant-be-challenged`.

### Items

- Default to `type: "activated"` or `type: "triggered"` instead of action-style modeling.
- Model real costs first:
  - `exert`
  - `ink`
  - discard
  - banish self
- Use `activateAbility(...)` tests as the default entry point.
- Assert hand/discard/under-card/hidden-zone effects with authoritative state when needed.

### Locations

- Treat "while here" as a location pattern, not as action text.
- Use location-specific static effects such as granted abilities while at a location.
- Use `toBeAtLocation(...)` when movement is the user-visible behavior.
- Use `activateAbility(...)` for location activations rather than building custom action-like harness code.
- "Whenever a character quests while here" uses `trigger: { event: "quest", on: "CHARACTERS_HERE", timing: "whenever" }`.
- Location effects reference the triggering character via `{ selector: "all", count: 1, reference: "trigger-subject" }`.

## Helper Cheatsheet

### Play-time helpers

- `playCard(...)`
- `playCardWithChoice(...)`
- `playCardWithDestinations(...)`
- `playSong(...)`
- `playSongTogether(...)`

### Pending / responder helpers

- `resolvePendingEffect(...)`
- `respondWith(...)`
- `respondWithChoice(...)`

### Activated ability helper

- `activateAbility(...)`

### When exact card identity matters

- `findCardInstanceId(...)`
- authoritative server access for hidden-zone or facedown assertions

## Assertion Cheatsheet

- Use `toHaveZoneCounts(...)` for hand/deck/discard/play/inkwell changes.
- Use `toHaveKeyword(...)` for temporary or granted keywords.
- Use `toBeAtLocation(...)` for character movement to locations.
- Use direct authoritative card reads for:
  - facedown inkwell cards
  - hidden-zone identity
  - under-card state
  - client/server mismatch suspicion

## Active Example Shapes

Use live examples instead of old comments:

- Action `sequence` + location move + temporary keyword:
  - `src/cards/010/actions/198-the-games-afoot.ts`
- Action choice / responder discard:
  - `src/cards/010/actions/095-trust-in-me.ts`
- Activated location granted ability:
  - `src/cards/010/locations/068-the-great-illuminary-abandoned-laboratory.ts`
- Triggered character `or` branch with legality fallback:
  - `src/cards/011/characters/046-meeko-skittish-scrounger.ts`
- Activated item patterns:
  - inspect live tests under `src/cards/002/items` and `src/cards/005/items`

## Verification

```bash
bun test --cwd packages/lorcana/lorcana-cards "./src/cards/<SET>/<TYPE>/<NUMBER>-<card-slug>.test.ts"
bun run --cwd packages/lorcana/lorcana-cards check-types
```

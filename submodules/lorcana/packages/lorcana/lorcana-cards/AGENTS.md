In this module we only test happy path for the cards and regression that happened with specific interactions.
Testing Edge Cases should be done in packages/lorcana/lorcana-simulator/src/testing

## Card Definition Structure

Every card file exports a typed constant (`CharacterCard`, `ActionCard`, `ItemCard`, `LocationCard`) with a standard shape. Cards that have abilities must have an `abilities` array; vanilla cards (no abilities) use `vanilla: true` instead.

### Finding Missing Cards

A card is "missing" when it has `text` describing abilities but no `abilities` array (and no `vanilla: true`). Find them with:

```bash
# Cards with text but no abilities and no vanilla flag
rg -l 'missingImplementation: true' packages/lorcana/lorcana-cards/src/cards/<SET> --type ts | grep -v '.i18n.ts' | grep -v '.test.ts'
```

Always remove `missingImplementation: true` and `missingTests: true` after adding abilities.

### Keyword Helpers

Simple keyword abilities use helpers from `src/helpers/abilities/`:

```ts
import { rush } from "../../../helpers/abilities/rush";           // Rush
import { ward } from "../../../helpers/abilities/ward";           // Ward
import { evasive } from "../../../helpers/abilities/evasive";     // Evasive
import { bodyguard } from "../../../helpers/abilities/bodyguard"; // Bodyguard
import { support } from "../../../helpers/abilities/support";     // Support
import { reckless } from "../../../helpers/abilities/reckless";   // Reckless
import { alert } from "../../../helpers/abilities/alert";         // Alert
import { vanish } from "../../../helpers/abilities/vanish";       // Vanish
import { resist } from "../../../helpers/abilities/resist";       // Resist +N
import { challenger } from "../../../helpers/abilities/challenger"; // Challenger +N
import { singer } from "../../../helpers/abilities/singer";       // Singer N
import { shift } from "../../../helpers/abilities/shift";         // Shift N or Shift(target, N)
import { boost } from "../../../helpers/abilities/boost";         // Boost N
import { singTogether } from "../../../helpers/abilities/sing-together"; // Sing Together N
```

Parameterized helpers take a number: `resist(1)`, `challenger(3)`, `singer(5)`, `shift(5)`. The `shift` helper has a two-arg overload: `shift("Chip or Dale", 5)` for named shift targets.

### Ability Types

Six ability types, discriminated by `type`:

| `type` | Use When | Key Fields |
|--------|----------|------------|
| `"keyword"` | Simple/parameterized keyword | `keyword`, `value?`, `cost?`, `shiftTarget?` |
| `"triggered"` | When/Whenever/At triggers | `trigger`, `effect`, `condition?` |
| `"activated"` | Cost-based activated abilities | `cost`, `effect`, `restrictions?` |
| `"static"` | Continuous/conditional effects | `effect`, `condition?` |
| `"action"` | Action card one-shot effects | `effect`, `alternativeCost?` |
| `"replacement"` | Replace one effect with another | `replaces`, `replacement`, `condition?` |

### Common Ability Patterns

#### "May enter play exerted" (optional for a benefit)

Two abilities: a static allowing the choice, plus a triggered ability gated on exerted state:

```ts
abilities: [
  {
    id: "XXX-1", name: "ABILITY", type: "static",
    effect: { type: "restriction", restriction: "may-enter-play-exerted", target: "SELF" },
  },
  {
    id: "XXX-2", name: "ABILITY", type: "triggered",
    trigger: { event: "play", on: "SELF", timing: "when" },
    condition: { type: "is-exerted" },
    effect: { /* benefit */ },
  },
]
```

Reference: `012/characters/078-lord-macguffin-clever-swordsman.ts`

#### Shift + Triggered ability

```ts
abilities: [
  shift(5),  // helper
  {
    id: "XXX-1", name: "NAME", type: "triggered",
    trigger: { event: "play", on: "SELF", timing: "when" },
    condition: { type: "used-shift" },  // optional: only if Shift was used
    effect: { ... },
  },
]
```

#### "While this character is exerted" conditional

On triggered abilities: `condition: { type: "is-exerted" }` (self-targeting, applies to trigger source)
On static abilities: `condition: { type: "is-exerted" }` or `condition: { type: "exerted" }`

#### "While you have a [classification] character in play"

```ts
condition: { type: "has-character-count", controller: "you", comparison: "greater-or-equal", count: 1, classification: "Villain" }
// or
condition: { type: "has-character-with-classification", classification: "Hero", controller: "any" }
```

#### "While you have no cards in your hand"

```ts
condition: { type: "resource-count", what: "cards-in-hand", controller: "you", comparison: "equal", value: 0 }
```

#### "Opponents can't play actions"

```ts
effect: { type: "restriction", restriction: "cant-play-actions", target: "OPPONENTS" }
```

#### "Your characters gain [keyword]"

```ts
effect: { type: "gain-keyword", keyword: "Resist", value: 1, target: "YOUR_CHARACTERS" }
```

#### "Counts as being named X for Shift"

```ts
effect: { type: "property-modification", property: "name", operation: "add-alias", value: "Syndrome", target: "SELF" }
```

#### Location "Whenever a character quests while here"

```ts
trigger: { event: "quest", on: "CHARACTERS_HERE", timing: "whenever" }
```

### Trigger Event Reference

Common `event` values: `"play"`, `"banish"`, `"banish-in-challenge"`, `"quest"`, `"challenge"`, `"damage"`, `"exert"`, `"draw"`, `"remove-damage"`, `"ink"`, `"leave-play"`, `"sing"`, `"discard"`

Common `on` values: `"SELF"`, `"YOUR_CHARACTERS"`, `"YOUR_OTHER_CHARACTERS"`, `"OTHER_CHARACTERS"`, `"OPPONENT_CHARACTERS"`, `"OPPONENT"`, `"YOU"`, `"CONTROLLER"`, `"CHARACTERS_HERE"`

### Enchanted/Epic Variants

Enchanted and epic variants are reprints of base cards. They share the same `canonicalId` and should have identical abilities to their base version. Always check if a base version exists and copy its ability structure. The `reprints` array links them.

### Effect Composition

Effects compose via:
- `sequence` — ordered steps (use `steps` array)
- `optional` — "you may" (wrap effect with `chooser: "CONTROLLER"`)
- `choice` — modal selection
- `or` — fallback branches
- `conditional` — if-then
- `forEach` — repeat per count

### Target Shorthand

String targets: `"SELF"`, `"CHOSEN_CHARACTER"`, `"CHOSEN_DAMAGED_CHARACTER"`, `"YOUR_CHARACTERS"`, `"CONTROLLER"`, `"OPPONENTS"`, `"CHARACTERS_HERE"`, `"CHALLENGING_PLAYER"`

Structured targets (for complex filtering):
```ts
target: {
  selector: "chosen",
  count: 1,
  owner: "any" | "you" | "opponent",
  zones: ["play"],
  cardTypes: ["character"],
  filter: [{ type: "has-classification", classification: "Super" }],
  excludeSelf: true,
}
```

Reference targets: `target: { ref: "previous-target" }`, `target: { ref: "selected-first" }`, `target: { ref: "attacker" }`, `target: { ref: "trigger-subject" }` (as `selector: "all", count: 1, reference: "trigger-subject"`)

### Opponent-Chosen Effects (`chosenBy`)

The `chosenBy` field controls **who picks the target** at resolution time. This is separate from `owner`, which controls **whose cards are eligible**.

| `chosenBy` | Who picks | Engine behaviour |
|------------|-----------|-----------------|
| *(omitted)* | Controller | Standard target selection at `resolveBag` / `resolveEffect` time |
| `"opponent"` | Opponent | Controller's bag auto-drains (no click); opponent resolves via `resolveEffect` |
| `"you"` | Controller | Used for effects that address the opponent's resources but let the controller pick (e.g. "each opponent discards a card you choose") |
| `"TARGET"` | The targeted player | Deferred — resolved by whoever is the effect target |

**`chosenBy: "opponent"` (mandatory, opponent picks)** — _Example: Dinky "GET HIM!"_

```ts
effect: {
  type: "deal-damage",
  amount: 1,
  chosenBy: "opponent",          // ← opponent selects which of their characters takes damage
  target: {
    selector: "chosen",
    count: 1,
    owner: "opponent",           // eligible pool: opponent's characters
    zones: ["play"],
    cardTypes: ["character"],
  },
},
```

Engine flow: the triggered ability goes into the bag, but because `chosenBy: "opponent"` defers target selection, `analyzeResolutionRequirements` sets `canAutoResolve = true` for the controller's bag entry. The engine auto-drains it without a controller click, which creates a `pendingEffect` the opponent must resolve with their chosen target.

**`chooser: "OPPONENT"` inside `optional` (cross-chooser optional)** — _Example: Donald Duck "WANT SOME?"_

```ts
effect: {
  type: "optional",
  chooser: "OPPONENT",           // ← opponent decides whether to accept
  effect: {
    type: "draw",
    amount: 1,
    target: "OPPONENT",
  },
},
```

Here the controller must first submit a plain `resolveBag` (no selection required on their part), which creates a `pendingEffect`. The opponent then resolves it and chooses to accept or decline. The simulator suppresses the Accept/Reject buttons on the controller's side because they have nothing to decide.

**Zero-target auto-skip**

If a mandatory or optional effect's `chosen` target slot has zero valid candidates on the current board, the engine automatically skips/declines the effect rather than locking the game waiting for a selection that cannot be made. This applies at both trigger-fire time (bag entry is never created) and bag-decision time (bag entry is drained without a prompt). This means card implementations do not need to add a `condition` guard for the "no valid targets" case.

### Duration Values

`"this-turn"`, `"until-start-of-next-turn"`, `"their-next-turn"`, or omitted for permanent static effects.


### Card Text Field

- Action cards: `text: "plain string"`
- Character/item/location cards: `text: [{ title: "ABILITY NAME" }, { title: "NAME", description: "full text" }]`
- Keyword-only entries use just `{ title: "Rush" }` or `{ title: "<Rush>" }` (angle brackets for keyword emphasis)

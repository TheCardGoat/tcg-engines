# Plan: Fill Out Expected JSON for Card Text Parser Tests

## Overview

Generate expected JSON assertions for each card in a set's test file `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-XXX.test.ts`.

## IMPORTANT: Scope Clarification

**This step is ONLY about generating the expected JSON structure for each card.**

- **DO NOT** remove `it.skip` from tests
- **DO NOT** enable any tests
- **ONLY** add the expected JSON assertions inside each skipped test
- Tests will remain skipped (`it.skip`) after this step is complete

The purpose is to document what the parser _should_ output for each card, so that when the parser is ready, the tests can be enabled.

## Current State

- All tests are currently skipped (`it.skip`) - **keep them skipped**
- Tests only verify that `result.success === true` and `result.abilities.length > 0`
- No validation of the actual parsed ability structure

## Target State

- Tests remain skipped (`it.skip`)
- Each test has the expected JSON assertions added (but not executed)
- Expected JSON documents:
  - `result.abilities.length` expected count
  - Each ability's `type`, `keyword`, `effect`, `trigger`, etc.
  - Named abilities with correct `name` field

---

## Expected JSON Structure Reference

### Parser Return Type

Based on `@tcg/lorcana-types`, the parser returns:

```typescript
interface MultiParseResult {
  success: boolean;
  abilities: AbilityWithText[];
  warnings?: string[];
}

interface AbilityWithText {
  ability: Ability; // KeywordAbility | TriggeredAbility | ActivatedAbility | StaticAbility | ActionAbility
  text?: string;
  name?: string; // Named ability prefix (ALL CAPS)
}
```

### CRITICAL: Accessing Abilities

**The ability object is nested inside `ability` property:**

```typescript
// CORRECT - access via .ability
expect(result.abilities[0].ability).toEqual(...)

// WRONG - this accesses AbilityWithText, not the Ability itself
expect(result.abilities[0]).toEqual(...)
```

---

## Keyword Ability Patterns

### Simple Keywords (no value)

```typescript
import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

// Bodyguard, Support, Rush, Ward, Evasive, Reckless, Alert
const bodyguard: KeywordAbilityDefinition = {
  type: "keyword",
  keyword: "Bodyguard",
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(bodyguard));
```

### Keywords with Value

```typescript
import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

// Challenger +N, Resist +N, Singer N, Boost N
const challenger: KeywordAbilityDefinition = {
  type: "keyword",
  keyword: "Challenger",
  value: 2,
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(challenger));
```

### Shift Keyword (special structure)

```typescript
import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

const shift: KeywordAbilityDefinition = {
  type: "keyword",
  keyword: "Shift",
  cost: { ink: 5 },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));
```

---

## Triggered Ability Patterns

### Common Trigger Events

| Text Pattern                                     | Event Value           |
| ------------------------------------------------ | --------------------- |
| "When you play this character/item"              | `play`                |
| "Whenever this character quests"                 | `quest`               |
| "Whenever this character challenges"             | `challenge`           |
| "When this character is challenged"              | `challenged`          |
| "When this character is banished"                | `banish`              |
| "When this character is banished in a challenge" | `banish-in-challenge` |
| "When this character leaves play"                | `leave-play`          |
| "At the start of your turn"                      | `start-of-turn`       |
| "At the end of your turn"                        | `end-of-turn`         |
| "Whenever you put a card under this character"   | `put-card-under`      |
| "Whenever you move a character"                  | `move`                |
| "Whenever an opponent draws a card"              | `draw`                |
| "Whenever you put a card into your inkwell"      | `put-into-inkwell`    |

### Trigger Timing

| Text Pattern          | Timing Value |
| --------------------- | ------------ |
| "When..."             | `when`       |
| "Whenever..."         | `whenever`   |
| "At the start/end..." | `at`         |

### Trigger Subject (on)

| Text Pattern             | On Value              |
| ------------------------ | --------------------- |
| "this character"         | `SELF`                |
| "one of your characters" | `YOUR_CHARACTERS`     |
| "another character"      | `OTHER_CHARACTERS`    |
| "an opposing character"  | `OPPOSING_CHARACTERS` |

### Example Triggered Ability

```typescript
import type { TriggeredAbilityDefinition } from "@tcg/lorcana-types";

const abilityName: TriggeredAbilityDefinition = {
  type: "triggered",
  name: "ABILITY_NAME",
  trigger: {
    event: "play",
    timing: "when",
    on: "SELF",
  },
  effect: {
    type: "draw",
    amount: 1,
    target: "CONTROLLER",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(abilityName));
```

---

## Static Ability Patterns

Static abilities provide continuous effects while in play.

### Common Static Effects

- `modify-stat` - Strength/Willpower/Lore modifications
- `restriction` - Can't quest, can't ready, can't be dealt damage, etc.
- `gain-keyword` - Grants keywords to characters
- `cost-reduction` - Reduces costs to play cards
- `property-modification` - Grants classifications or name aliases
- `grant-ability` - Grants activated abilities to characters

### Example Static Abilities

```typescript
import type { StaticAbilityDefinition } from "@tcg/lorcana-types";

// Stat modifier
const highEnergy: StaticAbilityDefinition = {
  type: "static",
  name: "HIGH ENERGY",
  effect: {
    type: "modify-stat",
    stat: "strength",
    modifier: 1,
    target: "SELF",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(highEnergy));

// Restriction (common: STONE BY DAY)
const stoneByDay: StaticAbilityDefinition = {
  type: "static",
  name: "STONE BY DAY",
  effect: {
    type: "restriction",
    restriction: "cant-ready",
    target: "SELF",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(stoneByDay));

// Grants keyword
const standFast: StaticAbilityDefinition = {
  type: "static",
  name: "STAND FAST",
  effect: {
    type: "gain-keyword",
    keyword: "Resist",
    value: 1,
    target: "SELF",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(standFast));
```

---

## Activated Ability Patterns

### Cost Structure

```typescript
import type { AbilityCost } from "@tcg/lorcana-types";

const cost: AbilityCost = {
  ink: 1, // {I} cost
  exert: true, // {E} - exert this card
  banishSelf: true, // "Banish this item/character"
};
```

### Example Activated Ability

```typescript
import type { ActivatedAbilityDefinition } from "@tcg/lorcana-types";

const wildRage: ActivatedAbilityDefinition = {
  type: "activated",
  name: "WILD RAGE",
  cost: {
    ink: 1,
    exert: true,
  },
  effect: {
    type: "ready",
    target: "SELF",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(wildRage));
```

---

## Action Ability Patterns

Action cards have a single action ability with their effect.

```typescript
import type { ActionAbilityDefinition } from "@tcg/lorcana-types";

// Simple action
const banishAction: ActionAbilityDefinition = {
  type: "action",
  effect: {
    type: "banish",
    target: "CHOSEN_CHARACTER",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(banishAction));

// Compound action (multiple effects)
const compoundAction: ActionAbilityDefinition = {
  type: "action",
  effect: {
    type: "sequence",
    effects: [
      { type: "draw", amount: 1, target: "CONTROLLER" },
      { type: "gain-lore", amount: 1 },
    ],
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(compoundAction));
```

---

## Common Effect Types

| Effect             | Description           | Example Text                        |
| ------------------ | --------------------- | ----------------------------------- |
| `draw`             | Draw cards            | "draw a card"                       |
| `deal-damage`      | Deal damage to target | "deal 2 damage to chosen character" |
| `put-damage`       | Put damage counters   | "put 1 damage counter on each..."   |
| `remove-damage`    | Remove damage         | "remove up to 3 damage"             |
| `move-damage`      | Move damage counters  | "move all damage counters from..."  |
| `gain-lore`        | Gain lore             | "gain 2 lore"                       |
| `lose-lore`        | Opponent loses lore   | "each opponent loses 1 lore"        |
| `exert`            | Exert a character     | "exert chosen character"            |
| `ready`            | Ready a character     | "ready chosen character"            |
| `banish`           | Banish a card         | "banish chosen character"           |
| `return-to-hand`   | Return to hand        | "return a card to your hand"        |
| `modify-stat`      | Modify stats          | "gets +2 strength"                  |
| `gain-keyword`     | Grant keyword         | "gains Rush this turn"              |
| `restriction`      | Apply restriction     | "can't quest this turn"             |
| `look-at-top`      | Look at top cards     | "look at the top 4 cards"           |
| `put-into-inkwell` | Put into inkwell      | "put into your inkwell"             |
| `play-card`        | Play a card           | "play a character for free"         |
| `compound`         | Multiple effects      | Complex multi-part effects          |

---

## Recurring Named Abilities

These ability names appear on multiple cards:

| Name            | Type      | Effect                                  | Found On             |
| --------------- | --------- | --------------------------------------- | -------------------- |
| `STONE BY DAY`  | static    | `restriction: cant-ready` (conditional) | Gargoyle characters  |
| Named triggered | triggered | Various                                 | Most character cards |

---

## File to Modify

`packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-XXX.test.ts`

## Verification

After implementation:

```bash
bun test packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-XXX.test.ts
```

Expected output: All tests skip, 0 fail.

---

## Task Organization

Organize work by ink color sections:

1. **Amber** - Characters, Actions, Items, Locations
2. **Amethyst** - Characters, Actions, Items, Locations
3. **Emerald** - Characters, Actions, Items, Locations
4. **Ruby** - Characters, Actions, Items, Locations
5. **Sapphire** - Characters, Actions, Items, Locations
6. **Steel** - Characters, Actions, Items, Locations

---

## Execution Steps

**IMPORTANT: Keep all tests as `it.skip` - do NOT remove the skip!**

For each card:

1. **Keep `it.skip`** - Tests remain skipped
2. **Analyze the card text** to determine expected ability structure
3. **Add expected ability count assertion**: `expect(result.abilities.length).toBe(N)`
4. **Add detailed ability structure assertions** for each ability using `result.abilities[X].ability`
5. **Add `name` assertions** for named abilities (ALL CAPS prefix)

### Example of a completed test (still skipped):

```typescript
import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

it.skip("Baloo - Friend and Guardian: should parse card text", () => {
  const text = "Bodyguard...\nSupport...";
  const result = parseAbilityTextMulti(text);

  expect(result.success).toBe(true);
  expect(result.abilities.length).toBe(2);

  // First ability: Bodyguard
  const bodyguard: KeywordAbilityDefinition = {
    type: "keyword",
    keyword: "Bodyguard",
  };
  expect(result.abilities[0].ability).toEqual(expect.objectContaining(bodyguard));

  // Second ability: Support
  const support: KeywordAbilityDefinition = {
    type: "keyword",
    keyword: "Support",
  };
  expect(result.abilities[1].ability).toEqual(expect.objectContaining(support));
});
```

### Complex Example with Multiple Ability Types

```typescript
import type { KeywordAbilityDefinition, TriggeredAbilityDefinition } from "@tcg/lorcana-types";

it.skip("Scrooge McDuck - Cavern Prospector: should parse card text", () => {
  const text =
    "Shift 4 {I}...\nSPECULATION Whenever you play a character or location with Boost...";
  const result = parseAbilityTextMulti(text);

  expect(result.success).toBe(true);
  expect(result.abilities.length).toBe(2);

  // First ability: Shift 4
  const shift: KeywordAbilityDefinition = {
    type: "keyword",
    keyword: "Shift",
    cost: { ink: 4 },
  };
  expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

  // Second ability: SPECULATION (triggered)
  const speculation: TriggeredAbilityDefinition = {
    type: "triggered",
    name: "SPECULATION",
    trigger: {
      event: "play",
      timing: "whenever",
      on: "YOUR_CHARACTERS",
    },
    effect: {
      type: "draw",
      amount: 1,
      target: "CONTROLLER",
    },
  };
  expect(result.abilities[1].ability).toEqual(expect.objectContaining(speculation));
});
```

---

## Tips from Implementation Experience

1. **Always use `.ability`** - Access `result.abilities[X].ability`, not `result.abilities[X]`

2. **Use typed ability definitions** - Import types from `@tcg/lorcana-types` for compile-time validation

3. **Use `expect.objectContaining`** - Wrap your typed ability in `expect.objectContaining()` to allow extra properties

4. **Comments help** - Add a comment before each ability assertion explaining what it is

5. **Compound effects** - When a card does multiple things in sequence, use `type: "compound"`

6. **Conditional abilities** - Many abilities have conditions ("if you have...", "while...") - these are still the same ability type, just with a condition

7. **"During your turn"** - This is a timing restriction on the trigger, not a separate ability

8. **"Once per turn"** - This is a usage restriction, affects the ability but doesn't change its type

9. **Named abilities** - The ALL CAPS prefix before the ability text becomes the `name` field

10. **Dual triggers** - "When you play this character and whenever she quests" is ONE ability with dual triggers

11. **Modal effects** - "Choose one:" creates a single ability with modal effect options

---

## IMPORTANT: Type-Safe Assertion Style

### Use Typed Ability Definitions (PREFERRED)

Define expected abilities using `AbilityDefinition` types from `@tcg/lorcana-types`. This provides **compile-time type checking** - if the ability structure is wrong, TypeScript will catch it before the test runs.

```typescript
import type { ActivatedAbilityDefinition } from "@tcg/lorcana-types";

const wildRage: ActivatedAbilityDefinition = {
  type: "activated",
  name: "WILD RAGE",
  cost: {
    ink: 1,
    exert: true,
  },
  effect: {
    type: "ready",
    target: "SELF",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(wildRage));
```

**Benefits:**

- **Type safety** - TypeScript validates the structure at compile time
- **Cleaner tests** - Define the ability once, use in assertion
- **Immediate feedback** - Wrong structures are caught before running tests
- **Self-documenting** - The type annotation shows exactly what kind of ability it is

### Available Ability Definition Types

Import from `@tcg/lorcana-types`:

| Type                           | Use For                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `KeywordAbilityDefinition`     | Rush, Ward, Bodyguard, Challenger +N, Shift, Singer, etc. |
| `TriggeredAbilityDefinition`   | "When you play...", "Whenever this character quests..."   |
| `ActivatedAbilityDefinition`   | "{E} - Draw a card", "2 {I} - Deal 3 damage..."           |
| `StaticAbilityDefinition`      | "Your characters gain Ward", "This character can't quest" |
| `ActionAbilityDefinition`      | Action card effects                                       |
| `ReplacementAbilityDefinition` | "If this character would be dealt damage..."              |
| `AbilityDefinition`            | Union of all above (when type varies)                     |

### Type-Safe Examples

#### Keyword ability

```typescript
import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

const bodyguard: KeywordAbilityDefinition = {
  type: "keyword",
  keyword: "Bodyguard",
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(bodyguard));
```

#### Keyword with value

```typescript
import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

const singer: KeywordAbilityDefinition = {
  type: "keyword",
  keyword: "Singer",
  value: 5,
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(singer));
```

#### Shift keyword

```typescript
import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

const shift: KeywordAbilityDefinition = {
  type: "keyword",
  keyword: "Shift",
  cost: { ink: 6 },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));
```

#### Triggered ability

```typescript
import type { TriggeredAbilityDefinition } from "@tcg/lorcana-types";

const castMySpell: TriggeredAbilityDefinition = {
  type: "triggered",
  name: "CAST MY SPELL!",
  trigger: {
    event: "play",
    timing: "when",
    on: "SELF",
  },
  effect: {
    type: "optional",
    effect: {
      type: "draw",
      amount: 1,
      target: "CONTROLLER",
    },
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(castMySpell));
```

#### Activated ability

```typescript
import type { ActivatedAbilityDefinition } from "@tcg/lorcana-types";

const quickShot: ActivatedAbilityDefinition = {
  type: "activated",
  name: "QUICK SHOT",
  cost: {
    exert: true,
    ink: 2,
  },
  effect: {
    type: "deal-damage",
    amount: 1,
    target: "CHOSEN_CHARACTER",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(quickShot));
```

#### Static ability

```typescript
import type { StaticAbilityDefinition } from "@tcg/lorcana-types";

const allForOne: StaticAbilityDefinition = {
  type: "static",
  name: "ALL FOR ONE",
  effect: {
    type: "modify-stat",
    stat: "strength",
    modifier: 1,
    target: "YOUR_CHARACTERS",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(allForOne));
```

#### Action ability

```typescript
import type { ActionAbilityDefinition } from "@tcg/lorcana-types";

const drawCards: ActionAbilityDefinition = {
  type: "action",
  effect: {
    type: "draw",
    amount: 2,
    target: "CONTROLLER",
  },
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(drawCards));
```

---

## Alternative: Inline `expect.objectContaining` (Legacy - DO NOT USE)

**IMPORTANT FOR AI AGENTS: Always use the type-safe approach with typed ability definitions. Do NOT use inline objects.**

The inline `expect.objectContaining` pattern is deprecated and should only be seen in legacy tests that haven't been migrated yet:

```typescript
// ❌ LEGACY - Do not use this pattern in new tests
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "keyword",
    keyword: "Bodyguard",
  }),
);

// ✅ CORRECT - Always use typed definitions
import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";

const bodyguard: KeywordAbilityDefinition = {
  type: "keyword",
  keyword: "Bodyguard",
};

expect(result.abilities[0].ability).toEqual(expect.objectContaining(bodyguard));
```

### DO NOT use single assertions (anti-pattern)

```typescript
// ❌ BAD - Fragile, verbose, hard to read
const ability = result.abilities[0]?.ability as any;
expect(ability?.type).toBe("triggered");
expect(ability?.name).toBe("WELL OF SOULS");
expect(ability?.trigger?.event).toBe("play");
```

Problems:

- Requires `as any` type casting
- Uses optional chaining (`?.`) which can mask errors
- Multiple assertions don't clearly show the expected structure

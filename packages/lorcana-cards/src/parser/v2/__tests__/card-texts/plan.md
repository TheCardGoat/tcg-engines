# Plan: Fill Out Expected JSON for Card Text Parser Tests

## Overview

Generate expected JSON assertions for each card in a set's test file `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-XXX.test.ts`.

## IMPORTANT: Scope Clarification

**This step is ONLY about generating the expected JSON structure for each card.**

- **DO NOT** remove `it.skip` from tests
- **DO NOT** enable any tests
- **ONLY** add the expected JSON assertions inside each skipped test
- Tests will remain skipped (`it.skip`) after this step is complete

The purpose is to document what the parser *should* output for each card, so that when the parser is ready, the tests can be enabled.

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
  ability: Ability;  // KeywordAbility | TriggeredAbility | ActivatedAbility | StaticAbility | ActionAbility
  text: string;
  name?: string;     // Named ability prefix (ALL CAPS)
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
// Bodyguard, Support, Rush, Ward, Evasive, Reckless, Alert
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "keyword",
    keyword: "Bodyguard",
  }),
);
```

### Keywords with Value
```typescript
// Challenger +N, Resist +N, Singer N, Boost N
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "keyword",
    keyword: "Challenger",
    value: 2,
  }),
);
```

### Shift Keyword (special structure)
```typescript
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "keyword",
    keyword: "Shift",
    cost: expect.objectContaining({
      ink: 5,
    }),
  }),
);
```

---

## Triggered Ability Patterns

### Common Trigger Events
| Text Pattern | Event Value |
|--------------|-------------|
| "When you play this character/item" | `play` |
| "Whenever this character quests" | `quest` |
| "Whenever this character challenges" | `challenge` |
| "When this character is challenged" | `challenged` |
| "When this character is banished" | `banish` |
| "When this character is banished in a challenge" | `banish-in-challenge` |
| "When this character leaves play" | `leave-play` |
| "At the start of your turn" | `start-of-turn` |
| "At the end of your turn" | `end-of-turn` |
| "Whenever you put a card under this character" | `put-card-under` |
| "Whenever you move a character" | `move` |
| "Whenever an opponent draws a card" | `draw` |
| "Whenever you put a card into your inkwell" | `put-into-inkwell` |

### Trigger Timing
| Text Pattern | Timing Value |
|--------------|--------------|
| "When..." | `when` |
| "Whenever..." | `whenever` |
| "At the start/end..." | `at` |

### Trigger Subject (on)
| Text Pattern | On Value |
|--------------|----------|
| "this character" | `SELF` |
| "one of your characters" | `YOUR_CHARACTERS` |
| "another character" | `OTHER_CHARACTERS` |
| "an opposing character" | `OPPOSING_CHARACTERS` |

### Example Triggered Ability
```typescript
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "triggered",
    name: "ABILITY_NAME",
    trigger: expect.objectContaining({
      event: "play",
      timing: "when",
      on: "SELF",
    }),
    effect: expect.objectContaining({
      type: "draw",
      amount: 1,
    }),
  }),
);
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
// Stat modifier
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "static",
    name: "HIGH ENERGY",
    effect: expect.objectContaining({
      type: "modify-stat",
      stat: "strength",
      modifier: 1,
    }),
  }),
);

// Restriction (common: STONE BY DAY)
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "static",
    name: "STONE BY DAY",
    effect: expect.objectContaining({
      type: "restriction",
      restriction: "cant-ready",
    }),
  }),
);

// Grants keyword
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "static",
    name: "STAND FAST",
    effect: expect.objectContaining({
      type: "gain-keyword",
      keyword: "Resist",
      value: 1,
    }),
  }),
);
```

---

## Activated Ability Patterns

### Cost Structure
```typescript
cost: expect.objectContaining({
  ink: 1,           // {I} cost
  exert: true,      // {E} - exert this card
  banishSelf: true, // "Banish this item/character"
})
```

### Example Activated Ability
```typescript
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "activated",
    name: "WILD RAGE",
    cost: expect.objectContaining({
      ink: 1,
      exert: true,
    }),
    effect: expect.objectContaining({
      type: "ready",
    }),
  }),
);
```

---

## Action Ability Patterns

Action cards have a single action ability with their effect.

```typescript
// Simple action
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "action",
    effect: expect.objectContaining({
      type: "banish",
    }),
  }),
);

// Compound action (multiple effects)
expect(result.abilities[0].ability).toEqual(
  expect.objectContaining({
    type: "action",
    effect: expect.objectContaining({
      type: "compound",
    }),
  }),
);
```

---

## Common Effect Types

| Effect | Description | Example Text |
|--------|-------------|--------------|
| `draw` | Draw cards | "draw a card" |
| `deal-damage` | Deal damage to target | "deal 2 damage to chosen character" |
| `put-damage` | Put damage counters | "put 1 damage counter on each..." |
| `remove-damage` | Remove damage | "remove up to 3 damage" |
| `move-damage` | Move damage counters | "move all damage counters from..." |
| `gain-lore` | Gain lore | "gain 2 lore" |
| `lose-lore` | Opponent loses lore | "each opponent loses 1 lore" |
| `exert` | Exert a character | "exert chosen character" |
| `ready` | Ready a character | "ready chosen character" |
| `banish` | Banish a card | "banish chosen character" |
| `return-to-hand` | Return to hand | "return a card to your hand" |
| `modify-stat` | Modify stats | "gets +2 strength" |
| `gain-keyword` | Grant keyword | "gains Rush this turn" |
| `restriction` | Apply restriction | "can't quest this turn" |
| `look-at-top` | Look at top cards | "look at the top 4 cards" |
| `put-into-inkwell` | Put into inkwell | "put into your inkwell" |
| `play-card` | Play a card | "play a character for free" |
| `compound` | Multiple effects | Complex multi-part effects |

---

## Recurring Named Abilities

These ability names appear on multiple cards:

| Name | Type | Effect | Found On |
|------|------|--------|----------|
| `STONE BY DAY` | static | `restriction: cant-ready` (conditional) | Gargoyle characters |
| Named triggered | triggered | Various | Most character cards |

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
it.skip("Baloo - Friend and Guardian: should parse card text", () => {
  const text = "Bodyguard...\nSupport...";
  const result = parseAbilityTextMulti(text);

  expect(result.success).toBe(true);
  expect(result.abilities.length).toBe(2);

  // First ability: Bodyguard
  expect(result.abilities[0].ability).toEqual(
    expect.objectContaining({
      type: "keyword",
      keyword: "Bodyguard",
    }),
  );

  // Second ability: Support
  expect(result.abilities[1].ability).toEqual(
    expect.objectContaining({
      type: "keyword",
      keyword: "Support",
    }),
  );
});
```

### Complex Example with Multiple Ability Types

```typescript
it.skip("Scrooge McDuck - Cavern Prospector: should parse card text", () => {
  const text =
    "Shift 4 {I}...\nSPECULATION Whenever you play a character or location with Boost...";
  const result = parseAbilityTextMulti(text);

  expect(result.success).toBe(true);
  expect(result.abilities.length).toBe(2);

  // First ability: Shift 4
  expect(result.abilities[0].ability).toEqual(
    expect.objectContaining({
      type: "keyword",
      keyword: "Shift",
      cost: expect.objectContaining({
        ink: 4,
      }),
    }),
  );

  // Second ability: SPECULATION (triggered)
  expect(result.abilities[1].ability).toEqual(
    expect.objectContaining({
      type: "triggered",
      name: "SPECULATION",
      trigger: expect.objectContaining({
        event: "play",
        timing: "whenever",
      }),
      effect: expect.objectContaining({
        type: "draw",
        amount: 1,
      }),
    }),
  );
});
```

---

## Tips from Implementation Experience

1. **Always use `.ability`** - Access `result.abilities[X].ability`, not `result.abilities[X]`

2. **Use `expect.objectContaining`** for flexibility - Don't assert every field, focus on key properties

3. **Comments help** - Add a comment before each ability assertion explaining what it is

4. **Compound effects** - When a card does multiple things in sequence, use `type: "compound"`

5. **Conditional abilities** - Many abilities have conditions ("if you have...", "while...") - these are still the same ability type, just with a condition

6. **"During your turn"** - This is a timing restriction on the trigger, not a separate ability

7. **"Once per turn"** - This is a usage restriction, affects the ability but doesn't change its type

8. **Named abilities** - The ALL CAPS prefix before the ability text becomes the `name` field

9. **Dual triggers** - "When you play this character and whenever she quests" is ONE ability with dual triggers

10. **Modal effects** - "Choose one:" creates a single ability with modal effect options

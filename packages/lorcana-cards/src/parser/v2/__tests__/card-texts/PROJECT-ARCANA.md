---
name: Fluent Ability Helpers
overview: Create a fluent builder API for Lorcana abilities and effects that improves type safety, removes OptionalEffect in favor of an `optional` flag, and makes writing ability definitions more readable and maintainable.
todos:
  - id: add-optional-flag
    content: "Add `optional?: boolean` to base effect interface in combined-types.ts"
    status: pending
  - id: update-gain-keyword-effect
    content: Update GainKeywordEffect to accept KeywordAbility instead of string for type safety
    status: pending
  - id: deprecate-optional-effect
    content: Mark OptionalEffect as deprecated in control-flow.ts
    status: pending
  - id: create-trigger-builders
    content: Create trigger-builders.ts with Triggers namespace (Play, Quest, Challenge, etc.)
    status: pending
  - id: create-effect-builders
    content: Create effect-builders.ts with Effects namespace (Draw, Banish, DealDamage, etc.)
    status: pending
  - id: create-target-builders
    content: Create target-builders.ts with CardTargets and PlayerTargets namespaces
    status: pending
  - id: create-cost-builders
    content: Create cost-builders.ts with Costs namespace (Exert, Ink, ExertAndInk, etc.)
    status: pending
  - id: create-condition-builders
    content: Create condition-builders.ts with Conditions namespace
    status: pending
  - id: create-ability-builders
    content: Create ability-builders.ts with TriggeredAbility, ActivatedAbility, StaticAbility, ActionAbility functions
    status: pending
  - id: create-keyword-builders
    content: Create keyword-builders.ts with Keywords namespace (Rush, Ward, Challenger, Shift, etc.)
    status: pending
  - id: create-builders-index
    content: Create builders/index.ts to re-export all builders
    status: pending
  - id: update-main-exports
    content: Update abilities/index.ts and main index.ts to export builders
    status: pending
  - id: add-jsdoc-examples
    content: Add comprehensive JSDoc documentation with examples to all builders
    status: pending
isProject: false
---

# Fluent Ability Helpers for Lorcana Type System

## Project Arcana

**Codename:** Project Arcana

**Status:** Planning Phase

**Target Directory:** `packages/lorcana-types/src/abilities/builders/`

This initiative aims to transform the Lorcana ability type system into a fluent, composable API that prioritizes developer experience and type safety.

## Goal

Transform verbose ability definitions into a fluent, type-safe API that:

1. Removes `OptionalEffect` wrapper in favor of an `optional: boolean` flag on effects
2. Provides builder functions for triggers, effects, and targets
3. Maintains full type safety with TypeScript inference
4. Makes test assertions more readable and maintainable

## Current State Analysis

The existing type system in [`packages/lorcana-types/src/abilities/`](packages/lorcana-types/src/abilities/) already has some builder functions:

- `triggered()`, `activated()`, `staticAbility()`, `actionAbility()` in `ability-types.ts`
- `COMMON_TRIGGERS` constants in `trigger-types.ts`
- Various condition builders in `condition-types.ts`

However, the current approach has issues:

- `OptionalEffect` wraps effects, adding nesting complexity
- No fluent builders for effects or targets
- Trigger builders are limited to constants, not composable functions

## Proposed Architecture

### File Structure

```
packages/lorcana-types/src/abilities/
├── builders/
│   ├── index.ts              # Re-exports all builders
│   ├── ability-builders.ts   # TriggeredAbility(), ActivatedAbility(), etc.
│   ├── trigger-builders.ts   # Triggers.Play(), Triggers.Quest(), etc.
│   ├── effect-builders.ts    # Effects.Draw(), Effects.Banish(), etc.
│   ├── target-builders.ts    # CardTargets.Self(), PlayerTargets.Controller(), etc.
│   └── timing-builders.ts    # Timings.When(), Timings.Whenever(), etc.
```

### Key Design Decisions

1. **Remove OptionalEffect type** - Add `optional?: boolean` to base effect interface
2. **Namespace-based API** - Use `Triggers.`, `Effects.`, `Targets.` namespaces
3. **Infer types from usage** - Builders return properly typed objects
4. **Backward compatible** - Existing raw object syntax still works

## API Examples

### Before (Current)

```typescript
const heroism: TriggeredAbilityDefinition = {
  type: "triggered",
  name: "HEROISM",
  trigger: {
    event: "banish-in-challenge",
    timing: "when",
    on: "SELF",
  },
  effect: {
    type: "optional",
    effect: {
      type: "banish",
      target: "CHALLENGED_CHARACTER",
    },
  },
};
```

### After (Fluent API)

```typescript
const heroism = TriggeredAbility({
  name: "HEROISM",
  trigger: Triggers.BanishInChallenge({ on: "SELF" }),
  effect: Effects.Banish({
    target: "CHALLENGED_CHARACTER",
    optional: true,
  }),
});
```

### More Examples

**Keyword Abilities:**

```typescript
// Simple keyword
const rush = Keywords.Rush();
const bodyguard = Keywords.Bodyguard();

// Parameterized keyword
const challenger = Keywords.Challenger(3);
const resist = Keywords.Resist(2, { condition: Conditions.InChallenge() });

// Shift
const shift = Keywords.Shift(5);
const shiftOnto = Keywords.Shift(4, { target: "Elsa" });
```

**Triggered Abilities:**

```typescript
// When you play this character, draw 2 cards
const playDraw = TriggeredAbility({
  trigger: Triggers.Play({ on: "SELF" }),
  effect: Effects.Draw({ amount: 2, target: Targets.Controller() }),
});

// Whenever this character quests, you may gain 1 lore
const questLore = TriggeredAbility({
  trigger: Triggers.Quest({ on: "SELF" }),
  effect: Effects.GainLore({ amount: 1, target: Targets.Controller(), optional: true }),
});

// At the start of your turn, deal 1 damage to each opposing character
const startTurnDamage = TriggeredAbility({
  trigger: Triggers.StartOfTurn(),
  effect: Effects.DealDamage({
    amount: 1,
    target: Targets.AllOpposingCharacters(),
  }),
});
```

**Activated Abilities:**

```typescript
// {E} - Draw a card
const exertDraw = ActivatedAbility({
  cost: Costs.Exert(),
  effect: Effects.Draw({ amount: 1, target: Targets.Controller() }),
});

// {E}, 2{I} - Deal 3 damage to chosen character
const exertInkDamage = ActivatedAbility({
  cost: Costs.ExertAndInk(2),
  effect: Effects.DealDamage({
    amount: 3,
    target: Targets.ChosenCharacter(),
  }),
});
```

**Static Abilities:**

```typescript
// Your characters gain Ward
const grantWard = StaticAbility({
  effect: Effects.GainKeyword({
    keyword: Keywords.Ward(),
    target: Targets.YourCharacters(),
  }),
});

// Your characters gain Challenger +2
const grantChallenger = StaticAbility({
  effect: Effects.GainKeyword({
    keyword: Keywords.Challenger(2),
    target: Targets.YourCharacters(),
  }),
});

// While this character has no damage, it gets +2 strength
const conditionalStrength = StaticAbility({
  condition: Conditions.NoDamage(),
  effect: Effects.ModifyStat({
    stat: "strength",
    modifier: 2,
    target: Targets.Self(),
  }),
});
```

**Target Builders:**

```typescript
// Character targets
const self = Targets.Self();
const chosenCharacter = Targets.ChosenCharacter();
const chosenOpposingCharacter = Targets.ChosenOpposingCharacter();
const yourCharacters = Targets.YourCharacters();
const allOpposingCharacters = Targets.AllOpposingCharacters();
const yourOtherCharacters = Targets.YourOtherCharacters();

// Player targets
const controller = Targets.Controller();
const opponent = Targets.Opponent();
const eachOpponent = Targets.EachOpponent();
const allPlayers = Targets.AllPlayers();

// Complex targets with filters
const chosenDamagedCharacter = Targets.ChosenCharacter({
  filter: [{ type: "damaged" }],
});

const yourExertedCharacters = Targets.YourCharacters({
  filter: [{ type: "exerted" }],
});

const chosenCharacterWithCost3OrLess = Targets.ChosenCharacter({
  filter: [{ type: "cost-comparison", comparison: "less-or-equal", value: 3 }],
});
```

**Sequence Effects:**

```typescript
// Draw 2 cards, then discard a card
const drawThenDiscard = Effects.Sequence([
  Effects.Draw({ amount: 2, target: Targets.Controller() }),
  Effects.Discard({ amount: 1, target: Targets.Controller(), chosenBy: "you" }),
]);
```

**Conditional Effects:**

```typescript
// If you have a character named Elsa, draw a card
const conditionalDraw = Effects.Conditional({
  condition: Conditions.HasCharacterNamed("Elsa"),
  then: Effects.Draw({ amount: 1, target: Targets.Controller() }),
});
```

**Choice Effects:**

```typescript
// Choose one: Draw a card OR Deal 2 damage
const chooseOne = Effects.Choice([
  Effects.Draw({ amount: 1, target: Targets.Controller() }),
  Effects.DealDamage({ amount: 2, target: Targets.ChosenCharacter() }),
]);
```

## Type Changes

### GainKeywordEffect Type Modification

The `GainKeywordEffect` will be updated to accept keyword objects from the `Keywords` namespace instead of raw strings. This provides type safety and ensures only valid keywords can be used.

```typescript
// Before
export interface GainKeywordEffect extends BaseEffect {
  type: "gain-keyword";
  keyword: string; // Any string allowed
  value?: number;
  target: CharacterTarget;
  duration?: EffectDuration;
}

// After
export interface GainKeywordEffect extends BaseEffect {
  type: "gain-keyword";
  keyword: KeywordAbility; // Only valid keyword abilities
  target: CharacterTarget;
  duration?: EffectDuration;
}
```

This change means:

- `Effects.GainKeyword({ keyword: Keywords.Ward(), target: "YOUR_CHARACTERS" })` ✅
- `Effects.GainKeyword({ keyword: Keywords.Challenger(2), target: "YOUR_CHARACTERS" })` ✅
- `Effects.GainKeyword({ keyword: "Ward", target: "YOUR_CHARACTERS" })` ❌ (type error)

### Effect Base Type Modification

```typescript
// In effect-types/combined-types.ts
interface BaseEffect {
  /** If true, the player may choose not to apply this effect */
  optional?: boolean;
}

// All effect types extend BaseEffect
export interface DrawEffect extends BaseEffect {
  type: "draw";
  amount?: Amount;
  target?: PlayerTarget;
}
```

### Deprecate OptionalEffect

```typescript
/**
 * @deprecated Use `optional: true` on the effect instead
 * Will be removed in next major version
 */
export interface OptionalEffect {
  type: "optional";
  effect?: Effect;
  chooser?: PlayerTarget;
}
```

## Implementation Tasks

1. **Modify effect types** - Add `optional?: boolean` to base effect interface
2. **Create builder modules** - Implement all builder functions
3. **Update exports** - Export builders from main index
4. **Add deprecation** - Mark `OptionalEffect` as deprecated
5. **Update tests** - Migrate existing tests to use new API (optional, for demonstration)
6. **Documentation** - Add JSDoc examples to all builders

## Migration Path

- Phase 1: Add new builders alongside existing types (non-breaking)
- Phase 2: Deprecate `OptionalEffect` with console warnings
- Phase 3: Remove `OptionalEffect` in next major version

## Files to Create/Modify

**Create:**

- `packages/lorcana-types/src/abilities/builders/index.ts`
- `packages/lorcana-types/src/abilities/builders/ability-builders.ts`
- `packages/lorcana-types/src/abilities/builders/trigger-builders.ts`
- `packages/lorcana-types/src/abilities/builders/effect-builders.ts`
- `packages/lorcana-types/src/abilities/builders/target-builders.ts`
- `packages/lorcana-types/src/abilities/builders/cost-builders.ts`
- `packages/lorcana-types/src/abilities/builders/condition-builders.ts`

**Modify:**

- `packages/lorcana-types/src/abilities/effect-types/combined-types.ts` - Add `optional` to base
- `packages/lorcana-types/src/abilities/effect-types/control-flow.ts` - Deprecate `OptionalEffect`
- `packages/lorcana-types/src/abilities/index.ts` - Export new builders
- `packages/lorcana-types/src/index.ts` - Export builders namespace

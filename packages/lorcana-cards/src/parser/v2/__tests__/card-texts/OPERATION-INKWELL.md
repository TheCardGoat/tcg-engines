# Operation Inkwell 🖋️

## Codename: INKWELL

> _"Like ink flowing into the inkwell, we're restructuring the foundation that powers all card abilities."_

---

## Overview

**Goal:** Refactor `@tcg/lorcana-types` to use helper-based API with breaking changes.

**Constraints:**

- ❌ NO backward compatibility
- ❌ NO translation layers
- ✅ Breaking changes allowed (design phase)
- ✅ Tests remain skipped (parser not ready)
- ✅ Update tests to use helpers

---

## Execution Order

```
Phase 1: Update Types (TypeScript will fail) ────────────────────────────┐
    │                                                                    │
    ▼                                                                    │
Phase 2: Create Helpers (TypeScript still fails) ────────────────────────┤
    │                                                                    │
    ▼                                                                    │
Phase 3: Update Tests to Use Helpers (TypeScript still fails) ───────────┤
    │                                                                    │
    ▼                                                                    │
Phase 4: Fix Type Issues (TypeScript passes) ────────────────────────────┘
```

---

## Phase 1: Update Types

**Location:** `packages/lorcana-types/src/`

### Step 1.1: Create Helper Types File

Create `packages/lorcana-types/src/abilities/helpers/index.ts`

```typescript
// This file will export all helper functions
// Created empty first, filled in Phase 2
```

### Step 1.2: Update Effect Types

**File:** `packages/lorcana-types/src/abilities/effect-types/`

Add missing effect types:

- [ ] `ModalEffect` - choose one option
- [ ] `UnlessEffect` - unless you pay cost
- [ ] `ForEachTargetEffect` - iterate with individual effects
- [ ] `GrantKeywordEffect` - grant keyword to target
- [ ] `GrantAbilityEffect` - grant ability to target
- [ ] `PreventDamageEffect` - prevent damage
- [ ] `CostReductionEffect` - reduce costs
- [ ] `ShuffleIntoDeckEffect` - shuffle into deck
- [ ] `PutCardUnderEffect` - put card under another
- [ ] `PlayForFreeEffect` - play without paying cost
- [ ] `MoveDamageEffect` - move damage between cards

### Step 1.3: Update Condition Types

**File:** `packages/lorcana-types/src/abilities/condition-types.ts`

Add missing condition types:

- [ ] `NotCondition` - negate condition
- [ ] `AndCondition` - all conditions must be true
- [ ] `OrCondition` - any condition must be true
- [ ] `DamagedCondition` - card has damage
- [ ] `ExertedCondition` - card is exerted
- [ ] `HandSizeCondition` - based on hand size
- [ ] `InkwellCountCondition` - based on inkwell count
- [ ] `HaveInPlayCondition` - have card type in play
- [ ] `ExistsCondition` - card exists in zone

### Step 1.4: Update Target Types

**File:** `packages/lorcana-types/src/abilities/target-types.ts`

Add missing target types:

- [ ] `DynamicTarget` - computed target
- [ ] `TriggerSourceTarget` - reference trigger source
- [ ] `CurrentTarget` - current iteration target
- [ ] `ChallengerTarget` - challenging character
- [ ] `ChallengedTarget` - challenged character

---

## Phase 2: Create Helpers

**Location:** `packages/lorcana-types/src/abilities/helpers/`

### Step 2.1: Create Directory Structure

```
packages/lorcana-types/src/abilities/helpers/
├── index.ts           # Re-exports all helpers
├── Abilities.ts       # Ability builders
├── Triggers.ts        # Trigger builders
├── Effects.ts         # Effect builders
├── Conditions.ts      # Condition builders
├── Targets.ts         # Target builders
├── Costs.ts           # Cost builders
└── Timings.ts         # Timing helpers
```

### Step 2.2: Implement Triggers.ts

```typescript
export const Triggers = {
  WhenYouPlay: (on: TriggerSubject = "SELF") => ({
    event: "play" as const,
    timing: "when" as const,
    on,
  }),

  WheneverThisQuests: () => ({
    event: "quest" as const,
    timing: "whenever" as const,
    on: "SELF" as const,
  }),

  WhenBanished: (on: TriggerSubject = "SELF") => ({
    event: "banish" as const,
    timing: "when" as const,
    on,
  }),

  BanishInChallenge: (params: { timing: TriggerTiming; on: TriggerSubject }) => ({
    event: "banish-in-challenge" as const,
    ...params,
  }),

  AtStartOfYourTurn: () => ({
    event: "start-turn" as const,
    timing: "at" as const,
    on: "YOU" as const,
  }),

  // ... more triggers
};
```

### Step 2.3: Implement Effects.ts

```typescript
export const Effects = {
  Draw: (params: { amount: number; target?: PlayerTarget }) => ({
    type: "draw" as const,
    amount: params.amount,
    target: params.target ?? "CONTROLLER",
  }),

  Banish: (params: { target: CardTarget; optional?: boolean }) =>
    params.optional
      ? { type: "optional" as const, effect: { type: "banish" as const, target: params.target } }
      : { type: "banish" as const, target: params.target },

  RemoveDamage: (params: { amount: number; target: CardTarget; upTo?: boolean }) => ({
    type: "remove-damage" as const,
    amount: params.amount,
    target: params.target,
    upTo: params.upTo,
  }),

  GainKeyword: (params: { keyword: string; target?: CardTarget }) => ({
    type: "gain-keyword" as const,
    keyword: params.keyword,
    target: params.target ?? "SELF",
  }),

  Sequence: (effects: Effect[]) => ({
    type: "sequence" as const,
    effects,
  }),

  Optional: (effect: Effect) => ({
    type: "optional" as const,
    effect,
  }),

  // ... more effects
};
```

### Step 2.4: Implement Targets.ts

```typescript
export const Targets = {
  Self: () => "SELF" as const,
  Controller: () => "CONTROLLER" as const,
  Opponent: () => "OPPONENT" as const,

  ChosenCharacter: () => "CHOSEN_CHARACTER" as const,
  ChallengedCharacter: () => "CHALLENGED_CHARACTER" as const,

  YourCharacters: () => "YOUR_CHARACTERS" as const,
  YourOtherCharacters: () => "YOUR_OTHER_CHARACTERS" as const,
  OpponentCharacters: () => "OPPONENT_CHARACTERS" as const,

  CharacterFromDiscard: () => "CHARACTER_FROM_DISCARD" as const,

  YourMusketeers: () => "YOUR_MUSKETEER_CHARACTERS" as const,
  YourVillains: () => "YOUR_VILLAIN_CHARACTERS" as const,

  // ... more targets
};
```

### Step 2.5: Implement Conditions.ts

```typescript
export const Conditions = {
  HasAnotherCharacter: () => ({
    type: "has-another-character" as const,
  }),

  HasCharacterNamed: (name: string) => ({
    type: "has-character-named" as const,
    name,
  }),

  WhileDamaged: () => ({
    type: "while-damaged" as const,
  }),

  WhileExerted: () => ({
    type: "while-exerted" as const,
  }),

  // ... more conditions
};
```

### Step 2.6: Implement Abilities.ts

```typescript
export const Abilities = {
  Keyword: (keyword: string, params?: { value?: number; cost?: AbilityCost }) => ({
    type: "keyword" as const,
    keyword,
    ...params,
  }),

  Triggered: (params: {
    name?: string;
    trigger: Trigger;
    effect: Effect;
    condition?: Condition;
  }) => ({
    type: "triggered" as const,
    ...params,
  }),

  Static: (params: { name?: string; effect: StaticEffect; condition?: Condition }) => ({
    type: "static" as const,
    ...params,
  }),

  Activated: (params: { name?: string; cost: AbilityCost; effect: Effect }) => ({
    type: "activated" as const,
    ...params,
  }),

  Action: (effect: Effect) => ({
    type: "action" as const,
    effect,
  }),
};
```

### Step 2.7: Implement Costs.ts

```typescript
export const Costs = {
  Ink: (amount: number) => ({ ink: amount }),
  Exert: () => ({ exert: true }),
  BanishSelf: () => ({ banishSelf: true }),

  Combined: (...costs: AbilityCost[]) => costs.reduce((acc, cost) => ({ ...acc, ...cost }), {}),
};
```

### Step 2.8: Update Index Exports

**File:** `packages/lorcana-types/src/abilities/helpers/index.ts`

```typescript
export { Abilities } from "./Abilities";
export { Triggers } from "./Triggers";
export { Effects } from "./Effects";
export { Conditions } from "./Conditions";
export { Targets } from "./Targets";
export { Costs } from "./Costs";
```

**File:** `packages/lorcana-types/src/abilities/index.ts`

Add:

```typescript
export * from "./helpers";
```

---

## Phase 3: Update Tests to Use Helpers

**Files:** All 21 test files in `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/`

### Step 3.1: Update Imports

Change from:

```typescript
import type {
  ActionAbilityDefinition,
  ActivatedAbilityDefinition,
  KeywordAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";
```

To:

```typescript
import { Abilities, Triggers, Effects, Conditions, Targets, Costs } from "@tcg/lorcana-types";
```

### Step 3.2: Update Test Assertions

**Example transformations:**

#### Keyword Abilities

Before:

```typescript
const singer: KeywordAbilityDefinition = {
  type: "keyword",
  keyword: "Singer",
  value: 4,
};
```

After:

```typescript
const singer = Abilities.Keyword("Singer", { value: 4 });
```

#### Triggered Abilities

Before:

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

After:

```typescript
const heroism = Abilities.Triggered({
  name: "HEROISM",
  trigger: Triggers.BanishInChallenge({
    timing: "when",
    on: Targets.Self(),
  }),
  effect: Effects.Banish({
    target: Targets.ChallengedCharacter(),
    optional: true,
  }),
});
```

#### Static Abilities

Before:

```typescript
const camouflage: StaticAbilityDefinition = {
  type: "static",
  name: "CAMOUFLAGE",
  effect: {
    type: "conditional",
    condition: { type: "has-another-character" },
    effect: {
      type: "gain-keyword",
      keyword: "Evasive",
      target: "SELF",
    },
  },
};
```

After:

```typescript
const camouflage = Abilities.Static({
  name: "CAMOUFLAGE",
  condition: Conditions.HasAnotherCharacter(),
  effect: Effects.GainKeyword({
    keyword: "Evasive",
    target: Targets.Self(),
  }),
});
```

#### Action Abilities

Before:

```typescript
const partOfYourWorld: ActionAbilityDefinition = {
  type: "action",
  effect: {
    type: "return-to-hand",
    target: "CHARACTER_FROM_DISCARD",
  },
};
```

After:

```typescript
const partOfYourWorld = Abilities.Action(
  Effects.ReturnToHand({
    target: Targets.CharacterFromDiscard(),
  }),
);
```

### Step 3.3: Keep Tests Skipped

**IMPORTANT:** Do NOT remove `it.skip` from any test. Parser is not ready.

---

## Phase 4: Fix Type Issues

### Step 4.1: Run Type Check

```bash
bun run check-types
```

### Step 4.2: Fix Any Remaining Type Errors

Common fixes:

- Add missing helper functions
- Fix return types on helpers
- Add missing type exports
- Fix type inference issues

### Step 4.3: Verify All Tests Still Skip

```bash
bun test packages/lorcana-cards/src/parser/v2/__tests__/card-texts/
```

All tests should be skipped, no failures.

---

## File Change Summary

### New Files (Phase 2)

```
packages/lorcana-types/src/abilities/helpers/
├── index.ts
├── Abilities.ts
├── Triggers.ts
├── Effects.ts
├── Conditions.ts
├── Targets.ts
└── Costs.ts
```

### Modified Files (Phase 1)

```
packages/lorcana-types/src/abilities/
├── effect-types/
│   ├── control-flow.ts      (add ModalEffect, UnlessEffect, etc.)
│   ├── modifier-effects.ts  (add GrantKeywordEffect, etc.)
│   ├── movement-effects.ts  (add ShuffleIntoDeckEffect, etc.)
│   └── combined-types.ts    (update Effect union)
├── condition-types.ts       (add compound conditions)
├── target-types.ts          (add dynamic targets)
└── index.ts                 (export helpers)
```

### Modified Files (Phase 3)

```
packages/lorcana-cards/src/parser/v2/__tests__/card-texts/
├── set-001-characters-a-m.test.ts
├── set-001-characters-n-z.test.ts
├── set-002-characters-a-m.test.ts
├── set-002-characters-n-z.test.ts
├── set-003-characters-a-m.test.ts
├── set-003-characters-n-z.test.ts
├── set-004-actions-items.test.ts
├── set-004-characters-a-m.test.ts
├── set-004-characters-n-z.test.ts
├── set-005-characters-a-m.test.ts
├── set-005-characters-n-z.test.ts
├── set-006-characters-a-m.test.ts
├── set-006-characters-n-z.test.ts
├── set-007-characters-a-m.test.ts
├── set-007-characters-n-z.test.ts
├── set-008-characters-a-m.test.ts
├── set-008-characters-n-z.test.ts
├── set-009-characters-a-m.test.ts
├── set-009-characters-n-z.test.ts
├── set-010-characters-a-m.test.ts
└── set-010-characters-n-z.test.ts
```

---

## Checklist

### Phase 1: Update Types

- [ ] Create helpers directory structure
- [ ] Add missing effect types
- [ ] Add missing condition types
- [ ] Add missing target types
- [ ] Update type exports

### Phase 2: Create Helpers

- [ ] Implement Triggers.ts
- [ ] Implement Effects.ts
- [ ] Implement Targets.ts
- [ ] Implement Conditions.ts
- [ ] Implement Abilities.ts
- [ ] Implement Costs.ts
- [ ] Export from index.ts

### Phase 3: Update Tests

- [ ] Update set-001-characters-a-m.test.ts
- [ ] Update set-001-characters-n-z.test.ts
- [ ] Update set-002-characters-a-m.test.ts
- [ ] Update set-002-characters-n-z.test.ts
- [ ] Update set-003-characters-a-m.test.ts
- [ ] Update set-003-characters-n-z.test.ts
- [ ] Update set-004-actions-items.test.ts
- [ ] Update set-004-characters-a-m.test.ts
- [ ] Update set-004-characters-n-z.test.ts
- [ ] Update set-005-characters-a-m.test.ts
- [ ] Update set-005-characters-n-z.test.ts
- [ ] Update set-006-characters-a-m.test.ts
- [ ] Update set-006-characters-n-z.test.ts
- [ ] Update set-007-characters-a-m.test.ts
- [ ] Update set-007-characters-n-z.test.ts
- [ ] Update set-008-characters-a-m.test.ts
- [ ] Update set-008-characters-n-z.test.ts
- [ ] Update set-009-characters-a-m.test.ts
- [ ] Update set-009-characters-n-z.test.ts
- [ ] Update set-010-characters-a-m.test.ts
- [ ] Update set-010-characters-n-z.test.ts

### Phase 4: Fix Types

- [ ] Run type check
- [ ] Fix all type errors
- [ ] Verify tests still skip
- [ ] Remove @ts-nocheck from test files

---

## Notes

1. **Keep `it.skip`** - Parser is not ready, tests must remain skipped
2. **Remove `@ts-nocheck`** - After Phase 4, types should be correct
3. **No runtime changes** - Helpers are just type-safe builders
4. **Breaking changes OK** - We're in design phase, no production code

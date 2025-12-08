# Lorcana Card Implementation Helpers Index

This directory contains a comprehensive, LLM-friendly index of helper functions available for implementing Disney Lorcana TCG cards in `packages/lorcana-engine`.

## Index Structure

1. **[triggers.md](triggers.md)** - Trigger helpers (`whenYouPlayThisCharacter`, `wheneverThisQuests`, etc.)
2. **[effects.md](effects.md)** - Effect helpers (`drawACard`, `dealDamageEffect`, `banishChosenCharacter`, etc.)
3. **[targets.md](targets.md)** - Target helpers (`chosenCharacter`, `chosenOpposingCharacter`, etc.)
4. **[conditions.md](conditions.md)** - Condition helpers (`ifYouHaveCharacterNamed`, `whileThisCharacterIsExerted`, etc.)
5. **[while-abilities.md](while-abilities.md)** - While/continuous ability helpers (`whileConditionThisCharacterGets`, etc.)
6. **[costs.md](costs.md)** - Cost helpers (`exertCharCost`, `discardCharCost`, etc.)

## How to Use This Index

When implementing a new Lorcana card:

1. Read the card's ability text
2. Identify the **trigger** (When/Whenever/At/While)
3. Identify the **effect** (Draw/Damage/Banish/etc.)
4. Identify the **target** (Chosen character/Opposing character/etc.)
5. Identify any **conditions** (If/While/etc.)
6. Look up the appropriate helpers in each category
7. Combine them to implement the ability

## Example Workflow

**Card Text:** "Whenever you play a character, you may deal 2 damage to chosen opposing character."

**Implementation:**
1. **Trigger:** `wheneverYouPlayACharacter` (from [triggers.md](triggers.md))
2. **Effect:** `dealDamageToChosenOpposingCharacter(2)` (from [effects.md](effects.md))
3. **Target:** Already included in effect helper
4. **Optional:** Set `optional: true` parameter

```typescript
export const abilityName: TriggeredAbility = wheneverYouPlayACharacter({
  name: "Ability Name",
  text: "Whenever you play a character, you may deal 2 damage to chosen opposing character.",
  effects: [dealDamageToChosenOpposingCharacter(2)],
  optional: true,
});
```

## Quick Reference Locations

- **Trigger Helpers**: `packages/lorcana-engine/src/abilities/whenAbilities.ts`, `wheneverAbilities.ts`, `atTheAbilities.ts`
- **Effect Helpers**: `packages/lorcana-engine/src/effects/effects.ts`
- **Target Helpers**: `packages/lorcana-engine/src/abilities/targets.ts`
- **Condition Helpers**: `packages/lorcana-engine/src/abilities/conditions/conditions.ts`
- **While Ability Helpers**: `packages/lorcana-engine/src/abilities/whileAbilities.ts`

## Note on Recent vs. Deprecated Patterns

Always prefer patterns from **recent sets (010, 009, 008, 007)** over older sets, as older patterns may be deprecated or superseded by better implementations.


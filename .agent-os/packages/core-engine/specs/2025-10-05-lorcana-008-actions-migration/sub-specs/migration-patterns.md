# Migration Patterns & Common Solutions

This document captures reusable patterns discovered during the Lorcana Set 008 actions migration.

## API Migration Patterns

### Pattern 1: TestEngine Initialization

**Old Pattern (if found):**
```typescript
// Legacy test setup
const game = createGame({ ... });
```

**New Pattern:**
```typescript
const testEngine = new TestEngine({
  inkwell: cardDefinition.cost,
  play: [characterCards],
  hand: [cardToPlay],
  deck: 10,
});
```

### Pattern 2: Card Play Assertions

**Old Pattern (if found):**
```typescript
// Legacy assertion
game.playCard(card);
expect(game.state.hand.length).toBe(X);
```

**New Pattern:**
```typescript
await testEngine.playCard(cardDefinition, {
  targets: [targetCard],
});
expect(testEngine.getZonesCardCount().hand).toBe(X);
```

### Pattern 3: Card Model Access

**New Pattern:**
```typescript
const cardModel = testEngine.getCardModel(cardDefinition);
expect(cardModel.strength).toBe(expectedValue);
expect(cardModel.zone).toBe("discard");
expect(cardModel.hasChallenger).toBe(true);
```

## Card Definition Patterns

### Pattern 1: Simple Stat Buff Action

**Example:** Candy Drift (+5 strength this turn, then banish)

```typescript
import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  getEffect,
  banishCardEffect,
  drawCardsEffect
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";

export const cardName: LorcanaActionCardDefinition = {
  id: "card_id",
  name: "Card Name",
  characteristics: ["action"],
  text: "Card text",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Card text",
      effects: [
        drawCardsEffect({ value: 1 }),
        getEffect({
          targets: [chosenCharacterTarget],
          attribute: "strength",
          value: 5,
          duration: THIS_TURN,
        }),
        // End-of-turn banish requires triggered ability system
      ],
    },
  ],
  inkwell: true,
  colors: ["amber", "ruby"],
  cost: 2,
  illustrator: "Artist Name",
  number: 39,
  set: "008",
  rarity: "uncommon",
};
```

### Pattern 2: Ability Grant Action

**Example:** Forest Duel (grant Challenger +2)

```typescript
import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";

export const cardName: LorcanaActionCardDefinition = {
  // ... basic fields
  abilities: [
    {
      type: "static",
      text: "Your characters gain Challenger +2 this turn.",
      targets: [yourCharactersTarget],
      effects: [
        gainsAbilityEffect({
          targets: [yourCharactersTarget],
          ability: challengerAbility(2),
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  // ... other fields
};
```

### Pattern 3: Multi-Effect Action

**Example:** Undermine (opponent discards + character gets +2 strength)

```typescript
import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  discardCardEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { chosenOpponentTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";

export const cardName: LorcanaActionCardDefinition = {
  // ... basic fields
  abilities: [
    {
      type: "static",
      text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
      effects: [
        discardCardEffect({
          targets: [chosenOpponentTarget],
          value: 1,
        }),
        getEffect({
          targets: [chosenCharacterTarget],
          attribute: "strength",
          value: 2,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  // ... other fields
};
```

## Test Patterns

### Pattern 1: Optional Target Testing

When a card has optional effects (e.g., target a character if you have one):

```typescript
it("Executes effect with target", async () => {
  const testEngine = new TestEngine({
    inkwell: card.cost,
    play: [targetCharacter],
    hand: [card],
  });

  await testEngine.playCard(card, {
    targets: [targetCharacter],
  });

  expect(testEngine.getCardModel(targetCharacter).strength).toBe(expectedValue);
});

it("Executes without target when none available", async () => {
  const testEngine = new TestEngine({
    inkwell: card.cost,
    play: [], // No valid targets
    hand: [card],
  });

  await testEngine.playCard(card);

  // Card should still execute other effects (like draw)
  expect(testEngine.getZonesCardCount().hand).toBe(1);
});
```

### Pattern 2: End-of-Turn Effects

When a card has effects that trigger at end of turn:

```typescript
it("Effect expires at end of turn", async () => {
  const testEngine = new TestEngine({
    inkwell: card.cost,
    play: [character],
    hand: [card],
  });

  await testEngine.playCard(card, {
    targets: [character],
  });

  // Effect active during turn
  expect(testEngine.getCardModel(character).strength).toBe(baseStrength + 5);

  await testEngine.passTurn();

  // Effect expired after turn
  expect(testEngine.getCardModel(character).strength).toBe(baseStrength);
});
```

### Pattern 3: Challenge-Related Effects

When testing Challenger ability or challenge-triggered effects:

```typescript
it("Character gains Challenger and can challenge", async () => {
  const testEngine = new TestEngine(
    {
      inkwell: card.cost,
      play: [attacker],
      hand: [card],
    },
    {
      play: [defender],
    },
  );

  await testEngine.playCard(card);

  expect(testEngine.getCardModel(attacker).hasChallenger).toEqual(true);

  await testEngine.challenge({
    attacker: attacker,
    defender: defender,
    exertDefender: true,
  });

  // Assert challenge results
  expect(testEngine.getCardModel(attacker).zone).toEqual("hand");
});
```

## Framework Extensions Needed

### Missing Effect Handlers

Track any effect types that need to be implemented:

#### 1. End-of-Turn Banish Effect
**Status:** Needs implementation
**Required for:** Candy Drift, and similar cards
**Implementation needed in:** `~/game-engine/engines/lorcana/src/abilities/effect/effect.ts`

```typescript
// TODO: Implement
export function banishAtEndOfTurnEffect(params: EffectParams) {
  // Register trigger for end of turn
  // Banish specified target when trigger fires
}
```

#### 2. Return-to-Hand-When-Banished Effect
**Status:** Needs trigger system implementation
**Required for:** Forest Duel ("when this character is banished in a challenge")
**Implementation needed in:** Triggered ability system

```typescript
// TODO: Implement triggered ability system
export function whenBanishedInChallengeTrigger(params: TriggerParams) {
  // Register trigger that fires when card banished during challenge
  // Return card to hand when trigger fires
}
```

## Common Issues & Solutions

### Issue 1: notImplemented Flag

**Problem:** Card has `notImplemented: true` flag
**Solution:** Remove flag after implementing all abilities
**Verification:** Test must pass without `.skip()`

### Issue 2: missingTestCase Flag

**Problem:** Card has `missingTestCase: true` flag
**Solution:** Write complete test covering all card effects
**Verification:** Test must cover all abilities and edge cases

### Issue 3: Skipped Test

**Problem:** Test uses `.skip()` or `it.skip()`
**Solution:** Implement missing functionality, then remove `.skip()`
**Verification:** Test must pass without skip

### Issue 4: Missing Target Definition

**Problem:** Card references undefined target type
**Solution:** Import or create target definition
**Location:** `~/game-engine/engines/lorcana/src/abilities/targets/`

**Available Targets:**
- `chosenCharacterTarget` - single character target
- `yourCharactersTarget` - all your characters
- `chosenOpponentTarget` - single opponent target
- `yourOpponentTarget` - your opponent
- (Add more as discovered)

### Issue 5: Missing Duration Definition

**Problem:** Effect duration not defined
**Solution:** Import or create duration constant
**Location:** `~/game-engine/engines/lorcana/src/abilities/duration`

**Available Durations:**
- `THIS_TURN` - until end of current turn
- (Add more as discovered)

## Progress Tracking Template

Use this template to track each card migration:

```markdown
### Card Name (Number)

**Status:** Not Started | In Progress | Completed
**Complexity:** Simple | Medium | Complex

**Changes Made:**
- [ ] Test updated to use new APIs
- [ ] Card definition updated to new format
- [ ] Framework extensions added (if needed)
- [ ] Edge cases tested
- [ ] Flags removed (notImplemented, missingTestCase)
- [ ] Human approval received

**Issues Encountered:**
- None / List any issues

**Patterns Applied:**
- Pattern X
- Pattern Y

**Notes:**
Any additional context or lessons learned
```

## Next Steps

As migration progresses:
1. Add new patterns discovered to this document
2. Update framework extension status as features are implemented
3. Document any deviations from expected patterns
4. Track completion status of all 27 cards

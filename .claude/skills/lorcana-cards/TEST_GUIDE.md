# Lorcana Card Testing Guide

This guide provides best practices, patterns, and examples for writing tests for Disney Lorcana TCG card implementations.

## Core Testing Principles

- Test behavior not implementation details.
- Do not test edge cases, edge cases are handle by testing the engine not the cards.

### 1. Test Behavior, Not Implementation

**❌ Bad - Asserting on card definition:**
```typescript
    it("has correct card properties", () => {
      expect(trustInMe.id).toBe("wll");
      expect(trustInMe.name).toBe("Trust In Me");
      expect(trustInMe.type).toBe("action");
    });
```

**❌ Bad - Testing implementation details:**
```typescript
it("should call drawCard method", () => {
  const spy = jest.spyOn(game, 'drawCard');
  testEngine.playCard(card);
  expect(spy).toHaveBeenCalled();
});
```

**✅ Good - Testing behavior:**
```typescript
it("draws a card when played", () => {
  const testEngine = new TestEngine({
    deck: [anotherCard],
    hand: [cardWithDrawEffect],
  });
  
  const initialHandSize = testEngine.getHand().length;
  testEngine.playCard(cardWithDrawEffect);
  
  expect(testEngine.getHand().length).toBe(initialHandSize);
});
```

### 2. Use Descriptive Test Names

Test names should clearly describe what the card does in plain English.

**❌ Bad:**
```typescript
it("works", () => { ... });
it("test1", () => { ... });
it("ability triggers", () => { ... });
```

**✅ Good:**
```typescript
it("draws a card when played", () => { ... });
it("gains Support when Dale is in play", () => { ... });
it("deals 2 damage to chosen opposing character", () => { ... });
it("does not trigger when opponent plays a character", () => { ... });
```

### 3. Follow AAA Pattern

**Arrange** → **Act** → **Assert**

```typescript
it("gains +2 strength when you have 3+ characters", () => {
  // ARRANGE: Set up the game state
  const testEngine = new TestEngine({
    play: [mainCharacter, supportChar1, supportChar2, supportChar3],
  });
  
  // ACT: Perform the action
  const character = testEngine.getByName("mainCharacter");
  
  // ASSERT: Verify the result
  expect(character.strength).toBe(character.baseStrength + 2);
});
```

### 4. Test Only Card Abilities

**❌ Don't test card properties:**
```typescript
// DON'T TEST THESE - They're in the card definition
it("has 3 cost", () => {
  expect(card.cost).toBe(3);
});

it("is named Mickey Mouse", () => {
  expect(card.name).toBe("Mickey Mouse");
});

it("has 4 strength", () => {
  expect(card.strength).toBe(4);
});

  if (
    stoneByDay &&
    "effects" in stoneByDay &&
    Array.isArray(stoneByDay.effects)
  ) {
    // Should have restriction effect
    expect(stoneByDay.effects).toHaveLength(1);
    const effect = stoneByDay.effects[0] as any;
    expect(effect.type).toBe("restriction");
    expect(effect.restriction).toBe("ready");
  }
```

**✅ Do test card abilities:**
```typescript
// TEST THESE - They're the ability implementation
it("draws a card when played", () => { ... });
it("gains Support when condition is met", () => { ... });
it("deals damage to chosen character", () => { ... });
```

## Test Structure Templates

### Template 1: Triggered Ability (On Play)

```typescript
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
import { cardWithAbility } from "./123-card-with-ability.ts";
import { otherCard } from "./456-other-card.ts";

describe("Card Name - Card Title", () => {
  it("triggers ability when played", () => {
    const testEngine = new TestEngine({
      hand: [cardWithAbility],
    });
    
    testEngine.playCard(cardWithAbility);
    
    // Assert the effect happened
    expect(/* effect result */).toBe(/* expected value */);
  });
});
```

### Template 2: Triggered Ability (Quest)

```typescript
describe("Card Name - Card Title", () => {
  it("triggers ability when character quests", () => {
    const testEngine = new TestEngine({
      play: [questingCharacter],
    });
    
    const character = testEngine.getByName("questingCharacter");
    testEngine.quest(character);
    
    expect(/* effect result */).toBe(/* expected value */);
  });
});
```

### Template 3: Continuous Ability

```typescript
describe("Card Name - Card Title", () => {
  it("gains keyword when condition is met", () => {
    const testEngine = new TestEngine({
      play: [mainCharacter, conditionCard],
    });
    
    const character = testEngine.getByName("mainCharacter");
    expect(character.hasKeyword("support")).toBe(true);
  });
  
  it("does not have keyword when condition is not met", () => {
    const testEngine = new TestEngine({
      play: [mainCharacter],
    });
    
    const character = testEngine.getByName("mainCharacter");
    expect(character.hasKeyword("support")).toBe(false);
  });
});
```

### Template 4: Optional Ability

```typescript
describe("Card Name - Card Title", () => {
  it("can choose to activate optional ability", () => {
    const testEngine = new TestEngine({
      hand: [cardWithOptional],
    });
    
    testEngine.playCard(cardWithOptional, { 
      chooseOptional: true 
    });
    
    expect(/* effect happened */).toBe(true);
  });
  
  it("can choose not to activate optional ability", () => {
    const testEngine = new TestEngine({
      hand: [cardWithOptional],
    });
    
    testEngine.playCard(cardWithOptional, { 
      chooseOptional: false 
    });
    
    expect(/* effect did not happen */).toBe(true);
  });
});
```

### Template 5: Targeting Ability

```typescript
describe("Card Name - Card Title", () => {
  it("applies effect to chosen target", () => {
    const testEngine = new TestEngine({
      hand: [cardWithTargeting],
      play: [targetCharacter],
    }, {
      play: [opponentCharacter],
    });
    
    testEngine.playCard(cardWithTargeting, {
      targets: [targetCharacter]
    });
    
    expect(targetCharacter./* affected property */).toBe(/* expected value */);
  });
});
```

### Template 6: Conditional Ability

```typescript
describe("Card Name - Card Title", () => {
  it("triggers ability when condition is true", () => {
    const testEngine = new TestEngine({
      hand: [cardWithCondition],
      play: [conditionCard], // Satisfies condition
    });
    
    testEngine.playCard(cardWithCondition);
    
    expect(/* effect happened */).toBe(true);
  });
  
  it("does not trigger when condition is false", () => {
    const testEngine = new TestEngine({
      hand: [cardWithCondition],
      // No condition card
    });
    
    testEngine.playCard(cardWithCondition);
    
    expect(/* effect did not happen */).toBe(true);
  });
});
```

## TestEngine API Reference

### Setup Methods

```typescript
// Basic setup
const testEngine = new TestEngine({
  inkwell: 5,                    // Available ink
  deck: [card1, card2],          // Deck cards
  hand: [card3, card4],          // Hand cards
  play: [card5, card6],          // Cards in play
  discard: [card7],              // Discard pile
}, {
  // Opponent setup (optional)
  inkwell: 3,
  hand: [oppCard1],
  play: [oppCard2],
});
```

### Action Methods

```typescript
// Play a card
testEngine.playCard(card);
testEngine.playCard(card, { targets: [target] });
testEngine.playCard(card, { chooseOptional: true });

// Quest with a character
const character = testEngine.getByName("characterName");
testEngine.quest(character);

// Challenge
testEngine.challenge(attacker, defender);

// Use an ability
testEngine.useAbility(card, ability);

// Pass turn
testEngine.passTurn();
```

### Query Methods

```typescript
// Get cards
const card = testEngine.getByName("cardName");
const hand = testEngine.getHand();
const play = testEngine.getPlay();
const deck = testEngine.getDeck();
const discard = testEngine.getDiscard();

// Get card state
const isExerted = card.isExerted();
const hasDamage = card.hasDamage();
const strength = card.strength;
const willpower = card.willpower;

// Check keywords
const hasSupport = card.hasKeyword("support");
const hasRush = card.hasKeyword("rush");
const hasEvasive = card.hasKeyword("evasive");

// Get lore
const lore = testEngine.getLore();
const opponentLore = testEngine.getOpponentLore();
```

## Real-World Examples

### Example 1: Card Draw on Play

```typescript
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
import { mickeyMouseTrueFriend } from "./001-mickey-mouse-true-friend.ts";
import { donaldDuckMusketeer } from "./002-donald-duck-musketeer.ts";

describe("Mickey Mouse - True Friend", () => {
  it("draws a card when played", () => {
    const testEngine = new TestEngine({
      deck: [donaldDuckMusketeer],
      hand: [mickeyMouseTrueFriend],
    });
    
    const initialHandSize = testEngine.getHand().length;
    testEngine.playCard(mickeyMouseTrueFriend);
    const finalHandSize = testEngine.getHand().length;
    
    expect(finalHandSize).toBe(initialHandSize); // One card played, one drawn
  });
});
```

### Example 2: Conditional Support

```typescript
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
import { chipRangerLeader } from "./012-chip-ranger-leader.ts";
import { daleAdventurousSquirrel } from "./013-dale-adventurous-squirrel.ts";

describe("Chip - Ranger Leader", () => {
  it("gains Support when Dale is in play", () => {
    const testEngine = new TestEngine({
      play: [chipRangerLeader, daleAdventurousSquirrel],
    });
    
    const chip = testEngine.getByName("chipRangerLeader");
    expect(chip.hasKeyword("support")).toBe(true);
  });

  it("does not have Support when Dale is not in play", () => {
    const testEngine = new TestEngine({
      play: [chipRangerLeader],
    });
    
    const chip = testEngine.getByName("chipRangerLeader");
    expect(chip.hasKeyword("support")).toBe(false);
  });
});
```

### Example 3: Damage Effect with Targeting

```typescript
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
import { fireBlast } from "./050-fire-blast.ts";
import { targetCharacter } from "./100-target-character.ts";

describe("Fire Blast", () => {
  it("deals 3 damage to chosen character", () => {
    const testEngine = new TestEngine({
      hand: [fireBlast],
      play: [targetCharacter],
    });
    
    const target = testEngine.getByName("targetCharacter");
    const initialDamage = target.meta.damage || 0;
    
    testEngine.playCard(fireBlast, { targets: [target] });
    
    expect(target.meta.damage).toBe(initialDamage + 3);
  });
});
```

### Example 4: Quest Trigger

```typescript
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
import { arielOnHumanLegs } from "./001-ariel-on-human-legs.ts";
import { extraCard } from "./002-extra-card.ts";

describe("Ariel - On Human Legs", () => {
  it("draws a card when she quests", () => {
    const testEngine = new TestEngine({
      deck: [extraCard],
      play: [arielOnHumanLegs],
    });
    
    const ariel = testEngine.getByName("arielOnHumanLegs");
    const initialHandSize = testEngine.getHand().length;
    
    testEngine.quest(ariel);
    
    expect(testEngine.getHand().length).toBe(initialHandSize + 1);
  });
});
```

### Example 5: Stat Modification

```typescript
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
import { tianaCelebrating } from "./050-tiana-celebrating.ts";
import { otherCharacter } from "./051-other-character.ts";

describe("Tiana - Celebrating", () => {
  it("gives chosen character +2 strength this turn", () => {
    const testEngine = new TestEngine({
      hand: [tianaCelebrating],
      play: [otherCharacter],
    });
    
    const target = testEngine.getByName("otherCharacter");
    const baseStrength = target.strength;
    
    testEngine.playCard(tianaCelebrating, { targets: [target] });
    
    expect(target.strength).toBe(baseStrength + 2);
  });
});
```

## Common Testing Mistakes

### Mistake 1: Not Importing Cards by Reference

**❌ Wrong:**
```typescript
const testEngine = new TestEngine({
  play: ["mickey-mouse_001-001"], // Using ID string
});
```

**✅ Correct:**
```typescript
import { mickeyMouseTrueFriend } from "./001-mickey-mouse-true-friend.ts";

const testEngine = new TestEngine({
  play: [mickeyMouseTrueFriend], // Using card reference
});
```

### Mistake 2: Using Deprecated TestStore

**❌ Wrong:**
```typescript
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
const testStore = new TestStore({...});
```

**✅ Correct:**
```typescript
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
const testEngine = new TestEngine({...});
```

### Mistake 3: Testing Implementation Instead of Behavior

**❌ Wrong:**
```typescript
it("calls the drawCard function", () => {
  // Testing implementation detail
});
```

**✅ Correct:**
```typescript
it("draws a card when played", () => {
  // Testing observable behavior
});
```

### Mistake 4: Vague Test Names

**❌ Wrong:**
```typescript
it("works", () => { ... });
it("test1", () => { ... });
```

**✅ Correct:**
```typescript
it("deals 2 damage to chosen character when played", () => { ... });
```

### Mistake 5: Not Testing Negative Cases

**❌ Incomplete:**
```typescript
describe("Conditional Ability", () => {
  it("triggers when condition is met", () => { ... });
  // Missing: test for when condition is NOT met
});
```

**✅ Complete:**
```typescript
describe("Conditional Ability", () => {
  it("triggers when condition is met", () => { ... });
  it("does not trigger when condition is not met", () => { ... });
});
```

## Test Organization Best Practices

### Group Related Tests

```typescript
describe("Card Name - Card Title", () => {
  describe("when played", () => {
    it("draws a card", () => { ... });
    it("deals damage", () => { ... });
  });
  
  describe("when condition is met", () => {
    it("gains Support", () => { ... });
    it("gets +2 strength", () => { ... });
  });
  
  describe("when condition is not met", () => {
    it("does not gain Support", () => { ... });
    it("has base strength", () => { ... });
  });
});
```

### One Assertion Focus Per Test

**❌ Too many concerns:**
```typescript
it("does everything", () => {
  testEngine.playCard(card);
  expect(hand.length).toBe(5);
  expect(lore).toBe(2);
  expect(character.strength).toBe(4);
  expect(character.hasKeyword("rush")).toBe(true);
});
```

**✅ Focused tests:**
```typescript
it("draws a card when played", () => {
  testEngine.playCard(card);
  expect(hand.length).toBe(5);
});

it("gains 2 lore when questing", () => {
  testEngine.quest(character);
  expect(lore).toBe(2);
});
```

## TDD Workflow for Card Implementation

1. **Write failing test** - Describe expected behavior
2. **Run test** - Verify it fails (RED phase)
3. **Implement minimum code** - Make test pass
4. **Run test** - Verify it passes (GREEN phase)
5. **Refactor** - Improve code quality
6. **Run test again** - Ensure still passing

### Example TDD Flow

**Step 1: Write failing test**
```typescript
it("draws a card when played", () => {
  const testEngine = new TestEngine({
    deck: [extraCard],
    hand: [cardToImplement],
  });
  
  testEngine.playCard(cardToImplement);
  expect(testEngine.getHand().length).toBe(1);
});
```

**Step 2: Run test** → ❌ FAILS (no ability implemented)

**Step 3: Implement ability**
```typescript
export const cardAbility: TriggeredAbility = {
  type: "triggered",
  trigger: whenYouPlayThisCharacter(),
  effects: [drawACard]
};
```

**Step 4: Run test** → ✅ PASSES

**Step 5: Refactor if needed** (improve code quality)

**Step 6: Run test** → ✅ Still PASSES

## Keywords

testing, tdd, test-driven-development, jest, test-patterns, behavior-testing, lorcana-tests


# Common Issues and Troubleshooting

This guide covers common problems encountered when implementing Lorcana cards and how to resolve them.

## Import and Reference Issues

### Issue 1: Referencing Cards by ID String

**Problem:** Using card ID strings instead of card object references

**Symptom:**
```typescript
const testEngine = new TestEngine({
  play: ["hercules_007-101"], // Error: String not supported
});
```

**Error Message:** `Type 'string' is not assignable to type 'CardModel'`

**Solution:** Import and use the card object reference
```typescript
import { herculesTrueHero } from "@lorcanito/lorcana-engine/cards/001/characters/181-hercules-true-hero.ts";

const testEngine = new TestEngine({
  play: [herculesTrueHero], // Correct
});
```

**Why:** The engine requires actual card objects, not string identifiers.

### Issue 2: Using Deprecated TestStore

**Problem:** Using the old TestStore class instead of TestEngine

**Symptom:**
```typescript
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
const testStore = new TestStore({...}); // Deprecated
```

**Solution:** Use TestEngine instead
```typescript
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
const testEngine = new TestEngine({...}); // Current
```

**Why:** TestStore is deprecated. TestEngine is the current, maintained testing framework.

### Issue 3: Incorrect Import Paths

**Problem:** Import path doesn't match file location

**Symptom:**
```typescript
import { card } from "./wrong-path.ts"; // Error: Module not found
```

**Solution:** Use correct path relative to current file or absolute from package root
```typescript
// Relative import (same directory)
import { card } from "./123-card-name.ts";

// Absolute import from package root
import { card } from "@lorcanito/lorcana-engine/cards/007/characters/123-card-name.ts";
```

## Type Safety Issues

### Issue 4: Using `any` Types

**Problem:** Type assertions or `any` types bypass TypeScript safety

**Symptom:**
```typescript
const card: any = testEngine.getByName("cardName"); // Bad practice
```

**Solution:** Use proper types
```typescript
import type { CardModel } from "@lorcanito/lorcana-engine/types";

const card: CardModel = testEngine.getByName("cardName");
```

**Why:** Type safety helps catch errors at compile time.

### Issue 5: Missing Type Definitions for Effects

**Problem:** Effect functions without proper types

**Symptom:**
```typescript
effects: [
  (context) => { // Type of 'context' is implicitly 'any'
    // Effect logic
  }
]
```

**Solution:** Import and use proper effect types
```typescript
import type { EffectContext } from "@lorcanito/lorcana-engine/types";

effects: [
  (context: EffectContext) => {
    // Effect logic with proper typing
  }
]
```

## Ability Implementation Issues

### Issue 6: Trigger Not Firing

**Problem:** Ability doesn't trigger when expected

**Common Causes:**
1. Wrong trigger type used
2. Missing trigger registration
3. Condition preventing trigger

**Debugging Steps:**
```typescript
// 1. Verify trigger type matches card text
// If card says "When you play this character"
trigger: whenYouPlayThisCharacter(), // Not wheneverYouPlayACharacter()

// 2. Check if ability is registered in abilities array
export const cardDefinition = {
  // ...
  abilities: [yourAbility], // Must be included
};

// 3. Check conditions aren't blocking
conditions: [
  () => {
    console.log("Condition check:", this.checkSomething());
    return this.checkSomething();
  }
]
```

### Issue 7: Continuous Ability Not Applying

**Problem:** Continuous ability effect doesn't apply when condition is met

**Common Causes:**
1. Condition check is incorrect
2. Effect not properly applying
3. Timing issues

**Solution:**
```typescript
export const ability: ContinuousAbility = {
  type: "continuous",
  name: "Ability Name",
  text: "Card text",
  conditions: [
    () => {
      // Verify this returns true when expected
      const result = checkCondition();
      console.log("Condition result:", result);
      return result;
    }
  ],
  effects: [
    () => {
      // Verify this executes when condition is true
      console.log("Effect applying");
      this.addKeyword("support");
    }
  ]
};
```

### Issue 8: Optional Ability Always/Never Triggering

**Problem:** Optional ability doesn't respect player choice

**Symptom:**
```typescript
// Ability marked as optional but always triggers
optional: true,
```

**Solution:** Ensure test provides choice
```typescript
testEngine.playCard(card, {
  chooseOptional: true // or false
});
```

**Test both cases:**
```typescript
it("can choose to activate ability", () => {
  testEngine.playCard(card, { chooseOptional: true });
  expect(/* effect happened */).toBe(true);
});

it("can choose not to activate ability", () => {
  testEngine.playCard(card, { chooseOptional: false });
  expect(/* effect did not happen */).toBe(true);
});
```

## Targeting Issues

### Issue 9: Target Not Resolving

**Problem:** Targeting ability doesn't properly select target

**Common Causes:**
1. No valid targets available
2. Target filter too restrictive
3. Target not passed to effect

**Solution:**
```typescript
// Ensure valid targets exist
const testEngine = new TestEngine({
  hand: [cardWithTargeting],
  play: [validTarget], // Must have valid target
});

// Pass target in playCard options
testEngine.playCard(cardWithTargeting, {
  targets: [validTarget]
});

// Verify target filter
target: {
  type: "character",
  filter: (card) => {
    console.log("Checking card:", card.name, "Valid:", card.zone === "play");
    return card.zone === "play"; // Ensure filter logic is correct
  }
}
```

### Issue 10: Multi-Target Abilities

**Problem:** Ability should target multiple cards but only targets one

**Solution:**
```typescript
// For "up to X targets" abilities
target: upToXTargets(2, characterFilter),

// Pass multiple targets in test
testEngine.playCard(card, {
  targets: [target1, target2]
});

// For "all matching cards" abilities
target: allMatchingCards(filter),
// No need to pass targets - automatically selects all
```

## Test Issues

### Issue 11: Test Passes But Behavior is Wrong

**Problem:** Test passes but card doesn't work correctly in practice

**Common Causes:**
1. Test doesn't verify correct behavior
2. Test setup doesn't match real game state
3. Mocking hides real issues

**Solution:** Test real behavior, not mocks
```typescript
// ❌ Don't test implementation
it("calls drawCard method", () => {
  const spy = jest.spyOn(game, 'drawCard');
  testEngine.playCard(card);
  expect(spy).toHaveBeenCalled();
});

// ✅ Test observable behavior
it("adds a card to hand", () => {
  const initialHandSize = testEngine.getHand().length;
  testEngine.playCard(card);
  expect(testEngine.getHand().length).toBe(initialHandSize + 1);
});
```

### Issue 12: Flaky Tests

**Problem:** Tests pass sometimes, fail other times

**Common Causes:**
1. Relying on random behavior
2. Shared state between tests
3. Async timing issues

**Solutions:**

**For random behavior:**
```typescript
// ❌ Don't rely on deck order without control
it("draws a specific card", () => {
  testEngine.playCard(card);
  expect(testEngine.getHand()[0]).toBe(specificCard); // Flaky
});

// ✅ Control the deck order
it("draws a card from deck", () => {
  const testEngine = new TestEngine({
    deck: [specificCard], // Controlled order
    hand: [card],
  });
  
  testEngine.playCard(card);
  expect(testEngine.getHand()).toContain(specificCard);
});
```

**For shared state:**
```typescript
// ❌ Don't reuse testEngine between tests
let testEngine;
beforeAll(() => {
  testEngine = new TestEngine({...}); // Shared state
});

// ✅ Create fresh testEngine for each test
beforeEach(() => {
  testEngine = new TestEngine({...}); // Fresh state
});
// Or create inline in each test
```

### Issue 13: Tests Don't Fail When Implementation is Missing

**Problem:** Tests pass even though ability isn't implemented

**Cause:** Test doesn't actually verify the behavior

**Solution:** Write test first, verify it fails
```typescript
it("draws a card when played", () => {
  const testEngine = new TestEngine({
    deck: [extraCard],
    hand: [cardToTest],
  });
  
  const initialHandSize = testEngine.getHand().length;
  testEngine.playCard(cardToTest);
  
  // This should fail if ability not implemented
  expect(testEngine.getHand().length).toBe(initialHandSize);
});
```

**TDD Process:**
1. Write test
2. **Run test - should FAIL**
3. Implement ability
4. Run test - should PASS

## Pattern Matching Issues

### Issue 14: Can't Find Similar Cards

**Problem:** similar.json file doesn't exist or is empty

**Possible Causes:**
1. Card too new (index not generated yet)
2. Wrong card ID format
3. File path incorrect

**Solution:**
```typescript
// Check file exists at correct path
const path = `packages/scripts/src/cards-json/llm-index/cards/${SET}-${NUMBER}-${CARD_ID}/similar.json`;

// Verify format: SET is 3 digits, NUMBER is 3 digits
// Example: 006-012-chip-ranger-leader
//          ^^^-^^^-card-id
//          SET NUM

// If file doesn't exist, manually find similar cards by:
// 1. Reading card text
// 2. Identifying key patterns (triggers, effects, keywords)
// 3. Searching for cards with same patterns in llm-index/patterns/
```

### Issue 15: Pattern Examples Use Deprecated Approach

**Problem:** Similar cards use old patterns no longer recommended

**Solution:** Prioritize recent sets
```typescript
// When loading similar cards, prefer:
// - Set 010 (newest)
// - Set 009
// - Set 008
// - Set 007

// Avoid patterns from:
// - Set 001-003 (may use deprecated approaches)

// Verify pattern is current by checking multiple recent cards
```

## TypeScript Compilation Issues

### Issue 16: Cannot Find Module

**Problem:** `Cannot find module '@lorcanito/lorcana-engine/...'`

**Solution:**
```bash
# 1. Verify you're in correct directory
cd packages/lorcana-engine

# 2. Install dependencies
bun install

# 3. Build the package
bun run build

# 4. Check tsconfig.json paths are correct
```

### Issue 17: Circular Dependency

**Problem:** `Warning: Circular dependency detected`

**Solution:**
```typescript
// ❌ Circular import
// File A imports B, B imports A

// ✅ Extract shared code to third file
// File A imports C, File B imports C, no circular dependency
```

## Runtime Issues

### Issue 18: Effect Not Applying to Correct Target

**Problem:** Effect applies to wrong card or no card

**Debugging:**
```typescript
effects: [
  (context: EffectContext) => {
    console.log("Target:", context.target);
    console.log("Target ID:", context.target?.id);
    console.log("This card:", this.name);
    
    // Verify target is correct before applying effect
    if (!context.target) {
      throw new Error("No target provided");
    }
    
    // Apply effect
    context.target.modifyStrength(2);
  }
]
```

### Issue 19: Ability Triggering Multiple Times

**Problem:** Ability fires more than once per trigger

**Common Causes:**
1. Multiple copies of card in play
2. Ability registered multiple times
3. Trigger condition too broad

**Solution:**
```typescript
// Verify trigger specificity
// ❌ Too broad
trigger: wheneverACharacterIsPlayed(), // Triggers for ANY character

// ✅ Specific
trigger: whenYouPlayThisCharacter(), // Triggers only for THIS character

// For "whenever you play a character" abilities, this is correct behavior
// But verify test accounts for it:
it("triggers once when this character is played", () => {
  const testEngine = new TestEngine({
    hand: [card],
  });
  
  let triggerCount = 0;
  // Hook into trigger to count
  
  testEngine.playCard(card);
  expect(triggerCount).toBe(1); // Not 2 or more
});
```

## Game State Issues

### Issue 20: Card in Wrong Zone

**Problem:** Card not in expected zone (hand, play, discard, etc.)

**Debugging:**
```typescript
it("card moves to play", () => {
  const testEngine = new TestEngine({
    hand: [card],
  });
  
  console.log("Before play:", card.zone); // Should be "hand"
  testEngine.playCard(card);
  console.log("After play:", card.zone); // Should be "play"
  
  expect(card.zone).toBe("play");
});
```

**Common Zone Values:**
- `"hand"` - In player's hand
- `"play"` - In play (for characters, items, locations)
- `"deck"` - In deck
- `"discard"` - In discard pile
- `"inkwell"` - In inkwell
- `"exiled"` - Exiled/removed from game

## Getting Help

When stuck:

1. **Find similar cards** - Load pattern files to see how others solved it
2. **Check recent implementations** - Prioritize sets 010, 009, 008, 007
3. **Read the card text carefully** - Implementation must match exactly
4. **Test behavior, not implementation** - Focus on what players observe
5. **Use console.log** - Debug intermediate states
6. **Start simple** - Implement core functionality first, edge cases later

## Quick Reference Checklist

When implementing a card:

- [ ] Import cards by reference, not ID strings
- [ ] Use TestEngine, not TestStore
- [ ] Write tests first (TDD)
- [ ] Test behavior, not implementation
- [ ] Use descriptive test names
- [ ] Test both positive and negative cases
- [ ] Verify tests fail before implementing (RED)
- [ ] Implement using patterns from similar cards
- [ ] Verify tests pass after implementing (GREEN)
- [ ] No `any` types
- [ ] Run type checking: `bun run check-types`
- [ ] All tests passing: `bun test "Card Name"`

## Keywords

troubleshooting, debugging, common-issues, errors, fixes, testing-problems, implementation-problems


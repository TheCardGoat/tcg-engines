---
name: lorcana-cards
description: Implements Disney Lorcana TCG cards in packages/lorcana-engine using test-driven development. Analyzes similar cards from llm-index to identify patterns (triggers, effects, conditions, keywords, targets), writes comprehensive tests first, then implements abilities. Use when implementing new cards, writing tests, fixing card behaviors, or debugging card abilities. Works exclusively within lorcana-engine package.
---

# Lorcana Card Implementation Skill

## Overview

This skill helps you implement Disney Lorcana TCG card abilities using test-driven development (TDD) and pattern-based learning from similar card implementations. You'll leverage the llm-index system to find similar cards, study their patterns, and apply proven approaches to new implementations.

## Prerequisites

Before starting, validate:
- Working directory is `packages/lorcana-engine` or monorepo root
- Access to `packages/scripts/src/cards-json/llm-index/` (pattern analysis)
- Access to `packages/lorcana-engine/src/cards/` (implementations)

## Implementation Workflow

When implementing a card, follow this natural workflow:

### 1. Identify the Card

Given user input like "Chip - Ranger Leader", "006-012-chip-ranger-leader", or just "Chip":

**Extract card information:**
- Card name (e.g., "Chip")
- Card title (e.g., "Ranger Leader")
- Set and number (e.g., "006", #12)

**If ambiguous**, ask the user:
> "Multiple cards match. Which one?
> 1. Chip - Ranger Leader (Set 006, #12)
> 2. Chip - Flicker Fan (Set 001, #31)"

**Confirm before proceeding:**
> "Working on: Chip - Ranger Leader (Set 006, #12)"

**Store these values:**
- `CARD_NAME`, `CARD_TITLE`, `CARD_ID`, `CARD_SET`, `CARD_NUMBER`

### 2. Locate Card Files

Find the card's implementation files using the pattern:
- **Definition**: `packages/lorcana-engine/src/cards/[SET]/[TYPE]/[NUMBER]-[CARD_ID].ts`
- **Tests**: `packages/lorcana-engine/src/cards/[SET]/[TYPE]/[NUMBER]-[CARD_ID].test.ts`

**Example:**
- Definition: `packages/lorcana-engine/src/cards/006/characters/012-chip-ranger-leader.ts`
- Tests: `packages/lorcana-engine/src/cards/006/characters/012-chip-ranger-leader.test.ts`

**Read both files** to understand the current implementation state.

**If test file doesn't exist**, you'll create it in step 5.

### 3. Load Similar Cards Index

Read the similarity analysis for this specific card:

**Path:** `packages/scripts/src/cards-json/llm-index/cards/[SET]-[NUMBER]-[CARD_ID]/similar.json`

**Example:** `packages/scripts/src/cards-json/llm-index/cards/006-012-chip-ranger-leader/similar.json`

**Extract the patterns object**, which contains arrays of pattern IDs:
```json
{
  "patterns": {
    "triggers": ["whenever-quests", "on-play"],
    "effects": ["draw-cards", "deal-damage"],
    "conditions": ["may", "while-condition"],
    "keywords": ["support", "challenger"],
    "targets": ["chosen-character", "opposing-character"],
    "costs": ["exert", "banish"]
  }
}
```

### 4. Load Pattern Files and Similar Cards

Using the pattern IDs from step 3, load the pattern files:

**Base path:** `packages/scripts/src/cards-json/llm-index/patterns/`

**File structure:**
- `triggers/[TRIGGER_NAME].json`
- `effects/[EFFECT_NAME].json`
- `conditions/[CONDITION_NAME].json`
- `keywords/[KEYWORD_NAME].json`
- `targets/[TARGET_NAME].json`
- `costs/[COST_NAME].json`

**Each pattern file contains:**
```json
{
  "pattern": "whenever-quests",
  "description": "Triggers when a character quests",
  "cards": [
    {
      "id": "TFC-149-jasmine-queen-of-agrabah",
      "name": "Jasmine",
      "title": "Queen of Agrabah",
      "set": "TFC",
      "number": 149,
      "type": "character",
      "category": "characters",
      "filePath": "001/characters/149-jasmine-queen-of-agrabah.ts"
    }
  ]
}
```

**Strategy:**
- Load up to 5 cards per pattern file
- Aggregate 10-20 unique similar cards total
- **Prioritize recent sets**: 010, 009, 008, 007 (newer patterns)
- Remove duplicates based on card ID

### 5. Study Similar Implementations

For each similar card, read both files:
- **Definition**: `packages/lorcana-engine/src/cards/[FILEPATH]`
- **Tests**: `packages/lorcana-engine/src/cards/[FILEPATH].test.ts`

**Look for:**
- How triggers are implemented (e.g., `whenYouPlayThisCharacter()`)
- How effects are coded (e.g., `drawACard`, `dealDamage()`)
- How conditions work (e.g., `optional: true`, `conditions: [...]`)
- Test structure and patterns
- Common helper functions used

**Build confidence:** If you understand the pattern after 10-15 cards, proceed. If not, load 5 more cards.

### 6. Implement Using TDD

Follow strict test-driven development:

#### Phase 1: Write Tests First (RED)

Read the card's ability text from the definition file and create comprehensive tests.

**Test structure example:**
```typescript
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
// Import cards by reference, NOT by ID string
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

**Test guidelines:**
- Use descriptive test names that explain behavior
- Test only the card's ability, NOT card properties (name, cost, etc.)
- Follow AAA pattern: Arrange, Act, Assert
- Test behavior, not implementation details
- Always use `TestEngine` (not deprecated `TestStore`)
- Import cards by reference (not by ID strings)

**Verify tests fail** before proceeding to implementation.

#### Phase 2: Implement Ability (GREEN)

Apply patterns learned from similar cards:

```typescript
export const theValueOfFriendship: ContinuousAbility = {
  type: "continuous",
  name: "The Value of Friendship",
  text: "While you have a character named Dale in play, this character gains Support.",
  conditions: [
    () => hasCharacterInPlay("Dale", this.ownerId)
  ],
  effects: [
    () => this.addKeyword("support")
  ]
};
```

**Implementation guidelines:**
- Use patterns from similar cards you studied
- Use existing helper functions from the engine
- Make tests pass incrementally (one at a time)
- Follow established trigger/effect/condition patterns
- Maintain type safety (no `any` types)
- Keep code readable and maintainable

#### Phase 3: Refactor

Once all tests pass:
- Improve code quality
- Remove duplication
- Ensure type safety
- Verify all tests still pass

### 7. Verify Implementation

Run validation checks:

```bash
# Run tests for the specific card
bun test "Card Name"

# Or run with file path
bun test packages/lorcana-engine/src/cards/[SET]/[TYPE]/[NUMBER]-[CARD_ID].test.ts

# Type check
cd packages/lorcana-engine && bun run check-types
```

**Success criteria** (all must pass):
- ✅ All test cases written and initially failing (RED)
- ✅ Ability implemented following similar card patterns
- ✅ All tests passing (GREEN)
- ✅ No TypeScript errors
- ✅ Code follows lorcana-engine conventions
- ✅ Implementation matches card text exactly

## Common Patterns

For detailed pattern reference, see [PATTERNS.md](PATTERNS.md).

**Quick reference:**

**Triggers:**
- `whenYouPlayThisCharacter()` - When you play this character
- `wheneverYouPlayACharacter()` - Whenever you play any character
- `wheneverThisQuests()` - Whenever this character quests
- `atStartOfTurn()` - At the start of your turn

**Effects:**
- `drawACard` / `drawXCards(n)` - Draw cards
- `dealDamage(n, target)` - Deal damage
- `chosenCharacterGetsStrength(n)` - Modify strength
- `banishChosenItem` - Banish item
- `returnToHand` - Return to hand

**Conditions:**
- `optional: true` - May trigger
- `conditions: [...]` - If conditions
- `whileCondition(...)` - While condition is met

**Targets:**
- `chosenCharacter` - Any character
- `chosenOpposingCharacter` - Opponent's character
- `chosenCharacterOfYours` - Your character
- `self` / `thisCharacter` - This card itself

## Critical Rules

### ✅ DO:
- **Use TestEngine** for all new tests (not deprecated TestStore)
- **Import cards by reference** (e.g., `import { chip } from "./012-chip.ts"`)
- **Prioritize recent sets** (010, 009, 008, 007) when learning patterns
- **Write tests BEFORE implementation** (strict TDD)
- **Test behavior**, not implementation details
- **Follow patterns** from similar cards
- **Maintain type safety** - no `any` types

### Test Structure

Follow AAA pattern (Arrange, Act, Assert):

```typescript
describe("Card Name - Card Title", () => {
  it("draws a card when played", () => {
    // ARRANGE: Set up game state
    const testEngine = new TestEngine({
      deck: [extraCard],
      hand: [cardToTest],
    });

    // ACT: Execute the action
    testEngine.playCard(cardToTest);

    // ASSERT: Verify the result
    expect(testEngine.getHand().length).toBe(1);
  });
});
```


### ❌ DON'T:
- Don't use deprecated `TestStore` (use `TestEngine` instead)
- Don't reference cards by ID strings (e.g., `"hercules_007-101"`)
- Don't skip TDD process (tests first, then implementation)
- Don't use `any` types - maintain strict TypeScript
- Don't copy patterns from old/deprecated sets without validation
- Don't test card's structure, test the behavior through an action on the TestEngine

## Example: Complete Workflow

**User request:** "Implement Chip - Ranger Leader"

**Step 1:** Identify card → `006-012-chip-ranger-leader`

**Step 2:** Locate files:
- `packages/lorcana-engine/src/cards/006/characters/012-chip-ranger-leader.ts`
- `packages/lorcana-engine/src/cards/006/characters/012-chip-ranger-leader.test.ts`

**Step 3:** Load similar cards index → Find patterns: `["while-condition", "support"]`

**Step 4:** Load pattern files → Discover 15 similar cards with conditional keywords

**Step 5:** Study implementations → Learn how "Work Together", "Scepter of Arendelle" implement continuous abilities with conditions

**Step 6:** TDD Implementation:
- Write tests for gaining Support when Dale is in play ✓
- Implement continuous ability with condition ✓
- Verify tests pass ✓

**Step 7:** Verify → Run `bun test "Chip"` and `bun run check-types`

**Result:** ✓ Card implementation complete

## Common Mistakes to Avoid

For detailed troubleshooting, see [COMMON_ISSUES.md](COMMON_ISSUES.md).

**Quick reference:**

❌ **Referencing cards by ID string:**
```typescript
// DON'T DO THIS
const testEngine = new TestEngine({
  play: ["hercules_007-101"], // Wrong!
});
```

✅ **Import cards by reference:**
```typescript
// DO THIS
import { herculesTrueHero } from "@lorcanito/lorcana-engine/cards/001/characters/181-hercules-true-hero.ts";

const testEngine = new TestEngine({
  play: [herculesTrueHero], // Correct!
});
```

❌ **Using deprecated TestStore:**
```typescript
// DON'T DO THIS
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
const testStore = new TestStore({...});
```

✅ **Use TestEngine:**
```typescript
// DO THIS
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
const testEngine = new TestEngine({...});
```

## Key Principles

1. **Test-Driven Development**: Always write tests before implementation
2. **Pattern-Based Learning**: Use similar cards as implementation guides
3. **Type Safety**: Maintain strict TypeScript typing throughout
4. **Behavior Testing**: Test card behavior, not implementation details
5. **Incremental Implementation**: Make one test pass at a time
6. **Code Quality**: Follow established patterns and maintain readability
7. **Recent Patterns**: Prefer patterns from recent sets (avoid deprecated approaches)

## Additional Resources

- **Pattern Reference**: [PATTERNS.md](PATTERNS.md) - Detailed trigger/effect/condition patterns
- **Test Guide**: [TEST_GUIDE.md](TEST_GUIDE.md) - Testing best practices and examples
- **Common Issues**: [COMMON_ISSUES.md](COMMON_ISSUES.md) - Troubleshooting guide
- **Code Examples**: [examples/](examples/) - Complete implementation examples

## Keywords

card, lorcanito, lorcana, tcg, implementation, tdd, test-driven-development, game-engine, pattern-based-learning

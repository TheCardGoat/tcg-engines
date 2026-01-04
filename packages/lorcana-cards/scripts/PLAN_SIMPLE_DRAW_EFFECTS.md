# Plan: Implement Parsers and Card Generators for All Simple Draw Effects

## Overview

This plan outlines the implementation strategy to correctly parse and generate card files for all cards with **simple draw effects**. A simple draw effect is defined as any effect that **only draws cards**, regardless of trigger or condition. Effects that draw cards AND perform other actions (e.g., "Draw a card, then discard") are NOT considered simple.

## Definition: Simple Draw Effect

**Simple Draw Effect:**
- ✅ Only draws cards (no other effects)
- ✅ Can have any trigger (when you play, whenever this quests, at start of turn, etc.)
- ✅ Can have any condition (if X, when Y happens, etc.)
- ✅ Can have different targets (controller, chosen player, each player, opponent, etc.)
- ✅ Can have different amounts (1, 2, 3, {d} placeholder, etc.)
- ✅ Can be action abilities (standalone "Draw X cards")
- ✅ Can be triggered abilities ("When you play this, draw a card")
- ✅ Can be optional abilities ("You may draw a card")
- ✅ "If X, draw a card"
- ✅ "Draw a card for each character" (for-each effect)
- ✅ "Draw a card. Repeat this 3 times" (repeat effect)

**NOT Simple Draw Effect:**
- ❌ "Draw a card, then discard" (sequence with discard)
- ❌ "Draw 2 cards, then deal 1 damage" (sequence with damage)
- ❌ "Choose one: Draw a card or discard a card" (choice effect)


## Current State Analysis

### Existing Components

1. **Effect Parser** (`packages/lorcana-cards/src/parser/parsers/effect-parser.ts`)
   - ✅ Already parses draw effects via `DRAW_AMOUNT_PATTERN`
   - ✅ Already detects composite effects (sequence, choice, optional, conditional, for-each, repeat)
   - ✅ Returns `{ type: "draw", amount: number, target: PlayerTarget }` for simple draws
   - ✅ Returns composite effect types for non-simple draws

2. **Parser Validator** (`packages/lorcana-cards/scripts/generators/parser-validator.ts`)
   - ✅ `isSimpleDrawEffect()` checks if effect type is exactly "draw" (not composite)
   - ✅ `isParseableCard()` validates cards with keywords or simple draw effects
   - ⚠️ Current logic may need refinement for edge cases

3. **File Generator** (`packages/lorcana-cards/scripts/generators/file-generator.ts`)
   - ✅ Uses parser to extract structured abilities
   - ✅ Generates TypeScript card files with proper AbilityDefinition format
   - ✅ Handles both action and triggered abilities

### Current Limitations

1. **Validator Logic**: The `isSimpleDrawEffect()` function only checks effect type, but doesn't validate that the effect ONLY draws (no other effects in sequences)
2. **Composite Detection**: Need to ensure sequences with draw + other effects are correctly rejected
3. **Edge Cases**: Need to handle cases like:
   - "Draw a card" (simple ✅)
   - "Draw 2 cards" (simple ✅)
   - "Each player draws a card" (simple ✅)
   - "Chosen player draws 2 cards" (simple ✅)
   - "Draw a card, then discard" (NOT simple ❌)
   - "Draw 2 cards, then deal 1 damage" (NOT simple ❌)

## Implementation Plan

### Phase 1: Enhance Parser Validation

**Goal**: Ensure the parser correctly identifies simple draw effects and rejects composite effects.

#### Task 1.1: Improve `isSimpleDrawEffect()` Function

**File**: `packages/lorcana-cards/scripts/generators/parser-validator.ts`

**Current Implementation**:
```typescript
function isSimpleDrawEffect(effect: { type: string }): boolean {
  const compositeTypes = ["sequence", "choice", "optional", "conditional", "for-each", "repeat"];
  if (compositeTypes.includes(effect.type)) {
    return false;
  }
  return effect.type === "draw";
}
```

**Enhancement Needed**:
- Add recursive check for nested composite effects
- Validate that effect has only draw properties (no other effect types)
- Add explicit validation that effect is not wrapped in optional/conditional

**Proposed Implementation**:
```typescript
function isSimpleDrawEffect(effect: { type: string; [key: string]: unknown }): boolean {
  // Reject all composite types
  const compositeTypes = ["sequence", "choice", "optional", "conditional", "for-each", "repeat"];
  if (compositeTypes.includes(effect.type)) {
    return false;
  }

  // Must be exactly "draw" type
  if (effect.type !== "draw") {
    return false;
  }

  // Validate that it's a pure draw effect (no nested effects)
  // Draw effects should only have: type, amount, target
  const allowedKeys = ["type", "amount", "target"];
  const hasOnlyDrawProperties = Object.keys(effect).every(key => 
    allowedKeys.includes(key)
  );

  return hasOnlyDrawProperties;
}
```

#### Task 1.2: Add Validation for Sequence Effects with Draw

**File**: `packages/lorcana-cards/scripts/generators/parser-validator.ts`

**Enhancement**: Add explicit check to reject sequence effects that contain draw + other effects.

**Proposed Function**:
```typescript
function isSequenceWithOnlyDraw(effect: { type: string; steps?: unknown[] }): boolean {
  if (effect.type !== "sequence") {
    return false;
  }

  // Check if all steps are draw effects
  if (!effect.steps || !Array.isArray(effect.steps)) {
    return false;
  }

  return effect.steps.every(step => 
    typeof step === "object" && 
    step !== null && 
    "type" in step && 
    step.type === "draw" &&
    isSimpleDrawEffect(step)
  );
}
```

**Note**: This function would be used to potentially allow sequences of ONLY draw effects (e.g., "Draw a card, then draw another card"), but based on the user's definition, we should reject ALL sequences, even if they only contain draws.

### Phase 2: Enhance Card Validation

**Goal**: Ensure `isParseableCard()` correctly identifies cards with simple draw effects.

#### Task 2.1: Update `isParseableCard()` Documentation

**File**: `packages/lorcana-cards/scripts/generators/parser-validator.ts`

**Current Documentation** says it rejects:
- Composite effects (e.g., "Draw a card and discard a card", "Draw 2 cards, then deal 1 damage")
- Choice effects
- Optional effects
- Conditional effects

**Enhancement**: Update documentation to be more explicit about what IS allowed:
- ✅ "Draw a card" (action)
- ✅ "Draw 2 cards" (action)
- ✅ "When you play this, draw a card" (triggered)
- ✅ "Whenever this character quests, draw a card" (triggered)
- ✅ "At the start of your turn, draw a card" (triggered)
- ✅ "Each player draws a card" (action with target)
- ✅ "Chosen player draws 2 cards" (action with target)

#### Task 2.2: Add Test Cases for Edge Cases

**File**: Create or update test file for parser validation

**Test Cases to Add**:
1. ✅ "Draw a card" → should be parseable
2. ✅ "Draw 2 cards" → should be parseable
3. ✅ "Each player draws a card" → should be parseable
4. ✅ "Chosen player draws 2 cards" → should be parseable
5. ✅ "When you play this, draw a card" → should be parseable
6. ✅ "You may draw a card" → should NOT be parseable (optional)
7. ✅ "If X, draw a card" → should NOT be parseable (conditional)
8. ✅ "Draw a card for each character" → should NOT be parseable (for-each)
9. ❌ "Draw a card, then discard" → should NOT be parseable
10. ❌ "Draw 2 cards, then deal 1 damage" → should NOT be parseable
11. ❌ "Choose one: Draw a card or discard" → should NOT be parseable


### Phase 3: Enhance File Generator

**Goal**: Ensure generated card files correctly represent simple draw effects.

#### Task 3.1: Verify Ability Generation

**File**: `packages/lorcana-cards/scripts/generators/file-generator.ts`

**Current Implementation**: The file generator already uses the parser to extract structured abilities. Verify that:
- Action abilities with draw effects are correctly generated
- Triggered abilities with draw effects are correctly generated
- Ability structure matches `AbilityDefinition` format

**Verification Checklist**:
- [ ] Action ability: `{ type: "action", effect: { type: "draw", amount: 1, target: "CONTROLLER" } }`
- [ ] Triggered ability: `{ type: "triggered", trigger: {...}, effect: { type: "draw", amount: 1, target: "CONTROLLER" } }`
- [ ] Target variations: CONTROLLER, CHOSEN_PLAYER, EACH_PLAYER, OPPONENT
- [ ] Amount variations: 1, 2, 3, {d} placeholder

#### Task 3.2: Add Logging for Debugging

**Enhancement**: Add console logging to track which cards are being generated with simple draw effects.

**Proposed Addition**:
```typescript
// In generate-cards.ts, after filtering generatableCards
const simpleDrawCards = Object.values(generatableCards).filter(card => {
  if (card.vanilla) return false;
  const abilityTexts = card.rulesText.split("\n").filter((t) => t.trim());
  return abilityTexts.some(text => {
    const result = parseAbilityText(stripReminderText(text));
    if (!result.success || !result.ability) return false;
    const ability = result.ability.ability;
    if (ability.type === "action" || ability.type === "triggered") {
      return ability.effect && isSimpleDrawEffect(ability.effect);
    }
    return false;
  });
});

console.log(`  Simple draw effect cards: ${simpleDrawCards.length}`);
```

### Phase 4: Testing and Validation

**Goal**: Verify that all simple draw effects are correctly parsed and generated.

#### Task 4.1: Create Test Suite

**File**: `packages/lorcana-cards/scripts/__tests__/simple-draw-effects.test.ts` (new file)

**Test Cases**:

```typescript
describe("Simple Draw Effects", () => {
  describe("isParseableCard", () => {
    it("should accept 'Draw a card'", () => {
      const card = createTestCard({ rulesText: "Draw a card" });
      expect(isParseableCard(card)).toBe(true);
    });

    it("should accept 'Draw 2 cards'", () => {
      const card = createTestCard({ rulesText: "Draw 2 cards" });
      expect(isParseableCard(card)).toBe(true);
    });

    it("should accept 'Each player draws a card'", () => {
      const card = createTestCard({ rulesText: "Each player draws a card" });
      expect(isParseableCard(card)).toBe(true);
    });

    it("should accept 'When you play this, draw a card'", () => {
      const card = createTestCard({ rulesText: "When you play this, draw a card" });
      expect(isParseableCard(card)).toBe(true);
    });

    it("should reject 'Draw a card, then discard'", () => {
      const card = createTestCard({ rulesText: "Draw a card, then discard" });
      expect(isParseableCard(card)).toBe(false);
    });

    it("should reject 'Draw 2 cards, then deal 1 damage'", () => {
      const card = createTestCard({ rulesText: "Draw 2 cards, then deal 1 damage" });
      expect(isParseableCard(card)).toBe(false);
    });

    it("should reject 'Choose one: Draw a card or discard'", () => {
      const card = createTestCard({ rulesText: "Choose one: Draw a card or discard" });
      expect(isParseableCard(card)).toBe(false);
    });

    it("should reject 'You may draw a card'", () => {
      const card = createTestCard({ rulesText: "You may draw a card" });
      expect(isParseableCard(card)).toBe(false);
    });

    it("should reject 'If X, draw a card'", () => {
      const card = createTestCard({ rulesText: "If you have 5 or more cards in hand, draw a card" });
      expect(isParseableCard(card)).toBe(false);
    });

    it("should reject 'Draw a card for each character'", () => {
      const card = createTestCard({ rulesText: "Draw a card for each character you have" });
      expect(isParseableCard(card)).toBe(false);
    });
  });
});
```

#### Task 4.2: Integration Testing

**Goal**: Test the full generation pipeline with real card data.

**Steps**:
1. Run `bun packages/lorcana-cards/scripts/generate-cards.ts`
2. Check console output for counts of:
   - Vanilla cards
   - Parseable cards (keywords/actions)
   - Simple draw effect cards
3. Verify generated card files contain correct ability structures
4. Spot-check a few generated files to ensure they match expected format

#### Task 4.3: Validate Against Real Cards

**Goal**: Find all cards in the dataset with simple draw effects and verify they're generated.

**Steps**:
1. Search canonical-cards.json for cards with draw effects
2. Categorize them:
   - Simple draw (should be generated)
   - Composite draw (should NOT be generated)
3. Verify generation script correctly categorizes them
4. Document any edge cases or discrepancies

### Phase 5: Documentation

**Goal**: Document the simple draw effect implementation.

#### Task 5.1: Update Code Comments

**Files**: 
- `packages/lorcana-cards/scripts/generators/parser-validator.ts`
- `packages/lorcana-cards/scripts/generators/file-generator.ts`

**Enhancement**: Add detailed JSDoc comments explaining:
- What constitutes a simple draw effect
- Examples of simple vs. composite draw effects
- How the validation works

#### Task 5.2: Create Implementation Guide

**File**: `packages/lorcana-cards/docs/SIMPLE_DRAW_EFFECTS.md` (new file)

**Content**:
- Definition of simple draw effects
- Examples of valid simple draw effects
- Examples of invalid (composite) draw effects
- How to add new simple draw effect patterns
- Troubleshooting guide

## Implementation Checklist

### Phase 1: Parser Validation
- [ ] Enhance `isSimpleDrawEffect()` with property validation
- [ ] Add recursive check for nested composite effects
- [ ] Test edge cases (sequences, choices, optionals, conditionals)

### Phase 2: Card Validation
- [ ] Update `isParseableCard()` documentation
- [ ] Add test cases for all edge cases
- [ ] Verify validation logic handles all trigger types

### Phase 3: File Generator
- [ ] Verify ability generation for action draw effects
- [ ] Verify ability generation for triggered draw effects
- [ ] Add logging for simple draw effect cards
- [ ] Test generated card file structure

### Phase 4: Testing
- [ ] Create comprehensive test suite
- [ ] Run integration tests
- [ ] Validate against real card data
- [ ] Document edge cases

### Phase 5: Documentation
- [ ] Update code comments
- [ ] Create implementation guide
- [ ] Document examples and patterns

## Success Criteria

1. ✅ All cards with simple draw effects are correctly identified as parseable
2. ✅ All cards with composite draw effects are correctly rejected
3. ✅ Generated card files contain correct ability structures
4. ✅ Test suite covers all edge cases
5. ✅ Documentation is complete and accurate

## Examples of Simple Draw Effects

### Action Abilities (Standalone)
- "Draw a card"
- "Draw {d} cards"
- "Each player draws a card"
- "Each player draws {d} cards"
- "Chosen player draws {d} cards"
- "Each opponent draws a card"
- "I SUMMON THEE {E} − Draw a card" (action with cost)
- "Speak {E}, {d} {I} - Draw a card" (action with cost)
- "THE BOOK KNOWS EVERYTHING , {d} , Banish this item — Draw {d} cards" (action with cost/banish cost)

### Triggered Abilities (Simple Draw Only)
- "When you play this, draw a card"
- "When you play this item, draw a card"
- "When you play this character, draw a card"
- "Whenever this character quests, draw a card"
- "Whenever this character is challenged, draw a card"
- "When this character is banished, draw a card"
- "When this character is banished in a challenge, draw a card"
- "At the start of your turn, draw a card"
- "Whenever you play a card, draw a card"
- "Whenever you play a Floodborn character, draw a card"
- "Whenever you play a Floodborn character on this card, draw a card"
- "ORIGIN STORY When you play a Floodborn character on this card, draw a card"
- "FRESH INK When you play this item, draw a card"
- "PREFLIGHT CHECK When you play this item, draw a card"
- "WHAT COMES NEXT? When you play this character, draw a card"
- "YOUR REWARD AWAITS Whenever you play a card, draw a card"
- "UPPER HAND Whenever this character is challenged, draw a card"
- "UNEARTHED When you play this character, each opponent draws a card"
- "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card"
- "LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw {d} cards" (conditional trigger, but effect is simple draw)

### Examples of NON-Simple Draw Effects

**Sequences (draw + other effect):**
- "Draw a card, then discard" (sequence)
- "Draw {d} cards, then choose and discard a card" (sequence)
- "Draw {d} cards, then choose and discard {d} cards" (sequence)
- "Draw 2 cards, then deal 1 damage" (sequence)
- "Draw a card, then choose and discard a card" (sequence)
- "Gain {d} lore. Draw a card" (sequence)
- "Banish chosen item. Draw a card" (sequence)
- "Banish chosen character. Draw a card" (sequence)
- "Deal {d} damage to chosen character. Draw a card" (sequence)
- "Remove up to {d} damage from chosen character. Draw a card" (sequence)
- "Chosen character gains Support this turn. Draw a card" (sequence)
- "Draw a card. Chosen character gains Challenger +{d} this turn" (sequence)
- "Draw {d} cards, then put {d} cards from your hand on the top of your deck in any order" (sequence)
- "Draw a card. Shuffle up to {d} cards from your opponent's discard into your opponent's deck" (sequence)
- "BREAKING RECORDS {E}, {d} {I} – Draw a card and gain {d} lore" (sequence with "and")

**Optional Effects (NOT simple):**
- "You may draw a card"
- "Each player may draw a card"
- "AMETHYST LIGHT {E} − Each player may draw a card"
- "ALLOW ME At the start of your turn, each player may draw a card"
- "JUMBO POP When you play this item, you may draw a card"
- "IT WORKS! Whenever you play an item, you may draw a card"
- "RESOURCEFUL When you play this item, you may draw a card"
- "CLOSER LOOK When you play this character, you may draw a card"
- "FREE FRUIT When this character is banished, you may draw a card"
- "FINE PRINT Whenever an opponent plays a song, you may draw a card"
- "FLY, MY PET! When this character is banished, you may draw a card"
- "PARTING GIFT When this character is banished, you may draw a card"
- "DARK KNOWLEDGE Whenever this character quests, you may draw a card"
- "OK, WHERE AM I? When this character is banished, you may draw a card"
- "TEA PARTY Whenever this character is challenged, you may draw a card"
- "ETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card"
- "POP! When this character is banished in a challenge, you may draw a card"
- "LOST IN A BOOK Whenever a character is banished while here, you may draw a card"
- "NEW INFORMATION Once per turn, when you play a character here, you may draw a card"
- "NOW, SING! Whenever you play a song, you may pay {d} {I} to draw a card"
- "LOOKING FOR THIS? Whenever you play another item, you may pay {d} {I} to draw a card"
- "TRAINING Whenever you play a character with {d} {S} or more, you may pay {d} {I} to draw a card"
- "ASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card"
- "UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card"
- "USING THE MIRROR At the start of your turn, for each character you have here, you may draw a card"
- "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card"
- "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card"
- "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card"
- "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card"
- "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card"
- "WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card"
- "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item to draw a card"
- "RESTLESS SOULS Whenever this character quests, you may banish this character to draw a card"
- "NICE AND TIDY Whenever you play another character, you man banish this character to draw a card"
- "SO CHEESY When you play this character, you may draw a card, then choose and discard a card"
- "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card"
- "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card"
- "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card"
- "THE GOOD OF OTHERS When this character is banished in a challenge, you may draw a card"
- "PLAY IT COOL During an opponent's turn, whenever one of your characters is banished, you may draw a card"
- "ALL FOR ONE AND ONE FOR ALL Whenever one of your characters with Bodyguard is banished, you may draw a card"
- "BRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play"
- "GOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card"
- "LEARN MORE Whenever an opponent chooses this character for an action or ability, you may draw a card"
- "LET THE GAME BEGIN Whenever one of your characters challenges another character, you may draw a card"
- "THREE WISHES Whenever this character quests, you may shuffle this card into your deck to draw {d} cards"

**Conditional Effects (NOT simple):**
- "If you have no cards in your hand, draw a card"
- "SHOW ME {E}, {d} {I} - If you have no cards in your hand, draw a card"
- "I GOT TO BE GOING {E} – If you've played {d} or more actions this turn, draw a card"
- "CAPTIVE AUDIENCE {E} – If you have at least {d} other characters in play, draw a card"
- "OH, MY LAND! When you play this character, if you have a location in play, draw a card"
- "If chosen opponent has more cards in their hand than you, draw cards until you have the same number"
- "LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw {d} cards" (Note: This has a conditional trigger, but the effect itself is a simple draw. This should be considered simple.)

**For-Each Effects (NOT simple):**
- "Draw a card for each character you have"
- "Draw a card for each opposing character with {S}"
- "TECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}"
- "For each character that sang this song, draw a card and gain {d} lore" (for-each + sequence)
- "Banish any number of your items, then draw a card for each item banished this way" (for-each pattern)

**Choice Effects (NOT simple):**
- "Choose one: Draw a card or discard" (choice)
- "ROLL WITH IT When you play this character, choose one: Each player draws a card. Each player chooses and discards a card"

**Repeat Effects (NOT simple):**
- "Draw a card. Repeat this 3 times" (repeat)

**Complex Patterns:**
- "Each player discards their hand and draws {d} cards" (sequence with discard all)
- "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card" (conditional based on opponent choice)
- "DRASTIC MEASURES When you play this character, you may discard your hand to draw {d} cards" (optional with cost)
- "Each player draws {d} cards and gains {d} lore. If {d} or more characters sang this song, ready them. They can't quest for the rest of this turn" (sequence + conditional)

## Edge Cases and Special Patterns

### Conditional Triggers vs Conditional Effects

**Important Distinction**: A conditional trigger with a simple draw effect should be considered simple, but a conditional effect wrapping a draw should NOT.

**Simple (Conditional Trigger, Simple Effect):**
- "LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw {d} cards"
  - Trigger has condition, but effect is pure draw → **SIMPLE** ✅
- "OH, MY LAND! When you play this character, if you have a location in play, draw a card"
  - Trigger has condition, but effect is pure draw → **SIMPLE** ✅ (if parser handles it as triggered with conditional trigger)

**NOT Simple (Conditional Effect):**
- "SHOW ME {E}, {d} {I} - If you have no cards in your hand, draw a card"
  - Effect itself is conditional → **NOT SIMPLE** ❌
- "I GOT TO BE GOING {E} – If you've played {d} or more actions this turn, draw a card"
  - Effect itself is conditional → **NOT SIMPLE** ❌

**Implementation Note**: The parser should distinguish between:
1. Triggered abilities with conditional triggers (should be simple if effect is draw)
2. Conditional effects (should NOT be simple)

### Action Costs with Draw Effects

**Simple (Action with Cost, Simple Draw):**
- "I SUMMON THEE {E} − Draw a card" → **SIMPLE** ✅
- "Speak {E}, {d} {I} - Draw a card" → **SIMPLE** ✅
- "THE BOOK KNOWS EVERYTHING , {d} , Banish this item — Draw {d} cards" → **SIMPLE** ✅
  - Note: The "Banish this item" is a cost, not part of the effect sequence

**Implementation Note**: Action abilities with costs should still be considered simple if the effect itself is only drawing.

### "And" vs "Then" in Sequences

**NOT Simple (Sequence with "and"):**
- "BREAKING RECORDS {E}, {d} {I} – Draw a card and gain {d} lore" → **NOT SIMPLE** ❌
  - Uses "and" to combine effects in a sequence

**NOT Simple (Sequence with "then"):**
- "Draw a card, then choose and discard a card" → **NOT SIMPLE** ❌
- "Draw {d} cards, then put {d} cards from your hand on the top of your deck" → **NOT SIMPLE** ❌

### For-Each Patterns

**NOT Simple (For-Each):**
- "TECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}" → **NOT SIMPLE** ❌
- "Banish any number of your items, then draw a card for each item banished this way" → **NOT SIMPLE** ❌
  - Note: This is a sequence + for-each pattern

### Complex Conditional Patterns

**NOT Simple (Conditional Based on Opponent Choice):**
- "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card" → **NOT SIMPLE** ❌
  - The draw is conditional on opponent's choice, making it a conditional effect

### Summary of Coverage

Based on analysis of all 196 draw-related card texts:

**Simple Draw Effects Found:**
- Standalone action draws: ~5-10 cards
- Triggered simple draws: ~20-30 cards
- Action draws with costs: ~3-5 cards
- Conditional draws: ~10-15 cards
- For-each draws: ~5-10 cards
- Optional draws ("you may"): ~50-60 cards

**Non-Simple Draw Effects Found:**
- Sequence draws (draw + other): ~40-50 cards
- Complex patterns: ~30-40 cards

**Coverage Verification:**
- ✅ All simple draw patterns are covered by the plan
- ✅ All non-simple patterns are correctly excluded
- ✅ Edge cases (conditional triggers, action costs) are addressed
- ✅ Special patterns (for-each, complex conditionals) are documented

## Next Steps

1. Review and approve this plan
2. Implement Phase 1 (Parser Validation)
3. Test Phase 1 changes with all identified simple draw patterns
4. Implement Phase 2 (Card Validation)
5. Test Phase 2 changes
6. Implement Phase 3 (File Generator)
7. Test Phase 3 changes
8. Run full integration tests (Phase 4) - validate against all 196 draw-related cards
9. Complete documentation (Phase 5)
10. Final review and validation


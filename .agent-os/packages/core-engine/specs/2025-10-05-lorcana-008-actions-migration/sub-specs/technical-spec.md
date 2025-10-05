# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/core-engine/specs/2025-10-05-lorcana-008-actions-migration/spec.md

## Technical Requirements

### Card Analysis

**Target Folder:** `packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/008/actions`

**Total Cards to Migrate:** 27 action cards

**Card List:**
1. 039-candy-drift
2. 040-she-s-your-person
3. 041-only-so-much-room
4. 042-it-means-no-worries
5. 043-trials-and-tribulations
6. 077-forest-duel
7. 078-they-never-come-back
8. 079-fantastical-and-magical
9. 080-pull-the-lever
10. 081-into-the-unknown
11. 082-everybody-s-got-a-weakness
12. 114-he-who-steals-and-runs-away
13. 115-stopped-chaos-in-its-tracks
14. 116-wrong-lever
15. 117-undermine
16. 118-walk-the-plank
17. 147-nothing-we-wont-do
18. 148-get-out
19. 149-light-the-fuse
20. 150-twitterpated
21. 151-most-everyones-mad-here
22. 175-heads-held-high
23. 176-pouncing-practice
24. 177-down-in-new-orleans
25. 201-desperate-plan
26. 202-beyond-the-horizon
27. 203-quick-shot

### Migration Process per Card

Each card must go through this systematic process:

#### 1. Test API Analysis
- **Current Pattern:** Tests use `TestEngine` (or older test utilities)
- **Required Analysis:**
  - Check if test uses new `TestEngine` methods: `playCard()`, `getCardModel()`, `getZonesCardCount()`, `passTurn()`, `challenge()`, etc.
  - Identify any deprecated API calls
  - Verify assertion patterns match new framework expectations
  - Check if test setup (initial state) uses new format

#### 2. Card Definition Analysis
- **Current Format:** `LorcanaActionCardDefinition` type
- **Required Fields:**
  - `id`: unique card identifier
  - `name`: card name
  - `type`: "action"
  - `characteristics`: array including "action"
  - `text`: card text description
  - `abilities`: array of ability definitions with new format
  - `cost`: mana cost
  - `colors`: array of card colors
  - `inkwell`: boolean
  - `illustrator`: artist name
  - `number`: card number
  - `set`: "008"
  - `rarity`: card rarity
- **Flags to Remove:**
  - `notImplemented: true` - remove after implementation
  - `missingTestCase: true` - remove after test completion

#### 3. Effect System Requirements

Based on sample cards analyzed, the following effect types must be supported:

**Stat Modification Effects:**
- Temporary stat buffs (e.g., +5 strength this turn)
- Permanent stat changes
- Conditional stat modifications

**Zone Manipulation Effects:**
- Draw cards
- Discard cards
- Move cards between zones (hand, play, discard)
- Banish characters

**Ability Grant Effects:**
- Grant keyword abilities (Challenger +X)
- Grant triggered abilities (when X happens, do Y)
- Temporary ability grants with duration (this turn, until end of turn)

**Targeting System:**
- Single target selection (chosen character, chosen opponent)
- Multi-target selection (your characters)
- Optional vs required targets
- Filter-based targeting (e.g., "your characters")

**Duration System:**
- `THIS_TURN` - effect lasts until end of current turn
- Permanent effects
- Until-condition-met effects

**Triggered Abilities:**
- "When this character is banished in a challenge" - requires trigger system
- "At the end of your turn" - requires phase-based triggers

### Framework Extension Points

If during migration a card requires functionality not yet in the framework:

1. **Add Effect Handler:** Create new effect type in `~/game-engine/engines/lorcana/src/abilities/effect/effect.ts`
2. **Add Target Type:** Create new target filter in `~/game-engine/engines/lorcana/src/abilities/targets/`
3. **Add Ability Type:** Extend ability system in `~/game-engine/engines/lorcana/src/abilities/`
4. **Add TestEngine Method:** Add helper methods to `~/game-engine/engines/lorcana/src/testing/lorcana-test-engine.ts`

### Test Patterns

**Standard Test Structure:**
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Card Name", () => {
  it("Card text description as test name", async () => {
    const testEngine = new TestEngine({
      inkwell: cardName.cost,
      play: [/* cards in play */],
      hand: [cardName],
      deck: 10,
    });

    // Execute card play
    await testEngine.playCard(cardName, {
      targets: [/* targets if needed */],
    });

    // Assert expected outcomes
    expect(testEngine.getCardModel(someCard).strength).toBe(expectedValue);
    expect(testEngine.getZonesCardCount().hand).toBe(expectedCount);
    expect(testEngine.getCardModel(someCard).zone).toBe("discard");
  });
});
```

**Edge Cases to Test:**
- Card played with no valid targets (should handle gracefully)
- Card played with optional targets not provided
- Card effects that depend on game state
- Turn-based effects that expire at end of turn
- Triggered abilities that fire under specific conditions

### Quality Metrics

Each migrated card must meet:
- ✅ Test passes without `.skip()`
- ✅ All assertions are meaningful and test game state changes
- ✅ Edge cases are covered
- ✅ Card definition has no `notImplemented` or `missingTestCase` flags
- ✅ Test description matches card text
- ✅ Code follows existing patterns in the framework

### Human Confirmation Checkpoints

After each card migration:
1. **Show test results:** Display passing test output
2. **Show changes made:** List API updates, card definition changes, framework extensions
3. **Request approval:** Ask "Ready to proceed to next card?" before continuing
4. **Allow iteration:** If human requests changes, make adjustments before moving on

### Migration Order Strategy

**Recommended Approach:** Start with simpler cards and progress to complex ones

**Complexity Classification:**
- **Simple:** Draw cards, stat buffs without triggers
- **Medium:** Multiple effects, optional targets, turn-based durations
- **Complex:** Triggered abilities, conditional effects, stack interactions

**Suggested Starting Cards:**
1. 039-candy-drift (simple stat buff + draw)
2. 040-she-s-your-person (if simpler)
3. Continue with increasing complexity

## Testing Infrastructure

### Test Execution

Run individual test:
```bash
bun test packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/008/actions/039-candy-drift.test.ts
```

Run all actions tests:
```bash
bun test packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/008/actions
```

### Test Output Requirements

Each test should provide clear output:
- Card name being tested
- Test scenario description
- Pass/fail status
- Detailed error messages if failures occur

## Documentation Requirements

As migration progresses, maintain documentation of:

1. **Common Patterns:** Reusable solutions for similar card effects
2. **API Changes:** List of old API → new API mappings discovered
3. **Framework Extensions:** New capabilities added to support cards
4. **Edge Cases:** Unexpected behaviors and how they were handled
5. **Lessons Learned:** Insights for migrating remaining card sets

This documentation should be added to:
`@.agent-os/packages/core-engine/specs/2025-10-05-lorcana-008-actions-migration/sub-specs/migration-patterns.md`

## Success Criteria

Migration is complete when:
1. All 27 tests pass without `.skip()` or error flags
2. All card definitions are in new format
3. Framework handles all effect types encountered
4. Documentation is complete with patterns and extensions
5. Zero regression in existing passing tests

# Riftbound Spec-Driven Development Plan

## Prompt for AI Agent

<context>
You are helping build a game-agnostic TCG (Trading Card Game) engine. The architecture has:
- A core engine (`@tcg/core`) that handles generic game mechanics
- Game-specific implementations (Riftbound, Lorcana, etc.) that use the core

The goal is to create abstractions by implementing real games, ensuring our patterns are practical and battle-tested.
</context>

<project_structure>
- `packages/riftbound-engine/` - Game engine implementation (moves, validators, state)
- `packages/riftbound-cards/` - Card definitions and ability parser
- `packages/riftbound-types/` - TypeScript types for Riftbound
- `.claude/skills/riftbound-rules/` - Skill for understanding Riftbound rules (use this to navigate the official rules)
</project_structure>

<task>
Create comprehensive test specifications for Riftbound game rules using Test-Driven Development (TDD).

Your deliverables:
1. **Rule Specifications** - Break down official Riftbound rules into testable specifications
2. **Red Tests** - Write failing tests that define expected behavior (mark as `.skip` for now)
3. **Test Organization** - Group tests by rule category (combat, abilities, turn structure, etc.)
</task>

<scope>
Cover ALL rule categories - order is not important:
- Turn structure (phases, states)
- Combat and showdowns
- Scoring and victory conditions
- Abilities and keywords
- Deck construction
- The Chain and timing
- Zones and card movement
- Resources and runes
</scope>

<test_coverage>
For each rule, provide BOTH:
- **Happy path tests** - Standard rule behavior
- **Edge cases** - Boundary conditions, rule interactions, and corner cases

Mark edge cases clearly in test names or group them in separate `describe` blocks.
</test_coverage>

<approach>
1. Use the riftbound-rules skill to navigate the official rules documentation
2. For each rule section, identify discrete, testable behaviors
3. Write test cases that simulate player interactions and assert final board state
4. Tests should be skipped (`it.skip` or `describe.skip`) since implementation comes later
</approach>

<output_format>
For each rule category, create a test file following this pattern:

```typescript
// packages/riftbound-engine/src/__tests__/rules/[category].test.ts
import { describe, it, expect } from 'bun:test';

describe('[Rule Category] - Rule XXX', () => {
  describe('[Specific Rule]', () => {
    it.skip('should [expected behavior]', () => {
      // Arrange: Set up initial board state
      // Act: Execute player action(s)
      // Assert: Verify final state matches rule
    });
  });

  describe('[Specific Rule] - Edge Cases', () => {
    it.skip('should handle [edge case description]', () => {
      // Edge case test...
    });
  });
});
```
</output_format>

<example>
Here's an example of what a rule specification test should look like:

```typescript
// packages/riftbound-engine/src/__tests__/rules/scoring.test.ts
import { describe, it, expect } from 'bun:test';
import { createTestGame } from '../../testing';

describe('Scoring Rules - Rule 629-633', () => {
  describe('Conquer (Rule 629)', () => {
    it.skip('should award points when gaining control of a battlefield not scored this turn', () => {
      // Arrange
      const game = createTestGame({
        player1: { score: 0, controlledBattlefields: [], ... },
      });
      
      // Act: Player 1 takes control of battlefield
      game.execute({ type: 'CONQUER_BATTLEFIELD', playerId: 'player1', battlefieldId: 'bf1' });
      
      // Assert
      expect(game.getScore('player1')).toBe(1);
      expect(game.getControlledBattlefields('player1')).toEqual(['bf1']);
    });
  });

  describe('Conquer (Rule 629) - Edge Cases', () => {
    it.skip('should NOT award points when conquering a battlefield already scored this turn', () => {
      // Arrange
      const game = createTestGame({
        player1: { score: 1, scoredThisTurn: ['bf1'] },
      });
      
      // Act: Player 1 loses and regains control same turn
      game.execute({ type: 'LOSE_CONTROL', battlefieldId: 'bf1' });
      game.execute({ type: 'CONQUER_BATTLEFIELD', playerId: 'player1', battlefieldId: 'bf1' });
      
      // Assert: Score should not increase
      expect(game.getScore('player1')).toBe(1);
    });

    it.skip('should allow scoring the same battlefield on different turns', () => {
      // Test multi-turn scoring...
    });
  });

  describe('Hold (Rule 630)', () => {
    it.skip('should award points during Beginning Phase for controlled battlefields', () => {
      // Happy path test...
    });
  });

  describe('Victory Conditions (Rule 631-633)', () => {
    it.skip('should end game when player reaches 8 points in 1v1', () => {
      // Victory condition test...
    });

    it.skip('should require 11 points for victory in 2v2 mode', () => {
      // Mode-specific victory test...
    });
  });
});
```
</example>

<constraints>
- Use `bun:test` for test imports (`import { describe, it, expect } from 'bun:test'`)
- Follow existing code patterns in `packages/riftbound-engine/src/`
- Use the existing test helpers if available
- Each test should be independent and self-contained
- Focus on rule correctness, not implementation details
- Use clear, descriptive test names that reference rule numbers
</constraints>

<success_criteria>
- All major rule sections have corresponding test files
- Each rule has at least one happy-path test case
- Edge cases and rule interactions are documented as tests
- Tests are organized logically by rule category
- Test names clearly describe the rule being verified with rule number citations
- Tests use `bun:test` imports correctly
</success_criteria>

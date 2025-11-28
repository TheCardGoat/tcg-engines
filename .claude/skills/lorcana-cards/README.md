# Lorcana Cards Agent Skill

## Overview

This Agent Skill helps implement Disney Lorcana TCG card abilities in the `packages/lorcana-engine` package using test-driven development (TDD) and pattern-based learning from similar card implementations.

## Quick Start

To implement a card, simply say:
> "Implement Chip - Ranger Leader"

The skill will automatically:
1. Identify the card
2. Find similar implementations
3. Study proven patterns
4. Guide you through TDD implementation
5. Verify the results

## File Structure

```
.claude/skills/lorcana-cards/
├── SKILLS.md              # Main skill definition (auto-loads)
├── PATTERNS.md            # Detailed pattern reference (load on-demand)
├── TEST_GUIDE.md          # Testing best practices (load on-demand)
├── COMMON_ISSUES.md       # Troubleshooting guide (load on-demand)
├── README.md              # This file
└── examples/              # Code examples (load on-demand)
    ├── triggered_ability_example.ts
    ├── continuous_ability_example.ts
    ├── resolution_ability_example.ts
    └── test_template.test.ts
```

## How It Works

### Progressive Disclosure (3 Levels)

**Level 1: Metadata (Always loaded, ~100 tokens)**
- Skill name and description in system prompt
- Claude knows when to activate this skill

**Level 2: Instructions (Loaded when triggered, ~3k tokens)**
- Main workflow in SKILLS.md
- Step-by-step implementation guidance
- Quick reference patterns

**Level 3: Resources (Loaded as needed, unlimited)**
- Detailed pattern documentation (PATTERNS.md)
- Test examples and templates (TEST_GUIDE.md)
- Troubleshooting guide (COMMON_ISSUES.md)
- Code examples (examples/*.ts)

### Pattern-Based Learning

The skill leverages the `llm-index` system:

```
packages/scripts/src/cards-json/llm-index/
├── cards/
│   └── [SET]-[NUM]-[ID]/
│       └── similar.json          # Cards similar to this one
└── patterns/
    ├── triggers/[PATTERN].json   # Cards using this trigger
    ├── effects/[PATTERN].json    # Cards using this effect
    ├── conditions/[PATTERN].json # Cards using this condition
    ├── keywords/[PATTERN].json   # Cards using this keyword
    ├── targets/[PATTERN].json    # Cards using this target
    └── costs/[PATTERN].json      # Cards using this cost
```

The skill reads these files to find 10-20 similar cards, studies their implementations, and applies proven patterns to new cards.

## Key Principles

1. **Test-Driven Development** - Always write tests before implementation
2. **Pattern-Based Learning** - Use similar cards as implementation guides
3. **Type Safety** - Maintain strict TypeScript typing (no `any`)
4. **Behavior Testing** - Test card behavior, not implementation details
5. **Recent Patterns** - Prefer patterns from sets 010, 009, 008, 007

## Critical Rules

### ✅ DO:
- Use `TestEngine` (not deprecated `TestStore`)
- Import cards by reference (not ID strings)
- Write tests BEFORE implementation (strict TDD)
- Test behavior, not implementation details
- Follow patterns from similar cards
- Prioritize recent sets for patterns

### ❌ DON'T:
- Don't use deprecated `TestStore`
- Don't reference cards by ID strings
- Don't skip TDD process
- Don't use `any` types
- Don't copy old/deprecated patterns without validation

## Usage Examples

### Basic Implementation
```
User: "Implement Mickey Mouse - True Friend"

Skill:
1. Identifies: 001-001-mickey-mouse-true-friend
2. Loads similar cards with "draw-cards" and "on-play" patterns
3. Studies 15 similar implementations
4. Writes tests (RED)
5. Implements ability (GREEN)
6. Verifies with bun test
```

### With Clarification
```
User: "Implement Belle"

Skill: "Multiple cards match. Which one?
1. Belle - Strange but Special (Set 001, #7)
2. Belle - Inventive Engineer (Set 002, #45)
3. Belle - Bookworm (Set 004, #23)"

User: "The first one"

Skill: [proceeds with 001-007-belle-strange-but-special]
```

## Documentation

- **Main Workflow**: [SKILLS.md](SKILLS.md) - Complete implementation process
- **Pattern Reference**: [PATTERNS.md](PATTERNS.md) - Triggers, effects, conditions, etc.
- **Testing Guide**: [TEST_GUIDE.md](TEST_GUIDE.md) - Test patterns and best practices
- **Troubleshooting**: [COMMON_ISSUES.md](COMMON_ISSUES.md) - Common problems and solutions
- **Code Examples**: [examples/](examples/) - Complete implementation examples

## Related Files

### Claude.ai Projects
- `.claude/agents/lorcana-card-engineer.md` - Agent definition for Claude.ai

### Cursor Commands
- `.cursor/commands/implement-lorcana-card.md` - Quick reference command

### Implementation Files
- `packages/lorcana-engine/src/cards/` - Card implementations
- `packages/scripts/src/cards-json/llm-index/` - Pattern analysis index

## Validation Commands

```bash
# Run tests for specific card
bun test "Card Name"

# Run all lorcana-engine tests
cd packages/lorcana-engine && bun test

# Type check
cd packages/lorcana-engine && bun run check-types

# From monorepo root
bunx turbo test --filter=@lorcanito/lorcana-engine
```

## Success Criteria

Implementation is complete when:
- ✅ All test cases written and initially failing (RED)
- ✅ Ability implemented following similar card patterns
- ✅ All tests passing (GREEN)
- ✅ No TypeScript errors
- ✅ Code follows lorcana-engine conventions
- ✅ Implementation matches card text exactly

## Version History

- **v2.0** - Refactored to natural markdown, added progressive disclosure, created reference docs
- **v1.0** - Initial XML-based implementation

## Keywords

agent-skill, lorcana, tcg, tdd, test-driven-development, pattern-based-learning, card-implementation


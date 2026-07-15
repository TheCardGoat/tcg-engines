# Parser Validation & Migration - Set 001

> Validate v2 parser against all 140 legacy cards, add manual overrides, and create migration/test generation agents.

## Context

| Field | Value |
|-------|-------|
| **Date Started** | 2026-01-03 |
| **Branch** | `refactor/lorcana-cards-use-lorcana-types` |
| **Related Tasks** | Parser validation, card migration, test generation |
| **Author** | Claude Code (AI Agent) |

## Problem Statement

### Current State
- **140 legacy cards** in `packages/lorcana-cards/src/legacy-cards/001/` using old `@lorcanito/lorcana-engine` format
- **New implementation** uses `@tcg/lorcana-types` (simpler, data-only definitions)
- **Only ~20 cards** have been migrated to new format (14% coverage)
- **Parser V2** exists but coverage against set 001 is unknown

### Expected Behavior
1. Parser successfully parses ALL 140 legacy card abilities
2. Cards can be migrated from legacy → new format via interactive agent
3. Tests are generated for each migrated card (happy path, abilities only)
4. Legacy files deleted after successful migration + test verification

### Why This Matters
- Complete migration removes technical debt (old engine format)
- Validates parser robustness against real-world card data
- Establishes pattern for migrating sets 002+
- Ensures all cards have test coverage

## Research & Analysis

### Key Findings

1. **Parser (V2) Architecture**
   - Located: `packages/lorcana-cards/src/parser/v2/`
   - Uses Chevrotain grammar engine
   - Hybrid approach: manual overrides → keyword → grammar → regex → null
   - Has **143 existing manual overrides** for complex cards
   - Pattern: Map normalized text (with `{d}` placeholders) → ability objects

2. **Legacy Cards Structure**
   - Location: `packages/lorcana-cards/src/legacy-cards/001/`
   - Format: TypeScript files using `@lorcanito/lorcana-engine`
   - Abilities: Complex objects with `singerAbility()`, `whenYouPlayThisCharAbility()`, etc.
   - Properties: `characteristics`, `title`, `inkwell`, `colors`, `number`, `set`, `rarity`, `illustrator`

3. **New Card Format**
   - Location: `packages/lorcana-cards/src/cards/001/`
   - Uses `@tcg/lorcana-types`
   - Simpler: data-only definitions, no logic
   - Properties: `classifications`, `version`, `inkType`, `cardNumber`

4. **Test Infrastructure**
   - `LorcanaTestEngine` provides `getCardModel()` with keyword checkers
   - Methods: `hasSupport()`, `hasBodyguard()`, `hasEvasive` (property), etc.
   - User requirement: **Basic happy-path tests only, NO property validation**

### Key Files

| File | Relevance |
|------|-----------|
| `packages/lorcana-cards/src/parser/v2/index.ts` | Main parser entry point - understand parsing flow |
| `packages/lorcana-cards/src/parser/manual-overrides.ts` | 143 existing manual overrides - pattern reference |
| `packages/lorcana-cards/src/legacy-cards/001/characters/002-ariel-spectacular-singer.ts` | Example legacy card format |
| `packages/lorcana-cards/src/cards/001/characters/007-heihei-boat-snack.ts` | Example new format |
| `packages/lorcana-engine/src/testing/lorcana-test-engine.ts` | TestEngine with getCardModel() |
| `.claude/agents/memory-bank-manager.md` | Reference for agent creation pattern |

### Existing Patterns

**Manual Override Pattern**:
```typescript
// In manual-overrides.ts
"[Normalized text with {d} placeholders]": manualEntry({
  text: "[Normalized text]",
  name: "ABILITY NAME",
  ability: {
    type: "triggered",
    trigger: { event: "play", timing: "when", on: "SELF" },
    effect: { type: "draw", amount: 0, target: "CONTROLLER" } // 0 = {d}
  }
}),
```

**Agent Pattern** (from existing agents):
- Frontmatter with: `##`, `**Description**`, `**When to use**`
- Workflow section with step-by-step process
- Examples section

**Skill Pattern** (from existing skills):
- `SKILL.md` with description, invocation, process
- `README.md` with detailed documentation
- `examples/` directory

## Proposed Solution

### Approach

**Phase 1: Parser Validation Script**
- Create `validate-parser-coverage.ts` script
- Read all 140 legacy cards, extract ability texts
- Run parser V2 on each text, track success/failure
- Generate JSON report with statistics
- Categorize failures by pattern

**Phase 2: Card Migrator Agent**
- Interactive agent that walks through card migration
- For each ability: parse → confirm with user → generate new format
- On failure: ask for clarification or suggest interpretation
- Generate new card file, update index
- Prompt for legacy file deletion

**Phase 3: Test Writer Agent**
- Read new card definition
- Identify abilities (keyword, triggered, activated, static)
- Generate basic happy-path tests for each ability
- Interactive: confirm each test generation
- NO property tests (effects tested separately)

**Phase 4: Iteration & Cleanup**
- Weekly validation runs
- Add manual overrides for top failure patterns
- Migrate successful parses, generate tests
- Delete legacy files after verification
- Target: 100% coverage by week 6

### Files to Create

| File | Purpose |
|------|---------|
| `packages/lorcana-cards/scripts/validate-parser-coverage.ts` | Parser validation script |
| `.ai_memory/parser-validation-001.md` | This file - parser iteration log |
| `.claude/agents/lorcana-card-migrator.md` | Card migration agent |
| `.claude/agents/lorcana-test-writer.md` | Test generation agent |
| `.claude/skills/lorcana-card-migration/SKILL.md` | Migration skill definition |
| `.claude/skills/lorcana-card-migration/README.md` | Migration skill docs |
| `.claude/skills/lorcana-test-generation/SKILL.md` | Test generation skill |
| `.claude/skills/lorcana-test-generation/README.md` | Test generation docs |

### Files to Modify

| File | Changes |
|------|---------|
| `packages/lorcana-cards/src/parser/manual-overrides.ts` | Add new manual override entries |
| `.claude/rules/packages/lorcana-cards.md` | Update with migration workflow |

### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Fully automated migration | Fast, handles 140 cards quickly | High risk of errors, difficult to verify | Rejected - user wants interactive |
| Manual migration for all cards | Full control, verified | Time-consuming, doesn't scale | Rejected - too slow |
| Interactive migration (chosen) | Balances speed + verification, scalable | Requires user interaction | **Chosen** - meets requirements |

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Parser cannot achieve 100% coverage | Document unique patterns, accept <5% manual overrides |
| Generated tests don't catch all issues | Focus on happy-path, rely on engine-level effect tests |
| Breaking changes during migration | Keep legacy files until card + test verified, easy rollback |
| Agent hallucinations | Interactive confirmation for each ability, show parsed result |

## Implementation Log

### 2026-01-03

- [x] Phase 1: Initial codebase exploration
  - [x] Explore parser V2 structure and manual overrides
  - [x] Explore legacy cards format and structure
  - [x] Explore new card implementation patterns
  - [x] Explore test engine capabilities
- [x] Phase 2: Design implementation plan
  - [x] Create detailed plan document
  - [x] Identify critical files and patterns
  - [x] Design agent and skill structure
- [x] Phase 3: Document in Memory Bank
  - [x] Create parser-validation-001.md log
  - [x] Document all research findings
  - [x] Record proposed solution
- [x] Phase 4: Implementation Started
  - [x] Create validation script (`validate-parser-coverage.ts`)
  - [x] Run baseline validation, document coverage
  - [ ] Create card migrator agent
  - [ ] Create test writer agent
  - [ ] Begin iteration cycle

## Baseline Coverage Report

**Date**: 2026-01-03

### Results
- **Total Cards**: 204 (includes characters, actions, items, songs)
- **Total Abilities**: 373
- **Successfully Parsed**: 74/373 (19.8%)
  - Grammar-based: 49
  - Text-based: 25
  - Keywords: 0
- **Failed Parses**: 92/373 (24.7%)

### Top Failure Patterns
1. **Other**: 75 (uncategorized)
2. **Complex targeting**: 7
3. **Conditional follow-up**: 3
4. **Named card reference**: 3
5. **Static conditional**: 3
6. **Conditional (has cards)**: 1

### Next Steps
1. Analyze failed parses and add manual overrides for common patterns
2. Create card migrator agent for interactive migration
3. Create test writer agent for test generation

## Success Metrics

| Metric | Baseline | Week 2 | Week 4 | Week 6 | Target |
|--------|----------|--------|--------|--------|--------|
| Parser Coverage | 19.8% | - | - | 100% | 100% |
| Cards Migrated | 20/204 | 60 | 140 | 204 | 204 |
| Tests Generated | 20 | 60 | 140 | 204 | 204 |
| Manual Overrides | 143 | +20 | +40 | +50 | <200 |

## Review Checklist (The Gauntlet)

### Style (Linter Agent)

- [ ] Follows `.claude/rules/code-style.md`
- [ ] No TypeScript `any` types
- [ ] Proper import ordering
- [ ] Biome formatting applied (`bun run format`)
- [ ] No unused variables or imports

### Logic (Analyst Agent)

- [ ] Parser correctly handles all ability patterns
- [ ] Manual overrides follow existing pattern
- [ ] Agent prompts are clear and helpful
- [ ] Tests verify happy path for each ability type
- [ ] No property validation tests (as per requirement)

### Architecture (Tech Lead Agent)

- [ ] No code duplication (DRY principle)
- [ ] Validation script is reusable for other sets
- [ ] Agents follow existing agent patterns
- [ ] Skills follow existing skill patterns
- [ ] Memory Bank properly maintained

## Status

- [x] Memory Bank created
- [x] Research complete
- [x] Plan approved by user
- [ ] Implementation pending (plan mode)
- [ ] Tests passing
- [ ] Type check passing
- [ ] Format check passing
- [ ] PR merged

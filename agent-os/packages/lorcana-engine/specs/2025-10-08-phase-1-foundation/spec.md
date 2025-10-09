# Spec Requirements Document

> Spec: Phase 1 - Foundation & Infrastructure
> Created: 2025-10-08

## Overview

Fix existing implementation issues and establish solid patterns for building the Lorcana TCG engine. This phase focuses on making the current codebase work correctly, establishing test patterns, and documenting the foundation for future development. By completing this phase, we'll have a stable, working foundation that demonstrates the core engine's capabilities and patterns.

## User Stories

### Fix Broken Implementation

As a developer working on the Lorcana engine, I want all existing code to compile and run without errors, so that I can build on a stable foundation.

**Workflow:**
1. Developer runs `bun run check`
2. All type checks pass
3. All tests run successfully
4. No import/export errors exist
5. Build completes without warnings

**Problem Solved:** Currently, there are import/export errors (e.g., `challengerAbility`), 247 TODOs/FIXMEs, and failing tests that prevent development progress.

### Establish Testing Patterns

As a developer implementing Lorcana rules, I want clear, documented test patterns that follow TDD principles, so that I can write tests that serve as specifications for game behavior.

**Workflow:**
1. Developer needs to implement a game rule (e.g., "Characters can quest")
2. Writes a failing test describing the expected behavior
3. Implements minimal code to pass the test
4. Test passes and documents the rule
5. Refactors if needed while tests remain green

**Problem Solved:** Without established patterns, developers don't know how to properly test game behavior, leading to implementation details being tested instead of business logic.

### Audit Current Implementation

As a project lead, I want a comprehensive audit of what's implemented vs. the comprehensive rules, so that I can prioritize development work effectively.

**Workflow:**
1. Review all 2278 rules in RULES.md
2. Map each rule section to existing code
3. Identify gaps in implementation
4. Document what works and what doesn't
5. Create prioritized backlog for future phases

**Problem Solved:** With 3421 card files and unclear implementation status, it's impossible to know what actually works and what needs to be built.

## Spec Scope

1. **Fix Build Infrastructure** - Resolve all type errors, import/export issues, and build failures so `bun run check` passes cleanly

2. **Establish Test Patterns** - Create documented examples of behavior-driven testing for game mechanics that follow TDD principles and test business logic, not implementation details

3. **Audit & Document** - Comprehensive mapping of implemented features to Lorcana comprehensive rules with gap analysis

4. **Code Organization** - Reorganize code to follow clear patterns: moves, operations, queries, abilities, and card definitions

5. **Core Framework Integration** - Document how Lorcana uses the core engine abstractions and identify gaps that need to be filled

## Out of Scope

- Implementing new game mechanics (Phase 2)
- Adding new card sets beyond what exists
- UI/visualization concerns
- Multiplayer/networking
- Performance optimization
- AI opponent development

## Expected Deliverable

1. **All checks pass:** `bun run check` completes successfully with no errors

2. **Test patterns documented:** Examples of proper behavior-driven tests for each major game concept (moves, phases, abilities)

3. **Implementation audit document:** Spreadsheet or markdown mapping rules to implementation status

4. **Working examples:** At least 3 complete game scenarios that can be played from start to finish via tests

5. **Pattern documentation:** Clear examples of:
   - How to define cards
   - How to implement moves
   - How to write abilities
   - How to test game behavior

# Spec Requirements Document

> Spec: Set 007 Action Cards Migration to Core Framework
> Created: 2025-10-05
> Status: Planning

## Overview

Make all Set 007 action card tests pass by implementing missing framework features and copying dependency cards from the old project. The Set 007 action cards and their tests already exist in the new project (`packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/`), but tests reference character/item cards from other sets (002, 005, etc.) that don't exist yet in the new project.

The migration has two phases: (1) Copy all missing dependency cards (characters/items) from old project to new project as complete definitions with abilities, (2) Work through each 007 action card test, implementing missing framework features until the test passes. The process is autonomous and production-ready: implement framework features immediately as they are discovered, working through the entire set without human intervention unless truly stuck on a complex issue.

## User Stories

**Developer Story:**
As a developer, I need to scan all 007 action card tests to identify which character/item cards they reference, copy those missing dependency cards from the old project with full abilities, then work through each 007 action card test implementing missing framework features until all tests pass. This allows me to complete the migration autonomously without stopping for approvals.

**Framework Story:**
As the framework implementation, I need to be extended with any missing features discovered when tests fail, implementing them in a production-ready manner immediately rather than creating temporary workarounds. The test expectations define what I must support, and I must be built to handle real card complexity.

## Spec Scope

1. **Dependency Card Identification** - Scan all 007 action card test files, extract all imported character/item cards from other sets, identify which cards are missing from new project

2. **Full Dependency Card Migration** - Copy missing character/item cards from old project with complete definitions including all abilities, migrate to new framework format, place in correct set folders (002/characters/, 005/characters/, etc.)

3. **Test-Driven Framework Implementation** - Work through each 007 action card test, run test to identify missing framework features, implement features production-ready until test passes, move to next card

4. **Autonomous Process** - Complete all dependency migration first, then work through all action card tests automatically, only request human help if genuinely stuck on complex issues

5. **NO Action Card Migration** - Set 007 action cards already exist in new project, do not copy or modify them, only implement framework features to make their tests pass

## Out of Scope

- Migrating set 007 action cards (they already exist in new project)
- Minimal card stubs (proven ineffective in set 008 migration)
- Human confirmation checkpoints between cards (slows progress unnecessarily)
- Simplified or temporary framework implementations (must be production-ready)
- Migrating cards not referenced by 007 action card tests

## Expected Deliverable

1. All set 007 action card tests passing (cards already in new project)
2. All referenced character/item cards from other sets migrated as complete definitions with abilities
3. Framework features implemented in production-ready manner for discovered requirements
4. Each dependency card in its own file following new project structure ([set]/characters/[number]-[name].ts)

## Spec Documentation

- Tasks: @.agent-os/packages/core-engine/specs/2025-10-05-incremental-framework-migration/tasks.md
- Technical Specification: @.agent-os/packages/core-engine/specs/2025-10-05-incremental-framework-migration/sub-specs/technical-spec.md
- Migration Workflow: @.agent-os/packages/core-engine/specs/2025-10-05-incremental-framework-migration/sub-specs/migration-workflow.md

# Spec Requirements Document

> Spec: Card Definitions Migration to New API
> Created: 2025-10-06
> Status: Planning

## Overview

Migrate all Lorcana card definitions from legacy patterns to the new type-safe API definitions in lorcana-card-repository.ts, ensuring TypeScript type checking passes without type assertions, `any`, or `unknown` types, while preserving existing test files as behavioral specifications for the new framework.

## User Stories

### Engine Developer Migration

As an engine developer, I want all card definitions to use the new type-safe API from lorcana-card-repository.ts, so that the codebase has consistent patterns and proper type safety without legacy code.

**Workflow:** The developer will migrate card definition files one set and card type at a time, starting with Set 001 Action cards. Each card file will be updated to use the new `LorcanaActionCardDefinition`, `LorcanaCharacterCardDefinition`, `LorcanaItemCardDefinition`, or `LorcanaLocationCardDefinition` types. The migration ensures TypeScript type checking passes for both the card definition file and its corresponding test file. When test files reference old APIs that no longer exist, stub methods will be created in the framework or test helpers to make the types pass, but the actual test execution can fail. This preserves the tests as behavioral specifications while the new framework is being built.

### Framework Developer API Alignment

As a framework developer, I want to identify missing APIs or type mismatches during the migration, so that I can create necessary stubs and align the new framework with existing test expectations.

**Workflow:** During migration, when TypeScript type checking fails due to missing APIs, the developer creates stub implementations in the framework or test helpers. These stubs only need to satisfy the type checker, not implement actual functionality. This approach allows the old tests to guide the development of the new framework API surface.

### Quality Assurance Through Testing

As a QA engineer, I want to preserve all existing test files unchanged, so that they serve as regression tests and behavioral specifications once the new framework implementation is complete.

**Workflow:** Test files are kept completely unchanged during the migration. If imports fail or types don't match, the framework or test helpers are updated to provide the necessary exports and type definitions. Test execution failures are acceptable during this phase - only type checking must pass.

## Spec Scope

1. **Set 001 Action Cards Migration** - Migrate all action card definitions in `definitions/001/actions/` to use `LorcanaActionCardDefinition` type with proper imports from lorcana-card-repository.ts
2. **Set 001 Character Cards Migration** - Migrate all character card definitions in `definitions/001/characters/` to use `LorcanaCharacterCardDefinition` type
3. **Set 001 Item Cards Migration** - Migrate all item card definitions in `definitions/001/items/` to use `LorcanaItemCardDefinition` type
4. **Set 001 Location Cards Migration** - Migrate all location card definitions in `definitions/001/locations/` to use `LorcanaLocationCardDefinition` type (if applicable)
5. **Ability System Migration** - Update ability imports and usage to align with new ability system patterns
6. **Framework Stub Creation** - Create stub methods, types, and exports in framework or test helpers to satisfy TypeScript type checking for existing test files
7. **Individual File Type Checking** - Verify each migrated card definition file and its test file pass TypeScript type checking using `tsc --noEmit <filename>`
8. **Repeat for Sets 002-009** - Apply the same migration pattern to sets 002 through 009 after completing set 001

## Out of Scope

- Backwards compatibility with old API patterns
- Making test execution pass (only type checking must pass)
- Modifying test file logic or expectations
- Running full project type checking (only individual file type checking required)
- Implementing actual functionality in framework stubs

## Expected Deliverable

1. All card definition files in `packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/` use the new type-safe API from lorcana-card-repository.ts
2. TypeScript type checking passes for each card definition file individually (`tsc --noEmit <filename>`)
3. TypeScript type checking passes for each corresponding test file individually (`tsc --noEmit <test-filename>`)
4. Framework stubs exist for all APIs referenced by test files to satisfy type checker
5. All test files remain unchanged in their test logic and expectations
6. No usage of type assertions (`as`), `any`, or `unknown` types in migrated code
7. All imports use internal project paths (no external imports from old locations)

## Spec Documentation

- Tasks: @.agent-os/packages/core-engine/specs/2025-10-06-card-definitions-migration/tasks.md
- Technical Specification: @.agent-os/packages/core-engine/specs/2025-10-06-card-definitions-migration/sub-specs/technical-spec.md

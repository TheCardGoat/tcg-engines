# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/packages/core-engine/specs/2025-10-06-card-definitions-migration/spec.md

> Created: 2025-10-06
> Status: Ready for Implementation

## Tasks

- [ ] 1. Migrate Set 001 Action Cards to New API
  - [ ] 1.1 Analyze first action card file and its test to understand current patterns and required stubs
  - [ ] 1.2 Create framework stubs for missing APIs identified in test files
  - [ ] 1.3 Migrate all action card definitions in `definitions/001/actions/` to use `LorcanaActionCardDefinition` type
  - [ ] 1.4 Update imports in all action card files to use internal project paths (`~/game-engine/`)
  - [ ] 1.5 Validate each action card file individually with `tsc --noEmit <filename>`
  - [ ] 1.6 Validate corresponding test files with `tsc --noEmit <test-filename>`
  - [ ] 1.7 Document any new framework stubs created and their locations
  - [ ] 1.8 Verify linter rules pass for all modified action card files
  - [ ] 1.9 Use the code-reviewer subagent to review the migrated action card files

- [ ] 2. Migrate Set 001 Character Cards to New API
  - [ ] 2.1 Analyze first character card file and its test for migration patterns
  - [ ] 2.2 Create any additional framework stubs needed for character card tests
  - [ ] 2.3 Migrate all character card definitions in `definitions/001/characters/` to use `LorcanaCharacterCardDefinition` type
  - [ ] 2.4 Update imports in all character card files to use internal project paths
  - [ ] 2.5 Validate each character card file individually with `tsc --noEmit <filename>`
  - [ ] 2.6 Validate corresponding test files with `tsc --noEmit <test-filename>`
  - [ ] 2.7 Verify linter rules pass for all modified character card files
  - [ ] 2.8 Use the code-reviewer subagent to review the migrated character card files

- [ ] 3. Migrate Set 001 Item Cards to New API
  - [ ] 3.1 Analyze first item card file and its test for migration patterns
  - [ ] 3.2 Create any additional framework stubs needed for item card tests
  - [ ] 3.3 Migrate all item card definitions in `definitions/001/items/` to use `LorcanaItemCardDefinition` type
  - [ ] 3.4 Update imports in all item card files to use internal project paths
  - [ ] 3.5 Validate each item card file individually with `tsc --noEmit <filename>`
  - [ ] 3.6 Validate corresponding test files with `tsc --noEmit <test-filename>`
  - [ ] 3.7 Verify linter rules pass for all modified item card files
  - [ ] 3.8 Use the code-reviewer subagent to review the migrated item card files

- [ ] 4. Migrate Set 001 Location Cards to New API (if applicable)
  - [ ] 4.1 Check if location cards exist in Set 001
  - [ ] 4.2 If locations exist, analyze first location card file and its test
  - [ ] 4.3 Create any additional framework stubs needed for location card tests
  - [ ] 4.4 Migrate all location card definitions in `definitions/001/locations/` to use `LorcanaLocationCardDefinition` type
  - [ ] 4.5 Update imports in all location card files to use internal project paths
  - [ ] 4.6 Validate each location card file individually with `tsc --noEmit <filename>`
  - [ ] 4.7 Validate corresponding test files with `tsc --noEmit <test-filename>`
  - [ ] 4.8 Use the code-reviewer subagent to review the migrated location card files

- [ ] 5. Complete Set 001 Migration and Document Process
  - [ ] 5.1 Run comprehensive type check validation on all Set 001 card definitions
  - [ ] 5.2 Run comprehensive type check validation on all Set 001 test files
  - [ ] 5.3 Verify no type assertions (`as`), `any`, or `unknown` types exist in migrated files
  - [ ] 5.4 Document migration patterns and lessons learned for Sets 002-009
  - [ ] 5.5 Create summary of framework stubs created and their purposes
  - [ ] 5.6 Verify linter rules pass for the entire Set 001 migration
  - [ ] 5.7 Use the code-reviewer subagent to review overall Set 001 migration
  - [ ] 5.8 Prepare template/guide for repeating migration process for Sets 002-009

Note: After completing Set 001 (Tasks 1-5), the same pattern should be repeated for Sets 002 through 009, with each set following the same task structure (Actions → Characters → Items → Locations → Documentation).

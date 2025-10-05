# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/packages/core-engine/specs/2025-10-05-incremental-framework-migration/spec.md

> Created: 2025-10-05
> Status: Ready for Implementation

## Tasks

- [ ] 1. Phase 1: Identify and Copy Missing Dependency Cards
  - [ ] 1.1 Scan all 007 action test files to extract imported character/item cards
  - [ ] 1.2 Create comprehensive list of all dependency cards with their set numbers
  - [ ] 1.3 Check which dependency cards already exist in new project
  - [ ] 1.4 Create missing cards list (in old project but not in new project)
  - [ ] 1.5 For each missing card, locate in old project and copy full definition with abilities
  - [ ] 1.6 Migrate each dependency card to new format (update types, imports, abilities)
  - [ ] 1.7 Place cards in correct set folders and export from index files
  - [ ] 1.8 Verify all dependency cards compile and type-check correctly

- [ ] 2. Phase 2: Make 007 Action Card Tests Pass (Card-by-Card)
  - [ ] 2.1 Create list of all 007 action tests and identify which are currently failing
  - [ ] 2.2 Select first failing test in numerical order
  - [ ] 2.3 Run test to identify specific framework gaps from error messages
  - [ ] 2.4 For each missing framework feature, write failing test first (TDD Red)
  - [ ] 2.5 Implement minimum code to pass test (TDD Green)
  - [ ] 2.6 Refactor implementation for quality while keeping tests green
  - [ ] 2.7 Verify the 007 action card test now passes
  - [ ] 2.8 Repeat steps 2.2-2.7 for each failing test until all pass

- [ ] 3. Final Validation and Quality Assurance
  - [ ] 3.1 Run complete 007 action test suite to verify all tests pass
  - [ ] 3.2 Verify type checking passes for all migrated dependency cards
  - [ ] 3.3 Verify type checking passes for all framework code
  - [ ] 3.4 Run linter on all changed files and fix any issues
  - [ ] 3.5 Use code-reviewer subagent to review all dependency card migrations
  - [ ] 3.6 Use code-reviewer subagent to review all framework implementations
  - [ ] 3.7 Verify no minimal stubs were created (all cards have full definitions)
  - [ ] 3.8 Document any patterns discovered for future set migrations

## Key Principles

- Follow TDD strictly for framework features
- Copy full card definitions with abilities (no stubs)
- Production-ready code only
- Autonomous execution (no human checkpoints unless stuck)
- Focus: ONLY set 007 actions and their dependencies

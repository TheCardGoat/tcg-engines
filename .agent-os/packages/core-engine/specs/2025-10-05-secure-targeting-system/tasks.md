# Spec Tasks

## Overview

Implementation tasks for the Secure Targeting System as defined in @.agent-os/packages/core-engine/specs/2025-10-05-secure-targeting-system/spec.md

This implementation extends the existing `BaseCoreCardFilter` with rich filtering capabilities and adds runtime target resolution with automatic security validation.

## Tasks

- [ ] 1. Enhance BaseCoreCardFilter with Rich Filtering Properties
  - [ ] 1.1 Write tests for enhanced BaseCoreCardFilter type definition
  - [ ] 1.2 Update `BaseCoreCardFilter` interface in `core-engine/types/game-specific-types.ts` to include status filters (ready, exerted, damaged)
  - [ ] 1.3 Add attribute comparison types (NumericComparison, StringComparison) to game-specific-types
  - [ ] 1.4 Add keyword/ability filter properties (withKeyword, withoutKeyword)
  - [ ] 1.5 Add characteristics filter properties (withCharacteristics, characteristicsMode)
  - [ ] 1.6 Add quantity/selection properties (count, upTo, random, excludeSelf)
  - [ ] 1.7 Verify all tests pass for core-engine package
  - [ ] 1.8 Verify linter rules pass for core-engine package
  - [ ] 1.9 Verify type safety, run typecheck for core-engine package
  - [ ] 1.10 Use code-reviewer subagent to review the changes

- [ ] 2. Create Core TargetResolver for Filter Evaluation
  - [ ] 2.1 Write tests for TargetResolver class
  - [ ] 2.2 Create `core-engine/targeting/target-resolver.ts` with TargetResolver class skeleton
  - [ ] 2.3 Implement `resolveCardTargets()` method with zone-based candidate pooling
  - [ ] 2.4 Implement owner filter evaluation (self, opponent, specific player ID)
  - [ ] 2.5 Implement type filter evaluation
  - [ ] 2.6 Implement status filter evaluation (ready, exerted, damaged)
  - [ ] 2.7 Implement attribute comparison evaluation (cost, strength, name)
  - [ ] 2.8 Implement keyword/ability filter evaluation
  - [ ] 2.9 Implement characteristics filter evaluation with AND/OR modes
  - [ ] 2.10 Implement excludeSelf filter logic
  - [ ] 2.11 Implement quantity rules (count, upTo, random selection)
  - [ ] 2.12 Verify all tests pass for core-engine package
  - [ ] 2.13 Verify linter rules pass for core-engine package
  - [ ] 2.14 Verify type safety, run typecheck for core-engine package
  - [ ] 2.15 Use code-reviewer subagent to review the changes

- [ ] 3. Implement Security Validation in TargetResolver
  - [ ] 3.1 Write tests for security validation (Ward, protection abilities)
  - [ ] 3.2 Create `SecurityRule` interface in `core-engine/targeting/types.ts`
  - [ ] 3.3 Create `SecurityRuleRegistry` class for managing game-specific rules
  - [ ] 3.4 Implement `applySecurityChecks()` method in TargetResolver
  - [ ] 3.5 Add Ward validation check (cannot target cards with Ward from opponent)
  - [ ] 3.6 Add hook for game-specific protection rules
  - [ ] 3.7 Create `ValidationResult` type with clear error reasons
  - [ ] 3.8 Verify all tests pass for core-engine package
  - [ ] 3.9 Verify linter rules pass for core-engine package
  - [ ] 3.10 Verify type safety, run typecheck for core-engine package
  - [ ] 3.11 Use code-reviewer subagent to review the changes

- [ ] 4. Create TargetValidator for Target Validation API
  - [ ] 4.1 Write tests for TargetValidator class
  - [ ] 4.2 Create `core-engine/targeting/target-validator.ts` with TargetValidator class
  - [ ] 4.3 Implement `getPotentialTargets()` method
  - [ ] 4.4 Implement `validateSelectedTargets()` method with quantity checking
  - [ ] 4.5 Implement `requiresTargetSelection()` method for auto-targeting detection
  - [ ] 4.6 Add support for "all" targets (no selection required)
  - [ ] 4.7 Add support for random targets (no selection required)
  - [ ] 4.8 Add support for "up to N" optional targeting
  - [ ] 4.9 Verify all tests pass for core-engine package
  - [ ] 4.10 Verify linter rules pass for core-engine package
  - [ ] 4.11 Verify type safety, run typecheck for core-engine package
  - [ ] 4.12 Use code-reviewer subagent to review the changes

- [ ] 5. Extend Lorcana Engine with Game-Specific Targeting
  - [ ] 5.1 Write tests for LorcanaCardFilter extension
  - [ ] 5.2 Create `LorcanaCardFilter` interface extending BaseCoreCardFilter in `lorcana-engine-types.ts`
  - [ ] 5.3 Add Lorcana-specific properties (inkwell, willpower, loreValue, atLocation, hasCardUnder, playedThisTurn)
  - [ ] 5.4 Add Lorcana keyword types (bodyguard, challenger, evasive, ward, etc.)
  - [ ] 5.5 Add Lorcana classification types (hero, villain, floodborn, dreamborn, storyborn)
  - [ ] 5.6 Verify all tests pass for lorcana engine
  - [ ] 5.7 Verify linter rules pass for lorcana engine
  - [ ] 5.8 Verify type safety, run typecheck for lorcana engine
  - [ ] 5.9 Use code-reviewer subagent to review the changes

- [ ] 6. Create Lorcana-Specific TargetValidator
  - [ ] 6.1 Write tests for LorcanaTargetValidator
  - [ ] 6.2 Create `lorcana/targeting/lorcana-target-validator.ts` with LorcanaTargetValidator class
  - [ ] 6.3 Implement Lorcana-specific filter resolution (inkwell, willpower, loreValue)
  - [ ] 6.4 Implement Lorcana-specific status checks (atLocation, hasCardUnder, playedThisTurn)
  - [ ] 6.5 Implement Lorcana keyword validation
  - [ ] 6.6 Implement Lorcana classification validation
  - [ ] 6.7 Add Ward security rule for Lorcana
  - [ ] 6.8 Verify all tests pass for lorcana engine
  - [ ] 6.9 Verify linter rules pass for lorcana engine
  - [ ] 6.10 Verify type safety, run typecheck for lorcana engine
  - [ ] 6.11 Use code-reviewer subagent to review the changes

- [ ] 7. Create Optional CardFilterBuilder Utility
  - [ ] 7.1 Write tests for CardFilterBuilder
  - [ ] 7.2 Create `core-engine/targeting/card-filter-builder.ts` with CardFilterBuilder class
  - [ ] 7.3 Implement fluent API methods (inZone, ofType, controlledBy, ready, damaged)
  - [ ] 7.4 Implement attribute filter methods (withCost, withStrength, named)
  - [ ] 7.5 Implement keyword filter methods (withKeyword, withoutKeyword)
  - [ ] 7.6 Implement quantity methods (count, all, upTo, random)
  - [ ] 7.7 Implement `build()` method that returns plain JSON CardFilter
  - [ ] 7.8 Verify all tests pass for core-engine package
  - [ ] 7.9 Verify linter rules pass for core-engine package
  - [ ] 7.10 Verify type safety, run typecheck for core-engine package
  - [ ] 7.11 Use code-reviewer subagent to review the changes

- [ ] 8. Update Lorcana Operations to Use New Targeting System
  - [ ] 8.1 Write tests for updated LorcanaCoreOperations.resolveTargets method
  - [ ] 8.2 Refactor `LorcanaCoreOperations.resolveTargets()` to use TargetResolver
  - [ ] 8.3 Update target resolution to use LorcanaTargetValidator
  - [ ] 8.4 Remove legacy target resolution code after validation
  - [ ] 8.5 Verify all existing tests still pass for lorcana engine
  - [ ] 8.6 Verify linter rules pass for lorcana engine
  - [ ] 8.7 Verify type safety, run typecheck for lorcana engine
  - [ ] 8.8 Use code-reviewer subagent to review the changes

- [ ] 9. Integration Testing and Documentation
  - [ ] 9.1 Write integration tests for complete targeting flow (filter → resolution → validation)
  - [ ] 9.2 Write tests for Ward protection blocking invalid targets
  - [ ] 9.3 Write tests for auto-targeting when only one valid target exists
  - [ ] 9.4 Write tests for "up to N" optional targeting
  - [ ] 9.5 Write tests for random target selection
  - [ ] 9.6 Create migration guide for converting old target definitions to new format
  - [ ] 9.7 Add JSDoc documentation to all public APIs
  - [ ] 9.8 Verify all tests pass for core-engine and lorcana packages
  - [ ] 9.9 Verify linter rules pass for both packages
  - [ ] 9.10 Verify type safety, run typecheck for both packages
  - [ ] 9.11 Use code-reviewer subagent to review the changes

## Notes

- All target definitions remain plain JSON for deterministic replay and network transmission
- Builder pattern (Task 7) is optional and for convenience only
- Focus on extending existing patterns (EnumerableMove, TargetSpec, CardFilterDSL)
- Security validation (Ward, protection) is automatically enforced during resolution
- No backward compatibility needed - clean slate implementation

## Dependencies

Tasks should be executed in order as they build upon each other:
- Tasks 1-4: Core engine foundation
- Tasks 5-6: Lorcana-specific extensions
- Task 7: Optional convenience utilities
- Task 8: Integration with existing code
- Task 9: Final validation and documentation


# Implementation Task Breakdown

Detailed task breakdown for implementing Core Framework Reuse & Consolidation spec.

## Phase 1: Core Enhancements (Est. 2 weeks)

### Task 1.1: Zone Operations Enhancement
**Priority:** P0 (Critical)  
**Estimate:** 3 days  
**Dependencies:** None

**Subtasks:**
1. Add `isCardInZone(zone: Zone, cardId: CardId): boolean` to zone-operations.ts
2. Add `addCardToTop(zone: Zone, cardId: CardId): Zone` to zone-operations.ts
3. Add `addCardToBottom(zone: Zone, cardId: CardId): Zone` to zone-operations.ts
4. Add `clearZone(zone: Zone): Zone` to zone-operations.ts
5. Add `findCardInZones(cardId: CardId, zones: Zone[]): Zone | undefined` to zone-operations.ts
6. Write comprehensive tests for each new operation (>95% coverage)
7. Update zone-operations.test.ts with new test cases

**Acceptance Criteria:**
- All new operations have unit tests
- Test coverage >95% for zone operations
- All operations are immutable (use Immer)
- TypeDoc comments for all functions

---

### Task 1.2: Zone State Helpers
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Dependencies:** Task 1.1

**Subtasks:**
1. Create `packages/core/src/zones/zone-state-helpers.ts`
2. Implement `createPlayerZones<T>(players: PlayerId[], initialValue?: () => T): Record<PlayerId, T>`
3. Implement `moveCardInState(state: ZoneState, playerId: PlayerId, cardId: CardId, fromZone: string, toZone: string)`
4. Implement `getCardZone(state: Record<string, ZoneState>, cardId: CardId): string | undefined`
5. Write tests for zone state helpers
6. Export from `packages/core/src/zones/index.ts`

**Acceptance Criteria:**
- State helpers work with flat state structures
- Compatible with lorcana's current zone state pattern
- Test coverage >95%
- Documentation includes migration examples

---

### Task 1.3: Testing Utilities - Test Engine Builder
**Priority:** P0 (Critical)  
**Estimate:** 3 days  
**Dependencies:** None

**Subtasks:**
1. Create `packages/core/src/testing/` directory
2. Create `test-engine-builder.ts` with `createTestEngine(definition, players?, options?)`
3. Create `test-player-builder.ts` with `createTestPlayers(count, names?)`
4. Create `test-state-builder.ts` with `createTestState<T>(overrides?)`
5. Write tests for builder utilities
6. Extract patterns from existing integration tests

**Acceptance Criteria:**
- Builders reduce boilerplate by >60%
- Support custom game definitions
- Support seeded RNG for determinism
- TypeScript generic support for custom state types

---

### Task 1.4: Testing Utilities - Assertions
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Dependencies:** Task 1.3

**Subtasks:**
1. Create `test-assertions.ts`
2. Implement `expectMoveSuccess(result: MoveExecutionResult)`
3. Implement `expectMoveFailure(result: MoveExecutionResult, errorPattern?: string | RegExp)`
4. Implement `expectStateProperty(engine: RuleEngine, path: string, value: unknown)`
5. Create `test-flow-assertions.ts`
6. Implement `expectPhaseTransition(engine: RuleEngine, expectedPhase: string)`
7. Create `test-end-assertions.ts`
8. Implement `expectGameEnd(engine: RuleEngine, winner?: PlayerId)`
9. Write tests for all assertions

**Acceptance Criteria:**
- Assertions provide clear error messages
- Support for deep property access
- Compatible with bun:test
- Documentation includes examples

---

### Task 1.5: Testing Utilities - Test Factories
**Priority:** P1 (High)  
**Estimate:** 2 days  
**Dependencies:** Task 1.3

**Subtasks:**
1. Create `test-card-factory.ts` with `createTestCard(overrides?)`
2. Create `test-zone-factory.ts` with `createTestZone(config, cards?)`
3. Create `test-player-factory.ts` with `createTestPlayer(overrides?)`
4. Create `test-rng-helpers.ts` with `withSeed(seed: string, fn: () => void)`
5. Create `test-replay-assertions.ts` with `expectDeterministicReplay(...)`
6. Write tests for factories

**Acceptance Criteria:**
- Factories work with core types
- Easy to extend for game-specific needs
- Deterministic by default
- Fast execution (<1ms per factory call)

---

### Task 1.6: Testing Utilities - Package Configuration
**Priority:** P0 (Critical)  
**Estimate:** 1 day  
**Dependencies:** Tasks 1.3, 1.4, 1.5

**Subtasks:**
1. Create `packages/core/src/testing/index.ts` with exports
2. Update `packages/core/package.json` exports map
3. Add `"./testing": "./src/testing/index.ts"`
4. Update `packages/core/tsconfig.json` if needed
5. Verify tree-shaking works (testing not in production builds)
6. Write integration test using testing utilities

**Acceptance Criteria:**
- Can import as `@tcg/core/testing`
- TypeScript autocomplete works
- Tree-shakeable (excluded from production)
- No circular dependencies

---

### Task 1.7: Card Tooling - Base Classes
**Priority:** P1 (High)  
**Estimate:** 3 days  
**Dependencies:** None

**Subtasks:**
1. Create `packages/core/src/tooling/` directory
2. Create `card-parser.ts` with abstract `CardParser<TInput, TOutput>` class
3. Create `card-generator.ts` with abstract `CardGenerator<TCard>` class
4. Create `card-validator.ts` with abstract `CardValidator<TCard>` class
5. Create `types.ts` with `ParserResult`, `ValidationResult`, etc.
6. Write tests for base classes
7. Document extension patterns

**Acceptance Criteria:**
- Base classes are abstract (must be extended)
- Provide common infrastructure methods
- Game-specific logic goes in subclasses
- Documentation includes extension examples

---

### Task 1.8: Card Tooling - File Utilities
**Priority:** P1 (High)  
**Estimate:** 2 days  
**Dependencies:** None

**Subtasks:**
1. Create `file-writer.ts` with `FileWriter` class
2. Implement `write(filepath, content)`
3. Implement `writeFormatted(filepath, content)` (auto-format TypeScript)
4. Create `file-utils.ts`
5. Implement `ensureDirectory(path)`, `createDirectory(path)`
6. Create `format-utils.ts`
7. Implement `formatTypeScript(code)` using core Biome config
8. Write tests for file utilities

**Acceptance Criteria:**
- File operations are async
- Proper error handling
- Respects workspace Biome configuration
- Safe path handling (no directory traversal)

---

### Task 1.9: Card Tooling - Naming Utilities
**Priority:** P1 (High)  
**Estimate:** 1 day  
**Dependencies:** None

**Subtasks:**
1. Create `naming-utils.ts`
2. Implement `generateVariableName(name: string): string`
3. Implement `toKebabCase(str: string): string`
4. Implement `toPascalCase(str: string): string`
5. Implement `toCamelCase(str: string): string`
6. Implement `toSnakeCase(str: string): string`
7. Write comprehensive tests
8. Handle edge cases (numbers, special characters, unicode)

**Acceptance Criteria:**
- Consistent naming conventions
- Handle edge cases gracefully
- Test coverage >95%
- Performance: <0.1ms per conversion

---

### Task 1.10: Card Tooling - Package Configuration
**Priority:** P1 (High)  
**Estimate:** 1 day  
**Dependencies:** Tasks 1.7, 1.8, 1.9

**Subtasks:**
1. Create `packages/core/src/tooling/index.ts` with exports
2. Update `packages/core/package.json` exports map
3. Add `"./tooling": "./src/tooling/index.ts"`
4. Verify imports work correctly
5. Write example showing extension pattern

**Acceptance Criteria:**
- Can import as `@tcg/core/tooling`
- TypeScript autocomplete works
- Tree-shakeable
- Documentation includes usage examples

---

### Task 1.11: Validation - Type Guard Builder
**Priority:** P2 (Medium)  
**Estimate:** 1 day  
**Dependencies:** None

**Subtasks:**
1. Create `packages/core/src/validation/` directory
2. Create `type-guard-builder.ts`
3. Implement `createTypeGuard<T, K, V>(field: K, value: V)`
4. Create `card-type-guards.ts`
5. Implement `isCardOfType(card, type)` generic helper
6. Write tests for type guards
7. Extract gundam's type guards as examples

**Acceptance Criteria:**
- Type guards maintain TypeScript type narrowing
- Generated guards are type-safe
- Performance: <0.01ms per guard check
- Documentation includes gundam migration example

---

### Task 1.12: Validation - Validator Builder
**Priority:** P2 (Medium)  
**Estimate:** 2 days  
**Dependencies:** None

**Subtasks:**
1. Create `validator-builder.ts`
2. Implement `ValidatorBuilder<T>` class
3. Add methods: `required(field)`, `type(field, type)`, `min(field, min)`, `max(field, max)`
4. Add method: `custom(fn)` for custom validation
5. Implement `build()` to create validator function
6. Write tests for validator builder
7. Performance optimization for validators

**Acceptance Criteria:**
- Fluent API for building validators
- Composable validators
- Clear error messages
- Performance: <1ms for complex validations

---

### Task 1.13: Validation - Schema Builders
**Priority:** P2 (Medium)  
**Estimate:** 1 day  
**Dependencies:** Task 1.12

**Subtasks:**
1. Create `schema-builders.ts`
2. Implement `buildCardSchema(baseSchema, extensions?)`
3. Implement `buildMoveSchema(baseSchema, extensions?)`
4. Implement `buildStateSchema(baseSchema, extensions?)`
5. Integrate with existing Zod schemas
6. Write tests for schema builders

**Acceptance Criteria:**
- Works with existing Zod validation
- Extensible for game-specific schemas
- Type inference works correctly
- Documentation includes extension examples

---

### Task 1.14: Validation - Package Configuration
**Priority:** P2 (Medium)  
**Estimate:** 0.5 days  
**Dependencies:** Tasks 1.11, 1.12, 1.13

**Subtasks:**
1. Create `packages/core/src/validation/index.ts` with exports
2. Update exports map in package.json (optional - could export from main)
3. Write integration tests
4. Document validation patterns

**Acceptance Criteria:**
- All validation utilities accessible
- Clear documentation of when to use each
- Examples for common patterns

---

## Phase 2: Documentation (Est. 1 week)

### Task 2.1: Zone Operations Guide
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Dependencies:** Tasks 1.1, 1.2

**Subtasks:**
1. Create `packages/core/docs/guides/zone-operations.md`
2. Document all zone operations with examples
3. Explain Zone objects vs flat state
4. Include decision guide for which pattern to use
5. Show lorcana and gundam usage examples
6. Document performance characteristics
7. Add troubleshooting section

**Acceptance Criteria:**
- Comprehensive API documentation
- Runnable code examples
- Decision trees for choosing patterns
- Migration guide from old patterns

---

### Task 2.2: Testing Utilities Guide
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Dependencies:** Tasks 1.3, 1.4, 1.5, 1.6

**Subtasks:**
1. Create `packages/core/docs/guides/testing-utilities.md`
2. Document all test builders and assertions
3. Show TDD workflow with utilities
4. Include best practices guide
5. Show before/after code comparisons
6. Document deterministic testing patterns
7. Add performance tips for test suites

**Acceptance Criteria:**
- Complete API reference
- TDD workflow examples
- Best practices documented
- Before/after comparisons show value

---

### Task 2.3: Card Tooling Guide
**Priority:** P1 (High)  
**Estimate:** 2 days  
**Dependencies:** Tasks 1.7, 1.8, 1.9, 1.10

**Subtasks:**
1. Create `packages/core/docs/guides/card-tooling.md`
2. Document base classes and extension patterns
3. Show gundam's tools as example
4. Include step-by-step tutorial for new game
5. Document file management patterns
6. Add naming conventions guide
7. Include testing strategies for tools

**Acceptance Criteria:**
- Clear extension patterns
- Complete tutorial for new games
- Real-world example (gundam)
- Testing strategies included

---

### Task 2.4: Validation Guide
**Priority:** P2 (Medium)  
**Estimate:** 1 day  
**Dependencies:** Tasks 1.11, 1.12, 1.13, 1.14

**Subtasks:**
1. Create `packages/core/docs/guides/validation.md`
2. Document type guards and validators
3. Explain when to use runtime vs compile-time validation
4. Include performance considerations
5. Show common validation patterns
6. Document error handling strategies

**Acceptance Criteria:**
- Clear guidance on validation strategies
- Performance implications documented
- Common patterns covered
- Error handling best practices

---

### Task 2.5: Core README Update
**Priority:** P0 (Critical)  
**Estimate:** 1 day  
**Dependencies:** Tasks 2.1, 2.2, 2.3, 2.4

**Subtasks:**
1. Update `packages/core/README.md`
2. Add sections for new utilities
3. Link to detailed guides
4. Update feature list
5. Add before/after code examples
6. Update architecture diagram if needed
7. Update API reference section

**Acceptance Criteria:**
- README reflects new capabilities
- Links to all guides work
- Examples are accurate
- Architecture diagram updated

---

### Task 2.6: Example Files
**Priority:** P1 (High)  
**Estimate:** 2 days  
**Dependencies:** Tasks 2.1, 2.2, 2.3

**Subtasks:**
1. Create `packages/core/docs/examples/zone-management.ts`
2. Create `packages/core/docs/examples/test-patterns.ts`
3. Create `packages/core/docs/examples/card-parser-extension.ts`
4. Create `packages/core/docs/examples/custom-validator.ts`
5. Ensure all examples are runnable
6. Add inline comments explaining patterns
7. Add examples to test suite (verify they work)

**Acceptance Criteria:**
- All examples compile and run
- Examples demonstrate best practices
- Inline documentation is clear
- Examples included in automated tests

---

## Phase 3: Lorcana Migration (Est. 1 week)

### Task 3.1: Lorcana Zone Operations Migration
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Dependencies:** Phase 1 complete, Task 2.1

**Subtasks:**
1. Create feature branch `lorcana-zone-migration`
2. Replace lorcana zone-operations.ts with core imports
3. Update all zone operation call sites
4. Run lorcana test suite
5. Fix any breaking issues
6. Performance benchmarking (before/after)
7. Update lorcana documentation

**Acceptance Criteria:**
- All lorcana tests pass
- No performance regression (< 5%)
- Zero duplicated zone code
- Documentation updated

---

### Task 3.2: Lorcana Testing Utilities Adoption
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Dependencies:** Task 3.1, Task 2.2

**Subtasks:**
1. Identify test files with boilerplate
2. Refactor tests to use @tcg/core/testing
3. Measure LOC reduction
4. Verify all tests still pass
5. Update test documentation
6. Add examples of testing patterns

**Acceptance Criteria:**
- Test boilerplate reduced by >60%
- All tests pass
- Test execution time unchanged or faster
- Documentation includes examples

---

### Task 3.3: Lorcana Validation Updates
**Priority:** P2 (Medium)  
**Estimate:** 1 day  
**Dependencies:** Task 3.1, Tasks 1.11-1.14

**Subtasks:**
1. Identify validation code in lorcana
2. Refactor to use core validators where applicable
3. Add type guards using core builders
4. Update tests
5. Document validation patterns

**Acceptance Criteria:**
- Consistent validation patterns
- No duplicated validation logic
- All tests pass

---

### Task 3.4: Lorcana Migration Verification
**Priority:** P0 (Critical)  
**Estimate:** 1 day  
**Dependencies:** Tasks 3.1, 3.2, 3.3

**Subtasks:**
1. Run full lorcana test suite
2. Run lorcana benchmarks
3. Static analysis for duplication
4. Code review
5. Update migration guide with lessons learned
6. Merge feature branch

**Acceptance Criteria:**
- 100% test pass rate
- No performance regression
- Zero zone operation duplication detected
- Code review approved

---

## Phase 4: Gundam Migration (Est. 1 week)

### Task 4.1: Gundam Card Tooling Migration
**Priority:** P1 (High)  
**Estimate:** 3 days  
**Dependencies:** Phase 1 complete, Task 2.3

**Subtasks:**
1. Create feature branch `gundam-tooling-migration`
2. Refactor text-parser.ts to extend core CardParser
3. Refactor card-generator.ts to extend core CardGenerator
4. Migrate file-writer.ts to use core FileWriter
5. Use core naming utilities
6. Update tool tests
7. Verify card generation still works

**Acceptance Criteria:**
- Gundam tools extend core base classes
- Infrastructure logic moved to core
- Game-specific logic remains in gundam
- All tool tests pass

---

### Task 4.2: Gundam Zone Operations Addition
**Priority:** P0 (Critical)  
**Estimate:** 1 day  
**Dependencies:** Task 4.1, Phase 1 complete

**Subtasks:**
1. Add zone operations to gundam game definition
2. Use core zone utilities from start
3. Write tests for zone interactions
4. Document gundam's zone structure

**Acceptance Criteria:**
- Gundam uses core zone utilities
- No custom zone operations in gundam
- Tests demonstrate zone usage

---

### Task 4.3: Gundam Testing Utilities Adoption
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Dependencies:** Task 4.2, Task 2.2

**Subtasks:**
1. Update existing gundam tests to use @tcg/core/testing
2. Add comprehensive test suite for gundam moves
3. Use testing utilities for all new tests
4. Measure test boilerplate reduction
5. Document testing patterns

**Acceptance Criteria:**
- All tests use core testing utilities
- Comprehensive test coverage
- Test boilerplate reduced >60%

---

### Task 4.4: Gundam Validation Updates
**Priority:** P2 (Medium)  
**Estimate:** 1 day  
**Dependencies:** Task 4.3, Tasks 1.11-1.14

**Subtasks:**
1. Refactor gundam type guards to use core builders
2. Add validation for card definitions
3. Update card tooling to use validators
4. Document validation patterns

**Acceptance Criteria:**
- Type guards use core utilities
- Card validation integrated with tools
- Consistent with lorcana patterns

---

### Task 4.5: Gundam Migration Verification
**Priority:** P0 (Critical)  
**Estimate:** 1 day  
**Dependencies:** Tasks 4.1, 4.2, 4.3, 4.4

**Subtasks:**
1. Run full gundam test suite
2. Run gundam card tools end-to-end
3. Static analysis for duplication
4. Code review
5. Update migration guide
6. Merge feature branch

**Acceptance Criteria:**
- 100% test pass rate
- Card tools work correctly
- No duplicated infrastructure
- Code review approved

---

## Phase 5: Validation & Polish (Est. 1 week)

### Task 5.1: Static Analysis for Duplication
**Priority:** P0 (Critical)  
**Estimate:** 1 day  
**Dependencies:** Phases 3 and 4 complete

**Subtasks:**
1. Install and configure jscpd (copy-paste detector)
2. Run duplication analysis on:
   - `packages/core/src/zones`
   - `packages/lorcana-engine/src`
   - `packages/gundam-engine/src`
3. Create duplication report
4. Address any remaining duplication
5. Set up CI check for duplication

**Acceptance Criteria:**
- Duplication report shows <1% code duplication
- No zone operation duplication
- No testing utility duplication
- CI enforces duplication limits

---

### Task 5.2: Performance Benchmarking
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Dependencies:** Phases 3 and 4 complete

**Subtasks:**
1. Create benchmark suite for:
   - Zone operations (before/after)
   - Test execution time (before/after)
   - Move execution with new utilities
2. Run benchmarks on lorcana
3. Run benchmarks on gundam
4. Analyze results
5. Optimize any regressions
6. Document performance characteristics

**Acceptance Criteria:**
- No regression >5% in any benchmark
- Benchmark results documented
- Optimization notes for future

---

### Task 5.3: Documentation Review
**Priority:** P0 (Critical)  
**Estimate:** 1 day  
**Dependencies:** Phase 2 complete

**Subtasks:**
1. Review all documentation for accuracy
2. Verify all code examples work
3. Check all links
4. Review for clarity and completeness
5. Add missing sections
6. Get peer review of documentation

**Acceptance Criteria:**
- All examples compile and run
- All links work
- Documentation peer-reviewed
- No obvious gaps

---

### Task 5.4: Integration Testing
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Dependencies:** Phases 3 and 4 complete

**Subtasks:**
1. Run complete test suite for:
   - @tcg/core
   - @tcg/lorcana
   - @tcg/gundam
2. Run end-to-end integration tests
3. Test cross-package imports
4. Verify tree-shaking works
5. Test in production-like environment

**Acceptance Criteria:**
- 100% test pass rate across all packages
- No flaky tests
- Tree-shaking verified
- Production build successful

---

### Task 5.5: Migration Guide Creation
**Priority:** P0 (Critical)  
**Estimate:** 1 day  
**Dependencies:** Phases 3 and 4 complete

**Subtasks:**
1. Create `packages/lorcana-engine/docs/migration-to-core-zones.md`
2. Create `packages/gundam-engine/docs/migration-to-core-tooling.md`
3. Document:
   - Before/after code examples
   - Breaking changes (if any)
   - Benefits of migration
   - Troubleshooting common issues
4. Include lessons learned

**Acceptance Criteria:**
- Step-by-step migration instructions
- Real code examples
- Troubleshooting guide
- Lessons learned documented

---

### Task 5.6: Final Review & Sign-off
**Priority:** P0 (Critical)  
**Estimate:** 1 day  
**Dependencies:** All previous tasks

**Subtasks:**
1. Review all success criteria met
2. Review all deliverables
3. Final code review
4. Update CHANGELOG for all packages
5. Prepare summary report
6. Get stakeholder sign-off

**Acceptance Criteria:**
- All spec requirements met
- All tests passing
- Documentation complete
- Zero duplication verified
- Performance acceptable
- Stakeholder approval

---

## Summary

**Total Tasks:** 46 tasks across 5 phases  
**Total Estimated Time:** 6 weeks  
**Critical Path:** Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

**Key Milestones:**
- End of Phase 1: Core utilities ready
- End of Phase 2: Documentation complete
- End of Phase 3: Lorcana migrated
- End of Phase 4: Gundam migrated
- End of Phase 5: Validated and complete

**Risk Mitigation:**
- Each phase has verification tasks
- Testing at every step
- Documentation written alongside code
- Performance monitoring throughout

**Success Metrics:**
- Zero zone operation duplication
- >95% test coverage for new utilities
- >60% test boilerplate reduction
- <5% performance impact
- 100% documentation coverage


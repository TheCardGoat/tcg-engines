# Spec Requirements: Lorcana Cards Parser Refactoring

## Initial Description
Major redesign of the lorcana-cards parser to improve readability, extensibility, and correctness while keeping manual overrides as an escape hatch.

**Approach:** Grammar-based parser using Chevrotain (TypeScript-native parser toolkit) with a modular, layered architecture.

**Key Goals:**
1. Replace the monolithic parseAtomicEffect() (70+ if/else branches) with modular effect parsers
2. Replace 50+ regex patterns with a proper grammar-based lexer/parser
3. Reduce manual overrides (currently 2,803 lines) by parsing more automatically
4. Create extension points so new effects only require adding one file + registering

**Proposed Architecture:**
- Lexer Layer (Chevrotain Lexer) - Tokenize keywords, numbers, symbols, text
- Grammar Layer (Chevrotain Parser) - Define ability, trigger, effect, target, condition rules
- AST Visitor Layer - Transform CST to typed Ability objects
- Effect Registry - Modular effect parsers (one file per effect type)

**Implementation Phases:**
1. Foundation (Setup) - Add chevrotain, create v2/ structure, define tokens, create lexer
2. Core Grammar - Define ability/trigger/effect grammar, create CST→AST visitor
3. Effect Registry - Create registry pattern, migrate atomic effects to individual files
4. Composite Effects - Implement sequence, choice, optional, forEach, conditional
5. Target & Condition Grammar - Implement target/condition parsing rules
6. Integration & Migration - Wire v2 parser, feature flag, comparison tests
7. Cleanup - Remove legacy duplicates, reduce manual overrides, document grammar

**Success Criteria:**
- Readability: Each effect type in its own file (~50-100 lines each)
- Extensibility: Adding new effect = adding one file + registering
- Correctness: Same or better parsing accuracy vs v1
- Manual overrides: Target 80% automated parsing, 20% manual overrides acceptable
- Test coverage: 95%+ on v2 parser code

## Requirements Discussion

### First Round Questions

**Q1:** I assume you want to keep Chevrotain as the core parsing library (given its TypeScript-native nature and good performance). Should we configure it with embedded actions or prefer a separate visitor pattern for cleaner separation? I'm thinking the visitor pattern aligns better with the proposed AST Visitor Layer.

**Answer:** "I know nothing about both approaches, use your judgement." → **Decision: Use visitor pattern for cleaner separation of concerns.**

**Q2:** For the phased implementation approach, I assume Phase 1 (Foundation) and Phase 2 (Core Grammar) should be completed together as a single atomic deliverable since the grammar is useless without basic parsing. Should we target a single PR for Phases 1-2, or do you want them truly separate?

**Answer:** "Single PR is fine, so long as we fully remove the old parser." → **Decision: Combine phases for single PR with complete removal of legacy parser.**

**Q3:** Regarding the Effect Registry pattern, I'm thinking each effect parser file should export a standard interface like `{ pattern: RegExp | Grammar, parse: (tokens) => Effect }`. Should we also include a `priority` field to handle overlapping patterns, or rely on registration order?

**Answer:** "Rely on registration order." → **Decision: No priority field needed, use registration order.**

**Q4:** For the manual overrides (currently 2,803 lines), I assume these are card-specific edge cases that can't be grammar-parsed. Should the v2 parser maintain a similar override system, or should we aim to extend the grammar to handle these cases and only keep truly exceptional overrides (like erratas or unofficial cards)?

**Answer:** "Keep the override system, we don't want to build an overly complex parser. So long as we're able to parse 80% of the cards, we're fine in doing 20% manually." → **Decision: Maintain override system, target 80% automated parsing, 20% manual acceptable.**

**Q5:** I'm thinking the v2 parser should live alongside v1 initially (in a `src/parser/v2/` directory) with a feature flag to switch between them. Should we set up A/B comparison tests that parse all existing cards with both parsers and diff the results, or just spot-check critical cards?

**Answer:** "No need for this." → **Decision: Skip A/B comparison tests.**

**Q6:** For the target success metric of "<50% of current manual overrides", I assume we should track this as a quantitative goal. Should we add a script that counts overrides and fails CI if we exceed the threshold, or just track it manually during development?

**Answer:** "No need for this." → **Decision: Manual tracking only, no CI threshold.**

**Q7:** Regarding extensibility, I assume new effect types should be addable by creating a single file in `src/parser/v2/effects/` and registering it in an effects registry. Should this registration be automatic (via directory scanning) or explicit (via imports in an index file)? I'm leaning toward explicit for better tree-shaking and type safety.

**Answer:** "Explicit." → **Decision: Explicit registration via imports in index file.**

**Q8:** For test coverage, I assume the 95%+ target applies to the v2 parser code itself (lexer, grammar, visitors, effect parsers). Should we also maintain 95%+ coverage for end-to-end card parsing tests, or is it acceptable to have lower coverage there since we're validating correctness via comparison tests?

**Answer:** "Only v2 parser code." → **Decision: 95%+ coverage target applies only to v2 parser code.**

**Q9:** I'm thinking the cleanup phase (Phase 7) should remove the v1 parser entirely once v2 proves stable. Should we plan for a deprecation period where both exist, or do a clean cutover once v2 achieves feature parity? If deprecation, how many releases should we maintain dual parsers?

**Answer:** "Remove it immediately." → **Decision: No deprecation period, clean cutover with complete v1 removal.**

**Q10:** For the grammar definition, I assume we should support the full Lorcana ability text grammar including triggers, effects, targets, conditions, and composite structures. Are there any specific edge cases or rare card patterns we should explicitly exclude from v2's scope (to avoid scope creep)?

**Answer:** "No worries about scope creep." → **Decision: No explicit exclusions, support full Lorcana grammar.**

**IMPORTANT ADDITION - Logging Infrastructure:**

**User Request:** "Add loggers to simplify debugging."

**Decision:** Implement comprehensive logging infrastructure for the v2 parser to aid in debugging during development and production use.

### Existing Code to Reference

**Similar Features Identified:** Not specified by user.

**Components to potentially reuse:** None explicitly mentioned.

**Backend logic to reference:** None explicitly mentioned.

No similar existing features identified for reference. The v2 parser will be built from scratch using Chevrotain.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual files found in the planning/visuals directory.

## Requirements Summary

### Functional Requirements

**Core Parser Replacement:**
- Replace current parser's 50+ regex patterns with Chevrotain grammar-based parser
- Replace monolithic parseAtomicEffect() function (70+ if/else branches) with modular effect parsers
- Support full Lorcana ability text grammar: triggers, effects, targets, conditions, composite structures
- Maintain manual override system for edge cases (20% of cards acceptable)

**Architecture:**
1. **Lexer Layer** - Chevrotain-based lexer to tokenize keywords, numbers, symbols, text
2. **Grammar Layer** - Chevrotain parser defining ability, trigger, effect, target, condition rules
3. **AST Visitor Layer** - Transform Concrete Syntax Tree (CST) to typed Ability objects using visitor pattern
4. **Effect Registry** - Modular, pluggable effect parsers with explicit registration

**Effect Types to Support:**
- Draw/discard effects
- Damage effects
- Lore gain/loss effects
- Exert/ready effects
- Banish/return effects
- Stat modification effects
- Keyword grant effects
- Play card effects
- Reveal effects
- Search/look at cards effects
- Inkwell effects
- Location movement effects
- Composite effects: sequences, optional, choice, conditional, for-each, repeat

**Logging Infrastructure:**
- Comprehensive logging system for debugging
- Log key parsing decisions and failures
- Structured logging for troubleshooting card-specific issues
- Debug mode support

**Manual Override System:**
- Maintain existing override mechanism for edge cases
- Target: 80% cards parsed automatically, 20% manual acceptable
- Override format should be compatible with v2 architecture

### Non-Functional Requirements

**Performance:**
- Parser should be as fast or faster than v1
- Chevrotain is known for good performance with TypeScript

**Maintainability:**
- Each effect type in its own file (~50-100 lines each)
- Clear separation of concerns via layered architecture
- Explicit registration for effect parsers (better tree-shaking and type safety)

**Extensibility:**
- Adding new effect = create one file + register it
- No modification to core grammar for new atomic effects
- Registry pattern enables clean plugin-style architecture

**Type Safety:**
- Full TypeScript support throughout
- Leverage Chevrotain's TypeScript-native design
- Maintain branded types from @tcg/lorcana

**Testing:**
- 95%+ test coverage on v2 parser code (lexer, grammar, visitors, effect parsers)
- Unit tests for each effect parser
- Integration tests for composite effects
- Grammar validation tests

### Reusability Opportunities

No existing similar patterns identified in the codebase. This is a greenfield refactoring using Chevrotain.

### Scope Boundaries

**In Scope:**
- Complete replacement of current regex-based parser with Chevrotain grammar-based parser
- Modular effect parser architecture with registry pattern
- Support for all Lorcana effect types (draw, damage, lore, exert, banish, stat mods, keywords, play, reveal, search, inkwell, location, composites)
- Visitor pattern for CST to AST transformation
- Comprehensive logging infrastructure for debugging
- Manual override system for edge cases (20% acceptable)
- 95%+ test coverage for v2 parser code
- Complete removal of v1 parser (no deprecation period)
- Documentation of grammar rules

**Out of Scope:**
- A/B comparison testing between v1 and v2 parsers
- CI threshold enforcement for manual override percentage
- Automatic effect registration via directory scanning (using explicit registration instead)
- End-to-end card parsing test coverage requirements (focus on parser unit coverage)
- Supporting parsers for other TCGs (Lorcana-specific only)
- Visual debugging tools or parser IDE extensions
- Performance benchmarking suite

**Future Enhancements (Not in Initial Scope):**
- Auto-discovery of effect parsers via directory scanning
- Parser performance profiling tools
- Visual grammar debugging tools
- Parser configuration UI

### Technical Considerations

**Dependencies:**
- Add `chevrotain` package to lorcana-cards package.json
- Ensure compatibility with existing @tcg/lorcana types
- Maintain compatibility with Bun test runner

**Existing System Constraints:**
- Must output same Effect types as v1 parser for compatibility with lorcana-engine
- Manual overrides file structure should remain similar for ease of migration
- Parser must integrate with existing card generation pipeline

**Technology Preferences:**
- Chevrotain as core parsing library (TypeScript-native)
- Visitor pattern for CST→AST transformation (cleaner separation)
- Explicit registration for effect parsers (type safety, tree-shaking)
- Structured logging library (to be selected)

**Migration Strategy:**
- Single PR with complete v1 removal (no side-by-side period)
- Combine Foundation and Core Grammar phases for atomic delivery
- No feature flags or gradual rollout
- Clean cutover once v2 achieves feature parity

**Current Parser Statistics:**
- parseAtomicEffect(): 1,265 lines with 70+ if/else branches
- effect-parser.ts: 1,265 total lines
- patterns/effects.ts: 494 lines of regex patterns
- manual-overrides.ts: 2,803 lines
- Total parser complexity: ~134 if statements in effect-parser.ts

**File Structure:**
- Current: `src/parser/parsers/effect-parser.ts` (monolithic)
- Proposed: `src/parser/v2/` with subdirectories for lexer, grammar, visitors, effects
- Registry: `src/parser/v2/effects/index.ts` for explicit effect registration

**Integration Points:**
- Card generation scripts: `scripts/generate-cards.ts`
- Parser entry point: `src/parser/index.ts`
- Type definitions: Import from `@tcg/lorcana`

**Logging Requirements:**
- Use structured logging (JSON or similar)
- Log levels: DEBUG, INFO, WARN, ERROR
- Include context: card name, ability text, parsing stage, failure reason
- Optional verbose mode for deep debugging
- Should not impact production performance when logging is off

### Similar Code Patterns to Follow

**Project Coding Standards:**
- TypeScript strict mode (no `any` types, use `unknown`)
- Type-only imports: `import type { ... }`
- Branded types for identifiers
- Immutable state patterns
- TDD approach: write tests first, 95%+ coverage
- Biome for formatting and linting
- Bun for testing

**Naming Conventions:**
- Files: kebab-case (e.g., `effect-parser.ts`)
- Types: PascalCase (e.g., `EffectParser`)
- Functions: camelCase (e.g., `parseEffect()`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_TARGET`)

**Import Order:**
1. Type-only imports
2. External packages (chevrotain)
3. Internal packages (@tcg/lorcana)
4. Relative imports

**Error Handling:**
- Use Result types for fallible operations
- Zod for runtime validation if needed
- Fail fast with context-rich error messages
- Type guards for runtime type checking

**Testing Patterns:**
- Behavior-driven tests (test observable behavior)
- Real parser instances in integration tests
- Use Bun test with Jest-compatible API
- Descriptive test names

## Implementation Phases (Detailed)

### Phase 1: Foundation & Core Grammar (Combined)
**Goal:** Set up Chevrotain infrastructure and define basic grammar

**Tasks:**
1. Add chevrotain dependency to package.json
2. Create `src/parser/v2/` directory structure
3. Define token vocabulary (keywords, operators, literals)
4. Create lexer with token definitions
5. Define basic grammar rules for abilities, triggers, effects
6. Implement visitor base class for CST→AST transformation
7. Set up logging infrastructure
8. Write unit tests for lexer and basic grammar

**Deliverables:**
- Working lexer that tokenizes ability text
- Basic grammar that recognizes ability structure
- Visitor pattern implementation
- Logging system integrated
- 95%+ test coverage for lexer and grammar

### Phase 2: Effect Registry Pattern
**Goal:** Create modular effect parser architecture

**Tasks:**
1. Define EffectParser interface/type
2. Create effects registry with explicit registration
3. Create `src/parser/v2/effects/` directory
4. Implement 5-10 common atomic effect parsers (draw, damage, discard, etc.)
5. Wire registry to main parser
6. Add logging to effect parsers
7. Write unit tests for each effect parser

**Deliverables:**
- EffectParser interface
- Effects registry with explicit registration
- 5-10 working effect parsers
- Tests for all effect parsers

### Phase 3: Composite Effects
**Goal:** Support complex effect structures

**Tasks:**
1. Implement sequence effect parser
2. Implement choice effect parser
3. Implement optional effect parser
4. Implement for-each effect parser
5. Implement conditional effect parser
6. Implement repeat effect parser
7. Add logging for composite effect parsing
8. Write integration tests for composite effects

**Deliverables:**
- All composite effect types supported
- Recursive parsing of nested effects
- Tests for composite structures

### Phase 4: Targets & Conditions
**Goal:** Parse target and condition clauses

**Tasks:**
1. Define target grammar rules (characters, items, players, locations)
2. Implement target parsers
3. Define condition grammar rules
4. Implement condition parsers
5. Integrate targets and conditions into effect parsers
6. Add logging for target/condition parsing
7. Write tests for targets and conditions

**Deliverables:**
- Complete target parsing support
- Complete condition parsing support
- Integration with effect parsers
- Tests for all target and condition types

### Phase 5: Remaining Effect Types
**Goal:** Cover all Lorcana effect types

**Tasks:**
1. Identify remaining unparsed effect types from v1
2. Create effect parser for each type
3. Register all new parsers
4. Add comprehensive logging
5. Write tests for each new parser
6. Validate against real card data

**Deliverables:**
- 100% of effect types covered (that can be parsed)
- All parsers registered
- Comprehensive tests
- Logging for all code paths

### Phase 6: Integration & Migration
**Goal:** Wire v2 parser and migrate from v1

**Tasks:**
1. Update `src/parser/index.ts` to use v2 parser
2. Migrate manual overrides to v2 format (if needed)
3. Run card generation with v2 parser
4. Fix any parsing errors discovered
5. Validate output matches expected ability structures
6. Update any downstream code depending on parser output
7. Update documentation

**Deliverables:**
- v2 parser fully integrated
- Manual overrides migrated
- Card generation working
- Documentation updated

### Phase 7: Cleanup
**Goal:** Remove v1 parser and finalize

**Tasks:**
1. Delete v1 parser code entirely (effect-parser.ts, patterns/, old parsers/)
2. Remove any v1-specific tests
3. Clean up imports and references
4. Optimize effect parser registration order
5. Write grammar documentation
6. Create developer guide for adding new effect parsers
7. Final test suite run
8. Code review and polish

**Deliverables:**
- v1 parser completely removed
- Clean codebase
- Comprehensive documentation
- Developer guide for extensibility
- Final test coverage report (95%+)

## Success Metrics

**Quantitative:**
- 80%+ cards parsed automatically (20% manual overrides acceptable)
- 95%+ test coverage on v2 parser code
- Each effect parser file: 50-100 lines
- Zero regression in card parsing accuracy
- Parser performance equal to or better than v1

**Qualitative:**
- Code is more readable and maintainable
- Adding new effects requires only 1 file + registration
- Grammar is well-documented and understandable
- Logging provides actionable debugging information
- Developer experience is improved

**Validation:**
- All existing tests pass with v2 parser
- Card generation produces valid ability objects
- Manual code review confirms improved readability
- New developer can add effect parser in <1 hour

## Risk Mitigation

**Risk: Chevrotain learning curve**
- Mitigation: Follow Chevrotain tutorials and examples closely
- Mitigation: Start with simple grammar and iterate

**Risk: Incomplete grammar coverage**
- Mitigation: Maintain manual override system for edge cases
- Mitigation: Accept 80/20 rule (80% automated, 20% manual)

**Risk: Breaking changes to downstream code**
- Mitigation: Ensure v2 outputs same Effect types as v1
- Mitigation: Comprehensive integration testing

**Risk: Test coverage gaps**
- Mitigation: TDD approach, write tests first
- Mitigation: Track coverage metrics continuously

**Risk: Performance regression**
- Mitigation: Chevrotain is performant by design
- Mitigation: Profile if issues arise (not in initial scope)

## Dependencies on Other Work

**Blockers:**
- None identified

**Dependencies:**
- Chevrotain package must be added
- Logging library must be selected and added

**Impacts:**
- Card generation pipeline will use v2 parser
- Any code depending on parser output must be validated
- Documentation must be updated

## Open Questions

None remaining - all questions have been answered by the user.

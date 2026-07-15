# Initial Spec Idea

## User's Initial Description

**Feature Name:** Lorcana Cards Parser Refactoring

**Description:**
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
- Manual overrides: Reduced reliance (target: <50% of current)
- Test coverage: 95%+ on v2 parser

Create the spec folder and save this raw idea. Return the path to the dated spec folder.

## Metadata
- Date Created: 2025-12-29
- Spec Name: lorcana-cards-parser-refactoring
- Spec Path: /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/specs/2025-12-29-lorcana-cards-parser-refactoring

# Spec Requirements Document

> Spec: Core Framework Reuse & Consolidation
> Created: 2025-10-09
> Status: ✅ **COMPLETED** (Merged via PR #29 on October 9, 2025)

## Overview

Consolidate duplicated functionality from gundam-engine and lorcana-engine into the @tcg/core framework to reduce code duplication, improve consistency, and simplify game engine development. This initiative addresses critical gaps where game engines are reimplementing zone operations, testing utilities, card tooling, and common patterns that should be provided by the core framework.

## User Stories

### Story 1: Game Engine Developer - Zone Operations

As a game engine developer, I want to use standard zone operation utilities from @tcg/core, so that I don't have to reimplement common patterns like moving cards between zones, shuffling decks, or checking zone contents in each game.

**Workflow:**
Currently, both gundam-engine and lorcana-engine implement their own zone operation helpers with slightly different APIs (lorcana has `createZoneState`, `moveCardBetweenZones`, etc.; core has `addCard`, `removeCard`, `moveCard` with Zone objects). This creates confusion about which approach to use and leads to duplicated testing. The developer should simply import zone utilities from @tcg/core and use them consistently across all games.

**Problem Solved:**
Eliminates duplicate zone operation implementations and provides a single, well-tested, well-documented API for common zone operations.

### Story 2: Game Engine Developer - Testing Infrastructure

As a game engine developer, I want reusable test utilities from @tcg/core, so that I can quickly set up test games, create test states, and verify game behavior without writing boilerplate test setup code for each game.

**Workflow:**
Currently, each game engine creates its own test game definitions from scratch. Core has excellent integration tests (coin-flip-game, complete-game, network-sync) but doesn't expose these patterns as reusable utilities. The developer should be able to import test builders like `createTestEngine()`, `createTestGameState()`, `createTestMove()`, etc.

**Problem Solved:**
Reduces test boilerplate, ensures consistent testing patterns across games, and makes TDD easier for game developers.

### Story 3: Card Management Tooling Developer

As a developer working on card management tooling (scrapers, parsers, generators), I want reusable card definition utilities from @tcg/core, so that I don't have to build text parsing, code generation, and file management infrastructure from scratch for each game.

**Workflow:**
Currently, gundam-engine has sophisticated card management tools (text-parser, card-generator, file-writer) but these are game-specific. While card text patterns differ by game, the infrastructure for parsing structured text, generating TypeScript files, managing card files, and validating card definitions could be abstracted. The developer should be able to extend core card tooling patterns with game-specific parsers.

**Problem Solved:**
Provides a foundation for card management tooling that games can extend, reducing the barrier to building professional card management pipelines.

## Spec Scope

1. **Zone Operations Consolidation** - Unify zone operation APIs between core and game engines, provide comprehensive zone utilities covering all common patterns (move, shuffle, draw, mill, search, peek).

2. **Testing Utilities Package** - Extract reusable testing patterns from core integration tests into a dedicated `@tcg/core/testing` export with test builders, assertion helpers, and game state factories.

3. **Card Tooling Foundation** - Create a `@tcg/core/tooling` package with infrastructure for card text parsing, code generation, file management, and validation that games can extend.

4. **Common Type Guards & Validators** - Provide type guards, validation utilities, and schema builders that games can use for runtime validation of cards, moves, and game states.

5. **Documentation & Examples** - Document all reusable utilities with clear examples showing how gundam-engine and lorcana-engine leverage core framework features.

## Out of Scope

- Game-specific logic (e.g., Lorcana's lore system, Gundam's pilot pairing)
- Game-specific card text patterns (e.g., Gundam's 【Deploy】syntax, Lorcana's challenge rules)
- Game-specific move implementations
- UI components or rendering logic
- Network transport layers (covered separately)
- Complete card databases (games maintain their own cards)

## Expected Deliverable

1. **Unified Zone API** - Single, comprehensive zone operations API used by both gundam-engine and lorcana-engine with zero zone operation duplication.

2. **Testing Utilities Export** - `@tcg/core/testing` package with documented test builders and helpers, with both game engines using these utilities in their test suites.

3. **Card Tooling Infrastructure** - `@tcg/core/tooling` package with base classes for parsers, generators, and validators that gundam-engine's tools extend.

4. **Zero Duplication Verification** - Run static analysis showing no duplicated zone operations, no duplicated test utilities, and clear documentation of what's in core vs what's game-specific.

5. **Migration Guide** - Step-by-step guide for migrating existing game-specific utilities to use core framework equivalents.


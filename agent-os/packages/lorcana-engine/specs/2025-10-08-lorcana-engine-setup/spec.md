# Spec Requirements Document

> Spec: Lorcana Engine Package Setup
> Created: 2025-10-08

## Overview

Create a standalone package `@tcg/lorcana` at `packages/lorcana-engine` that implements Disney Lorcana game rules using the `@tcg/core` framework. This package will serve as both a production-ready Lorcana engine and a reference implementation to validate and polish the core framework's extensibility while maintaining framework agnosticism.

## User Stories

### Game Engine Developer

As a game engine developer, I want to build a Lorcana implementation using `@tcg/core`, so that I can validate the framework's design and identify areas for improvement.

**Workflow**: Developer creates package structure, configures tooling (TypeScript, Biome, Turbo), sets up boundaries to enforce clean dependencies, documents folder structure with clear READMEs explaining each component's purpose, and creates integration documentation for `@tcg/core` that guides future TCG implementations.

**Problem Solved**: Without proper package scaffolding and documentation, it's unclear how to structure a TCG engine using the framework. This spec establishes patterns and conventions that make framework integration clear and repeatable.

### Future TCG Implementer

As a developer building another TCG engine, I want clear documentation and examples, so that I can quickly understand how to integrate with `@tcg/core`.

**Workflow**: Developer reads `ENGINE_INTEGRATION.md` to understand core concepts, examines `@tcg/lorcana` folder structure as reference, follows established patterns for game definition, move system, and card management, and uses documented conventions for testing and validation.

**Problem Solved**: Without a reference implementation and clear integration guide, each TCG implementation would need to figure out the framework patterns independently, leading to inconsistency and slower adoption.

### Framework Maintainer

As a framework maintainer, I want a reference implementation that validates design decisions, so that I can identify framework gaps and ensure extensibility.

**Workflow**: Maintainer uses `@tcg/lorcana` as test bed for framework changes, identifies missing abstractions or inflexible APIs, refines core framework based on real-world usage, and ensures framework remains agnostic to specific game implementations.

**Problem Solved**: Without a concrete implementation, framework design remains theoretical and may have blind spots that only surface when building actual games.

## Spec Scope

1. **Package Configuration** - Set up `package.json`, `tsconfig.json`, `biome.json`, and `turbo.json` with proper dependencies and build configuration.

2. **Turborepo Boundaries** - Configure boundaries to enforce that `@tcg/lorcana` only depends on `@tcg/core`, preventing cross-engine dependencies.

3. **Folder Structure** - Create documented folder structure (`src/game-definition/`, `src/moves/`, `src/cards/`, `src/types/`, `src/queries/`, `src/rules/`) with README files explaining each component's purpose and integration patterns.

4. **Integration Documentation** - Create comprehensive `ENGINE_INTEGRATION.md` in `@tcg/core` package documenting how to build TCG engines with the framework, including state shape design, move system, zones, flow, cards, and testing strategies.

5. **Agent OS Structure** - Establish `.agent-os/packages/lorcana-engine/` with product documentation (mission, tech stack, roadmap) and specs folder for future specifications.

## Out of Scope

- Game logic implementation (moves, abilities, card definitions)
- Card data for Lorcana sets
- Ability DSL or card builder tools
- Performance optimization
- AI opponent integration
- UI/presentation layer
- Network/multiplayer infrastructure
- Example games or demo applications

## Expected Deliverable

1. **Package builds and type-checks** - Running `bun run check-types` succeeds without errors.

2. **Boundaries enforced** - Running `turbo boundaries` validates that `@tcg/lorcana` only depends on `@tcg/core`.

3. **Clear integration documentation** - `ENGINE_INTEGRATION.md` provides comprehensive guide for building TCG engines, covering all major framework features with code examples.

4. **Complete folder structure** - All required directories exist with informative README files explaining purpose, patterns, and usage.

5. **Agent OS documentation** - Product mission, tech stack, and roadmap clearly document package goals and implementation strategy.


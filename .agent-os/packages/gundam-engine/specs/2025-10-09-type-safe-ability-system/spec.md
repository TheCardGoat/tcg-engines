# Spec Requirements Document

> Spec: Type-Safe Ability System for Gundam Card Game Engine
> Created: 2025-10-09

## Overview

Implement a comprehensive, type-safe ability system for the Gundam Card Game engine that eliminates `unknown` types, provides full TypeScript type safety, enables exhaustive pattern matching, and creates a direct execution path from card definitions to engine runtime. This system will replace the current loosely-typed ability definitions with a robust, discriminated union-based architecture that ensures compile-time correctness and runtime reliability.

## User Stories

### Developer: Type-Safe Card Definition

As a card game developer, I want to define card abilities using strongly-typed structures, so that I catch errors at compile time rather than at runtime and get full IDE autocomplete support when writing card definitions.

**Workflow:** Developer opens a card definition file, begins typing an ability structure, and receives immediate autocomplete suggestions for all valid effect actions, targets, and conditions. TypeScript compiler catches any type mismatches before code is committed.

### Engine Developer: Exhaustive Pattern Matching

As an engine developer, I want to implement effect executors with exhaustive switch statements, so that the TypeScript compiler ensures I handle every possible effect type and prevents unhandled cases from reaching production.

**Workflow:** When implementing the effect execution system, the developer writes a switch statement over effect action types. TypeScript enforces that all discriminated union cases are handled, preventing compilation if any effect type is missed.

### Parser Developer: Structured Output Target

As a parser developer, I want a clear target type system to parse card text into, so that I can incrementally improve parsing accuracy while maintaining type safety and falling back gracefully for complex effects.

**Workflow:** Parser reads card text, identifies patterns, and constructs strongly-typed ability definitions. For effects that cannot be parsed automatically, the parser can still produce valid output with appropriate flags for manual review.

## Spec Scope

1. **Target System Definition** - Create comprehensive type definitions for all possible effect targets including players, cards in zones, shields, with full filtering capabilities (traits, stats, card types, etc.)

2. **Effect Action Types** - Define all atomic effect actions as discriminated unions covering card movement, state changes, combat, stat modification, keyword granting, searching, and special actions

3. **Condition System** - Implement a composable condition system for constant effects, trigger conditions, and activation requirements with logical operators (AND, OR, NOT)

4. **Duration System** - Define how long effects last including permanent, until-end-of-turn, until-end-of-battle, while-condition-is-true, and zone-dependent durations

5. **Complete Ability Types** - Create distinct types for constant, triggered, activated, command, and substitution abilities with proper metadata (restrictions, triggers, costs)

6. **Card Type Updates** - Update all card definition types (Unit, Pilot, Command, Base, Resource) to use the new strongly-typed ability system

7. **Type Guards and Utilities** - Implement helper functions for type narrowing and validation to support runtime type checking

## Out of Scope

- Parser implementation (will be separate task after types are defined)
- Engine executor implementation (will be separate task after types are defined)
- Migration of existing card definitions (will be done incrementally)
- UI/display layer changes (this is purely type system work)
- Network synchronization (types will support it but implementation is separate)

## Expected Deliverable

1. **Compile-Time Safety**: All new card definitions using the type system must compile with TypeScript strict mode with zero type errors and zero use of `any` or `unknown` types

2. **Exhaustive Handling**: A sample effect executor function that switches over all effect action types and successfully compiles only when all cases are handled (demonstrating exhaustiveness checking)

3. **Complete Type Coverage**: Type definitions covering all ability types, effect actions, targets, conditions, and durations documented in the Gundam Card Game comprehensive rules

4. **Type Guard Suite**: Complete set of type guard functions enabling runtime type narrowing for all major type discriminations in the system


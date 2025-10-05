# Spec Requirements Document

> Spec: Secure Targeting System for Core TCG Engine
> Created: 2025-10-05

## Overview

Design and implement a comprehensive, type-safe, and secure targeting system for the Core TCG Engine that builds upon the existing `TargetSpec` infrastructure, extends the `CardFilterDSL` with rich filtering capabilities, provides automatic target validation with security checks (Ward, protection abilities), and delivers a clean API for enumerating potential targets. This system will work with the existing `EnumerableMove` pattern while adding the missing pieces needed for game-specific implementations like Lorcana.

## User Stories

### Game Engine Developer Story

As a game engine developer, I want a unified, type-safe targeting API with clear separation of concerns, so that I can easily define card targets, validate them securely, and avoid subtle bugs caused by circular dependencies or scattered validation logic.

**Detailed Workflow:**
1. Define a card effect's target requirements using a declarative, type-safe Target builder
2. Query the system for potential valid targets based on filters and game state
3. Validate player-selected targets against security rules (Ward, protection abilities) automatically
4. Receive clear error messages when validation fails, with detailed reasoning
5. Handle "up to X" targets and optional targeting scenarios uniformly
6. Trust that all security checks (Ward, Hexproof-like abilities) are enforced by default
7. Debug target validation issues using built-in diagnostic tools

### Card Implementation Story

As a card implementer, I want to specify targeting requirements in a declarative way without worrying about security edge cases, so that I can focus on card behavior rather than validation logic.

**Detailed Workflow:**
1. Use predefined target templates for common scenarios (`opponentCharacters`, `damagedCharactersYouControl`)
2. Compose complex targets using builder pattern for unusual requirements
3. Rely on the system to automatically enforce Ward, targeting restrictions, and protection abilities
4. Have confidence that "choose a target" vs "all targets" semantics are handled correctly
5. See clear compile-time errors if target definitions are malformed

### Security Auditor Story

As a security-conscious developer, I want all targeting validation to go through a single, auditable entry point with guaranteed security checks, so that there are no bypass vulnerabilities allowing invalid targets.

**Detailed Workflow:**
1. Review a single `TargetValidator` class that all target selection flows through
2. Verify that Ward checks, protection abilities, and zone restrictions are mandatory
3. Confirm that client-submitted targets are re-validated on the server
4. Audit the codebase for any direct card references that bypass target validation
5. Add custom validation rules (e.g., "can't target this turn") to a centralized hook system

## Spec Scope

1. **Unified Target Definition API** - Create a type-safe builder pattern for defining targets with filters, eliminating the need for manual filter arrays and reducing `as any` casts.

2. **Centralized Target Validation** - Implement a single `TargetValidator` class that enforces all security rules (Ward, protection, zone restrictions) in one place, replacing scattered validation across multiple files.

3. **Potential Target Calculation** - Provide a `PotentialTargetsCalculator` that efficiently computes valid targets considering game state, security restrictions, and filter criteria without circular dependencies.

4. **Target Requirement Detection** - Implement a `requiresTarget()` API that reliably determines if an ability needs player input for targeting, handling edge cases like random targets, auto-targets, and "all" effects.

5. **Performance Optimization** - Design the filter evaluation system to short-circuit expensive checks and avoid recursive filter evaluations through proper dependency ordering.

6. **Migration Path & Backward Compatibility** - Ensure the new system can coexist with legacy target definitions during migration, with adapter functions to convert old format to new format.

## Out of Scope

- Changes to the effect execution system (focus is purely on target selection/validation)
- UI/frontend target selection interface (backend logic only)
- Network protocol changes for multiplayer target selection
- Migration of existing card definitions (will be handled in separate migration spec)
- Performance benchmarking tools (focus is on correctness first)
- Support for complex multi-stage targeting (e.g., "choose two targets, then choose one of those two")

## Expected Deliverable

1. **Secure-by-Default Target Validation** - All target selection flows through a centralized validator that enforces Ward, protection abilities, and zone restrictions without requiring explicit checks in card code.

2. **Zero Circular Dependency Issues** - The new system eliminates all circular filter evaluation problems through proper dependency management and does not require MAX_DEPTH safeguards.

3. **Type-Safe Target Definitions** - Card implementers can define targets using a builder API with full TypeScript type checking, catching errors at compile time rather than runtime.

4. **Clear API Contracts** - `requiresTarget()`, `getPotentialTargets()`, and `validateTarget()` have well-defined behavior with comprehensive documentation and edge case handling.

5. **Migration Guide & Compatibility** - A documented migration path exists for converting legacy target definitions to the new system, with adapter functions ensuring backward compatibility during transition.


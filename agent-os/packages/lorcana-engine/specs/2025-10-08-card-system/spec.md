# Spec Requirements Document

> Spec: Lorcana Card System (Phase 3)
> Created: 2025-10-08

## Overview

Implement the complete card system for Disney Lorcana, including all card types (Characters, Actions, Items, Locations), card properties (Strength, Willpower, Lore, Ink Cost, Classifications), and all 11 keyword abilities. This establishes the type-safe foundation for defining Lorcana cards that integrate seamlessly with the @tcg/core framework, enabling full implementation of card interactions and gameplay mechanics.

## User Stories

### Card Type Definitions

As a game developer, I want to define Lorcana card types (Character, Action, Item, Location) with full type safety, so that I can catch type errors at compile time and ensure all card properties are correctly structured according to the official rules.

**Workflow**: Define a character card with required properties (Strength, Willpower, Lore Value, Classifications) and the TypeScript compiler validates all properties are present and correctly typed. Cards without required properties (e.g., Action without Strength) are prevented at compile time.

**Problem Solved**: Eliminates runtime errors from missing or incorrectly typed card properties. Developers get immediate feedback when card definitions don't match the official Lorcana rules.

### Keyword Ability System

As a game developer, I want to implement all 11 Lorcana keyword abilities (Bodyguard, Challenger, Evasive, Reckless, Resist, Rush, Shift, Singer, Sing Together, Support, Vanish, Ward) with their technical definitions from the comprehensive rules, so that keyword abilities work exactly as specified in the official rules.

**Workflow**: Define a character with "Challenger +2" keyword ability. The type system ensures the keyword is spelled correctly, the +N value is provided for stacking keywords, and the ability is only applied to characters (not Actions). The system prevents invalid combinations like "Challenger" on an Action card.

**Problem Solved**: Ensures all keyword abilities are implemented consistently and correctly according to official rules. Prevents typos in keyword names and invalid ability assignments. Supports keyword stacking for abilities like Resist and Challenger.

### Card Instance State Management

As a game developer, I want to track runtime card state (damage, exerted status, shifted stack position, location attachment) using @tcg/core's CardInstance system extended with Lorcana-specific properties, so that card state updates are immutable, type-safe, and compatible with the framework's delta synchronization.

**Workflow**: During a challenge, damage is dealt to a character. The system updates the character's damage counter through Immer's immutable update, creating a new state with delta patches. The character's Willpower is checked against damage, and if damaged >= willpower, the character is banished automatically through a game state check.

**Problem Solved**: Prevents state mutation bugs and ensures all state changes are tracked for replay/undo functionality. Damage accumulation, shift stacking, and location attachment all work consistently within the framework.

## Spec Scope

1. **Card Type Definitions** - Define Character, Action (including Songs), Item, and Location types with discriminated unions for type safety

2. **Card Properties** - Implement all properties (Ink Cost, Strength, Willpower, Lore Value, Ink Type, Classifications, Rarity, Set, Collector Number, Move Cost for Locations)

3. **Keyword Abilities (All 11)** - Complete type definitions and factory functions for Bodyguard, Challenger +N, Evasive, Reckless, Resist +N, Rush, Shift (including variants), Singer, Sing Together, Support, Vanish, Ward

4. **Ability Systems** - Type definitions for Triggered Abilities (with conditions), Activated Abilities (with costs), Static Abilities, and Replacement Effects

5. **Card Conditions** - Type-safe representations for Ready, Exerted, Damaged, Under/On Top/In Stack states

6. **Card Instance Extensions** - Extend @tcg/core CardInstance with Lorcana-specific runtime state (damage, shift stack, location attachment, played-this-turn flag)

7. **Type Guards and Utilities** - Helper functions for type narrowing (isCharacter, isAction, isLocation, hasKeyword, etc.)

8. **Integration with @tcg/core** - Seamless integration with CardDefinition, CardInstance, Modifier types from the framework

## Out of Scope

- Move implementations (Phase 2 - playCard, quest, challenge, etc.)
- Flow definitions (Phase 2 - turn structure, phases, steps)
- Specific card set data (Phase 5 - individual card definitions for sets 1-8)
- Card ability resolution logic (will be implemented with moves in Phase 2)
- UI components for displaying cards
- Network synchronization (handled by @tcg/core framework)
- Deck building validation (separate feature)

## Expected Deliverable

1. **Type-Safe Card Definitions** - TypeScript compiles without errors and prevents invalid card configurations (e.g., Action with Strength property, character without Willpower)

2. **All 11 Keywords Represented** - Each keyword ability has a type definition matching its technical definition from the comprehensive rules, with proper support for stacking keywords (+N)

3. **Runtime State Management** - CardInstance extended with Lorcana properties works with Immer immutability and produces delta patches for synchronization

4. **Type Guards Functional** - Helper functions correctly narrow types (isCharacter(card) → card has Strength/Willpower properties available)

5. **Integration Tests Pass** - Core types can be instantiated, modified through Immer, and queried using framework's filter system

6. **Zero `any` Types** - All types are explicit and type-safe, with no `any` escapes


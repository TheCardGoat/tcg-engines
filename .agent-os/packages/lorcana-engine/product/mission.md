# Product Mission

## Overview

`@tcg/lorcana` is a comprehensive implementation of Disney Lorcana trading card game using the `@tcg/core` framework. This package serves a dual purpose:

1. **Reference Implementation**: Demonstrates best practices for building TCG engines with `@tcg/core`, validating the framework's extensibility and guiding future game implementations.
2. **Production Engine**: Provides a fully-featured, production-ready Lorcana game engine that can be integrated into multiplayer games, AI opponents, and simulation tools.

## Goals

### Primary Goals

1. **Validate Core Framework**: Serve as the primary testing ground for `@tcg/core`, identifying gaps, refining APIs, and ensuring the framework remains truly agnostic while being extensible enough for complex TCG mechanics.

2. **Complete Rule Implementation**: Implement all official Lorcana rules including:
   - Turn structure (Beginning, Main, End phases)
   - Card types (Characters, Actions, Items, Locations)
   - Core mechanics (Questing, Challenging, Inking, Shifting)
   - Keyword abilities (Bodyguard, Challenger, Evasive, Resist, Rush, Singer, Support, Ward, etc.)
   - Triggered and activated abilities
   - Zone management (Hand, Deck, Play, Discard, Inkwell)

3. **Type-Safe Game Definition**: Create a declarative, type-safe game definition that:
   - Defines all Lorcana-specific state shape
   - Registers all available moves
   - Configures turn/phase/step flow
   - Establishes zone configurations
   - Provides validation rules

4. **Comprehensive Card Library**: Build a complete card definition system for all Lorcana sets, demonstrating how to express complex card abilities using the framework's DSL.

### Secondary Goals

1. **Documentation by Example**: Serve as living documentation showing developers how to:
   - Structure a TCG engine package
   - Define game-specific state types
   - Implement move handlers
   - Create card definitions
   - Write behavior-driven tests
   - Integrate with the core framework

2. **Performance Benchmarking**: Establish performance baselines for TCG engines built with `@tcg/core`, identifying optimization opportunities.

3. **AI Integration Ready**: Structure the engine to support AI opponent development through clear move enumeration and state evaluation APIs.

## Success Criteria

- All official Lorcana rules implemented and tested
- 100% test coverage of game mechanics through behavior tests
- Type-safe throughout with TypeScript strict mode
- Deterministic and replayable gameplay
- Clear integration patterns documented
- Serves as template for other TCG implementations
- Performance suitable for real-time multiplayer gameplay

## Non-Goals

- UI/UX implementation (this is a logic-only engine)
- Network/multiplayer infrastructure (handled by consumers)
- Asset management (card images, sounds, etc.)
- Deck building interface
- Player authentication or accounts
- Tournament management systems

## Target Users

1. **Game Developers**: Building Lorcana implementations for web, mobile, or desktop
2. **AI Researchers**: Training AI agents to play Lorcana
3. **Rule Engine Developers**: Learning how to build TCG engines with `@tcg/core`
4. **Simulation Tools**: Requiring accurate Lorcana game logic for testing and analysis


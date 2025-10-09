# Product Mission

## Vision

Build a **universal, open-source TypeScript framework** for developing **turn-based trading card games (TCGs)**—from Magic: The Gathering and Hearthstone to custom indie titles—with first-class support for **deterministic state management**, **delta-based synchronization**, **turn/phase/step orchestration**, and **multiplayer networking**.

The goal is not to build a single game, but to provide a **robust, extensible core engine** that any TCG developer can use to rapidly prototype and ship production-ready games.

## The Problem

Developing a TCG from scratch is complex:
- Managing mutable game state across turns is error-prone
- Synchronizing state between clients in multiplayer requires careful delta handling
- Turn structures (phases, steps, priority) vary widely between games
- Undo, replay, and spectator modes are hard to retrofit
- Most teams reinvent these wheels—often inconsistently and without testability or network safety

## The Solution

`@tcg/core` is a minimal, immutable, Immer-powered core engine that provides:
- Game state as a pure data tree
- Action-based state transitions
- Built-in delta patching (via Immer patches)
- Turn/phase/step flow orchestration
- Undo/redo and replay support
- Player view filtering (for hidden information)
- Type-safe move definitions
- Authoritative server-side state management with client-side optimistic updates
- Game logs and telemetry

## Target Users

| User | Use Case |
|------|----------|
| **Indie Game Devs** | Rapidly prototype a custom TCG without building engine logic |
| **TCG Studios** | Standardize multiplayer sync and turn logic across titles |
| **Modders** | Extend existing engines with new cards or rules |
| **Educators** | Teach game architecture with a real-world, open-source example |

## Why This Matters

> "Every TCG team shouldn't have to solve the same hard problems in isolation."

By providing a **battle-tested, type-safe, network-ready core**, we lower the barrier to entry for TCG development and raise the quality bar for multiplayer integrity, replayability, and maintainability.

This isn't just a library—it's a **foundation for the next generation of digital card games**.

## Success Metrics

- **Adoption**: 10+ production TCG implementations using the framework
- **Performance**: Support 10,000+ concurrent games with <100ms move latency
- **Developer Satisfaction**: <2 hour onboarding time for new developers
- **Code Quality**: 95%+ test coverage, 0 critical bugs in production
- **Community**: 1,000+ GitHub stars, 50+ contributors


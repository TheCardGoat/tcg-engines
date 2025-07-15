# Product Overview

TheCardGoat is a Trading Card Game (TCG) framework and simulation platform, specifically designed for Disney Lorcana but built with extensibility in mind.

## Core Components

- **Core Engine**: Framework-agnostic TCG engine with immutable state management, replay capabilities, and server-authoritative architecture
- **Lorcana Engine**: Legacy Disney Lorcana-specific implementation (deprecated - use core engine for new projects)
- **Shared Libraries**: Common utilities, types, and logging infrastructure

## Key Features

- Immutable, replayable game state with delta-driven updates
- Deterministic game logic for consistent multiplayer experiences  
- Extensible architecture supporting multiple TCG implementations
- Comprehensive logging and debugging capabilities
- Server-authoritative multiplayer support

## Architecture Principles

- Separation of concerns between game logic, rules, UI, and platform services
- Clear action and query interfaces for game interactions
- Hierarchical game structure (Segment → Turn → Phase → Step)
- Localization-ready communication system
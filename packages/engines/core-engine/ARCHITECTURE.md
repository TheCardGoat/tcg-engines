# ARCHITECTURE.md

## OVERVIEW

### 1.1 Core Tenets
The TCG framework is built on these architectural principles:
- **Immutable State**: All game state objects are immutable, changes create new objects
- **Replayable & Delta-Driven**: Games can be replayed from initial state + action logs
- **Server-Authoritative**: Server holds definitive game state
- **Deterministic Logic**: Same inputs always produce same outputs
- **Agnostic & Extensible Core**: Core engine unaware of specific game rules
- **Clear Action & Query Interfaces**: Well-defined APIs for actions and state queries
- **Separation of Concerns**: Game logic, rules, UI, and platform services strictly separated
- **Comprehensive Logging**: Structured logging at configurable levels
- **Localized Communication**: Player text designed for localization

### 1.2 System Architecture
```
Core Engine                    Game Engines
┌──────────────────┐          ┌─────────── ────┐
│ Framework        │◄─extends─┤ Specific Impl  │
│ - Flow control   │          │ - Game state   │
│ - State mgmt     │          │ - Card defs    │
│ - Event system   │          │ - Rules        │
│ - Move validation│          │ - Effects      │
└──────────────────┘          └────────────────┘
```

### 1.3 Hierarchical Game Structure
```
Segment
  └── Turn
      └── Phase
          └── Step
```
- **Segment**: Logical game sections (Setup, Mulligan, Gameplay, Sideboard)
- **Turn**: Complete cycle where each player becomes turn player
- **Phase**: Major divisions within turn (Draw Phase, Main Phase, Combat Phase)
- **Step**: Smaller divisions within phase (Untap Step, Draw Step)

## COMPONENTS

# Compatibility Layer Audit - Tasks 9-16

## Overview
This document tracks the gaps between the specification (tasks.md) and the existing implementation, and defines the compatibility layer needed.

## Task 9: XState Flow Manager

**Spec Requirements:**
- FlowDefinition type with XState integration
- XState machine for turn/phase/step orchestration
- Lifecycle hooks (onBegin, onEnd) in Immer context
- Guard conditions for transitions
- Hierarchical states support
- Flow event handling (NEXT_PHASE, PASS_PRIORITY, EXECUTE_MOVE, END_TURN)

**Current Implementation:**
- ✅ `FlowManager` class exists in `flow/flow-manager.ts`
- ❌ Does NOT use XState (custom implementation)
- ✅ Has lifecycle hooks
- ✅ Has phase/step management
- ❌ Missing explicit XState machine integration

**Compatibility Layer Needed:**
- [ ] Create `FlowDefinition<TState>` type matching spec
- [ ] Create XState machine wrapper/adapter
- [ ] Expose XState-compatible API
- [ ] Add XState types for events and context

**Status:** PARTIAL - Needs XState compatibility layer

---

## Task 10: GameDefinition Type System

**Spec Requirements:**
- `GameDefinition<TState, TMoves>` generic type
- setup, moves, flow, endIf, playerView fields
- Validation at initialization
- Zod schema for validation

**Current Implementation:**
- ✅ `GameDefinition` type exists in `game-configuration.ts`
- ✅ Has setup, moves, flow fields
- ⚠️  May be missing some type constraints
- ❌ Missing Zod schema validation

**Compatibility Layer Needed:**
- [ ] Verify GameDefinition matches spec exactly
- [ ] Create Zod schema for GameDefinition
- [ ] Add validation function

**Status:** MOSTLY COMPLETE - Needs validation

---

## Task 11: Rule Engine Core

**Spec Requirements:**
- `RuleEngine<TState, TMoves>` class
- Methods: getState, getPlayerView, executeMove, canExecuteMove, getValidMoves
- History: undo, redo, getHistory
- Replay: replay(actions)
- Patches: getPatches, applyPatches

**Current Implementation:**
- ✅ `CoreEngine` class exists in `engine/core-engine.ts`
- ⚠️  May have different method names/signatures
- ❌ Missing explicit RuleEngine wrapper

**Compatibility Layer Needed:**
- [ ] Create `RuleEngine` class/interface matching spec
- [ ] Adapter to CoreEngine
- [ ] Verify all required methods exist

**Status:** PARTIAL - Needs compatibility wrapper

---

## Task 12: AI Move Enumeration

**Spec Requirements:**
- `EnumeratedMove` type with evaluation score
- `enumerateValidMoves` function
- `enumerateValidTargets` function
- `isValidMove` validation
- `countValidMoves` optimization
- Move priority/ranking system

**Current Implementation:**
- ❓ Unknown if exists
- Need to search for move enumeration code

**Compatibility Layer Needed:**
- [ ] Audit existing move enumeration
- [ ] Create missing enumeration functions
- [ ] Add AI evaluation scoring

**Status:** UNKNOWN - Needs audit

---

## Task 13: Delta Synchronization Utilities

**Spec Requirements:**
- `serializePatches` for JSON serialization
- `deserializePatches` for JSON parsing
- `applyPatchesToState` utility
- `reversePatch` for undo using Immer inverse patches
- Batch patch application
- Patch validation

**Current Implementation:**
- ⚠️  Patches likely exist (Immer is used)
- ❌ Missing utility functions as described in spec

**Compatibility Layer Needed:**
- [ ] Create patch serialization utilities
- [ ] Create patch application utilities
- [ ] Add patch validation
- [ ] Export as standalone module

**Status:** MISSING - Needs implementation

---

## Task 14: Player View Filtering

**Spec Requirements:**
- Default playerView function
- Hide opponent hands
- Hide deck contents
- Face-down card filtering
- Zone visibility rules
- Deterministic views

**Current Implementation:**
- ⚠️  May exist in GameDefinition.playerView
- ❌ Not as standalone system

**Compatibility Layer Needed:**
- [ ] Create playerView filtering module
- [ ] Implement visibility rules
- [ ] Create helper functions for common patterns
- [ ] Tests for determinism

**Status:** PARTIAL - Needs dedicated module

---

## Task 15: Example Game Implementation

**Spec Requirements:**
- Simple card game (CoinFlip or Rock-Paper-Scissors)
- Complete game definition
- Game moves
- Game flow
- End conditions
- End-to-end playthrough test
- Deterministic replay test

**Current Implementation:**
- ⚠️  Examples may exist in engines/
- ❌ Not matching spec requirements

**Compatibility Layer Needed:**
- [ ] Create simple example game from scratch
- [ ] Follow spec exactly
- [ ] Comprehensive tests
- [ ] Documentation

**Status:** MISSING - Needs implementation

---

## Task 16: Integration & Documentation

**Spec Requirements:**
- Integration tests for server-authoritative pattern
- Network synchronization tests
- Complete game flow tests
- TypeDoc API documentation
- README.md with quick start
- Core concepts guide
- Tutorial for building TCG
- Code examples

**Current Implementation:**
- ❌ Integration tests likely incomplete
- ❌ Documentation incomplete

**Compatibility Layer Needed:**
- [ ] Write integration tests
- [ ] Generate TypeDoc
- [ ] Write comprehensive documentation
- [ ] Create tutorial

**Status:** MISSING - Needs implementation

---

## Implementation Priority

### High Priority (Blocking)
1. Task 13: Delta Synchronization Utilities (needed for network play)
2. Task 14: Player View Filtering (needed for multiplayer)
3. Task 9: XState compatibility (spec compliance)

### Medium Priority (Enhancement)
4. Task 12: AI Move Enumeration (needed for AI)
5. Task 15: Example Game (validates framework)
6. Task 10: Validation (hardening)

### Low Priority (Polish)
7. Task 11: RuleEngine wrapper (syntactic)
8. Task 16: Documentation (important but not blocking)

---

## Next Steps

1. Start with Task 13 (Delta Synchronization) - Most critical for multiplayer
2. Then Task 14 (Player View Filtering) - Security critical
3. Then Task 9 (XState compatibility) - Spec compliance
4. Then remaining tasks in priority order

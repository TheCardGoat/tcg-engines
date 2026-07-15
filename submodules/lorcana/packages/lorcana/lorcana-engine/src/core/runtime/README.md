# @tcg/core Runtime (PLAN.md Implementation)

This directory implements the new boardgame.io-style runtime architecture as specified in `packages/core/docs/PLAN.md`.

## Overview

The new runtime uses a unified state model:

```typescript
type MatchState<G> = {
  G: G; // game-specific state (developer-owned)
  ctx: TCGCtx; // framework-owned runtime state
};
```

This replaces the current split where framework internals (`InternalState`) live outside the synced state.

## Implementation Status

### ✅ Phase 1: Unified Match State and Engine Foundation

**Status: IMPLEMENTED**

- [x] `MatchState<G>` type with unified `G + ctx`
- [x] `TCGCtx` with all required fields:
  - [x] `protocolVersion`
  - [x] `matchID`
  - [x] `rulesetHash`
  - [x] `_stateID` (state versioning)
  - [x] `status` (flow state)
  - [x] `priority` (TCG priority)
  - [x] `zones` (zone runtime state)
  - [x] `time` (time control)
  - [x] `random` (RNG state)
  - [x] `log` (log sequencing)
  - [x] `authz` (authorization)
- [x] `MatchRuntime` class with command pipeline
- [x] Deterministic reducer using Mutative
- [x] Patch generation for sync
- [x] Domain event emission
- [x] Game end detection

**Files:**

- `types.ts` - Core type definitions
- `match-runtime.ts` - Runtime engine

**Tests:** 49 tests passing (core runtime)

### ✅ Phase 2: ctx.zones as First-Class Runtime Subsystem

**Status: IMPLEMENTED**

- [x] `ZoneRuntimeState` type structure
- [x] `zoneDefs` - Zone definitions
- [x] `public.zoneSummaries` - Public zone metadata
- [x] `private.zoneCards` - Authoritative card ordering
- [x] `private.cardIndex` - Card location tracking
- [x] `private.cardMeta` - Dynamic card metadata
- [x] `reveals.active` - Reveal windows
- [x] Zone revision counters
- [x] `ZoneOperationsAPI` with full implementation:
  - [x] Card movement (`moveCard`, `moveCards`)
  - [x] Drawing (`drawCards`, `drawSpecificCard`)
  - [x] Shuffling (`shuffle`, `shuffleBottom`)
  - [x] Revealing (`reveal`, `revealTop`, `clearReveal`)
  - [x] Searching (`search`, `searchAndPick`)
  - [x] Looking (`lookAt`, `lookAtTop`, `lookAtBottom`)
  - [x] Queries (count, top/bottom card, ownership)
  - [x] `performMulligan()` - Full mulligan operation
  - [x] `expireReveals()` - Reveal window cleanup

**Files:**

- `types.ts` - Zone type definitions
- `zone-operations.ts` - Zone operations API

**Tests:** 30 zone operations tests passing

### ✅ Phase 3: ctx.time Passive Clock System

**Status: IMPLEMENTED**

- [x] `TimeContext` discriminated union type
- [x] `ChessClockContext` - Classic reserve clock
- [x] `PriorityClockContext` - TCG priority window clock
- [x] `ClockPauseReason` types
- [x] Passive clock settlement (no ticking loop)
- [x] Window vs reserve accounting in priority mode
- [x] Per-move bonus system
- [x] Timeout handling (window + reserve)
- [x] `settleClocks()` - Core settlement logic
- [x] `grantPriority()` - Priority handoff with clock
- [x] `passPriority()` - Priority pass with bonus
- [x] `pauseClock()` / `resumeClock()`

**Files:**

- `time-control.ts` - Clock management

**Tests:** 20 tests passing

### ✅ Phase 4: Flow / Priority / Events / TCG Resolution Pipeline

**Status: IMPLEMENTED**

- [x] `CtxPriority` type with holder, window, passSequence
- [x] `grantPriority()` and `passPriority()` in runtime
- [x] Basic flow definition types
- [x] Phase transition logic

**Files:**

- `match-runtime.ts` - Basic priority handling

### ✅ Phase 5: Protocol and Transport

**Status: COMPLETE**

- [x] `_stateID` versioning
- [x] Stale state detection in `processCommand()`
- [x] Command envelope types
- [x] Patch generation
- [x] **Protocol Types** (`protocol-types.ts`)
  - All message types (UPDATE_ACTION, UPDATE_PATCH, SYNC_FULL, ERROR)
  - Protocol validation
  - Type guards
- [x] **WebSocket Transport** (`websocket-transport.ts`)
- [x] **In-Memory Transport** (`in-memory-transport.ts`)

**Files:**

- `protocol-types.ts` + `.test.ts`
- `websocket-transport.ts`
- `in-memory-transport.ts`

### ✅ Phase 6: Persistence, Replay, Audit, and Auth

**Status: COMPLETE**

- [x] `GameEvent` / `PublishedGameEvent` types
- [x] Game event emission with commit-time publishing
- [x] `rulesetHash` in ctx
- [x] **Persistence Layer** (`persistence.ts`)
  - Snapshots (latest and by stateID)
  - Match metadata with filtering
  - Command log storage
  - Game event and log storage
  - Audit log
  - InMemory adapter for testing
- [x] **Replay System** (`replay.ts`)
  - Replay engine with step navigation
  - Replay builder
  - Replay exporter (JSON and compressed)
  - Role-based replay filtering
  - Replay validation
- [x] **Auth System** (`auth.ts`)
  - Credential validation
  - Token generation and revocation
  - Session management
  - Access control (role-based)
  - Audit logging

**Files:**

- `persistence.ts` + `.test.ts`
- `replay.ts`
- `auth.ts`

### ✅ Phase 7: Command Validation Simplification

**Status: COMPLETE**

- [x] Runtime command validation based on flow, role, priority, and move-level validation
- [x] Args-only command payloads (`MoveInput = { args }`)
- [x] Removed intent/enumeration legality coupling from runtime execution

**Files:**

- `match-runtime.validation.ts`
- `match-runtime.utils.ts`

### ✅ Phase 8: Performance, Security Hardening, and Docs

**Status: COMPLETE**

- [x] **Benchmarking** (`benchmark.ts`)
  - `Benchmark` class for performance testing
  - `PerformanceMonitor` for runtime metrics
  - State size measurement
  - Benchmark suites and comparison
- [x] **Security Hardening** (`security.ts`)
  - `InputValidator` for command validation
  - `RateLimiter` for request throttling
  - `StateSanitizer` for safe logging
  - `SecurityManager` for centralized security
- [x] **Documentation**
  - [Runtime Migration Guide](../../docs/RUNTIME_MIGRATION_GUIDE.md)
  - API documentation in code
  - Type exports for all public APIs

**Files:**

- `benchmark.ts`
- `security.ts`
- `../../docs/RUNTIME_MIGRATION_GUIDE.md`

## API Usage

### Creating a MatchRuntime

```typescript
import { MatchRuntime } from "@tcg/core/runtime";

const runtime = new MatchRuntime(
  {
    name: "my-game",
    setup: ({ players }) => ({
      resources: Object.fromEntries(players.map((p) => [p.id, 0])),
    }),
    moves: {
      gainResource: {
        validate: (ctx) => {
          if (ctx.G.resources[ctx.playerId] >= 10) {
            return { valid: false, error: "Max resources" };
          }
          return { valid: true };
        },
        execute: (ctx) => {
          ctx.G.resources[ctx.playerId]++;
        },
      },
    },
    timeControl: {
      mode: "priority",
      config: {
        perPriorityWindowMs: 30_000,
        reserveMs: 600_000,
        perMoveBonusMs: 5_000,
        endGameBaselineMs: 0,
        graceMs: 0,
        onWindowExpiry: "auto-pass-if-legal-else-forfeit",
        onReserveExpiry: "lose-on-time",
      },
    },
    endIf: (state) => {
      if (state.G.turn >= 20) {
        return { reason: "max-turns-reached" };
      }
    },
  },
  [{ id: "p1" }, { id: "p2" }],
  "seed-123",
);
```

### Processing Commands

```typescript
const result = runtime.processCommand(
  {
    commandID: "cmd-1",
    move: "gainResource",
    input: {
      args: {},
    },
  },
  "p1", // player ID
  0, // prevStateID
  Date.now(), // timestamp
);

if (result.success) {
  console.log("New state ID:", result.stateID);
  console.log("Patches:", result.patches);
  console.log("Events:", result.domainEvents);
} else {
  console.log("Error:", result.error, result.errorCode);
}
```

### Priority Management (TCG)

```typescript
// Grant priority to player
runtime.grantPriority("p1", Date.now());

// Player passes priority
runtime.passPriority("p1", Date.now());
```

### View Filtering

```typescript
import { filterMatchView } from "@tcg/core/runtime";

const playerView = filterMatchView(state, { role: "player", playerId: "p1" });
const spectatorView = filterMatchView(state, { role: "spectator" });
const judgeView = filterMatchView(state, { role: "judge" });
```

## Testing

```bash
# Run all runtime tests
bun test packages/core/src/runtime

# Run specific test file
bun test packages/core/src/runtime/match-runtime.test.ts
```

## Architecture

### Command Pipeline

Per `MATCH_RUNTIME.md`, each command flows through:

1. **Auth + role validation** - Verify credentials
2. **\_stateID stale check** - Reject outdated commands
3. **tickClocks(now)** - Settle passive time
4. **Move legality validation** - Check conditions
5. **Reducer execution** - Execute move via Mutative
6. **Queue events** - Domain events, history
7. **Resolve flow** - Phase transitions
8. **Update clocks** - Set waiting state
9. **Increment \_stateID** - Version state
10. **Emit events** - Broadcast updates
11. **Filter views** - Generate per-role patches

### Passive Time Management

Clocks are **settled** on transitions, not continuously ticking:

```
Command Received
    ↓
Settle elapsed time since last startedAtMs
    ↓
Update active player's reserve/consumed
    ↓
Execute move
    ↓
Set new startedAtMs for next player
```

This makes time:

- **Deterministic** - Same events = same times
- **Auditable** - Every change is logged
- **Server-authoritative** - No client clock trust

## Migration from Old Engine

The old `RuleEngine` is still available and fully functional. The new `MatchRuntime` can be used alongside it during migration.

```typescript
// Old way (still works)
import { RuleEngine } from "@tcg/core";
const engine = new RuleEngine(gameDef, players);

// New way
import { MatchRuntime } from "@tcg/core/runtime";
const runtime = new MatchRuntime(gameDef, players);
```

## References

- `packages/core/docs/PLAN.md` - Master rewrite plan
- `packages/core/docs/MATCH_RUNTIME.md` - Runtime architecture
- `packages/core/docs/CTX_SCHEMA.md` - State schema
- `packages/core/docs/TIME_CONTROL.md` - Clock semantics
- `packages/core/docs/VIEW_FILTERING.md` - Filtering rules

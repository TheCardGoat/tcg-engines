# Core Beliefs — Engine Invariants

These are properties the engine guarantees. Code that breaks them is wrong even
if tests pass. If you need to violate one, write an exec-plan first.

## 1. Determinism

The engine is fully deterministic given `(initial state, command sequence, PRNG seed)`.

- **Never call `Date.now()`, `Math.random()`, or any non-deterministic API directly in match logic.** Use the runtime's injected clock (`packages/engine/src/runtime/clock-view.ts`) and `createRandomAPI` (`packages/engine/src/runtime/random.ts`).
- Replays rely on this. So do tests. So does the network layer (`engine/` topology) when synchronising clients.

## 2. Single source of truth for logs

All match-side-effect log entries are produced by `GameLogger` (`packages/engine/src/runtime/match-runtime.logs.ts`). UI code projects logs for display via `createLogProjection` — it must not invent, mutate, or re-order log entries.

The reason: the log is what clients use to reconstruct state changes they did not directly observe. If the UI synthesizes log entries, replays and reconnects diverge silently.

## 3. Cards are data

Card files in `packages/cards/src/cards/` declare behavior using the engine's effect DSL (`TargetFilter`, `Condition`, `Effect`). They must not import runtime code from `@tcg/gundam-engine`. The engine interprets the data — the data does not call the engine.

Why: cards are loaded, serialized, and shown in deck-builders. Embedding runtime code in card files would couple data to engine internals and make card definitions un-portable.

## 4. Boundary direction is one-way

Allowed import edges (see [`docs/architecture.md`](../architecture.md)):

```
simulator → cards, engine, types, token-data
cards     → types, token-data
engine    → types, token-data
website   → (none of the above)
```

Reverse edges are bugs. A new edge is a design decision and needs an exec-plan.

## 5. The engine's public surface is curated

`packages/engine/src/index.ts` is the contract with consumers. Adding to it is fine; removing or changing types is a breaking change.

Simulator code must not deep-import (`@tcg/gundam-engine/runtime/...`). If you need something that isn't exported, add it to the curated surface — don't reach around it.

## 6. The runtime owns state mutation

Match state is mutated **only** by `MatchRuntime` applying a validated command. UI code, bots, and tests interact via commands — they never write to state directly.

This is why `validateCommand` exists. Bypassing it (e.g. by hand-rolling state in a test) creates states the engine cannot reach naturally, and tests against such states are not load-bearing.

## 7. Move legality is enumerable

For any (state, player) the set of legal moves is a finite, enumerable list (`enumerateAvailableMoves` / `enumerateAvailableMovesDetailed`). The bot relies on this. The UI does too (to gray out illegal actions). New move types must support enumeration; otherwise the bot will pass through them silently and the UI will offer them when they shouldn't be offered.

## 8. Private information stays private

Hidden zones (opponent hand, deck order) are guarded by `privateField` / `stripPrivateFields`. Any new state field that contains hidden information must use this mechanism. View-filtering (`filterMatchView`) is the choke point for serializing state to a specific player.

Losing this guarantee leaks information to clients. There is no "just this once" exception.

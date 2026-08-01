# @tcg-engines/naruto

TypeScript workspace implementing a **pure rules engine** for the Naruto Card
Game (Bandai), plus the card database it runs on.

> **Fan project — legal notice.** Card data and artwork are © Bandai /
> Masashi Kishimoto. This workspace ships card **data only — no card images**
> are included. The game is currently unreleased and the official rulebook
> has not been published, so **all rules here are provisional** interpretations
> of publicly revealed cards and will be corrected when the official rules are
> published (see `OFFICIAL_RULES` vs `PROVISIONAL_RULES` in
> `packages/engine/src/rules.ts`).

## Packages

| Package | Name | Purpose |
|---|---|---|
| `packages/cards` | `@tcg-engines/naruto-cards` | Typed card DB (35 cards), repository accessors, search index. |
| `packages/engine` | `@tcg-engines/naruto-engine` | Pure, deterministic rules engine: state, reducer, effects, combat/chain, greedy AI. Zero runtime dependencies (only `naruto-cards`). |

No UI, no networking — the consuming platform provides rendering and comms.

## Quickstart

```ts
import {
  applyAction,
  chooseAiAction,
  createInitialState,
  deciderOf,
  prebuiltDeckList,
  PREBUILT_DECKS,
} from "@tcg-engines/naruto-engine";

// Fresh game (seeded => fully replayable from seed + action log).
let state = createInitialState({
  seed: 42,
  decks: {
    p1: prebuiltDeckList(PREBUILT_DECKS[0]!), // Team 10
    p2: prebuiltDeckList(PREBUILT_DECKS[2]!), // The Taka
  },
});

// Game loop: deciderOf(state) tells you who must act next.
while (!state.winner) {
  const decider = deciderOf(state);
  if (decider === null) break;
  // Human players: render state, collect an Action from your UI.
  // Here we let the built-in greedy AI drive both sides:
  const action = chooseAiAction(state, decider);
  if (!action) break;
  const next = applyAction(state, action);
  if (next === state) throw new Error("illegal action"); // same ref => rejected
  state = next;
}

console.log("winner:", state.winner);
```

Key concepts:

- **Deterministic**: seeded mulberry32 RNG + Fisher-Yates shuffle; the seed
  lives in `state.seed`, so `seed + action log` fully replays a game.
- **Immutable reducer**: `applyAction` shallow-copies state; illegal actions
  return the *same reference*.
- **Choices**: effects queue `state.pendingChoice` (`promptKey` + `options`);
  the indicated player answers with `RESOLVE_CHOICE`. This is the clean seam
  for UI/comm layers.
- **Counter step & chain**: attacks open a counter window; supports chain and
  resolve LIFO; two consecutive passes resolve.
- **Log**: `state.log` holds i18n-key entries (`log.summon`, `log.hitLeader`,
  ...) with `{ turn, actor, key, values }` — localize in your UI.

## Scripts

- `pnpm run ci-check` — typecheck + tests (fast CI gate).
- `pnpm run ci-check-full` — typecheck + tests + build.
- `pnpm -r run typecheck`, `pnpm -r run test`, `pnpm -r run build`.

## Requirements

Node 24+, pnpm 10+.

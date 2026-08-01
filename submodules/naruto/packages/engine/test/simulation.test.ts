import { describe, expect, it } from "vitest";

import { chooseAiAction } from "../src/ai";
import { deciderOf } from "../src/queries";
import { applyAction } from "../src/reducer";
import { createInitialState, prebuiltDeckList, PREBUILT_DECKS } from "../src/setup";
import type { GameState, PlayerId } from "../src/types";

const MAX_ACTIONS = 20_000;

/** Count of deck cards across all zones (must always equal 50). */
function cardsInPlay(state: GameState, player: PlayerId): number {
  const p = state.players[player];
  return (
    p.deck.length +
    p.hand.length +
    p.trash.length +
    p.exPile.length +
    p.characters.filter((c) => c !== null).length +
    p.supports.filter((s) => s !== null).length
    // Note: chain links / resolvingSupport still occupy their support slot,
    // so they are counted via `supports`.
  );
}

interface GameResult {
  readonly finalState: GameState;
  readonly actions: number;
}

function playGame(seed: number): GameResult {
  let state = createInitialState({ seed });
  let actions = 0;
  while (!state.winner) {
    if (actions >= MAX_ACTIONS) throw new Error(`game ${seed} stalled after ${actions} actions`);
    const decider = deciderOf(state);
    if (decider === null) throw new Error(`game ${seed} has no decider but no winner`);
    const action = chooseAiAction(state, decider);
    if (!action) throw new Error(`game ${seed}: AI returned no action for ${decider}`);
    const next = applyAction(state, action);
    if (next === state) {
      throw new Error(`game ${seed}: AI produced illegal action ${JSON.stringify(action)}`);
    }
    state = next;
    actions += 1;
    // Invariants checked continuously, not just at the end.
    expect(cardsInPlay(state, "p1")).toBe(50);
    expect(cardsInPlay(state, "p2")).toBe(50);
    expect(state.players.p1.life).toBeGreaterThanOrEqual(0);
    expect(state.players.p2.life).toBeGreaterThanOrEqual(0);
  }
  return { finalState: state, actions };
}

describe("full-game simulation (greedy AI vs greedy AI)", () => {
  it("plays 20 seeded games to completion without stalls", () => {
    const winners: Record<PlayerId, number> = { p1: 0, p2: 0 };
    let totalTurns = 0;
    for (let seed = 1; seed <= 20; seed += 1) {
      const { finalState } = playGame(seed);
      expect(finalState.winner).not.toBeNull();
      winners[finalState.winner as PlayerId] += 1;
      totalTurns += finalState.turn;
    }
    // Sanity: games actually end (reference average ~8 turns; allow wide margin).
    expect(totalTurns / 20).toBeLessThan(120);
  });

  it("is deterministic: same seed + same policy -> identical final state", () => {
    for (const seed of [1, 7, 42, 1337]) {
      const a = playGame(seed);
      const b = playGame(seed);
      expect(JSON.stringify(a.finalState)).toBe(JSON.stringify(b.finalState));
    }
  });

  it("plays a prebuilt-deck mirror match to completion", () => {
    const takaPrebuilt = PREBUILT_DECKS[2];
    if (!takaPrebuilt) throw new Error("missing prebuilt deck");
    const taka = prebuiltDeckList(takaPrebuilt);
    let current = createInitialState({ seed: 5, decks: { p1: taka, p2: taka } });
    let actions = 0;
    while (!current.winner && actions < MAX_ACTIONS) {
      const decider = deciderOf(current);
      if (decider === null) throw new Error("no decider but no winner");
      const action = chooseAiAction(current, decider);
      if (!action) throw new Error("AI returned no action");
      const next = applyAction(current, action);
      if (next === current) throw new Error(`illegal action ${JSON.stringify(action)}`);
      current = next;
      actions += 1;
    }
    expect(current.winner).not.toBeNull();
  });
});

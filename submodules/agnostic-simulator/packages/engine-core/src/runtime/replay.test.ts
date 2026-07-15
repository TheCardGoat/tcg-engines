import { describe, expect, it } from "vitest";
import type { CommandEnvelope, MatchState } from "../types/index.ts";
import type { CreateRuntimeFn } from "./replay.ts";
import { ReplayEngine } from "./replay.ts";

type CounterState = MatchState<{ count: number }>;

function state(count: number): CounterState {
  return {
    G: { count },
    ctx: {
      protocolVersion: "test",
      matchID: "m1",
      gameID: "g1",
      rulesetHash: "test",
      _stateID: count,
      playerIds: ["p1"],
      zones: {
        public: { zoneSummaries: {} },
        private: { zoneCards: {}, cardIndex: {}, cardMeta: {} },
      },
      status: {
        turn: 1,
        activePlayer: "p1",
        gameEnded: false,
        pendingDecision: [],
      },
      time: { mode: "none" },
      random: { seed: "seed", state: null, drawCount: 0 },
    },
  };
}

const runtime: CreateRuntimeFn = (currentState: MatchState) => {
  return {
    executeCommand(envelope: CommandEnvelope): CounterState {
      const amount = typeof envelope.args === "number" ? envelope.args : 1;
      return state((currentState as CounterState).G.count + amount);
    },
  };
};

describe("ReplayEngine", () => {
  it("tracks state when stepping forward", () => {
    const engine = new ReplayEngine(
      state(0),
      [
        { commandID: "c1", move: "increment", args: 2, playerId: "p1", timestamp: 1 },
        { commandID: "c2", move: "increment", args: 3, playerId: "p1", timestamp: 2 },
      ],
      [],
      runtime,
    );

    engine.stepForward();
    expect((engine.getCurrentState() as CounterState).G.count).toBe(2);

    engine.stepForward();
    expect((engine.getCurrentState() as CounterState).G.count).toBe(5);
  });

  it("tracks state when seeking and stepping backward", () => {
    const engine = new ReplayEngine(
      state(0),
      [
        { commandID: "c1", move: "increment", args: 2, playerId: "p1", timestamp: 1 },
        { commandID: "c2", move: "increment", args: 3, playerId: "p1", timestamp: 2 },
      ],
      [{ index: 1, state: state(2) }],
      runtime,
    );

    engine.seekTo(1);
    expect((engine.getCurrentState() as CounterState).G.count).toBe(5);

    engine.stepBackward();
    expect(engine.getCurrentIndex()).toBe(0);
    expect((engine.getCurrentState() as CounterState).G.count).toBe(2);
  });

  it("clamps out-of-range seeks to the final command", () => {
    const engine = new ReplayEngine(
      state(0),
      [
        { commandID: "c1", move: "increment", args: 2, playerId: "p1", timestamp: 1 },
        { commandID: "c2", move: "increment", args: 3, playerId: "p1", timestamp: 2 },
      ],
      [],
      runtime,
    );

    engine.seekTo(99);

    expect(engine.getCurrentIndex()).toBe(1);
    expect((engine.getCurrentState() as CounterState).G.count).toBe(5);
  });
});

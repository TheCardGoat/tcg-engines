import { describe, expect, it } from "vite-plus/test";

import { createStaticResources, type Player } from "./static-resources.ts";
import { MatchRuntime } from "./match-runtime.ts";
import { DEFAULT_DYNAMIC_CLOCK_CONFIG, checkTimeout, settleClocks } from "./time-control.ts";
import { asPlayerId } from "../types/branded.ts";

const p1 = asPlayerId("player_one");
const p2 = asPlayerId("player_two");

function players(): Player[] {
  return [
    { id: p1, name: "Player One", deck: [], resourceDeck: [] },
    { id: p2, name: "Player Two", deck: [], resourceDeck: [] },
  ];
}

function runtimeWithClock(): MatchRuntime {
  const staticResources = createStaticResources(players(), new Map());
  const runtime = new MatchRuntime(staticResources);
  runtime.initialize(players(), "clock-test", p1, {
    mode: "dynamic",
    config: DEFAULT_DYNAMIC_CLOCK_CONFIG,
  });
  return runtime;
}

describe("time-control", () => {
  it("settles elapsed time only when asked", () => {
    const runtime = runtimeWithClock();
    const state = runtime.getState();
    if (state.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");

    state.ctx.time.startedAtMs = 1_000;
    state.ctx.time.players[p1].reserveMsRemaining = 100_000;

    const settled = settleClocks(state, 6_000);
    if (settled.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");

    expect(settled.ctx.time.players[p1].reserveMsRemaining).toBe(95_000);
    expect(settled.ctx.time.players[p1].totalConsumedMs).toBe(5_000);
    expect(settled.ctx.time.startedAtMs).toBe(6_000);
  });

  it("detects per-decision cap timeout for the active clock player", () => {
    const runtime = runtimeWithClock();
    const state = runtime.getState();
    if (state.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");

    state.ctx.time.startedAtMs = 0;
    state.ctx.time.activePlayerAccumulatedMs = 30_000;
    state.ctx.time.config.maxDecisionTimeMs = 60_000;

    expect(checkTimeout(state, String(p1), 29_999)).toBeNull();
    expect(checkTimeout(state, String(p1), 30_001)).toBe("first");
    expect(checkTimeout(state, String(p2), 30_001)).toBeNull();
  });

  it("skipOpponentTurn resets a first stalling timeout", () => {
    const runtime = runtimeWithClock();
    const state = runtime.getState();
    if (state.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");

    state.ctx.status.activePlayer = p2;
    state.ctx.status.pendingDecision = [p2];
    state.ctx.time.activePlayerID = String(p2);
    state.ctx.time.startedAtMs = Date.now();
    state.ctx.time.activePlayerAccumulatedMs = 61_000;

    const result = runtime.executeCommand(
      {
        commandID: "skip-clock",
        move: "skipOpponentTurn",
        prevStateID: state.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      p1,
    );

    expect(result.success).toBe(true);
    const next = runtime.getState();
    if (next.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");
    expect(next.ctx.time.players[p2].timeoutCount).toBe(1);
    expect(next.ctx.time.players[p2].reserveMsRemaining).toBe(
      DEFAULT_DYNAMIC_CLOCK_CONFIG.resetTimeOnSkipMs,
    );
    expect(next.ctx.status.activePlayer).toBe(p1);
  });

  it("dropOpponent ends the game when opponent reserve is exhausted", () => {
    const runtime = runtimeWithClock();
    const state = runtime.getState();
    if (state.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");

    state.ctx.status.activePlayer = p2;
    state.ctx.time.activePlayerID = String(p2);
    state.ctx.time.players[p2].reserveMsRemaining = -1;
    state.ctx.time.players[p2].isInNegativeTime = true;

    const result = runtime.executeCommand(
      {
        commandID: "drop-clock",
        move: "dropOpponent",
        prevStateID: state.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      p1,
    );

    expect(result.success).toBe(true);
    expect(runtime.getState().ctx.status.gameEnded).toBe(true);
    expect(runtime.getState().ctx.status.winner).toBe(p1);
  });
});

import { describe, expect, it } from "vite-plus/test";

import { defaultGundamSetupCards } from "@tcg/gundam-token-data";
import { createStaticResources, type Player } from "./static-resources.ts";
import { MatchRuntime } from "./match-runtime.ts";
import {
  DEFAULT_DYNAMIC_CLOCK_CONFIG,
  checkTimeout,
  hasClockGraceExpired,
  settleClocks,
} from "./time-control.ts";
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
  const roster = players();
  const staticResources = createStaticResources(
    roster,
    new Map(),
    defaultGundamSetupCards(roster.map((player) => player.id)),
  );
  const runtime = new MatchRuntime(staticResources);
  runtime.initialize(roster, "clock-test", p1, {
    mode: "dynamic",
    config: DEFAULT_DYNAMIC_CLOCK_CONFIG,
  });
  return runtime;
}

function runtimeWithoutClock(): MatchRuntime {
  const roster = players();
  const staticResources = createStaticResources(
    roster,
    new Map(),
    defaultGundamSetupCards(roster.map((player) => player.id)),
  );
  const runtime = new MatchRuntime(staticResources);
  runtime.initialize(roster, "clockless-test", p1);
  return runtime;
}

describe("time-control", () => {
  it("does not expose or execute timeout administration without a clock", () => {
    const runtime = runtimeWithoutClock();

    expect(runtime.getAvailableMoves(p1)).not.toContain("skipOpponentTurn");
    expect(runtime.getAvailableMoves(p1)).not.toContain("dropOpponent");

    for (const move of ["skipOpponentTurn", "dropOpponent"] as const) {
      const result = runtime.executeCommand(
        {
          commandID: `clockless-${move}`,
          move,
          prevStateID: runtime.getState().ctx._stateID,
          actorRole: "player",
          args: {},
        },
        p1,
      );

      expect(result).toMatchObject({
        success: false,
        errorCode:
          move === "skipOpponentTurn" ? "OPPONENT_NOT_TIMED_OUT" : "OPPONENT_NOT_DROPPABLE",
      });
    }
    expect(runtime.getState().ctx.status.gameEnded).toBe(false);
  });

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

  it("honors grace before reserve exhaustion becomes droppable", () => {
    const runtime = runtimeWithClock();
    const state = runtime.getState();
    if (state.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");

    state.ctx.time.startedAtMs = 1_000;
    state.ctx.time.players[p1].reserveMsRemaining = 10_000;
    state.ctx.time.players[p1].isInNegativeTime = true;
    state.ctx.time.players[p1].timeoutCount = 1;
    state.ctx.time.config.graceMs = 15_000;

    expect(hasClockGraceExpired(state, String(p1), 25_999)).toBe(false);
    expect(checkTimeout(state, String(p1), 25_999)).toBeNull();
    expect(hasClockGraceExpired(state, String(p1), 26_000)).toBe(true);
    expect(checkTimeout(state, String(p1), 26_000)).toBe("second");
  });

  it("awards action and turn-pass bonuses after successful commands", () => {
    const runtime = runtimeWithClock();
    const state = runtime.getState();
    if (state.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");

    state.ctx.time.running = false;
    state.ctx.time.startedAtMs = undefined;
    state.ctx.time.players[p1].reserveMsRemaining = 50_000;

    const chooseResult = runtime.executeCommand(
      {
        commandID: "choose-first-player-clock-bonus",
        move: "chooseFirstPlayer",
        prevStateID: state.ctx._stateID,
        actorRole: "player",
        args: { playerId: p1 },
      },
      p1,
    );

    expect(chooseResult.success).toBe(true);
    const afterChoose = runtime.getState();
    if (afterChoose.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");
    expect(afterChoose.ctx.time.players[p1].actionBonusMsGranted).toBe(5_000);
    expect(afterChoose.ctx.time.players[p1].turnPassBonusMsGranted).toBe(0);

    afterChoose.ctx.status.gameSegment = "game";
    afterChoose.ctx.status.phase = "main";
    afterChoose.ctx.status.step = undefined;
    afterChoose.ctx.status.turnPlayer = p1;
    afterChoose.ctx.status.activePlayer = p1;
    afterChoose.ctx.status.pendingDecision = [];
    afterChoose.ctx.time.running = false;
    afterChoose.ctx.time.startedAtMs = undefined;

    const passResult = runtime.executeCommand(
      {
        commandID: "pass-turn-clock-bonus",
        move: "passTurn",
        prevStateID: afterChoose.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      p1,
    );

    expect(passResult.success).toBe(true);
    const afterPass = runtime.getState();
    if (afterPass.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");
    expect(afterPass.ctx.time.players[p1].actionBonusMsGranted).toBe(10_000);
    expect(afterPass.ctx.time.players[p1].turnPassBonusMsGranted).toBe(60_000);
    expect(afterPass.ctx.time.players[p1].reserveMsRemaining).toBe(120_000);
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

  it("dropOpponent ends the game after opponent reserve and grace are exhausted", () => {
    const runtime = runtimeWithClock();
    const state = runtime.getState();
    if (state.ctx.time.mode !== "dynamic") throw new Error("expected dynamic clock");

    state.ctx.status.activePlayer = p2;
    state.ctx.time.activePlayerID = String(p2);
    state.ctx.time.config.graceMs = 15_000;
    state.ctx.time.players[p2].reserveMsRemaining = -15_001;
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

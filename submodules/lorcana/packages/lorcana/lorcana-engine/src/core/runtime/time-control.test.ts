/**
 * Time Control Tests
 *
 * Tests for passive clock management per PLAN.md Phase 3
 */

import { describe, it, expect } from "bun:test";
import {
  settleClocks,
  grantPriority,
  passPriority,
  pauseClock,
  resumeClock,
  awardMoveBonus,
  awardDynamicActionBonus,
  awardDynamicTurnPassBonus,
  checkPriorityTimeout,
  checkTimeout,
  resetPlayerTimeAfterSkip,
  handleWindowExpiry,
  handleReserveExpiry,
  getPlayerTimeSummary,
} from "./time-control";
import { createInitialTCGCtx } from "./types";
import type {
  MatchState,
  TimeContext,
  ChessClockConfig,
  PriorityClockConfig,
  DynamicClockConfig,
  ChessClockContext,
  PriorityClockContext,
  DynamicClockContext,
} from "./types";

function asChess(time: TimeContext): ChessClockContext {
  if (time.mode !== "chess") throw new Error("expected chess clock");
  return time;
}
function asPriority(time: TimeContext): PriorityClockContext {
  if (time.mode !== "priority") throw new Error("expected priority clock");
  return time;
}
function asDynamic(time: TimeContext): DynamicClockContext {
  if (time.mode !== "dynamic") throw new Error("expected dynamic clock");
  return time;
}

// Helper to create a test match state
type TestGameState = { turn: number };

function createTestState(timeMode: "none"): MatchState;
function createTestState(timeMode: "chess"): MatchState & { ctx: { time: ChessClockContext } };
function createTestState(
  timeMode: "priority",
): MatchState & { ctx: { time: PriorityClockContext } };
function createTestState(timeMode: "dynamic"): MatchState & { ctx: { time: DynamicClockContext } };
function createTestState(timeMode: "none" | "chess" | "priority" | "dynamic" = "none") {
  const chessConfig: ChessClockConfig = {
    initialReserveMs: 600_000,
    incrementMs: 0,
    delayMs: 0,
    graceMs: 0,
    resetTimeOnSkipMs: 60_000,
    lossPolicy: "lose-on-time",
  };

  const priorityConfig: PriorityClockConfig = {
    perPriorityWindowMs: 30_000,
    reserveMs: 600_000,
    perMoveBonusMs: 5_000,
    endGameBaselineMs: 0,
    graceMs: 0,
    onWindowExpiry: "auto-pass-if-legal-else-forfeit",
    onReserveExpiry: "lose-on-time",
  };

  const dynamicConfig: DynamicClockConfig = {
    initialReserveMs: 150_000,
    reserveCapMs: 150_000,
    perActionBonusMs: 5_000,
    perTurnPassBonusMs: 60_000,
    resetTimeOnSkipMs: 60_000,
    graceMs: 0,
  };

  const timeControl =
    timeMode === "none"
      ? { mode: "none" as const }
      : timeMode === "chess"
        ? { mode: "chess" as const, config: chessConfig }
        : timeMode === "priority"
          ? { mode: "priority" as const, config: priorityConfig }
          : { mode: "dynamic" as const, config: dynamicConfig };

  const ctx = createInitialTCGCtx({
    matchID: "match-123",
    gameID: "lorcana",
    rulesetHash: "ruleset-v1",
    timeConfig: timeControl,
  });

  // Add players to time control
  if (timeMode !== "none") {
    if (timeMode === "chess") {
      const time = ctx.time as ChessClockContext;
      time.players["p1"] = {
        reserveMsRemaining: chessConfig.initialReserveMs,
        totalConsumedMs: 0,
        movesMade: 0,
        lastUpdatedAtMs: 1000,
        timeoutCount: 0,
        isInNegativeTime: false,
      };
      time.players["p2"] = { ...time.players["p1"] };
    } else if (timeMode === "priority") {
      const time = ctx.time as PriorityClockContext;
      time.players["p1"] = {
        reserveMsRemaining: priorityConfig.reserveMs,
        totalConsumedMs: 0,
        movesMade: 0,
        lastUpdatedAtMs: 1000,
        totalWindowOverageMs: 0,
        moveBonusMsGranted: 0,
        windowTimeouts: 0,
      };
      time.players["p2"] = { ...time.players["p1"] };
    } else if (timeMode === "dynamic") {
      const time = ctx.time as DynamicClockContext;
      time.players["p1"] = {
        reserveMsRemaining: dynamicConfig.initialReserveMs,
        totalConsumedMs: 0,
        movesMade: 0,
        lastUpdatedAtMs: 1000,
        timeoutCount: 0,
        isInNegativeTime: false,
        actionBonusMsGranted: 0,
        turnPassBonusMsGranted: 0,
      };
      time.players["p2"] = { ...time.players["p1"] };
    }
  }

  return {
    G: { turn: 1 } as any,
    ctx,
  };
}

describe("Time Control", () => {
  describe("settleClocks", () => {
    it("should not modify state when no time control", () => {
      const state = createTestState("none");
      const result = settleClocks(state, 2000);

      expect(result).toBe(state);
    });

    it("should not modify state when clock is not running", () => {
      const state = createTestState("chess");
      asChess(state.ctx.time).running = false;
      const result = settleClocks(state, 2000);

      expect(result).toBe(state);
    });

    it("should settle chess clock correctly", () => {
      const state = createTestState("chess");
      const st = asChess(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;

      const result = settleClocks(state, 6000); // 5 seconds elapsed
      const time = asChess(result.ctx.time);
      expect(time.players["p1"].totalConsumedMs).toBe(5000);
      expect(time.players["p1"].reserveMsRemaining).toBe(595_000);
    });

    it("should allow chess clock to go negative (two-strike timeout)", () => {
      const state = createTestState("chess");
      const st = asChess(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;
      st.players["p1"].reserveMsRemaining = 5000; // Only 5 seconds left

      const result = settleClocks(state, 10_000); // 9 seconds elapsed
      const time = asChess(result.ctx.time);
      expect(time.players["p1"].reserveMsRemaining).toBe(-4000); // Goes negative
      expect(time.players["p1"].isInNegativeTime).toBe(true);
      expect(time.running).toBe(true); // Clock keeps running - opponent decides
    });

    it("should settle priority clock within window (no reserve burn)", () => {
      const state = createTestState("priority");
      const st = asPriority(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;
      st.prioritySeq = 1;
      st.activeWindow = {
        playerID: "p1",
        prioritySeq: 1,
        windowMs: 30_000,
        deadlineMs: 31_000,
      };

      const result = settleClocks(state, 20_000); // Within window
      const time = asPriority(result.ctx.time);
      expect(time.players["p1"].totalConsumedMs).toBe(19_000);
      expect(time.players["p1"].totalWindowOverageMs).toBe(0);
      expect(time.players["p1"].reserveMsRemaining).toBe(600_000); // No reserve burn
    });

    it("should settle priority clock with window overage (reserve burn)", () => {
      const state = createTestState("priority");
      const st = asPriority(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;
      st.prioritySeq = 1;
      st.activeWindow = {
        playerID: "p1",
        prioritySeq: 1,
        windowMs: 30_000,
        deadlineMs: 31_000,
      };

      const result = settleClocks(state, 40_000); // 9 seconds over window
      const time = asPriority(result.ctx.time);
      expect(time.players["p1"].totalConsumedMs).toBe(39_000);
      expect(time.players["p1"].totalWindowOverageMs).toBe(9000);
      expect(time.players["p1"].reserveMsRemaining).toBe(591_000); // Reserve burned
    });

    it("should track window timeouts in priority mode", () => {
      const state = createTestState("priority");
      const st = asPriority(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;
      st.activeWindow = {
        playerID: "p1",
        prioritySeq: 1,
        windowMs: 30_000,
        deadlineMs: 31_000,
      };

      const result = settleClocks(state, 40_000); // Past deadline
      expect(asPriority(result.ctx.time).players["p1"].windowTimeouts).toBe(1);
    });
  });

  describe("grantPriority", () => {
    it("should set priority holder", () => {
      const state = createTestState("none");
      const result = grantPriority(state, "p1", 1000);

      expect(result.ctx.priority.holder).toBe("p1");
      expect(result.ctx.priority.windowOpen).toBe(true);
    });

    it("should clear pass sequence", () => {
      const state = createTestState("none");
      state.ctx.priority.passSequence = ["p1", "p2"];
      const result = grantPriority(state, "p1", 1000);

      expect(result.ctx.priority.passSequence).toEqual([]);
    });

    it("should start chess clock when granting priority", () => {
      const state = createTestState("chess");
      const result = grantPriority(state, "p1", 1000);
      const time = asChess(result.ctx.time);
      expect(time.activePlayerID).toBe("p1");
      expect(time.running).toBe(true);
      expect(time.startedAtMs).toBe(1000);
    });

    it("should open priority window in priority mode", () => {
      const state = createTestState("priority");
      const result = grantPriority(state, "p1", 1000);
      const time = asPriority(result.ctx.time);
      expect(result.ctx.time.mode).toBe("priority");
      expect(time.prioritySeq).toBe(1);
      expect(time.activeWindow).toBeDefined();
      expect(time.activeWindow?.playerID).toBe("p1");
      expect(time.activeWindow?.windowMs).toBe(30_000);
      expect(time.activeWindow?.deadlineMs).toBe(31_000);
    });
  });

  describe("pauseClock", () => {
    it("should pause clock with reason", () => {
      const state = createTestState("chess");
      const st = asChess(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;

      const result = pauseClock(state, "ENGINE_RESOLVING", 5000);
      const time = asChess(result.ctx.time);
      expect(time.running).toBe(false);
      expect(time.pausedReason).toBe("ENGINE_RESOLVING");
    });

    it("should settle elapsed time before pausing", () => {
      const state = createTestState("chess");
      const st = asChess(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;

      const result = pauseClock(state, "ENGINE_RESOLVING", 6000);
      expect(asChess(result.ctx.time).players["p1"].totalConsumedMs).toBe(5000);
    });
  });

  describe("resumeClock", () => {
    it("should resume clock for player", () => {
      const state = createTestState("chess");
      const st = asChess(state.ctx.time);
      st.running = false;
      st.pausedReason = "ENGINE_RESOLVING";

      const result = resumeClock(state, "p1", 1000);
      const time = asChess(result.ctx.time);
      expect(time.running).toBe(true);
      expect(time.pausedReason).toBeUndefined();
      expect(time.activePlayerID).toBe("p1");
      expect(time.startedAtMs).toBe(1000);
    });

    it("should update player timestamp", () => {
      const state = createTestState("chess");
      const result = resumeClock(state, "p1", 5000);
      expect(asChess(result.ctx.time).players["p1"].lastUpdatedAtMs).toBe(5000);
    });
  });

  describe("awardMoveBonus", () => {
    it("should award bonus to player", () => {
      const state = createTestState("priority");
      const result = awardMoveBonus(state, "p1");
      const time = asPriority(result.ctx.time);
      expect(time.players["p1"].moveBonusMsGranted).toBe(5000);
      expect(time.players["p1"].reserveMsRemaining).toBe(605_000);
    });
  });

  describe("checkPriorityTimeout", () => {
    it("should detect window timeout", () => {
      const state = createTestState("priority");
      const st = asPriority(state.ctx.time);
      st.activePlayerID = "p1";
      st.activeWindow = {
        playerID: "p1",
        prioritySeq: 1,
        windowMs: 30_000,
        deadlineMs: 31_000,
      };

      const result = checkPriorityTimeout(state, "p1", 40_000);

      expect(result).toBe("window");
    });

    it("should detect reserve timeout", () => {
      const state = createTestState("priority");
      const st = asPriority(state.ctx.time);
      st.activePlayerID = "p1";
      st.players["p1"].reserveMsRemaining = 0;

      const result = checkPriorityTimeout(state, "p1", 1000);

      expect(result).toBe("reserve");
    });

    it("should return null if no timeout", () => {
      const state = createTestState("priority");
      const st = asPriority(state.ctx.time);
      st.activePlayerID = "p1";
      st.activeWindow = {
        playerID: "p1",
        prioritySeq: 1,
        windowMs: 30_000,
        deadlineMs: 31_000,
      };

      const result = checkPriorityTimeout(state, "p1", 20_000);

      expect(result).toBeNull();
    });
  });

  describe("handleWindowExpiry", () => {
    it("should auto-pass if legal", () => {
      const state = createTestState("none");
      const result = handleWindowExpiry(state, "p1", true);

      expect(result.action).toBe("auto-pass");
      expect(result.state.ctx.priority.passSequence).toContain("p1");
    });

    it("should forfeit if cannot auto-pass", () => {
      const state = createTestState("none");
      const result = handleWindowExpiry(state, "p1", false);

      expect(result.action).toBe("forfeit");
      expect(result.state.ctx.status.gameEnded).toBe(true);
      expect(result.state.ctx.status.reason).toBe("forfeit-window-expired");
    });
  });

  describe("handleReserveExpiry", () => {
    it("should end game with loss on time", () => {
      const state = createTestState("chess");
      const result = handleReserveExpiry(state, "p1");

      expect(result.ctx.status.gameEnded).toBe(true);
      expect(result.ctx.status.winner).toBe("p2");
      expect(result.ctx.status.reason).toBe("loss-on-time");
    });
  });

  describe("getPlayerTimeSummary", () => {
    it("should return null for no time control", () => {
      const state = createTestState("none");
      const result = getPlayerTimeSummary(state, "p1");

      expect(result).toBeNull();
    });

    it("should return chess time summary", () => {
      const state = createTestState("chess");
      const result = getPlayerTimeSummary(state, "p1");

      expect(result).toBeDefined();
      expect(result?.reserveMsRemaining).toBe(600_000);
      expect(result?.totalConsumedMs).toBe(0);
      expect(result?.movesMade).toBe(0);
      expect(result?.windowRemainingMs).toBeUndefined();
    });

    it("should return priority time summary with window", () => {
      const state = createTestState("priority");
      const st = asPriority(state.ctx.time);
      st.activePlayerID = "p1";
      st.activeWindow = {
        playerID: "p1",
        prioritySeq: 1,
        windowMs: 30_000,
        deadlineMs: Date.now() + 25_000,
      };

      const result = getPlayerTimeSummary(state, "p1");

      expect(result).toBeDefined();
      expect(result?.reserveMsRemaining).toBe(600_000);
      expect(result?.windowRemainingMs).toBeDefined();
    });

    it("should return null for unknown player", () => {
      const state = createTestState("chess");
      const result = getPlayerTimeSummary(state, "unknown");

      expect(result).toBeNull();
    });

    it("should include timeout info for chess mode", () => {
      const state = createTestState("chess");
      const st = asChess(state.ctx.time);
      st.players["p1"].timeoutCount = 1;
      st.players["p1"].isInNegativeTime = true;

      const result = getPlayerTimeSummary(state, "p1");
      expect(result?.isInNegativeTime).toBe(true);
      expect(result?.timeoutCount).toBe(1);
    });

    it("should include timeout info for dynamic mode", () => {
      const state = createTestState("dynamic");
      const result = getPlayerTimeSummary(state, "p1");
      expect(result?.isInNegativeTime).toBe(false);
      expect(result?.timeoutCount).toBe(0);
    });
  });

  describe("Dynamic Clock", () => {
    describe("settleClocks", () => {
      it("should settle dynamic clock correctly", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.running = true;
        st.activePlayerID = "p1";
        st.startedAtMs = 1000;

        const result = settleClocks(state, 6000); // 5 seconds elapsed
        const time = asDynamic(result.ctx.time);
        expect(time.players["p1"].totalConsumedMs).toBe(5000);
        expect(time.players["p1"].reserveMsRemaining).toBe(145_000);
        expect(time.players["p1"].isInNegativeTime).toBe(false);
      });

      it("should allow dynamic clock to go negative", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.running = true;
        st.activePlayerID = "p1";
        st.startedAtMs = 1000;
        st.players["p1"].reserveMsRemaining = 5000;

        const result = settleClocks(state, 10_000); // 9 seconds elapsed
        const time = asDynamic(result.ctx.time);
        expect(time.players["p1"].reserveMsRemaining).toBe(-4000);
        expect(time.players["p1"].isInNegativeTime).toBe(true);
      });
    });

    describe("grantPriority", () => {
      it("should charge clock to pendingChoice.playerID in chess mode", () => {
        const state = createTestState("chess");
        state.ctx.priority.pendingChoice = {
          type: "action-effect",
          playerID: "p2",
          requestID: "req-1",
        };
        const result = grantPriority(state, "p1", 1000);
        expect(asChess(result.ctx.time).activePlayerID).toBe("p2");
      });

      it("should charge clock to pendingChoice.playerID in dynamic mode", () => {
        const state = createTestState("dynamic");
        state.ctx.priority.pendingChoice = {
          type: "action-effect",
          playerID: "p2",
          requestID: "req-1",
        };
        const result = grantPriority(state, "p1", 1000);
        expect(asDynamic(result.ctx.time).activePlayerID).toBe("p2");
      });

      it("should charge clock to holder when no pendingChoice is active", () => {
        const state = createTestState("chess");
        const result = grantPriority(state, "p1", 1000);
        expect(asChess(result.ctx.time).activePlayerID).toBe("p1");
      });

      it("should start dynamic clock when granting priority", () => {
        const state = createTestState("dynamic");
        const result = grantPriority(state, "p1", 1000);
        const time = asDynamic(result.ctx.time);
        expect(time.activePlayerID).toBe("p1");
        expect(time.running).toBe(true);
        expect(time.startedAtMs).toBe(1000);
      });
    });

    describe("awardDynamicActionBonus", () => {
      it("should award action bonus", () => {
        const state = createTestState("dynamic");
        const result = awardDynamicActionBonus(state, "p1");
        const time = asDynamic(result.ctx.time);
        expect(time.players["p1"].actionBonusMsGranted).toBe(5000);
        expect(time.players["p1"].reserveMsRemaining).toBe(150_000); // capped at max
      });

      it("should not exceed cap", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.players["p1"].reserveMsRemaining = 148_000;

        const result = awardDynamicActionBonus(state, "p1");
        const time = asDynamic(result.ctx.time);
        // 148000 + 5000 = 153000, but capped at 150000
        expect(time.players["p1"].reserveMsRemaining).toBe(150_000);
        expect(time.players["p1"].actionBonusMsGranted).toBe(5000);
      });

      it("should add bonus when below cap", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.players["p1"].reserveMsRemaining = 100_000;

        const result = awardDynamicActionBonus(state, "p1");
        const time = asDynamic(result.ctx.time);
        expect(time.players["p1"].reserveMsRemaining).toBe(105_000);
      });
    });

    describe("awardDynamicTurnPassBonus", () => {
      it("should award turn pass bonus", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.players["p1"].reserveMsRemaining = 80_000;

        const result = awardDynamicTurnPassBonus(state, "p1");
        const time = asDynamic(result.ctx.time);
        expect(time.players["p1"].turnPassBonusMsGranted).toBe(60_000);
        expect(time.players["p1"].reserveMsRemaining).toBe(140_000);
      });

      it("should cap turn pass bonus at reserveCapMs", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.players["p1"].reserveMsRemaining = 120_000;

        const result = awardDynamicTurnPassBonus(state, "p1");
        const time = asDynamic(result.ctx.time);
        // 120000 + 60000 = 180000, capped at 150000
        expect(time.players["p1"].reserveMsRemaining).toBe(150_000);
      });
    });
  });

  describe("Shared Timeout System", () => {
    describe("checkTimeout", () => {
      it("should return null when player has time remaining", () => {
        const state = createTestState("chess");
        expect(checkTimeout(state, "p1")).toBeNull();
      });

      it("should return 'first' on first timeout (chess)", () => {
        const state = createTestState("chess");
        const st = asChess(state.ctx.time);
        st.players["p1"].isInNegativeTime = true;
        st.players["p1"].timeoutCount = 0;

        expect(checkTimeout(state, "p1")).toBe("first");
      });

      it("should return 'second' on second timeout (chess)", () => {
        const state = createTestState("chess");
        const st = asChess(state.ctx.time);
        st.players["p1"].isInNegativeTime = true;
        st.players["p1"].timeoutCount = 1;

        expect(checkTimeout(state, "p1")).toBe("second");
      });

      it("should return 'first' on first timeout (dynamic)", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.players["p1"].isInNegativeTime = true;
        st.players["p1"].timeoutCount = 0;

        expect(checkTimeout(state, "p1")).toBe("first");
      });

      it("should return 'second' on second timeout (dynamic)", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.players["p1"].isInNegativeTime = true;
        st.players["p1"].timeoutCount = 1;

        expect(checkTimeout(state, "p1")).toBe("second");
      });

      it("should return null for priority mode", () => {
        const state = createTestState("priority");
        expect(checkTimeout(state, "p1")).toBeNull();
      });

      describe("per-decision max time cap", () => {
        it("should return null when under the cap (paused, accumulator alone)", () => {
          const state = createTestState("chess");
          const st = asChess(state.ctx.time);
          st.config.maxDecisionTimeMs = 60_000;
          st.activePlayerID = "p1";
          st.activePlayerAccumulatedMs = 30_000;
          st.running = false; // paused → no unsettled delta added
          expect(checkTimeout(state, "p1", 9_999_999)).toBeNull();
        });

        it("should return 'first' when accumulator alone exceeds cap", () => {
          const state = createTestState("chess");
          const st = asChess(state.ctx.time);
          st.config.maxDecisionTimeMs = 60_000;
          st.activePlayerID = "p1";
          st.activePlayerAccumulatedMs = 61_000;
          st.running = false;
          expect(checkTimeout(state, "p1", 0)).toBe("first");
        });

        it("should include unsettled delta while running", () => {
          const state = createTestState("chess");
          const st = asChess(state.ctx.time);
          st.config.maxDecisionTimeMs = 60_000;
          st.activePlayerID = "p1";
          st.activePlayerAccumulatedMs = 30_000;
          st.startedAtMs = 1_000;
          st.running = true;
          // 30s accumulated + (61_000 - 1_000) = 30s + 60s = 90s > 60s cap
          expect(checkTimeout(state, "p1", 61_000)).toBe("first");
        });

        it("should return 'first' for dynamic mode when exceeded", () => {
          const state = createTestState("dynamic");
          const st = asDynamic(state.ctx.time);
          st.config.maxDecisionTimeMs = 45_000;
          st.activePlayerID = "p1";
          st.activePlayerAccumulatedMs = 46_000;
          st.running = false;
          expect(checkTimeout(state, "p1", 0)).toBe("first");
        });

        it("should not fire cap-timeout for a player who is NOT the active player", () => {
          // This is the regression fix: cap is per priority holder, not per
          // turn player. If p1 is the turn player but p2 currently holds
          // priority (e.g. resolving a triggered target), the cap accumulator
          // applies to p2, not p1.
          const state = createTestState("chess");
          const st = asChess(state.ctx.time);
          st.config.maxDecisionTimeMs = 60_000;
          st.activePlayerID = "p2";
          st.activePlayerAccumulatedMs = 120_000;
          st.running = false;
          expect(checkTimeout(state, "p1", 0)).toBeNull();
          expect(checkTimeout(state, "p2", 0)).toBe("first");
        });

        it("should return 'second' when cap-timed out and timeoutCount >= 1", () => {
          const state = createTestState("chess");
          const st = asChess(state.ctx.time);
          st.config.maxDecisionTimeMs = 60_000;
          st.activePlayerID = "p1";
          st.activePlayerAccumulatedMs = 70_000;
          st.running = false;
          st.players["p1"].timeoutCount = 1;
          expect(checkTimeout(state, "p1", 0)).toBe("second");
        });

        it("should not fire when maxDecisionTimeMs is undefined (backward compat)", () => {
          const state = createTestState("chess");
          const st = asChess(state.ctx.time);
          // Explicitly no maxDecisionTimeMs
          st.activePlayerID = "p1";
          st.activePlayerAccumulatedMs = 999_999;
          expect(checkTimeout(state, "p1", 0)).toBeNull();
        });

        it("should not fire when activePlayerID is unset", () => {
          const state = createTestState("chess");
          const st = asChess(state.ctx.time);
          st.config.maxDecisionTimeMs = 60_000;
          st.activePlayerAccumulatedMs = 999_999;
          // activePlayerID never set
          expect(checkTimeout(state, "p1", 0)).toBeNull();
        });

        it("should still fire isInNegativeTime timeout even if cap not exceeded", () => {
          const state = createTestState("chess");
          const st = asChess(state.ctx.time);
          st.config.maxDecisionTimeMs = 60_000;
          st.activePlayerID = "p1";
          st.activePlayerAccumulatedMs = 5_000;
          st.running = false;
          st.players["p1"].isInNegativeTime = true;
          expect(checkTimeout(state, "p1", 0)).toBe("first");
        });
      });
    });

    describe("resetPlayerTimeAfterSkip with per-decision tracking", () => {
      it("should clear activePlayerAccumulatedMs when resetting the active player", () => {
        const state = createTestState("chess");
        const st = asChess(state.ctx.time);
        st.config.maxDecisionTimeMs = 60_000;
        st.activePlayerID = "p1";
        st.activePlayerAccumulatedMs = 70_000;
        st.players["p1"].isInNegativeTime = true;

        const result = resetPlayerTimeAfterSkip(state, "p1");
        const time = asChess(result.ctx.time);
        expect(time.activePlayerAccumulatedMs).toBe(0);
      });

      it("should NOT clear accumulator when resetting a non-active player", () => {
        const state = createTestState("chess");
        const st = asChess(state.ctx.time);
        st.config.maxDecisionTimeMs = 60_000;
        st.activePlayerID = "p1";
        st.activePlayerAccumulatedMs = 30_000;
        st.players["p2"].isInNegativeTime = true;

        const result = resetPlayerTimeAfterSkip(state, "p2");
        const time = asChess(result.ctx.time);
        expect(time.activePlayerAccumulatedMs).toBe(30_000);
      });
    });

    describe("resetPlayerTimeAfterSkip", () => {
      it("should reset chess clock player time after skip", () => {
        const state = createTestState("chess");
        const st = asChess(state.ctx.time);
        st.players["p1"].reserveMsRemaining = -5000;
        st.players["p1"].isInNegativeTime = true;
        st.players["p1"].timeoutCount = 0;

        const result = resetPlayerTimeAfterSkip(state, "p1");
        const time = asChess(result.ctx.time);
        expect(time.players["p1"].reserveMsRemaining).toBe(60_000);
        expect(time.players["p1"].isInNegativeTime).toBe(false);
        expect(time.players["p1"].timeoutCount).toBe(1);
      });

      it("should reset dynamic clock player time after skip", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.players["p1"].reserveMsRemaining = -3000;
        st.players["p1"].isInNegativeTime = true;
        st.players["p1"].timeoutCount = 0;

        const result = resetPlayerTimeAfterSkip(state, "p1");
        const time = asDynamic(result.ctx.time);
        expect(time.players["p1"].reserveMsRemaining).toBe(60_000);
        expect(time.players["p1"].isInNegativeTime).toBe(false);
        expect(time.players["p1"].timeoutCount).toBe(1);
      });

      it("should increment timeout count on second skip", () => {
        const state = createTestState("dynamic");
        const st = asDynamic(state.ctx.time);
        st.players["p1"].reserveMsRemaining = -3000;
        st.players["p1"].isInNegativeTime = true;
        st.players["p1"].timeoutCount = 1;

        const result = resetPlayerTimeAfterSkip(state, "p1");
        const time = asDynamic(result.ctx.time);
        expect(time.players["p1"].timeoutCount).toBe(2);
      });

      it("should not modify priority mode", () => {
        const state = createTestState("priority");
        const result = resetPlayerTimeAfterSkip(state, "p1");
        expect(result).toBe(state); // No change
      });
    });
  });

  describe("Clock target derivation (pendingChoice vs priority.holder)", () => {
    // These tests verify the pattern used in match-runtime.commands.ts Step 8:
    //   clockTarget = pendingChoice?.playerID ?? priority.holder

    it("should derive clock target from pendingChoice.playerID when present", () => {
      const state = createTestState("chess");
      state.ctx.priority.holder = "p1";
      state.ctx.priority.pendingChoice = {
        type: "action-effect",
        playerID: "p2",
        requestID: "effect-1",
      };

      const clockTarget = state.ctx.priority.pendingChoice?.playerID ?? state.ctx.priority.holder;
      expect(clockTarget).toBe("p2");
    });

    it("should fall back to priority.holder when no pendingChoice", () => {
      const state = createTestState("chess");
      state.ctx.priority.holder = "p1";
      // pendingChoice is absent by default on a fresh state

      const clockTarget = state.ctx.priority.pendingChoice?.playerID ?? state.ctx.priority.holder;
      expect(clockTarget).toBe("p1");
    });

    it("should revert to priority.holder after pendingChoice is cleared", () => {
      const state = createTestState("dynamic");
      state.ctx.priority.holder = "p1";
      state.ctx.priority.pendingChoice = {
        type: "action-effect",
        playerID: "p2",
        requestID: "effect-1",
      };

      // Before clearing
      const clockTargetBefore =
        state.ctx.priority.pendingChoice?.playerID ?? state.ctx.priority.holder;
      expect(clockTargetBefore).toBe("p2");

      // After clearing — pendingChoice is gone, clock falls back to priority.holder
      state.ctx.priority.pendingChoice = undefined;
      const clockTargetAfter = state.ctx.priority.holder;
      expect(clockTargetAfter).toBe("p1");
    });
  });

  describe("settleClocks updates startedAtMs", () => {
    it("should advance startedAtMs after chess clock settlement", () => {
      const state = createTestState("chess");
      const st = asChess(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;

      const result = settleClocks(state, 6000);
      expect(asChess(result.ctx.time).startedAtMs).toBe(6000);
    });

    it("should advance startedAtMs after priority clock settlement", () => {
      const state = createTestState("priority");
      const st = asPriority(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;
      st.activeWindow = {
        playerID: "p1",
        prioritySeq: 1,
        windowMs: 30_000,
        deadlineMs: 31_000,
      };

      const result = settleClocks(state, 6000);
      expect(asPriority(result.ctx.time).startedAtMs).toBe(6000);
    });

    it("should advance startedAtMs after dynamic clock settlement", () => {
      const state = createTestState("dynamic");
      const st = asDynamic(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;

      const result = settleClocks(state, 6000);
      expect(asDynamic(result.ctx.time).startedAtMs).toBe(6000);
    });

    it("should be idempotent: settling twice at the same time does not double-charge", () => {
      const state = createTestState("chess");
      const st = asChess(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;

      const first = settleClocks(state, 6000);
      expect(asChess(first.ctx.time).players["p1"].reserveMsRemaining).toBe(595_000);

      const second = settleClocks(first, 6000);
      // Second settlement at the same timestamp should not charge more
      expect(asChess(second.ctx.time).players["p1"].reserveMsRemaining).toBe(595_000);
    });

    it("should correctly charge only the delta on sequential settlements", () => {
      const state = createTestState("chess");
      const st = asChess(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;

      // First settlement: 5 seconds
      const first = settleClocks(state, 6000);
      expect(asChess(first.ctx.time).players["p1"].reserveMsRemaining).toBe(595_000);

      // Second settlement: only 2 more seconds (not 7 total)
      const second = settleClocks(first, 8000);
      expect(asChess(second.ctx.time).players["p1"].reserveMsRemaining).toBe(593_000);
    });

    it("should be idempotent for dynamic clock mode", () => {
      const state = createTestState("dynamic");
      const st = asDynamic(state.ctx.time);
      st.running = true;
      st.activePlayerID = "p1";
      st.startedAtMs = 1000;

      const first = settleClocks(state, 6000);
      expect(asDynamic(first.ctx.time).players["p1"].reserveMsRemaining).toBe(145_000);

      const second = settleClocks(first, 6000);
      expect(asDynamic(second.ctx.time).players["p1"].reserveMsRemaining).toBe(145_000);
    });
  });

  describe("Match initialization clock start", () => {
    it("should start clock for choosingFirstPlayer on init (chess)", () => {
      const ctx = createInitialTCGCtx({
        matchID: "match-init-1",
        gameID: "lorcana",
        rulesetHash: "v1",
        timeConfig: {
          mode: "chess",
          config: {
            initialReserveMs: 600_000,
            incrementMs: 0,
            delayMs: 0,
            graceMs: 0,
            resetTimeOnSkipMs: 60_000,
            lossPolicy: "lose-on-time",
          },
        },
        choosingFirstPlayer: "p1",
        players: [{ id: "p1" } as any, { id: "p2" } as any],
      });

      // Clock should NOT be running yet from createInitialTCGCtx alone
      // (match-runtime.init.ts handles the clock start after player initialization)
      // But priority should be set
      expect(ctx.priority.holder).toBe("p1");
      expect(ctx.priority.windowOpen).toBe(true);
    });

    it("should keep clock paused when no choosingFirstPlayer", () => {
      const ctx = createInitialTCGCtx({
        matchID: "match-init-2",
        gameID: "lorcana",
        rulesetHash: "v1",
        timeConfig: {
          mode: "dynamic",
          config: {
            initialReserveMs: 150_000,
            reserveCapMs: 150_000,
            perActionBonusMs: 5_000,
            perTurnPassBonusMs: 60_000,
            resetTimeOnSkipMs: 60_000,
            graceMs: 0,
          },
        },
        players: [{ id: "p1" } as any, { id: "p2" } as any],
      });

      const time = asDynamic(ctx.time);
      expect(time.running).toBe(false);
      expect(time.pausedReason).toBe("MATCH_NOT_STARTED");
    });
  });
});

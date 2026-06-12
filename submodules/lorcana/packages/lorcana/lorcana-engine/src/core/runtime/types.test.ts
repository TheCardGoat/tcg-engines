/**
 * Runtime Types Tests
 *
 * Tests for MatchState and TCGCtx types per PLAN.md Phase 1
 */

import { describe, it, expect } from "bun:test";
import {
  createInitialTCGCtx,
  isChessClockContext,
  isPriorityClockContext,
  isClockRunning,
} from "./types";
import type { TimeControlConfig } from "./types";
import { createPlayerId } from "../types";

describe("Runtime Types", () => {
  describe("createInitialTCGCtx", () => {
    it("should create initial context with required fields", () => {
      const ctx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
      });

      expect(ctx.protocolVersion).toBe(1);
      expect(ctx.matchID).toBe("match-123");
      expect(ctx.gameID).toBe("lorcana");
      expect(ctx.rulesetHash).toBe("ruleset-v1");
      expect(ctx._stateID).toBe(0);
    });

    it("should initialize status correctly", () => {
      const ctx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
      });

      expect(ctx.status.turn).toBe(0);
      expect(ctx.status.gameEnded).toBe(false);
      expect(ctx.status.phase).toBeUndefined();
      expect(ctx.status.winner).toBeUndefined();
    });

    it("should initialize priority correctly", () => {
      const ctx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
      });

      expect(ctx.priority.windowOpen).toBe(false);
      expect(ctx.priority.passSequence).toEqual([]);
      expect(ctx.priority.stackDepth).toBe(0);
      expect(ctx.priority.holder).toBeUndefined();
    });

    it("should initialize playerIds from players", () => {
      const playerOne = createPlayerId("player_one");
      const playerTwo = createPlayerId("player_two");

      const ctx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
        players: [
          { id: playerOne, name: "Player One" },
          { id: playerTwo, name: "Player Two" },
        ],
      });

      expect(ctx.playerIds).toEqual([playerOne, playerTwo]);
    });

    it("should initialize zones correctly", () => {
      const ctx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
      });

      expect(ctx.zones.public.zoneSummaries).toEqual({});
      expect(ctx.zones.private.zoneCards).toEqual({});
      expect(ctx.zones.private.cardIndex).toEqual({});
      expect(ctx.zones.private.cardMeta).toEqual({});
      expect(ctx.zones.reveals.active).toEqual([]);
    });

    it("should initialize with no time control", () => {
      const ctx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
      });

      expect(ctx.time.mode).toBe("none");
    });

    it("should initialize with chess clock", () => {
      const config: TimeControlConfig = {
        mode: "chess",
        config: {
          initialReserveMs: 600_000,
          incrementMs: 0,
          delayMs: 0,
          graceMs: 0,
          resetTimeOnSkipMs: 60_000,
          lossPolicy: "lose-on-time",
        },
      };
      const ctx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
        timeConfig: config,
      });

      expect(ctx.time.mode).toBe("chess");
      expect(isChessClockContext(ctx.time)).toBe(true);
      if (isChessClockContext(ctx.time)) {
        expect(ctx.time.running).toBe(false);
        expect(ctx.time.pausedReason).toBe("MATCH_NOT_STARTED");
      }
    });

    it("should initialize with priority clock", () => {
      const config: TimeControlConfig = {
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
      };
      const ctx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
        timeConfig: config,
      });

      expect(ctx.time.mode).toBe("priority");
      expect(isPriorityClockContext(ctx.time)).toBe(true);
      if (isPriorityClockContext(ctx.time)) {
        expect(ctx.time.running).toBe(false);
        expect(ctx.time.prioritySeq).toBe(0);
        expect(ctx.time.activeWindow).toBeUndefined();
      }
    });

    it("should initialize random state", () => {
      const ctx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
        timeConfig: { mode: "none" },
        seed: "my-seed",
      });

      expect(ctx.random.seed).toBe("my-seed");
      expect(ctx.random.draws).toBe(0);
      expect(ctx.random.state).toBeNull();
    });
  });

  describe("type guards", () => {
    it("should identify chess clock context", () => {
      const chessCtx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
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
      });

      expect(isChessClockContext(chessCtx.time)).toBe(true);
      expect(isPriorityClockContext(chessCtx.time)).toBe(false);
    });

    it("should identify priority clock context", () => {
      const priorityCtx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
        timeConfig: {
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
      });

      expect(isPriorityClockContext(priorityCtx.time)).toBe(true);
      expect(isChessClockContext(priorityCtx.time)).toBe(false);
    });

    it("should correctly report clock running state", () => {
      const chessCtx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
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
      });

      expect(isClockRunning(chessCtx.time)).toBe(false);

      if (isChessClockContext(chessCtx.time)) {
        chessCtx.time.running = true;
      }
      expect(isClockRunning(chessCtx.time)).toBe(true);
    });

    it("should report no clock for none mode", () => {
      const noneCtx = createInitialTCGCtx({
        matchID: "match-123",
        gameID: "lorcana",
        rulesetHash: "ruleset-v1",
      });

      expect(isClockRunning(noneCtx.time)).toBe(false);
    });
  });
});

import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine } from "../src/testing/index.ts";
import type { GigFixtureEntry } from "../src/testing/test-fixtures.ts";
import type { CommandSuccess } from "../src/types/commands.ts";
import type { GameEndedLog } from "../src/logging/index.ts";
import { ALL_DICE } from "../src/testing/test-engine.ts";

// ── Helpers ──────────────────────────────────────────────────────────

/** First N dice from the standard set, pre-placed in gig area. */
function gigsInArea(count: number): GigFixtureEntry[] {
  return ALL_DICE.slice(0, count);
}

/** Pass a full turn for the active player (play → attack → endTurn). */
function passTurn(engine: CyberpunkTestEngine): CommandSuccess {
  return engine.passPhase(); // end turn (transitions to opponent)
}

// ── Tests ────────────────────────────────────────────────────────────

describe("Win Conditions", () => {
  describe("Overtime", () => {
    it("overtime flag activates at the start of turn 15 (after last player's 7th turn)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(5) },
        { gigArea: gigsInArea(5) },
        { seed: "overtime-flag" },
      );

      // Before any turns: flag is false
      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(false);

      // Pass 13 turns to reach turn 14 (end of last player's 7th turn).
      for (let i = 0; i < 13; i++) {
        passTurn(engine);
        expect(engine.isGameOver()).toBe(false);
        expect(engine.getState().G.turnMetadata.overtimeActive).toBe(false);
      }

      // One more turn → turn 15 begins, overtime activates.
      passTurn(engine);
      expect(engine.isGameOver()).toBe(false);
      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(true);
    });

    it("overtime does not trigger before turn 15", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(5) },
        { gigArea: gigsInArea(5) },
        { seed: "no-overtime-early" },
      );

      // Pass 12 turns → turn 13 begins (first player's 7th turn), still not overtime.
      for (let i = 0; i < 12; i++) {
        passTurn(engine);
      }

      expect(engine.isGameOver()).toBe(false);
      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(false);
    });

    it("player with majority wins via overtime_majority when overtime begins", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6) },
        { gigArea: gigsInArea(6) },
        { seed: "overtime-majority" },
      );

      const firstActive = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(firstActive);

      // Judge: move 1 die from opponent to firstActive (7-5 split)
      const die = engine.getGigDice(opponent).at(-1)!;
      engine.judgeMoveGigToPlayer(die, firstActive);
      engine.judgeSetTurnMetadata({
        turnNumber: 14,
        activePlayerId: firstActive,
      });

      // firstActive has 7 gigs, opponent has 5
      expect(engine.getGigCount(firstActive)).toBe(7);
      expect(engine.getGigCount(opponent)).toBe(5);

      // firstActive ends turn → turn 15 begins, overtime triggers, majority check fires.
      passTurn(engine);

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(firstActive);
      expect(engine.getWinReason()).toBe("overtime_majority");
    });

    it("gameEnded log is emitted with correct winner and reason for overtime", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6) },
        { gigArea: gigsInArea(6) },
        { seed: "overtime-log" },
      );

      const firstActive = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(firstActive);
      const die = engine.getGigDice(opponent).at(-1)!;
      engine.judgeMoveGigToPlayer(die, firstActive);
      engine.judgeSetTurnMetadata({
        turnNumber: 14,
        activePlayerId: firstActive,
      });

      const result = passTurn(engine);
      const endLogs = result.moveLogs.filter(
        (log): log is GameEndedLog => log.type === "gameEnded",
      );

      expect(endLogs).toHaveLength(1);
      expect(endLogs[0]!.playerId).toBe(firstActive);
      expect(endLogs[0]!.winnerId).toBe(firstActive);
      expect(endLogs[0]!.reason).toBe("overtime_majority");
    });

    it("6-6 split in overtime has no majority and does not fall through to gig_victory", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6) },
        { gigArea: gigsInArea(6) },
        { seed: "overtime-split", overTime: true },
      );

      // Both have 6 gigs, majority = 7 → no overtime winner.
      passTurn(engine);

      expect(engine.isGameOver()).toBe(false);
      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(true);
    });

    it("overtime majority can be reached mid-turn after turn 15", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6), field: [], deck: 40 },
        { gigArea: gigsInArea(5), field: [], deck: 40 },
        { seed: "overtime-mid-turn", overTime: true },
      );

      const p1 = engine.getActivePlayerId();
      const p2 = engine.getOpponentOf(p1);

      // Turn 15+ with overtime already active. P1 has 6, P2 has 5.
      // P1 ends turn → P2 starts turn. No majority yet (majority = 7/12).
      passTurn(engine);
      expect(engine.isGameOver()).toBe(false);
      expect(engine.getActivePlayerId()).toBe(p2);

      // P2 steals 2 gigs from P1 mid-turn to reach 7/12 majority.
      // In overtime the game should end immediately once majority is held.
      const p1Gigs = engine.getGigDice(p1);
      engine.judgeMoveGigToPlayer(p1Gigs[0]!, p2);
      expect(engine.isGameOver()).toBe(false);

      engine.judgeMoveGigToPlayer(p1Gigs[1]!, p2);
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(p2);
      expect(engine.getWinReason()).toBe("overtime_majority");
    });
  });
});

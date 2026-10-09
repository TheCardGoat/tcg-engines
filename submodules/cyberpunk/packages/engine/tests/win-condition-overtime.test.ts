import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine } from "../src/testing/index.ts";
import type { GigFixtureEntry } from "../src/testing/test-fixtures.ts";
import type { CommandSuccess } from "../src/types/commands.ts";
import type { GameEndedLog } from "../src/logging/index.ts";
import { ALL_DICE } from "../src/testing/test-engine.ts";
import { turnsUntilOvertime } from "../src/moves/overtime.ts";

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
    it("starts after each player completes seven turns from normal setup", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 40 },
        { deck: 40 },
        { seed: "overtime-full-turns", skipSetup: false },
      );
      const firstPlayer = engine.getActivePlayerId();
      const secondPlayer = engine.getOpponentOf(firstPlayer);

      engine.keepHand({ as: firstPlayer });
      engine.keepHand({ as: secondPlayer });

      for (let turn = 1; turn <= 14; turn++) {
        const before = engine.getState();
        expect(before.G.turnMetadata.turnNumber).toBe(turn);
        expect(before.G.turnMetadata.activePlayerId).toBe(
          turn % 2 === 1 ? firstPlayer : secondPlayer,
        );
        expect(before.G.turnMetadata.turnBeganWithEmptyFixer).toBe(turn >= 13);
        expect(before.G.overtime).toBe(false);

        // The last die leaves during turn 12. Its empty areas do not make
        // that turn qualify because they were not empty when the turn began.
        if (turn === 12) {
          expect(
            before.ctx.playerIds.every((id) => before.G.players[id]!.fixerArea.length === 0),
          ).toBe(true);
        }

        engine.passPhase();
        const after = engine.getState();
        expect(after.G.turnMetadata.turnNumber).toBe(turn + 1);
        expect(after.G.overtime).toBe(turn === 14);
        expect(after.G.gameEnded).toBe(false);
      }
    });

    it("forecasts from the remaining public Fixer dice", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { seed: "countdown" });
      expect(turnsUntilOvertime(engine.getState())).toBe(15);
    });

    it("activates after two consecutive turns with empty Fixer areas", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6) },
        { gigArea: gigsInArea(6) },
        { seed: "overtime-flag" },
      );

      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(false);

      passTurn(engine);
      expect(engine.isGameOver()).toBe(false);
      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(false);

      passTurn(engine);
      expect(engine.isGameOver()).toBe(false);
      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(true);
    });

    it("does not trigger after only one empty-Fixer turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6) },
        { gigArea: gigsInArea(6) },
        { seed: "no-overtime-early" },
      );

      passTurn(engine);

      expect(engine.isGameOver()).toBe(false);
      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(false);
    });

    it("requires both Fixer areas to be empty at each turn start", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6) },
        { gigArea: ALL_DICE.slice(1), fixerDice: ["d20"] },
        { seed: "both-fixers-empty" },
      );

      passTurn(engine);
      passTurn(engine);

      expect(engine.getState().G.overtime).toBe(false);
      expect(engine.getState().G.turnMetadata.previousTurnBeganWithEmptyFixer).toBe(false);
    });

    it("counts the qualifying turns and logs the warning at turn start", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6) },
        { gigArea: gigsInArea(6) },
        { seed: "overtime-warning" },
      );
      engine.judgeSetTurnMetadata({
        previousTurnBeganWithEmptyFixer: false,
        turnBeganWithEmptyFixer: false,
      });

      expect(turnsUntilOvertime(engine.getState())).toBe(3);
      const first = passTurn(engine);
      expect(first.moveLogs).toContainEqual(
        expect.objectContaining({ messageKey: "game.overtimeFirstEmptyTurn" }),
      );
      expect(turnsUntilOvertime(engine.getState())).toBe(2);

      const second = passTurn(engine);
      expect(second.moveLogs).toContainEqual(
        expect.objectContaining({ messageKey: "game.overtimeFinalTurn" }),
      );
      expect(turnsUntilOvertime(engine.getState())).toBe(1);

      passTurn(engine);
      expect(engine.getState().G.overtime).toBe(true);
      expect(turnsUntilOvertime(engine.getState())).toBe(0);
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
        activePlayerId: firstActive,
        previousTurnBeganWithEmptyFixer: true,
        turnBeganWithEmptyFixer: true,
      });

      // firstActive has 7 gigs, opponent has 5
      expect(engine.getGigCount(firstActive)).toBe(7);
      expect(engine.getGigCount(opponent)).toBe(5);

      // The second empty-Fixer turn ends, overtime triggers, and the majority check fires.
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
        activePlayerId: firstActive,
        previousTurnBeganWithEmptyFixer: true,
        turnBeganWithEmptyFixer: true,
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

    it("logs when overtime begins without an immediate winner", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6) },
        { gigArea: gigsInArea(6) },
        { seed: "overtime-start-log" },
      );

      engine.judgeSetTurnMetadata({
        previousTurnBeganWithEmptyFixer: true,
        turnBeganWithEmptyFixer: true,
      });
      const result = passTurn(engine);

      expect(engine.getState().G.overtime).toBe(true);
      expect(engine.isGameOver()).toBe(false);
      expect(result.gameEvents).toContainEqual({
        type: "actionLog",
        messageKey: "game.overtimeStarted",
        params: {},
        playerId: expect.any(String),
        category: "system",
      });
      expect(result.moveLogs).toContainEqual(
        expect.objectContaining({
          type: "action",
          messageKey: "game.overtimeStarted",
          params: {},
        }),
      );
    });

    it("does not start overtime from turn number alone", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(5), fixerDice: ["d20"] },
        { gigArea: gigsInArea(6) },
        { seed: "overtime-not-turn-number" },
      );

      engine.judgeSetTurnMetadata({
        turnNumber: 14,
        previousTurnBeganWithEmptyFixer: false,
        turnBeganWithEmptyFixer: false,
        gigTakenThisTurn: true,
      });
      passTurn(engine);

      expect(engine.getState().G.turnMetadata.turnNumber).toBe(15);
      expect(engine.getState().G.overtime).toBe(false);
      expect(engine.getState().G.turnMetadata.overtimeActive).toBe(false);
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

    it("overtime majority can be reached mid-turn after overtime begins", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(6), field: [], deck: 40 },
        { gigArea: gigsInArea(5), field: [], deck: 40 },
        { seed: "overtime-mid-turn", overTime: true },
      );

      const p1 = engine.getActivePlayerId();
      const p2 = engine.getOpponentOf(p1);

      // Overtime is already active. P1 has 6, P2 has 5.
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

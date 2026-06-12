import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import type { GigFixtureEntry } from "../src/testing/test-fixtures.ts";
import type { GameEndedEvent } from "../src/types/game-events.ts";
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

/** Give a player 7 gigs via judge commands. */
function setupSevenGigs(engine: CyberpunkTestEngine, playerId: typeof P1) {
  for (const die of ALL_DICE) {
    engine.judgeAddGigDie(playerId, die.dieType, die.faceValue);
  }
  engine.judgeAddGigDie(playerId, "d4", 1);
}

// ── Tests ────────────────────────────────────────────────────────────

describe("Win Conditions", () => {
  // ── Gig Victory ──────────────────────────────────────────────────

  describe("Gig Victory (7+ Gigs)", () => {
    it("does not award p1 a win when p1 is already mid-turn with 6 gigs", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          gigArea: [...ALL_DICE],
        },
        {},
        { seed: "p1-mid-turn-with-6", activePlayerId: P1 },
      );

      passTurn(engine);

      // 6 gigs is below the 7 threshold — no win
      expect(engine.isGameOver()).toBe(false);
      expect(engine.getWinnerId()).toBeNull();
      expect(engine.getWinReason()).toBeNull();

      passTurn(engine);

      // Still no win after cycling back; 6 < 7
      expect(engine.isGameOver()).toBe(false);
      expect(engine.getWinnerId()).toBeNull();
      expect(engine.getWinReason()).toBeNull();
    });

    it("p2 wins when p1 passes into p2's turn with 7 gigs already in p2's gig area", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {},
        {},
        { seed: "p2-starts-with-7", activePlayerId: P1 },
      );
      setupSevenGigs(engine, P2);

      passTurn(engine);

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("gig_victory");
      expect(engine.getPhase()).toBe("end");
    });

    it("p2 wins when p1 passes into p2's turn and p2 has 7 gigs", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          gigArea: [...ALL_DICE],
        },
        {},
        { seed: "p2-starts-with-7", activePlayerId: P1 },
      );
      setupSevenGigs(engine, P2);

      passTurn(engine);

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("gig_victory");
      expect(engine.getPhase()).toBe("end");
    });

    it("5 gigs does not trigger a win", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { gigArea: gigsInArea(4) },
        { gigArea: gigsInArea(4) },
        { seed: "no-win-5" },
      );

      // Active passes turn → opponent takes 5th die (4 + 1 = 5) → no win
      passTurn(engine);

      expect(engine.isGameOver()).toBe(false);
      expect(engine.getWinnerId()).toBeNull();
      expect(engine.getPhase()).not.toBe("end");
    });

    it("gameEnded event is emitted with correct winner and reason", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { seed: "event-check" });

      const firstActive = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(firstActive);
      setupSevenGigs(engine, opponent);

      passTurn(engine);

      const endEvents = engine.getEvents("gameEnded") as GameEndedEvent[];
      expect(endEvents).toHaveLength(1);
      expect(endEvents[0]!.winnerId).toBe(opponent);
      expect(endEvents[0]!.reason).toBe("gig_victory");
    });

    it("gameEnded log is emitted with correct winner and reason", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { seed: "log-check" });

      const firstActive = engine.getActivePlayerId();
      const opponent = engine.getOpponentOf(firstActive);
      setupSevenGigs(engine, opponent);

      const result = passTurn(engine);
      const endLogs = result.moveLogs.filter(
        (log): log is GameEndedLog => log.type === "gameEnded",
      );

      expect(endLogs).toHaveLength(1);
      expect(endLogs[0]!.playerId).toBe(opponent);
      expect(endLogs[0]!.winnerId).toBe(opponent);
      expect(endLogs[0]!.reason).toBe("gig_victory");
    });

    it("no further moves are allowed after game ends", () => {
      const engine = CyberpunkTestEngine.createWithFixture({}, {}, { seed: "no-moves" });
      setupSevenGigs(engine, engine.getOpponentOf(engine.getActivePlayerId()));

      passTurn(engine);
      expect(engine.isGameOver()).toBe(true);

      const failure = engine.expectFailure(() => engine.passPhase());
      expect(failure.errorCode).toBe("GAME_ENDED");
    });
  });
});

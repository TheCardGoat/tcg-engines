import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
  theHeistRetailStarterDeckVCorporateExile,
  embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
  welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import type { CommandSuccess } from "../src/types/commands.ts";
import type { GameEndedLog } from "../src/logging/index.ts";

const riverWard = welcomeToNightCityRetailRiverWardDetectiveOnTheHunt;
const goro = embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean;
const goroUnit = embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay;
const vCorporate = theHeistRetailStarterDeckVCorporateExile;
const yorinobu = embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction;
const kerry = welcomeToNightCityRetailKerryEurodyneTheLastRockerboy;

/** Pass a full turn for the active player (play → attack → endTurn). */
function passTurn(engine: CyberpunkTestEngine): CommandSuccess {
  return engine.passPhase(); // end turn (transitions to opponent)
}

function moveFixerDiceToGigArea(engine: CyberpunkTestEngine, playerId: typeof P1, count: number) {
  while (engine.getGigCount(playerId) < count && engine.getFixerDice(playerId).length > 0) {
    engine.judgeMoveFixerDieToGigArea(playerId);
  }
}

function setupSevenGigs(engine: CyberpunkTestEngine, playerId: typeof P1) {
  moveFixerDiceToGigArea(engine, playerId, 6);
  engine.judgeAddGigDie(playerId, "d4", 1);
}

// ── Tests ────────────────────────────────────────────────────────────

describe("Win Conditions", () => {
  describe("Deck Out", () => {
    it("active player wins when the incoming player must draw from an empty deck", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 1 },
        { deck: 0 },
        { seed: "deck-out" },
      );
      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);

      expect(activePlayer).toBe(P1);
      expect(incomingPlayer).toBe(P2);
      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(0);

      passTurn(engine);

      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(0);
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(activePlayer);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("p2 wins when p1 must draw from an empty deck", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 0 },
        { deck: 1 },
        { seed: "deck-out-p1", activePlayerId: P2 },
      );
      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);

      expect(activePlayer).toBe(P2);
      expect(incomingPlayer).toBe(P1);
      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(0);

      passTurn(engine);

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("gameEnded log is emitted with correct winner and reason for deck out", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 1 },
        { deck: 0 },
        { seed: "deck-out-log" },
      );
      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);

      const result = passTurn(engine);
      const endLogs = result.moveLogs.filter(
        (log): log is GameEndedLog => log.type === "gameEnded",
      );

      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(0);
      expect(endLogs).toHaveLength(1);
      expect(endLogs[0]!.playerId).toBe(activePlayer);
      expect(endLogs[0]!.winnerId).toBe(activePlayer);
      expect(endLogs[0]!.reason).toBe("deck_out_victory");
    });

    it("p2 wins when p1 must draw from an empty deck on a later turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 1 },
        { deck: 2 },
        { seed: "deck-out-p1" },
      );
      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);

      expect(activePlayer).toBe(P1);
      expect(incomingPlayer).toBe(P2);
      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(2);

      passTurn(engine);

      expect(engine.isGameOver()).toBe(false);
      expect(engine.getWinnerId()).toBeNull();
      expect(engine.getWinReason()).toBeNull();

      // P1 draws their last card here and survives because a card was available.
      passTurn(engine);

      expect(engine.isGameOver()).toBe(false);
      expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);

      passTurn(engine);
      expect(engine.isGameOver()).toBe(false);

      passTurn(engine);
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("opponent wins when a draw-card Unit ability requires more cards than remain", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [kerry],
          gigArea: [{ dieType: "d8", faceValue: 8 }],
          deck: 2,
        },
        { deck: 2 },
        { seed: "main-phase-draw-effect-deck-out" },
      );

      engine.activateAbility(kerry, 0);

      expect(engine.getCardsInZone("hand", P1)).toHaveLength(1);
      expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("opponent wins when a player must draw from an empty deck during an attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: yorinobu, faceDown: false }, goro, vCorporate],
          field: [{ card: goroUnit, spent: false }],
          gigArea: [
            { dieType: "d6", faceValue: 6 },
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 6 },
          ],
          deck: 1,
        },
        { deck: 2 },
        { seed: "attack-phase-deck-out" },
      );

      expect(engine.getActivePlayerId()).toBe(P1);
      expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);

      // The first time a friendly Arasaka unit attacks each turn, draw a card...
      engine.attackRival(goroUnit);

      expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("deck out does not trigger with cards remaining", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 1 },
        { deck: 1 },
        { seed: "no-deck-out" },
      );
      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);

      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(1);

      passTurn(engine);

      expect(engine.isGameOver()).toBe(false);
      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(0);
      expect(engine.getCardsInZone("hand", incomingPlayer)).toHaveLength(1);
    });

    it("gig victory takes priority over deck out", () => {
      // Opponent starts the incoming turn with 7 gigs and no cards in deck.
      // Gig check runs before draw → gig_victory, not deck_out_victory.
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 1 },
        { deck: 0 },
        { seed: "gig-over-deckout" },
      );

      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);
      setupSevenGigs(engine, incomingPlayer);

      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(0);
      expect(engine.getGigCount(incomingPlayer)).toBe(7);

      passTurn(engine);

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(incomingPlayer);
      expect(engine.getWinReason()).toBe("gig_victory");
    });
  });
});

import { describe, expect, it } from "vite-plus/test";
import {
  alphaGoroTakemuraHandsUnclean,
  alphaGoroTakemuraLosingHisWay,
  alphaVCorporateExile,
  alphaYorinobuArasakaEmbracingDestruction,
  spoilerRiverWardDetectiveOnTheHunt,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import type { CommandSuccess } from "../src/types/commands.ts";
import type { GameEndedLog } from "../src/logging/index.ts";

const riverWard = spoilerRiverWardDetectiveOnTheHunt;
const goro = alphaGoroTakemuraHandsUnclean;
const goroUnit = alphaGoroTakemuraLosingHisWay;
const vCorporate = alphaVCorporateExile;
const yorinobu = alphaYorinobuArasakaEmbracingDestruction;

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
    it("active player wins when the incoming player draws their last deck card", () => {
      // deck: 1 means the fixture starts in main phase with exactly 1 card
      // left. P1 passes the turn; P2 draws that card and decks out.
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 1 },
        { deck: 1 },
        { seed: "deck-out" },
      );
      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);

      expect(activePlayer).toBe(P1);
      expect(incomingPlayer).toBe(P2);
      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(1);

      passTurn(engine);

      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(0);
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(activePlayer);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("p2 wins when p1 draws their last deck card", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 1 },
        { deck: 1 },
        { seed: "deck-out-p1", activePlayerId: P2 },
      );
      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);

      expect(activePlayer).toBe(P2);
      expect(incomingPlayer).toBe(P1);
      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(1);

      passTurn(engine);

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("gameEnded log is emitted with correct winner and reason for deck out", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 1 },
        { deck: 1 },
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

    it("p2 wins when p1 draws their last deck card on a later turn", () => {
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

      passTurn(engine);

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("opponent wins when a player draws their last card in the middle of the main phase", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [riverWard, goro, vCorporate],
          eddies: 2,
          deck: 1,
        },
        { deck: 2 },
        { seed: "play-phase-deck-out" },
      );

      expect(engine.getActivePlayerId()).toBe(P1);
      expect(engine.getState().G.gamePhase).toBe("main");
      expect(engine.getCardsInZone("deck", P1)).toHaveLength(1);

      engine.callLegend(riverWard);

      expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("opponent wins when a player draws their last card during an attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: yorinobu, faceDown: false }, goro, vCorporate],
          field: [{ card: goroUnit, spent: false }],
          gigArea: [
            { dieType: "d6", faceValue: 6 },
            { dieType: "d8", faceValue: 8 },
            { dieType: "d10", faceValue: 6 },
          ],
          deck: 2,
        },
        { deck: 2 },
        { seed: "attack-phase-deck-out" },
      );

      expect(engine.getActivePlayerId()).toBe(P1);
      expect(engine.getCardsInZone("deck", P1)).toHaveLength(1);

      // The first time a friendly Arasaka unit attacks each turn, draw a card...
      engine.attackRival(goroUnit);

      expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(P2);
      expect(engine.getWinReason()).toBe("deck_out_victory");
    });

    it("deck out does not trigger with cards remaining", () => {
      // deck: 2 means the fixture starts with 2 cards left. Drawing 1 leaves
      // one card in deck, so deck out does not trigger.
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 2 },
        { deck: 2 },
        { seed: "no-deck-out" },
      );
      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);

      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(2);

      passTurn(engine);

      expect(engine.isGameOver()).toBe(false);
      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(1);
    });

    it("gig victory takes priority over deck out", () => {
      // Opponent starts the incoming turn with 6 gigs AND only 1 card in deck.
      // Gig check runs before draw → gig_victory, not deck_out_victory.
      const engine = CyberpunkTestEngine.createWithFixture(
        { deck: 1 },
        { deck: 1 },
        { seed: "gig-over-deckout" },
      );

      const activePlayer = engine.getActivePlayerId();
      const incomingPlayer = engine.getOpponentOf(activePlayer);
      setupSevenGigs(engine, incomingPlayer);

      expect(engine.getCardsInZone("deck", incomingPlayer)).toHaveLength(1);
      expect(engine.getGigCount(incomingPlayer)).toBe(7);

      passTurn(engine);

      expect(engine.isGameOver()).toBe(true);
      expect(engine.getWinnerId()).toBe(incomingPlayer);
      expect(engine.getWinReason()).toBe("gig_victory");
    });
  });
});

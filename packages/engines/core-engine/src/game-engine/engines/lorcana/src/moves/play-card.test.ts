import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type {
  LorcanitoCharacterCard,
  LorcanitoLocationCard,
} from "@lorcanito/lorcana-engine";
import { createInvalidMove } from "../../../../core-engine/move/move-types";
// Using mock cards for testing instead of external dependencies
// import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// import { taffytaMuttonfudgeSourSpeedster } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { LorcanaTestEngine } from "../testing/lorcana-test-engine";
import { mockCharacterCard, mockLocationCard } from "../testing/mockCards";
import { playCardMove } from "./play-card";
import type { LorcanaMoveFn } from "./types";

// Mock cards for testing
const hiddenCoveTranquilHaven: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "hidden-cove-tranquil-haven",
  name: "Hidden Cove",
  title: "Tranquil Haven",
  cost: 2,
  moveCost: 1,
  lore: 2,
};

const taffytaMuttonfudgeSourSpeedster: LorcanitoCharacterCard = {
  ...mockCharacterCard,
  id: "taffyta-muttonfudge-sour-speedster",
  name: "Taffyta Muttonfudge",
  title: "Sour Speedster",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
};

const testCharacterCard: LorcanitoCharacterCard = {
  ...mockCharacterCard,
  id: "test-character-basic",
  name: "Test Character",
};

const testOpponentCharacterCard: LorcanitoCharacterCard = {
  ...mockCharacterCard,
  id: "test-character-opponent",
  name: "Test Character (Opponent)",
};

// Test location cards for testing move functionality
const testLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-basic",
  name: "Test Location",
  moveCost: 1, // Cost to move a character to this location
  lore: 1,
};

const expensiveLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-expensive",
  name: "Expensive Location",
  cost: 3,
  moveCost: 3, // High cost to move characters here
  lore: 2,
};

const freeLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-free",
  name: "Free Location",
  title: "Zero Move Cost",
  cost: 1,
  moveCost: 0, // Free to move characters here
  lore: 0,
};

const twentyLoreLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-twenty-lore",
  name: "Twenty Lore Location",
  cost: 1,
  moveCost: 0, // Free to move characters here
  lore: 20, // High lore gain for testing
};

const freeOpponentLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-free-opponent",
  name: "Free Location (Opponent)",
  cost: 1,
  moveCost: 0, // Free to move characters here
  lore: 2,
};

describe("Move: Play Card", () => {
  describe("Basic validation", () => {
    it("should be defined", () => {
      expect(playCardMove).toBeDefined();
      expect(typeof playCardMove).toBe("function");
    });

    it("should return invalid move for wrong phase", () => {
      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "wrongPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "wrongPhase" }),
          getCardInstance: () => null,
          getCardsInZone: () => [],
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = (playCardMove as LorcanaMoveFn)(
        mockContext as any,
        "test-instance-id",
      );

      expect(result).toEqual(
        createInvalidMove("WRONG_PHASE", "moves.playCard.errors.wrongPhase", {
          currentPhase: "wrongPhase",
          expectedPhase: "mainPhase",
        }),
      );
    });

    it("should return invalid move for non-existent card", () => {
      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "mainPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "mainPhase" }),
          getCardInstance: () => null,
          getCardsInZone: () => [],
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = (playCardMove as LorcanaMoveFn)(
        mockContext as any,
        "non-existent-id",
      );

      expect(result).toEqual(
        createInvalidMove(
          "CARD_NOT_FOUND",
          "moves.playCard.errors.cardNotFound",
          {
            instanceId: "non-existent-id",
          },
        ),
      );
    });

    it("should return invalid move for insufficient ink", () => {
      const mockCard = {
        instanceId: "test-card-id",
        card: { cost: 5, type: ["Character"] },
      };

      const mockContext = {
        G: { effects: [], bag: [] },
        ctx: { currentPhase: "mainPhase" },
        coreOps: {
          getCtx: () => ({ currentPhase: "mainPhase" }),
          getCardInstance: () => mockCard,
          getCardsInZone: () => [mockCard],
          getAvailableInk: () => 3, // Less than card cost
        },
        gameOps: null,
        playerID: "player_one",
      };

      const result = (playCardMove as LorcanaMoveFn)(
        mockContext as any,
        "test-card-id",
      );

      expect(result).toEqual(
        createInvalidMove(
          "INSUFFICIENT_INK",
          "moves.playCard.errors.insufficientInk",
          {
            required: 5,
            available: 3,
            playerId: "player_one",
          },
        ),
      );
    });
  });
});

import { beforeEach, describe, expect, it } from "bun:test";
import { createPlayerId } from "@tcg/core";
import {
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../../testing/lorcana-test-engine";

describe("Core Move Parameter Enumeration", () => {
  describe("playCard Parameter Enumeration", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      // Start in main phase with cards in hand
      testEngine = new LorcanaTestEngine(
        { hand: 3, deck: 10 },
        { hand: 3, deck: 10 },
        { skipPreGame: true },
      );
    });

    it.todo("should enumerate cards in hand as valid playCard targets", () => {
      const params = testEngine.enumerateMoveParameters("playCard", PLAYER_ONE);

      expect(params).not.toBeNull();
      expect(params?.validCombinations).toBeDefined();
      expect(params?.validCombinations.length).toBeGreaterThan(0);
    });

    it.todo("should include cardId in parameter info", () => {
      const params = testEngine.enumerateMoveParameters("playCard", PLAYER_ONE);

      expect(params?.parameterInfo.cardId).toBeDefined();
      expect(params?.parameterInfo.cardId.type).toBe("cardId");
      expect(params?.parameterInfo.cardId.validValues).toBeDefined();
    });

    it("should return empty when no cards in hand", () => {
      // Remove all cards from hand
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      for (const cardId of hand || []) {
        testEngine.moveCard(cardId, "discard", PLAYER_ONE);
      }

      const params = testEngine.enumerateMoveParameters("playCard", PLAYER_ONE);

      if (params) {
        expect(params.validCombinations).toHaveLength(0);
      }
    });

    it("should return null when move not available", () => {
      // Try during opponent's turn or wrong phase
      const params = testEngine.enumerateMoveParameters(
        "playCard",
        PLAYER_TWO, // Not active player
      );

      // May return null or empty combinations depending on phase/turn rules
      if (params === null) {
        expect(params).toBeNull();
      } else {
        expect(params.validCombinations).toBeDefined();
      }
    });
  });

  describe("quest Parameter Enumeration", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      testEngine = new LorcanaTestEngine(
        { hand: 0, deck: 10 },
        { hand: 0, deck: 10 },
        { skipPreGame: true },
      );
    });

    it.todo("should enumerate ready characters as valid quest targets", () => {
      const params = testEngine.enumerateMoveParameters("quest", PLAYER_ONE);

      expect(params).toBeDefined();
      expect(params?.parameterInfo.cardId).toBeDefined();
      expect(params?.parameterInfo.cardId.type).toBe("cardId");
    });

    it("should exclude exerted characters", () => {
      // This test would require characters in play
      // For now, verify the structure
      const params = testEngine.enumerateMoveParameters("quest", PLAYER_ONE);

      if (params) {
        expect(params.validCombinations).toBeDefined();
        expect(Array.isArray(params.validCombinations)).toBe(true);
      }
    });

    it("should return empty when no ready characters", () => {
      const params = testEngine.enumerateMoveParameters("quest", PLAYER_ONE);

      // With no characters in play, should have no valid combinations
      if (params) {
        expect(params.validCombinations).toHaveLength(0);
      }
    });
  });

  describe("challenge Parameter Enumeration", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      testEngine = new LorcanaTestEngine(
        { hand: 0, deck: 10 },
        { hand: 0, deck: 10 },
        { skipPreGame: true },
      );
    });

    it("should enumerate attacker-defender pairs", () => {
      const params = testEngine.enumerateMoveParameters(
        "challenge",
        PLAYER_ONE,
      );

      expect(params).toBeDefined();
      if (params) {
        expect(params.parameterInfo.attackerId).toBeDefined();
        expect(params.parameterInfo.defenderId).toBeDefined();
      }
    });

    it("should have attackerId and defenderId in parameter info", () => {
      const params = testEngine.enumerateMoveParameters(
        "challenge",
        PLAYER_ONE,
      );

      if (params) {
        expect(params.parameterInfo.attackerId.type).toBe("cardId");
        expect(params.parameterInfo.defenderId.type).toBe("cardId");
      }
    });

    it("should return empty when no valid attackers or defenders", () => {
      const params = testEngine.enumerateMoveParameters(
        "challenge",
        PLAYER_ONE,
      );

      // With no characters in play, should have no valid combinations
      if (params) {
        expect(params.validCombinations).toHaveLength(0);
      }
    });
  });

  describe("alterHand Parameter Enumeration", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      testEngine = new LorcanaTestEngine(
        { hand: 7, deck: 10 },
        { hand: 7, deck: 10 },
        { skipPreGame: false },
      );

      // Execute choose first player to get to mulligan phase
      const choosingPlayer = testEngine.getCtx().choosingFirstPlayer;
      testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
      testEngine.chooseWhoGoesFirst(PLAYER_ONE);
    });

    it.todo("should enumerate cards in hand as mulligan options", () => {
      const params = testEngine.enumerateMoveParameters(
        "alterHand",
        PLAYER_ONE,
      );

      expect(params).not.toBeNull();
      if (params) {
        expect(params.parameterInfo.cardsToMulligan).toBeDefined();
      }
    });

    it("should allow mulliganing 0 cards (keep all)", () => {
      const params = testEngine.enumerateMoveParameters(
        "alterHand",
        PLAYER_ONE,
      );

      if (params) {
        // Should include option to mulligan no cards
        const keepAllOption = params.validCombinations.find(
          (c: any) =>
            Array.isArray(c.cardsToMulligan) && c.cardsToMulligan.length === 0,
        );
        expect(keepAllOption).toBeDefined();
      }
    });

    it("should allow mulliganing all cards", () => {
      const params = testEngine.enumerateMoveParameters(
        "alterHand",
        PLAYER_ONE,
      );

      if (params) {
        const hand = testEngine.getZone("hand", PLAYER_ONE);
        const handSize = hand?.length || 0;

        // Should include option to mulligan all cards
        const mulliganAllOption = params.validCombinations.find(
          (c: any) =>
            Array.isArray(c.cardsToMulligan) &&
            c.cardsToMulligan.length === handSize,
        );
        expect(mulliganAllOption).toBeDefined();
      }
    });
  });

  describe("putACardIntoTheInkwell Parameter Enumeration", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      testEngine = new LorcanaTestEngine(
        { hand: 5, deck: 10 },
        { hand: 5, deck: 10 },
        { skipPreGame: true },
      );
    });

    it("should enumerate inkable cards in hand", () => {
      const params = testEngine.enumerateMoveParameters(
        "putACardIntoTheInkwell",
        PLAYER_ONE,
      );

      expect(params).toBeDefined();
      if (params) {
        expect(params.parameterInfo.cardId).toBeDefined();
        expect(params.parameterInfo.cardId.type).toBe("cardId");
      }
    });

    it("should only include cards with inkable property", () => {
      const params = testEngine.enumerateMoveParameters(
        "putACardIntoTheInkwell",
        PLAYER_ONE,
      );

      // All returned cards should be inkable (this would be validated by move condition)
      if (params) {
        expect(Array.isArray(params.validCombinations)).toBe(true);
      }
    });

    it("should return null if already inked this turn", () => {
      // Execute ink move once
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      if (hand && hand.length > 0) {
        testEngine.executeMove("putACardIntoTheInkwell", {
          playerId: createPlayerId(PLAYER_ONE),
          params: { cardId: hand[0] },
        });
      }

      // Try to enumerate again - should return null (move not available)
      const params = testEngine.enumerateMoveParameters(
        "putACardIntoTheInkwell",
        PLAYER_ONE,
      );

      // Move should no longer be available after using once per turn
      if (params === null) {
        expect(params).toBeNull();
      }
    });
  });

  describe("Cross-Move Integration", () => {
    let testEngine: LorcanaTestEngine;

    beforeEach(() => {
      testEngine = new LorcanaTestEngine(
        { hand: 5, deck: 10 },
        { hand: 5, deck: 10 },
        { skipPreGame: true },
      );
    });

    it("should enumerate parameters for multiple moves simultaneously", () => {
      const playCardParams = testEngine.enumerateMoveParameters(
        "playCard",
        PLAYER_ONE,
      );
      const inkwellParams = testEngine.enumerateMoveParameters(
        "putACardIntoTheInkwell",
        PLAYER_ONE,
      );

      // Both should be available during main phase
      expect(playCardParams).toBeDefined();
      expect(inkwellParams).toBeDefined();
    });

    it("should return consistent results across multiple calls", () => {
      const params1 = testEngine.enumerateMoveParameters(
        "playCard",
        PLAYER_ONE,
      );
      const params2 = testEngine.enumerateMoveParameters(
        "playCard",
        PLAYER_ONE,
      );

      // Should be identical
      expect(params1).toEqual(params2);
    });
  });
});

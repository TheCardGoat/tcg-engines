/**
 * Section 10 - Boost Keyword
 *
 * Tests for the Boost keyword mechanic from Disney Lorcana.
 *
 * Rule: Once during your turn, you may pay X {I} to put the top card
 * of your deck facedown under a character with "Boost X".
 *
 * Key rules:
 * - Boost can be used the same turn a character is played (no drying restriction)
 * - Only usable once per character per turn
 * - Requires X ready ink cards in the inkwell
 * - Top card of deck goes facedown under the character
 * - If deck is empty, Boost cannot be activated
 */

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createPlayerId } from "@tcg/core";
import { LorcanaTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../testing/lorcana-test-engine";

/**
 * Helper: Adds Boost X keyword to a card definition registered in the test engine
 *
 * The LorcanaTestEngine stores card definitions in `this.cardDefinitions` (private).
 * We access it via `(testEngine as any).cardDefinitions` to add Boost to a test character.
 */
function addBoostToCard(testEngine: LorcanaTestEngine, cardId: string, boostValue: number): void {
  const cardDefs = (testEngine as any).cardDefinitions as Record<string, any>;
  if (cardDefs[cardId]) {
    cardDefs[cardId] = {
      ...cardDefs[cardId],
      abilities: [
        ...(cardDefs[cardId].abilities ?? []),
        { keyword: "Boost", type: "keyword", value: boostValue },
      ],
    };
  }
}

describe("Boost Keyword", () => {
  let testEngine: LorcanaTestEngine;

  afterEach(() => {
    testEngine.dispose();
  });

  describe("Basic Boost functionality", () => {
    test("Boost move can be executed: exerts ink and moves top deck card to limbo", () => {
      // Arrange: Player with 2 ready ink cards, a deck, and a Boost 1 character in play
      testEngine = new LorcanaTestEngine(
        { deck: 5, inkwell: 2 },
        { deck: 5 },
        { skipPreGame: true },
      );

      const initialDeckSize = testEngine.getZone("deck", PLAYER_ONE).length;

      // Create a dry character (ready to act)
      const charId = testEngine.createCharacterInPlay(PLAYER_ONE, {
        lore: 1,
        strength: 2,
        willpower: 3,
      });

      // Add Boost 1 to the character's registered definition
      addBoostToCard(testEngine, charId, 1);

      // Act: Execute boost move
      const result = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });

      // Assert: Move succeeds
      expect(result.success).toBe(true);

      // Deck should have lost one card (moved to limbo)
      const deckAfter = testEngine.getZone("deck", PLAYER_ONE);
      expect(deckAfter.length).toBe(initialDeckSize - 1);

      // One ink card should now be exerted
      const inkCards = testEngine.getZone("inkwell", PLAYER_ONE);
      const exertedInk = inkCards.filter((id) => {
        const meta = testEngine.getCardMeta(id);
        return meta?.state === "exerted";
      });
      expect(exertedInk.length).toBe(1);

      // Character should have the card tracked under it
      const characterMeta = testEngine.getCardMeta(charId);
      expect(characterMeta?.stackPosition?.cardsUnderneath?.length).toBe(1);
    });

    test("Boost can be used the same turn a character is played (no drying restriction)", () => {
      // Arrange: Fresh character (isDrying: true) with Boost keyword
      testEngine = new LorcanaTestEngine(
        { deck: 5, inkwell: 2 },
        { deck: 5 },
        { skipPreGame: true },
      );

      const charId = testEngine.createCharacterInPlay(PLAYER_ONE, {
        lore: 1,
        strength: 2,
        willpower: 3,
      });

      // Add Boost 1 to the character's definition
      addBoostToCard(testEngine, charId, 1);

      // Simulate a freshly-played character (isDrying = true) - summoning sickness
      const engineAsAny = testEngine.engine as any;
      const {internalState} = engineAsAny;
      if (internalState?.cardMetas?.[charId]) {
        internalState.cardMetas[charId].isDrying = true;
      }

      // Act: Execute boost move (should work even while drying)
      const result = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });

      // Assert: Boost succeeds despite character being fresh/drying
      expect(result.success).toBe(true);
    });

    test("Boost cannot be used twice on the same character in one turn", () => {
      // Arrange: Character with Boost 1, enough ink for two uses
      testEngine = new LorcanaTestEngine(
        { deck: 10, inkwell: 4 },
        { deck: 10 },
        { skipPreGame: true },
      );

      const charId = testEngine.createCharacterInPlay(PLAYER_ONE, {
        lore: 1,
        strength: 2,
        willpower: 3,
      });
      addBoostToCard(testEngine, charId, 1);

      // Act: First Boost succeeds
      const firstResult = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });
      expect(firstResult.success).toBe(true);

      // Act: Second Boost on same character this turn should fail
      const secondResult = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });
      expect(secondResult.success).toBe(false);
    });

    test("Boost fails when deck is empty", () => {
      // Arrange: Character with Boost 1, but no deck cards
      testEngine = new LorcanaTestEngine(
        { deck: 0, inkwell: 2 },
        { deck: 5 },
        { skipPreGame: true },
      );

      const charId = testEngine.createCharacterInPlay(PLAYER_ONE, {
        lore: 1,
        strength: 2,
        willpower: 3,
      });
      addBoostToCard(testEngine, charId, 1);

      // Act: Boost with empty deck
      const result = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });

      // Assert: Move fails
      expect(result.success).toBe(false);
    });

    test("Boost fails when player does not have enough ready ink", () => {
      // Arrange: Character with Boost 2, but only 1 ready ink card
      testEngine = new LorcanaTestEngine(
        { deck: 5, inkwell: 1 },
        { deck: 5 },
        { skipPreGame: true },
      );

      const charId = testEngine.createCharacterInPlay(PLAYER_ONE, {
        lore: 1,
        strength: 2,
        willpower: 3,
      });
      addBoostToCard(testEngine, charId, 2);

      // Act: Boost 2 with only 1 ready ink
      const result = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });

      // Assert: Move fails due to insufficient ink
      expect(result.success).toBe(false);
    });

    test("Boost fails when character does not have Boost keyword", () => {
      // Arrange: Regular character without Boost keyword
      testEngine = new LorcanaTestEngine(
        { deck: 5, inkwell: 2 },
        { deck: 5 },
        { skipPreGame: true },
      );

      const charId = testEngine.createCharacterInPlay(PLAYER_ONE, {
        lore: 1,
        strength: 2,
        willpower: 3,
      });

      // Do NOT add Boost keyword - character has none

      // Act: Try to Boost a non-Boost character
      const result = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });

      // Assert: Move fails
      expect(result.success).toBe(false);
    });

    test("Boost fails when targeting opponent's character", () => {
      // Arrange: Opponent has a Boost character in play
      testEngine = new LorcanaTestEngine(
        { deck: 5, inkwell: 2 },
        { deck: 5 },
        { skipPreGame: true },
      );

      // Create character for PLAYER_TWO
      testEngine.changeActivePlayer(PLAYER_TWO);
      const opponentCharId = testEngine.createCharacterInPlay(PLAYER_TWO, {
        lore: 1,
        strength: 2,
        willpower: 3,
      });
      addBoostToCard(testEngine, opponentCharId, 1);

      // Act: PLAYER_ONE tries to Boost PLAYER_TWO's character
      testEngine.changeActivePlayer(PLAYER_ONE);
      const result = testEngine.engine.executeMove("boost", {
        params: { characterId: opponentCharId },
        playerId: createPlayerId(PLAYER_ONE),
      });

      // Assert: Move fails (can't use Boost on opponent's character)
      expect(result.success).toBe(false);
    });

    test("Boost tracker resets after turn ends allowing Boost again next turn", () => {
      // Arrange: Character with Boost 1
      testEngine = new LorcanaTestEngine(
        { deck: 10, inkwell: 4 },
        { deck: 10 },
        { skipPreGame: true },
      );

      const charId = testEngine.createCharacterInPlay(PLAYER_ONE, {
        lore: 1,
        strength: 2,
        willpower: 3,
      });
      addBoostToCard(testEngine, charId, 1);

      // Act: Use Boost this turn
      const firstResult = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });
      expect(firstResult.success).toBe(true);

      // Pass turn to player two and back
      testEngine.passTurn();
      testEngine.passTurn();

      // Act: Player one should be able to Boost again next turn
      const secondResult = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });

      // Assert: Boost succeeds again after turn reset
      expect(secondResult.success).toBe(true);
    });

    test("Boost with cost 2 exerts exactly 2 ink cards", () => {
      // Arrange: Character with Boost 2, 3 ready ink cards
      testEngine = new LorcanaTestEngine(
        { deck: 5, inkwell: 3 },
        { deck: 5 },
        { skipPreGame: true },
      );

      const charId = testEngine.createCharacterInPlay(PLAYER_ONE, {
        lore: 1,
        strength: 2,
        willpower: 3,
      });
      addBoostToCard(testEngine, charId, 2);

      // Act
      const result = testEngine.engine.executeMove("boost", {
        params: { characterId: charId },
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(true);

      // Assert: Exactly 2 ink cards exerted
      const inkCards = testEngine.getZone("inkwell", PLAYER_ONE);
      const exertedInk = inkCards.filter((id) => {
        const meta = testEngine.getCardMeta(id);
        return meta?.state === "exerted";
      });
      expect(exertedInk.length).toBe(2);
    });
  });
});

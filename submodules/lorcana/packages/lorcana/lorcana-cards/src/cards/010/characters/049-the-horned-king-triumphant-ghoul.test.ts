import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import type { ZoneId } from "@tcg/lorcana-types";
import { theBlackCauldron } from "../items/032-the-black-cauldron";
import { theHornedKingTriumphantGhoul } from "./049-the-horned-king-triumphant-ghoul";

const plainCharacter = createMockCharacter({
  id: "plain-char-001",
  name: "Plain Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("The Horned King - Triumphant Ghoul", () => {
  describe("GRAND MACHINATIONS - During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}", () => {
    it("should have base lore value when no cards have left any discard pile", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theHornedKingTriumphantGhoul],
          deck: 5,
        },
        { deck: 5 },
      );

      const hornedKing = testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul);
      expect(hornedKing.lore).toBe(theHornedKingTriumphantGhoul.lore);
    });

    it("should get +2 lore when a card leaves own discard pile this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theHornedKingTriumphantGhoul],
          discard: [plainCharacter],
          deck: 5,
        },
        { deck: 5 },
      );

      // Before any card leaves discard, base lore
      const hornedKingBefore = testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul);
      expect(hornedKingBefore.lore).toBe(theHornedKingTriumphantGhoul.lore);

      // Move plain character from discard to hand
      const plainCharId = testEngine.findCardInstanceId(plainCharacter, "discard", PLAYER_ONE);
      testEngine.asServer().manualMoveCard(plainCharId, `hand:${PLAYER_ONE}` as ZoneId);

      expect(testEngine.asPlayerOne().getCardZone(plainCharacter)).toBe("hand");

      // Horned King should now have +2 lore
      const hornedKingAfter = testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul);
      expect(hornedKingAfter.lore).toBe(theHornedKingTriumphantGhoul.lore + 2);
    });

    it("gets +2 lore when The Black Cauldron puts a character from discard under itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theHornedKingTriumphantGhoul, theBlackCauldron],
          discard: [plainCharacter],
          inkwell: 1,
          deck: 5,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul).lore).toBe(
        theHornedKingTriumphantGhoul.lore,
      );

      expect(
        testEngine.asPlayerOne().activateAbility(theBlackCauldron, {
          ability: "THE CAULDRON CALLS",
          targets: [plainCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul).lore).toBe(
        theHornedKingTriumphantGhoul.lore + 2,
      );
    });

    it("should get +2 lore when a card leaves opponent's discard pile this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theHornedKingTriumphantGhoul],
          deck: 5,
        },
        {
          discard: [plainCharacter],
          deck: 5,
        },
      );

      // Before any card leaves discard
      expect(testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul).lore).toBe(
        theHornedKingTriumphantGhoul.lore,
      );

      // Move opponent's card from discard to hand
      const opponentPlainCharId = testEngine.findCardInstanceId(
        plainCharacter,
        "discard",
        PLAYER_TWO,
      );
      testEngine.asServer().manualMoveCard(opponentPlainCharId, `hand:${PLAYER_TWO}` as ZoneId);

      // Horned King should now have +2 lore since ANY player's discard was affected
      const hornedKingAfter = testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul);
      expect(hornedKingAfter.lore).toBe(theHornedKingTriumphantGhoul.lore + 2);
    });

    it("should get +2 lore when multiple cards leave discard pile (not stacking)", () => {
      const secondPlain = createMockCharacter({
        id: "plain-char-002",
        name: "Second Plain Character",
        cost: 2,
        strength: 2,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theHornedKingTriumphantGhoul],
          discard: [plainCharacter, secondPlain],
          deck: 5,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul).lore).toBe(
        theHornedKingTriumphantGhoul.lore,
      );

      const plainId = testEngine.findCardInstanceId(plainCharacter, "discard", PLAYER_ONE);
      const secondId = testEngine.findCardInstanceId(secondPlain, "discard", PLAYER_ONE);
      testEngine.asServer().manualMoveCard(plainId, `hand:${PLAYER_ONE}` as ZoneId);
      testEngine.asServer().manualMoveCard(secondId, `hand:${PLAYER_ONE}` as ZoneId);

      // Bonus should still be just +2, not +4 (doesn't stack per card)
      const hornedKingAfter = testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul);
      expect(hornedKingAfter.lore).toBe(theHornedKingTriumphantGhoul.lore + 2);
    });

    it("should lose the +2 lore bonus when the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theHornedKingTriumphantGhoul],
          discard: [plainCharacter],
          deck: 5,
        },
        { deck: 5 },
      );

      const plainId = testEngine.findCardInstanceId(plainCharacter, "discard", PLAYER_ONE);
      testEngine.asServer().manualMoveCard(plainId, `hand:${PLAYER_ONE}` as ZoneId);

      // Should have bonus during the turn
      expect(testEngine.asPlayerOne().getCard(theHornedKingTriumphantGhoul).lore).toBe(
        theHornedKingTriumphantGhoul.lore + 2,
      );

      // Pass turn
      testEngine.asPlayerOne().passTurn();

      // Bonus should be gone after turn passes (metric resets)
      const hornedKingAfterPass = testEngine.asPlayerTwo().getCard(theHornedKingTriumphantGhoul);
      expect(hornedKingAfterPass.lore).toBe(theHornedKingTriumphantGhoul.lore);
    });

    it("should not get bonus during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theHornedKingTriumphantGhoul],
          deck: 5,
        },
        {
          discard: [plainCharacter],
          deck: 5,
        },
      );

      // Pass turn to opponent
      testEngine.asPlayerOne().passTurn();

      // Opponent moves a card from their discard to hand
      const opponentPlainCharId = testEngine.findCardInstanceId(
        plainCharacter,
        "discard",
        PLAYER_TWO,
      );
      testEngine.asServer().manualMoveCard(opponentPlainCharId, `hand:${PLAYER_TWO}` as ZoneId);

      // No bonus during opponent's turn (condition requires "during your turn")
      const hornedKing = testEngine.asPlayerTwo().getCard(theHornedKingTriumphantGhoul);
      expect(hornedKing.lore).toBe(theHornedKingTriumphantGhoul.lore);
    });
  });
});

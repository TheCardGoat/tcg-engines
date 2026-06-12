import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { trampDapperRascal } from "./022-tramp-dapper-rascal";

const allyCharacter = createMockCharacter({
  id: "tramp-dapper-rascal-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const strongOpponent = createMockCharacter({
  id: "tramp-dapper-rascal-test-strong-opponent",
  name: "Strong Opponent",
  cost: 4,
  strength: 5,
  willpower: 5,
});

describe("Tramp - Dapper Rascal", () => {
  describe("PLAY IT COOL - During an opponent's turn, whenever one of your characters is banished, you may draw a card.", () => {
    it("triggers during opponent's turn when one of your characters is banished, allowing you to draw a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [trampDapperRascal, { card: allyCharacter, exerted: true }],
          deck: 5,
        },
        {
          play: [strongOpponent],
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      const handSizeBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      // Opponent challenges the exerted ally (strong opponent kills ally)
      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, allyCharacter),
      ).toBeSuccessfulCommand();

      // Ally should be banished
      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("discard");

      // PLAY IT COOL should trigger (bag should have 1 item)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional draw
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(trampDapperRascal, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Player one should have drawn 1 card
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(
        handSizeBefore + 1,
      );
    });

    it("can be declined (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [trampDapperRascal, { card: allyCharacter, exerted: true }],
          deck: 5,
        },
        {
          play: [strongOpponent],
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();

      const handSizeBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, allyCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional draw
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(trampDapperRascal, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Hand size should be unchanged
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(
        handSizeBefore,
      );
    });

    it("does NOT trigger during your own turn when your character is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [trampDapperRascal, allyCharacter],
        deck: 5,
      });

      // On player one's own turn, set damage to banish ally
      expect(
        testEngine.asServer().manualSetDamage(allyCharacter, allyCharacter.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("discard");

      // PLAY IT COOL should NOT trigger on your own turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers for each character banished during opponent's turn", () => {
      const secondAlly = createMockCharacter({
        id: "tramp-dapper-rascal-test-second-ally",
        name: "Second Ally",
        cost: 2,
        strength: 1,
        willpower: 2,
      });

      const secondOpponent = createMockCharacter({
        id: "tramp-dapper-rascal-test-second-opponent",
        name: "Second Strong Opponent",
        cost: 4,
        strength: 5,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            trampDapperRascal,
            { card: allyCharacter, exerted: true },
            { card: secondAlly, exerted: true },
          ],
          deck: 5,
        },
        {
          play: [strongOpponent, secondOpponent],
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();

      // Opponent challenges first ally - triggers PLAY IT COOL
      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, allyCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      // Resolve the bag entry so player two gets priority back
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(trampDapperRascal, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Opponent challenges second ally - triggers PLAY IT COOL again
      expect(
        testEngine.asPlayerTwo().challenge(secondOpponent, secondAlly),
      ).toBeSuccessfulCommand();

      // Should have 1 bag item from the second banish
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });
  });
});

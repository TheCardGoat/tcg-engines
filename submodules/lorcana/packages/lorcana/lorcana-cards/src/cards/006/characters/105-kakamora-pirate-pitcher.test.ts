import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kakamoraPiratePitcher } from "./105-kakamora-pirate-pitcher";

const pirateCharacter = createMockCharacter({
  id: "kakamora-test-pirate",
  name: "Friendly Pirate",
  cost: 3,
  classifications: ["Storyborn", "Pirate"],
});

describe("Kakamora - Pirate Pitcher", () => {
  describe("DIZZYING SPEED - When you play this character, chosen Pirate character gains Evasive until the start of your next turn.", () => {
    it("grants Evasive to chosen Pirate character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: kakamoraPiratePitcher.cost,
          hand: [kakamoraPiratePitcher],
          play: [pirateCharacter],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().hasKeyword(pirateCharacter, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(kakamoraPiratePitcher)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kakamoraPiratePitcher, {
          resolveOptional: true,
          targets: [pirateCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(pirateCharacter, "Evasive")).toBe(true);
    });

    it("Evasive expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: kakamoraPiratePitcher.cost,
          hand: [kakamoraPiratePitcher],
          play: [pirateCharacter],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(kakamoraPiratePitcher)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kakamoraPiratePitcher, {
          resolveOptional: true,
          targets: [pirateCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(pirateCharacter, "Evasive")).toBe(true);

      // Player one passes turn — Evasive should still be active during opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(pirateCharacter, "Evasive")).toBe(true);

      // Opponent passes turn — Evasive expires at start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(pirateCharacter, "Evasive")).toBe(false);
    });

    it("is optional and can be declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: kakamoraPiratePitcher.cost,
          hand: [kakamoraPiratePitcher],
          play: [pirateCharacter],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(kakamoraPiratePitcher)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kakamoraPiratePitcher, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Evasive not granted since the effect was declined
      expect(testEngine.asPlayerOne().hasKeyword(pirateCharacter, "Evasive")).toBe(false);
    });
  });
});

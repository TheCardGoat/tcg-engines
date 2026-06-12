import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { isabelaMadrigalGoldenChild } from "./045-isabela-madrigal-golden-child";

const otherCharacter = createMockCharacter({
  id: "isabela-other-char",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Isabela Madrigal - Golden Child", () => {
  describe("LADIES FIRST - During your turn, if no other character has quested this turn, this character gets +3 {L}.", () => {
    it("gets +3 lore when no other character has quested this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [isabelaMadrigalGoldenChild, otherCharacter],
        deck: 2,
      });

      const isabela = testEngine.asPlayerOne().getCard(isabelaMadrigalGoldenChild);
      expect(isabela.lore).toBe(4);
    });

    it("does not get +3 lore when another character has quested this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [isabelaMadrigalGoldenChild, otherCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(otherCharacter)).toBeSuccessfulCommand();

      const isabela = testEngine.asPlayerOne().getCard(isabelaMadrigalGoldenChild);
      expect(isabela.lore).toBe(1);
    });
  });
});

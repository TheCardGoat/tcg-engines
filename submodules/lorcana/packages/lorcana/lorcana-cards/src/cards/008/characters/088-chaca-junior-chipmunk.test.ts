import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { chacaJuniorChipmunk } from "./088-chaca-junior-chipmunk";
import { tipoJuniorChipmunk } from "./089-tipo-junior-chipmunk";

const opposingCharacter = createMockCharacter({
  id: "chaca-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Chaca - Junior Chipmunk", () => {
  describe("IN CAHOOTS — When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn.", () => {
    it("gives the chosen opposing character Reckless during their next turn when Tipo is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tipoJuniorChipmunk],
          hand: [chacaJuniorChipmunk],
          inkwell: chacaJuniorChipmunk.cost,
          deck: 3,
        },
        {
          play: [opposingCharacter],
          deck: 3,
        },
      );

      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(chacaJuniorChipmunk)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0];
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(chacaJuniorChipmunk, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);

      expect(testEngine.asServer().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);

      expect(testEngine.asServer().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);
    });
  });
});

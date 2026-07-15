import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { madameMedusaTheBoss } from "./112-madame-medusa-the-boss";

const weakTarget = createMockCharacter({
  id: "mm-weak-target",
  name: "Weak Target",
  cost: 1,
  strength: 3,
  willpower: 2,
  lore: 1,
});

const strongTarget = createMockCharacter({
  id: "mm-strong-target",
  name: "Strong Target",
  cost: 1,
  strength: 4,
  willpower: 2,
  lore: 1,
});

describe("Madame Medusa - The Boss", () => {
  describe("THAT TERRIBLE WOMAN — When you play this character, banish chosen opposing character with 3 {S} or less.", () => {
    it("banishes chosen opposing character with strength 3 or less when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: madameMedusaTheBoss.cost,
          hand: [madameMedusaTheBoss],
        },
        {
          play: [weakTarget],
        },
      );

      expect(testEngine.asPlayerOne().playCard(madameMedusaTheBoss)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(madameMedusaTheBoss),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [weakTarget] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(weakTarget)).toBe("discard");
    });

    it("does not allow targeting opposing character with strength 4 or more", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: madameMedusaTheBoss.cost,
          hand: [madameMedusaTheBoss],
        },
        {
          play: [strongTarget],
        },
      );

      expect(testEngine.asPlayerOne().playCard(madameMedusaTheBoss)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(strongTarget)).toBe("play");
    });
  });
});

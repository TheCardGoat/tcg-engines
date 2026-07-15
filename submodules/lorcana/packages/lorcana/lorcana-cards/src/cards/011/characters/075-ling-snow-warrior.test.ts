import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lingSnowWarrior } from "./075-ling-snow-warrior";

const targetCharacter = createMockCharacter({
  id: "ling-test-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Ling - Snow Warrior", () => {
  describe("BUILDING MUSCLES 1 — {I} — Chosen character gets +1 {S} this turn", () => {
    it("chosen character gets +1 strength this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lingSnowWarrior, targetCharacter],
        inkwell: 1,
        deck: 5,
      });

      const initialStrength = testEngine.asPlayerOne().getCardStrength(targetCharacter);

      expect(
        testEngine.asPlayerOne().activateAbility(lingSnowWarrior, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(initialStrength + 1);
    });

    it("chosen character gets +3 strength when activated 3 times", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lingSnowWarrior, targetCharacter],
        inkwell: 3,
        deck: 5,
      });

      const initialStrength = testEngine.asPlayerOne().getCardStrength(targetCharacter);

      // Activate 3 times (1 ink each, no exert so can reuse)
      expect(
        testEngine.asPlayerOne().activateAbility(lingSnowWarrior, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().activateAbility(lingSnowWarrior, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().activateAbility(lingSnowWarrior, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(initialStrength + 3);
    });
  });
});

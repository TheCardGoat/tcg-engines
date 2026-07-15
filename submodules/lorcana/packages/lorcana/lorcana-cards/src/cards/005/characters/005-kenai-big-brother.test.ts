import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kenaiBigBrother } from "./005-kenai-big-brother";
import { kodaSmallishBear } from "../../007/characters/034-koda-smallish-bear";

const mockAttacker = createMockCharacter({
  id: "kenai-test-attacker",
  name: "Mock Attacker",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const notKoda = createMockCharacter({
  id: "kenai-test-not-koda",
  name: "Not Koda",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Kenai - Big Brother", () => {
  describe("BROTHERS FOREVER: While this character is exerted, your characters named Koda can't be challenged.", () => {
    it("Koda can't be challenged while Kenai is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mockAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: kenaiBigBrother, exerted: true },
            { card: kodaSmallishBear, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(mockAttacker, kodaSmallishBear);

      expect(result).not.toBeSuccessfulCommand();
    });

    it("other characters (not named Koda) can still be challenged while Kenai is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mockAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: kenaiBigBrother, exerted: true },
            { card: notKoda, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(mockAttacker, notKoda);

      expect(result).toBeSuccessfulCommand();
    });

    it("Koda can be challenged when Kenai is not exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mockAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: kenaiBigBrother, exerted: false },
            { card: kodaSmallishBear, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(mockAttacker, kodaSmallishBear);

      expect(result).toBeSuccessfulCommand();
    });
  });
});

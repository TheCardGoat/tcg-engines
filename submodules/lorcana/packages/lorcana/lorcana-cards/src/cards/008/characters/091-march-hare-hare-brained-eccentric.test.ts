import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { marchHareHarebrainedEccentric } from "./091-march-hare-hare-brained-eccentric";

const damagedCharacter = createMockCharacter({
  id: "march-hare-damaged-char",
  name: "Damaged Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("March Hare - Hare-Brained Eccentric", () => {
  describe("LIGHT THE CANDLES: When you play this character, you may deal 2 damage to chosen damaged character.", () => {
    it("deals 2 damage to chosen damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: marchHareHarebrainedEccentric.cost,
          hand: [marchHareHarebrainedEccentric],
          deck: 2,
        },
        {
          play: [damagedCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asServer().manualSetDamage(damagedCharacter, 1)).toBeSuccessfulCommand();
      expect(testEngine.asServer().getDamage(damagedCharacter)).toBe(1);

      expect(
        testEngine.asPlayerOne().playCard(marchHareHarebrainedEccentric),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(marchHareHarebrainedEccentric, {
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getDamage(damagedCharacter)).toBe(3);
    });
  });
});

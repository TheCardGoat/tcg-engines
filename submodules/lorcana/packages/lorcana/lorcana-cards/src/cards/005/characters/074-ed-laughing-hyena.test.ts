import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { edLaughingHyena } from "./074-ed-laughing-hyena";

const damagedCharacter = createMockCharacter({
  id: "ed-test-damaged",
  name: "Damaged Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const undamagedCharacter = createMockCharacter({
  id: "ed-test-undamaged",
  name: "Undamaged Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Ed - Laughing Hyena", () => {
  describe("CAUSE A PANIC - When you play this character, you may deal 2 damage to chosen damaged character.", () => {
    it("deals 2 damage to a chosen damaged character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [edLaughingHyena],
          inkwell: edLaughingHyena.cost,
          play: [damagedCharacter],
          deck: 5,
        },
        {
          play: [],
        },
      );

      testEngine.asServer().manualSetDamage(damagedCharacter, 1);

      expect(testEngine.asPlayerOne().playCard(edLaughingHyena)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(edLaughingHyena),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(3);
    });

    it("can target an opposing damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [edLaughingHyena],
          inkwell: edLaughingHyena.cost,
          deck: 5,
        },
        {
          play: [damagedCharacter],
        },
      );

      testEngine.asServer().manualSetDamage(damagedCharacter, 1);

      expect(testEngine.asPlayerOne().playCard(edLaughingHyena)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(edLaughingHyena),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(damagedCharacter)).toBe(3);
    });
  });
});

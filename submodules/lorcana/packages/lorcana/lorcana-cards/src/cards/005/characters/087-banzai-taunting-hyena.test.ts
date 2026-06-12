import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { banzaiTauntingHyena } from "./087-banzai-taunting-hyena";

const damagedCharacter = createMockCharacter({
  id: "banzai-test-damaged",
  name: "Damaged Character",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const undamagedCharacter = createMockCharacter({
  id: "banzai-test-undamaged",
  name: "Undamaged Character",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

describe("Banzai - Taunting Hyena", () => {
  describe("HERE KITTY, KITTY, KITTY - When you play this character, you may exert chosen damaged character.", () => {
    it("exerts a chosen damaged character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [banzaiTauntingHyena],
          inkwell: banzaiTauntingHyena.cost,
          play: [damagedCharacter],
          deck: 5,
        },
        {
          play: [],
        },
      );

      testEngine.asServer().manualSetDamage(damagedCharacter, 2);

      expect(testEngine.asPlayerOne().playCard(banzaiTauntingHyena)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(banzaiTauntingHyena),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(damagedCharacter)).toBe(true);
    });

    it("can target an opposing damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [banzaiTauntingHyena],
          inkwell: banzaiTauntingHyena.cost,
          deck: 5,
        },
        {
          play: [damagedCharacter],
        },
      );

      testEngine.asServer().manualSetDamage(damagedCharacter, 2);

      expect(testEngine.asPlayerOne().playCard(banzaiTauntingHyena)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(banzaiTauntingHyena),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(damagedCharacter)).toBe(true);
    });

    it("cannot target an undamaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [banzaiTauntingHyena],
          inkwell: banzaiTauntingHyena.cost,
          deck: 5,
        },
        {
          play: [undamagedCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(banzaiTauntingHyena)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.isExerted(undamagedCharacter)).toBe(false);
    });
  });
});

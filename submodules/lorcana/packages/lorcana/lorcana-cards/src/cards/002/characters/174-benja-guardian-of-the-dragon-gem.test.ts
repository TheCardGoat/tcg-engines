import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { benjaGuardianOfTheDragonGem } from "./174-benja-guardian-of-the-dragon-gem";

const targetItem = createMockItem({
  id: "benja-target-item",
  name: "Target Item",
  cost: 1,
});

describe("Benja - Guardian of the Dragon Gem", () => {
  describe("WE HAVE A CHOICE - When you play this character, you may banish chosen item.", () => {
    it("banishes chosen item when played and accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [benjaGuardianOfTheDragonGem],
        inkwell: benjaGuardianOfTheDragonGem.cost,
        play: [targetItem],
      });

      expect(
        testEngine.asPlayerOne().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(benjaGuardianOfTheDragonGem, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetItem] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetItem)).toBe("discard");
    });

    it("does not banish when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [benjaGuardianOfTheDragonGem],
        inkwell: benjaGuardianOfTheDragonGem.cost,
        play: [targetItem],
      });

      expect(
        testEngine.asPlayerOne().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(benjaGuardianOfTheDragonGem, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetItem)).toBe("play");
    });

    it("plays successfully even with no items in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [benjaGuardianOfTheDragonGem],
        inkwell: benjaGuardianOfTheDragonGem.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(benjaGuardianOfTheDragonGem)).toBe("play");
    });
  });
});

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { benjaGuardianOfTheDragonGem } from "./180-benja-guardian-of-the-dragon-gem";
import { fortisphere } from "../../004/items/200-fortisphere";

const targetItem = createMockItem({
  id: "benja-target-item",
  name: "Target Item",
  cost: 1,
});

describe("Benja - Guardian of the Dragon Gem (set 9)", () => {
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

    it("regression: can banish Fortisphere specifically", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [benjaGuardianOfTheDragonGem],
          inkwell: benjaGuardianOfTheDragonGem.cost,
          deck: 1,
        },
        {
          play: [fortisphere],
        },
      );

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
        testEngine.asPlayerOne().resolveNextPending({ targets: [fortisphere] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(fortisphere)).toBe("discard");
    });
  });
});

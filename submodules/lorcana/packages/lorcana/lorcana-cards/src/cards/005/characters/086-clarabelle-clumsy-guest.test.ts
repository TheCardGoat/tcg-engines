import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { clarabelleClumsyGuest } from "./086-clarabelle-clumsy-guest";

const chosenItem = createMockItem({
  id: "clarabelle-chosen-item",
  name: "Chosen Item",
  cost: 2,
});

describe("Clarabelle - Clumsy Guest", () => {
  describe("BUTTERFINGERS - When you play this character, you may pay 2 {I} to banish chosen item.", () => {
    it("banishes a chosen item when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleClumsyGuest],
          inkwell: clarabelleClumsyGuest.cost + 2,
          deck: 2,
        },
        {
          play: [chosenItem],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(clarabelleClumsyGuest)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(clarabelleClumsyGuest, {
          targets: [chosenItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(chosenItem)).toBe("discard");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleClumsyGuest],
          inkwell: clarabelleClumsyGuest.cost + 2,
          deck: 2,
        },
        {
          play: [chosenItem],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(clarabelleClumsyGuest)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(clarabelleClumsyGuest, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(chosenItem)).toBe("play");
    });

    it("does not leave a pending optional prompt when the 2 ink cost cannot be paid", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleClumsyGuest],
          inkwell: clarabelleClumsyGuest.cost,
          deck: 2,
        },
        {
          play: [chosenItem],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(clarabelleClumsyGuest)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toEqual([]);
      expect(testEngine.asPlayerTwo().getCardZone(chosenItem)).toBe("play");
    });
  });
});

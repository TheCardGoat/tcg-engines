import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { puaProtectivePig } from "./019-pua-protective-pig";
import { dragonFire } from "../../001/actions/130-dragon-fire";

describe("Pua - Protective Pig", () => {
  describe("Bodyguard", () => {
    it("has Bodyguard keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [puaProtectivePig],
      });

      const cardUnderTest = testEngine.getCardModel(puaProtectivePig);
      expect(cardUnderTest.hasBodyguard()).toBe(true);
    });
  });

  describe("FREE FRUIT - When this character is banished, you may draw a card.", () => {
    it("draws a card when banished during your turn and optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [puaProtectivePig],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 10,
      });

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [puaProtectivePig] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(puaProtectivePig)).toBe("discard");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(puaProtectivePig, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        deck: 9,
        hand: 1,
      });
    });

    it("does not draw a card when optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [puaProtectivePig],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 10,
      });

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [puaProtectivePig] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(puaProtectivePig, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        deck: 10,
        hand: 0,
      });
    });

    it("triggers during opponent's turn when banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [puaProtectivePig],
          deck: 10,
        },
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [puaProtectivePig] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(puaProtectivePig)).toBe("discard");

      // FREE FRUIT triggers regardless of whose turn it is
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(puaProtectivePig, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        deck: 9,
        hand: 1,
      });
    });
  });
});

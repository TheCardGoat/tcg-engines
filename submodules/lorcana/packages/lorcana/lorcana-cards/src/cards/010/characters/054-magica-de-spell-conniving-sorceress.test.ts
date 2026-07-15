import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { magicaDeSpellConnivingSorceress } from "./054-magica-de-spell-conniving-sorceress";
import { magicaDeSpellShadowyAndSinister } from "./041-magica-de-spell-shadowy-and-sinister";

describe("Magica De Spell - Conniving Sorceress", () => {
  it("should have Shift 7 keyword ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [magicaDeSpellConnivingSorceress],
    });

    expect(testEngine.hasKeyword(magicaDeSpellConnivingSorceress, "Shift")).toBe(true);
  });

  describe("SHADOW'S GRASP - When you play this character, if you used Shift to play her, you may draw 4 cards.", () => {
    it("draws 4 cards when played via Shift and ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 7,
        hand: [magicaDeSpellConnivingSorceress],
        play: [magicaDeSpellShadowyAndSinister],
        deck: 10,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        magicaDeSpellShadowyAndSinister,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(magicaDeSpellConnivingSorceress, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicaDeSpellConnivingSorceress, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 4,
        deck: 6,
      });
    });

    it("is optional - can decline to draw 4 cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 7,
        hand: [magicaDeSpellConnivingSorceress],
        play: [magicaDeSpellShadowyAndSinister],
        deck: 10,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        magicaDeSpellShadowyAndSinister,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(magicaDeSpellConnivingSorceress, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicaDeSpellConnivingSorceress, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 0,
        deck: 10,
      });
    });

    it("does not trigger when played normally without Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: magicaDeSpellConnivingSorceress.cost,
        hand: [magicaDeSpellConnivingSorceress],
        deck: 10,
      });

      expect(
        testEngine.asPlayerOne().playCard(magicaDeSpellConnivingSorceress),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 0,
        deck: 10,
      });
    });
  });
});

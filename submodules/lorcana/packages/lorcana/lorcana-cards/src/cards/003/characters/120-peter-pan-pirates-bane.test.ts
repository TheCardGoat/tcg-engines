import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { peterPanPiratesBane } from "./120-peter-pan-pirates-bane";

const pirateCharacter = createMockCharacter({
  id: "ppb-test-pirate",
  name: "Pirate Character",
  cost: 3,
  strength: 3,
  willpower: 8,
  lore: 1,
  classifications: ["Pirate"],
});

const nonPirateCharacter = createMockCharacter({
  id: "ppb-test-non-pirate",
  name: "Non-Pirate Character",
  cost: 3,
  strength: 3,
  willpower: 8,
  lore: 1,
});

describe("Peter Pan - Pirate's Bane", () => {
  describe("Shift 4", () => {
    it("has Shift keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [peterPanPiratesBane],
      });

      const cardUnderTest = testEngine.getCardModel(peterPanPiratesBane);
      expect(cardUnderTest.hasShift()).toBe(true);
    });
  });

  describe("Evasive", () => {
    it("has Evasive keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [peterPanPiratesBane],
      });

      const cardUnderTest = testEngine.getCardModel(peterPanPiratesBane);
      expect(cardUnderTest.hasEvasive).toBe(true);
    });
  });

  describe("YOU'RE NEXT! - Whenever he challenges a Pirate character, this character takes no damage from the challenge.", () => {
    it("takes no damage when challenging a Pirate character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: peterPanPiratesBane, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: pirateCharacter, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(peterPanPiratesBane, pirateCharacter),
      ).toBeSuccessfulCommand();

      // Peter Pan should take no damage from challenging a Pirate
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: peterPanPiratesBane,
        value: 0,
      });

      // The Pirate should still take damage from Peter Pan
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: pirateCharacter,
        value: peterPanPiratesBane.strength,
      });
    });

    it("takes normal damage when challenging a non-Pirate character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: peterPanPiratesBane, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: nonPirateCharacter, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(peterPanPiratesBane, nonPirateCharacter),
      ).toBeSuccessfulCommand();

      // Peter Pan should take normal damage from challenging a non-Pirate
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: peterPanPiratesBane,
        value: nonPirateCharacter.strength,
      });
    });
  });
});

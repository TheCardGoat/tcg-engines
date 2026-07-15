import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { munchingsAndCrunchings } from "./033-munchings-and-crunchings";
import { gurgiAppleLover } from "../../../cards/010/characters/010-gurgi-apple-lover";

const woundedOpponent = createMockCharacter({
  id: "munchings-wounded-opponent",
  name: "Wounded Opponent",
  cost: 3,
  strength: 3,
  willpower: 5,
});

const nonGurgiCharacter = createMockCharacter({
  id: "munchings-non-gurgi",
  name: "Not Gurgi",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Munchings and Crunchings", () => {
  describe("WHAT A JUICY APPLE - {E} - Remove up to 2 damage from chosen character", () => {
    it("removes up to 2 damage from a chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [munchingsAndCrunchings],
        },
        {
          play: [woundedOpponent],
        },
      );

      expect(testEngine.asServer().manualSetDamage(woundedOpponent, 3)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().activateAbility(munchingsAndCrunchings, {
          targets: [woundedOpponent],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(munchingsAndCrunchings)).toBe(true);
      expect(testEngine.asPlayerTwo().getDamage(woundedOpponent)).toBe(1);
    });
  });

  describe("COME ON OUT - You pay 1 {I} less to play characters named Gurgi", () => {
    it("reduces Gurgi's cost by 1 when Munchings and Crunchings is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [munchingsAndCrunchings],
        hand: [gurgiAppleLover],
        inkwell: gurgiAppleLover.cost - 1, // 1 ink (Gurgi normally costs 2)
        deck: 2,
      });

      // With Munchings and Crunchings in play, Gurgi should cost 1 ink
      expect(testEngine.asPlayerOne().playCard(gurgiAppleLover)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(gurgiAppleLover)).toBe("play");
    });

    it("does not reduce cost of non-Gurgi characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [munchingsAndCrunchings],
        hand: [nonGurgiCharacter],
        inkwell: nonGurgiCharacter.cost - 1, // 1 ink (Not Gurgi costs 2)
        deck: 2,
      });

      // Non-Gurgi characters should not get a cost reduction
      expect(testEngine.asPlayerOne().playCard(nonGurgiCharacter).success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(nonGurgiCharacter)).toBe("hand");
    });

    it("Gurgi costs normal amount without Munchings and Crunchings in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gurgiAppleLover],
        inkwell: gurgiAppleLover.cost - 1, // 1 ink (insufficient without discount)
        deck: 2,
      });

      // Without Munchings and Crunchings, Gurgi costs full 2 ink
      expect(testEngine.asPlayerOne().playCard(gurgiAppleLover).success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(gurgiAppleLover)).toBe("hand");
    });
  });
});

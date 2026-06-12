import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { littleJohnRobinsPal } from "./179-little-john-robins-pal";
import { createMockCharacter } from "@tcg/lorcana-engine/testing";

const nonBodyguardCharacter = createMockCharacter({
  id: "little-john-robins-pal-non-bodyguard",
  name: "Non Bodyguard",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const evasiveDefender = createMockCharacter({
  id: "little-john-robins-pal-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "little-john-robins-pal-evasive-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const attacker = createMockCharacter({
  id: "little-john-robins-pal-attacker",
  name: "Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Little John - Robin's Pal", () => {
  describe("Bodyguard", () => {
    it("has Bodyguard ability", () => {
      const testEngine = new LorcanaTestEngine({
        play: [littleJohnRobinsPal],
      });

      expect(testEngine.getCardModel(littleJohnRobinsPal).hasBodyguard()).toBe(true);
    });

    it("can be played ready (standard)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [littleJohnRobinsPal],
        inkwell: littleJohnRobinsPal.cost,
      });

      expect(testEngine.asPlayerOne().playCard(littleJohnRobinsPal)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(littleJohnRobinsPal)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(littleJohnRobinsPal)).toBe(false);
    });

    it("can enter play exerted (optional Bodyguard)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [littleJohnRobinsPal],
        inkwell: littleJohnRobinsPal.cost,
      });

      expect(
        testEngine.asPlayerOne().playCardOptional(littleJohnRobinsPal, true),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(littleJohnRobinsPal)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(littleJohnRobinsPal)).toBe(true);
    });

    it("opponent must challenge Bodyguard first if able", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: littleJohnRobinsPal, exerted: true },
            { card: nonBodyguardCharacter, exerted: true },
          ],
        },
        {
          play: [{ card: attacker, exerted: false }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const failResult = testEngine.asPlayerTwo().challenge(attacker, nonBodyguardCharacter);
      expect(failResult.success).toBe(false);

      expect(
        testEngine.asPlayerTwo().challenge(attacker, littleJohnRobinsPal),
      ).toBeSuccessfulCommand();
    });
  });

  describe("DISGUISED — During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [littleJohnRobinsPal],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: littleJohnRobinsPal,
        keyword: "Evasive",
      });
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [littleJohnRobinsPal],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: littleJohnRobinsPal,
        keyword: "Evasive",
      });
    });

    it("can challenge Evasive characters during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: littleJohnRobinsPal, exerted: false }],
          deck: 1,
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(littleJohnRobinsPal, evasiveDefender),
      ).toBeSuccessfulCommand();
    });
  });
});

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { frozoneSuperCool } from "./059-frozone-super-cool";

const superAlly = createMockCharacter({
  id: "frozone-super-ally",
  name: "Super Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Super"],
});

const nonSuperAlly = createMockCharacter({
  id: "frozone-non-super-ally",
  name: "Non-Super Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const opposingCharacter = createMockCharacter({
  id: "frozone-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Frozone - Super Cool", () => {
  describe("JUST CHILL - When you play this character, if you have another Super character in play, you may exert chosen opposing character.", () => {
    it("exerts chosen opposing character when another Super is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [frozoneSuperCool],
          play: [superAlly],
          inkwell: frozoneSuperCool.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.isExerted(opposingCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().playCard(frozoneSuperCool)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(frozoneSuperCool, {
          resolveOptional: true,
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opposingCharacter)).toBe(true);
    });

    it("does not trigger when no other Super character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [frozoneSuperCool],
          play: [nonSuperAlly],
          inkwell: frozoneSuperCool.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(frozoneSuperCool)).toBeSuccessfulCommand();

      // Condition fails at resolution; if queued, it resolves without effect.
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(frozoneSuperCool),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.isExerted(opposingCharacter)).toBe(false);
    });

    it("can decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [frozoneSuperCool],
          play: [superAlly],
          inkwell: frozoneSuperCool.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(frozoneSuperCool)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(frozoneSuperCool, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opposingCharacter)).toBe(false);
    });
  });
});

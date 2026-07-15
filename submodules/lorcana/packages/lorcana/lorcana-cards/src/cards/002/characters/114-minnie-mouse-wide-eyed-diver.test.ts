import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseWideeyedDiver } from "./114-minnie-mouse-wide-eyed-diver";

const actionOne = createMockAction({
  id: "minnie-wed-action-1",
  name: "Action One",
  cost: 1,
});

const actionTwo = createMockAction({
  id: "minnie-wed-action-2",
  name: "Action Two",
  cost: 1,
});

const actionThree = createMockAction({
  id: "minnie-wed-action-3",
  name: "Action Three",
  cost: 1,
});

describe("Minnie Mouse - Wide-Eyed Diver", () => {
  it("has Shift keyword", () => {
    const abilities = minnieMouseWideeyedDiver.abilities ?? [];
    const shiftAbility = abilities.find((a) => a.type === "keyword" && a.keyword === "Shift");
    expect(shiftAbility).toBeDefined();
  });

  it("has Evasive keyword", () => {
    const abilities = minnieMouseWideeyedDiver.abilities ?? [];
    const evasiveAbility = abilities.find((a) => a.type === "keyword" && a.keyword === "Evasive");
    expect(evasiveAbility).toBeDefined();
  });

  describe("UNDERSEA ADVENTURE - Whenever you play a second action in a turn, this character gets +2 lore this turn", () => {
    it("does not gain lore when you play the first action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [actionOne],
        play: [minnieMouseWideeyedDiver],
        inkwell: 1,
      });

      const loreBefore = testEngine.asPlayerOne().getCardLore(minnieMouseWideeyedDiver);
      expect(testEngine.asPlayerOne().playCard(actionOne)).toBeSuccessfulCommand();
      const loreAfter = testEngine.asPlayerOne().getCardLore(minnieMouseWideeyedDiver);

      expect(loreAfter).toBe(loreBefore);
    });

    it("gains +2 lore when you play the second action in a turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [actionOne, actionTwo],
        play: [minnieMouseWideeyedDiver],
        inkwell: 2,
      });

      expect(testEngine.asPlayerOne().playCard(actionOne)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(minnieMouseWideeyedDiver)).toBe(
        minnieMouseWideeyedDiver.lore,
      );

      expect(testEngine.asPlayerOne().playCard(actionTwo)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(minnieMouseWideeyedDiver)).toBe(
        minnieMouseWideeyedDiver.lore + 2,
      );
    });

    it("does not gain additional lore when you play a third action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [actionOne, actionTwo, actionThree],
        play: [minnieMouseWideeyedDiver],
        inkwell: 3,
      });

      expect(testEngine.asPlayerOne().playCard(actionOne)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(actionTwo)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(minnieMouseWideeyedDiver)).toBe(
        minnieMouseWideeyedDiver.lore + 2,
      );

      expect(testEngine.asPlayerOne().playCard(actionThree)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(minnieMouseWideeyedDiver)).toBe(
        minnieMouseWideeyedDiver.lore + 2,
      );
    });
  });
});

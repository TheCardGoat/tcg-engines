import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { painUnderworldImp } from "./086-pain-underworld-imp";

const strengthBuff = createMockCharacter({
  id: "pain-str-buff",
  name: "Strength Buffer",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  abilities: [
    {
      id: "pain-str-buff-1",
      type: "static",
      text: "Other characters you control get +5 strength.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 5,
        target: {
          selector: "all",
          count: "all",
          zones: ["play"],
          owner: "you",
          excludeSelf: true,
        },
      },
    },
  ],
});

const smallStrengthBuff = createMockCharacter({
  id: "pain-small-str-buff",
  name: "Small Buffer",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  abilities: [
    {
      id: "pain-small-str-buff-1",
      type: "static",
      text: "Other characters you control get +3 strength.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: {
          selector: "all",
          count: "all",
          zones: ["play"],
          owner: "you",
          excludeSelf: true,
        },
      },
    },
  ],
});

describe("Pain - Underworld Imp", () => {
  describe("COMING, YOUR MOST LUGUBRIOUSNESS - While this character has 5 {S} or more, he gets +2 {L}.", () => {
    it("does not get +2 lore when strength is below 5 (base strength is 1)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [painUnderworldImp],
      });

      expect(testEngine.asPlayerOne().getCardStrength(painUnderworldImp)).toBe(1);
      expect(testEngine.asPlayerOne().getCardLore(painUnderworldImp)).toBe(1);
    });

    it("does not get +2 lore when strength is below 5 (buffed to 4)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [painUnderworldImp, smallStrengthBuff],
      });

      // base 1 + 3 buff = 4 strength, below threshold of 5
      expect(testEngine.asPlayerOne().getCardStrength(painUnderworldImp)).toBe(4);
      expect(testEngine.asPlayerOne().getCardLore(painUnderworldImp)).toBe(1);
    });

    it("gets +2 lore when strength reaches 5 or more", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [painUnderworldImp, strengthBuff],
      });

      // base 1 + 5 buff = 6 strength >= 5, condition passes => lore = 1 + 2 = 3
      expect(testEngine.asPlayerOne().getCardStrength(painUnderworldImp)).toBe(6);
      expect(testEngine.asPlayerOne().getCardLore(painUnderworldImp)).toBe(3);
    });
  });
});

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aliceGrowingGirl } from "./160-alice-growing-girl";

const ally = createMockCharacter({
  id: "alice-test-ally",
  name: "Ally",
  cost: 1,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const ally2 = createMockCharacter({
  id: "alice-test-ally2",
  name: "Ally Two",
  cost: 1,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Alice - Growing Girl (Set 9)", () => {
  describe("GOOD ADVICE — Your other characters gain Support.", () => {
    it("other characters gain Support while Alice is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aliceGrowingGirl, ally, ally2],
      });

      expect(testEngine.hasKeyword(ally, "Support")).toBe(true);
      expect(testEngine.hasKeyword(ally2, "Support")).toBe(true);
    });

    it("Alice herself does NOT have Support", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aliceGrowingGirl, ally],
      });

      expect(testEngine.hasKeyword(aliceGrowingGirl, "Support")).toBe(false);
    });
  });

  describe("WHAT DID I DO? — While this character has 10 {S} or more, she gets +4 {L}.", () => {
    it("does not get +4 lore when strength is below 10", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aliceGrowingGirl],
      });

      // Alice base strength is 1, far below 10
      expect(testEngine.asPlayerOne().getCardLore(aliceGrowingGirl)).toBe(1);
    });

    it("gets +4 lore when strength reaches 10 or more via static buffs", () => {
      const massiveStrengthBuff = createMockCharacter({
        id: "alice-str-buff-s9",
        name: "Strength Buffer",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
        abilities: [
          {
            id: "alice-str-buff-s9-1",
            type: "static",
            text: "Other characters you control get +10 strength.",
            effect: {
              type: "modify-stat",
              stat: "strength",
              modifier: 10,
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

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aliceGrowingGirl, massiveStrengthBuff],
      });

      // Alice base strength 1 + 10 buff = 11 >= 10 => condition passes => lore = 1+4 = 5
      expect(testEngine.asPlayerOne().getCardStrength(aliceGrowingGirl)).toBe(11);
      expect(testEngine.asPlayerOne().getCardLore(aliceGrowingGirl)).toBe(5);
    });

    it("regression: uses effective (modified) strength, not printed strength, when checking 10+ threshold", () => {
      // If a modifier brings Alice to 10+ strength, she should get +4 lore
      // even though her printed strength is only 1
      const smallStrengthBuff = createMockCharacter({
        id: "alice-small-str-buff-s9",
        name: "Small Buffer",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
        abilities: [
          {
            id: "alice-small-str-buff-s9-1",
            type: "static",
            text: "Other characters get +9 strength.",
            effect: {
              type: "modify-stat",
              stat: "strength",
              modifier: 9,
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

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aliceGrowingGirl, smallStrengthBuff],
      });

      // Alice base strength 1 + 9 buff = 10 >= 10 => condition passes => lore = 1+4 = 5
      expect(testEngine.asPlayerOne().getCardStrength(aliceGrowingGirl)).toBe(10);
      expect(testEngine.asPlayerOne().getCardLore(aliceGrowingGirl)).toBe(5);
    });
  });
});

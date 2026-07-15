import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { alienTrueBelieverEnchanted } from "./229-alien-true-believer-enchanted";

const toyAlly1 = createMockCharacter({
  id: "alien-enchanted-toy-ally-1",
  name: "Toy Ally 1",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const toyAlly2 = createMockCharacter({
  id: "alien-enchanted-toy-ally-2",
  name: "Toy Ally 2",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Toy"],
});

describe("Alien - True Believer (Enchanted)", () => {
  describe("WE ARE ONE - This character gets +1 {S} for each other Toy character you have in play.", () => {
    it("has base strength with no other Toy characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [alienTrueBelieverEnchanted],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardStrength(alienTrueBelieverEnchanted)).toBe(
        alienTrueBelieverEnchanted.strength,
      );
    });

    it("gets +1 strength per other Toy character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [alienTrueBelieverEnchanted, toyAlly1, toyAlly2],
        deck: 3,
      });

      // 2 other Toy characters → +2 strength
      expect(testEngine.asPlayerOne().getCardStrength(alienTrueBelieverEnchanted)).toBe(
        alienTrueBelieverEnchanted.strength + 2,
      );
    });
  });

  describe("HE HAS BEEN CHOSEN - During your turn, when banished, return another Alien from discard to hand.", () => {
    it("has both abilities defined", () => {
      expect(alienTrueBelieverEnchanted.abilities).toHaveLength(2);
      expect(alienTrueBelieverEnchanted.abilities![0]).toMatchObject({
        name: "WE ARE ONE",
        type: "static",
      });
      expect(alienTrueBelieverEnchanted.abilities![1]).toMatchObject({
        name: "HE HAS BEEN CHOSEN",
        type: "triggered",
      });
    });
  });
});

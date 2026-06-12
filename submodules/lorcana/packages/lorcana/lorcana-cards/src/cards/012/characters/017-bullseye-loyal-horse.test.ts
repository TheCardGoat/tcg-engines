import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bullseyeLoyalHorse } from "./017-bullseye-loyal-horse";

const woody = createMockCharacter({
  id: "bullseye-test-woody",
  name: "Woody",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const jessie = createMockCharacter({
  id: "bullseye-test-jessie",
  name: "Jessie",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const unrelatedCharacter = createMockCharacter({
  id: "bullseye-test-other",
  name: "Buzz Lightyear",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Bullseye - Loyal Horse", () => {
  describe("LET'S RIDE - If you have a character named Woody or Jessie in play, you pay 1 {I} less to play this character.", () => {
    it("costs 1 less when Woody is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: bullseyeLoyalHorse.cost - 1, // Only reduced cost
        play: [woody],
        hand: [bullseyeLoyalHorse],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(bullseyeLoyalHorse)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(bullseyeLoyalHorse)).toBe("play");
    });

    it("costs 1 less when Jessie is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: bullseyeLoyalHorse.cost - 1, // Only reduced cost
        play: [jessie],
        hand: [bullseyeLoyalHorse],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(bullseyeLoyalHorse)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(bullseyeLoyalHorse)).toBe("play");
    });

    it("costs full price when neither Woody nor Jessie is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: bullseyeLoyalHorse.cost - 1, // Only reduced cost - not enough without discount
        play: [unrelatedCharacter],
        hand: [bullseyeLoyalHorse],
        deck: 5,
      });

      const result = testEngine.asPlayerOne().playCard(bullseyeLoyalHorse);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(bullseyeLoyalHorse)).toBe("hand");
    });

    it("can be played at full cost without Woody or Jessie", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: bullseyeLoyalHorse.cost, // Full cost
        hand: [bullseyeLoyalHorse],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(bullseyeLoyalHorse)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(bullseyeLoyalHorse)).toBe("play");
    });
  });
});

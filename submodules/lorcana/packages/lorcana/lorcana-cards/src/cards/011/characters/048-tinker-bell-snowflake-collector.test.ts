import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tinkerBellSnowflakeCollector } from "./048-tinker-bell-snowflake-collector";

const handFiller = createMockCharacter({
  id: "snowflake-collector-hand-filler",
  name: "Hand Filler",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Tinker Bell - Snowflake Collector", () => {
  it("has correct base stats", () => {
    expect(tinkerBellSnowflakeCollector).toMatchObject({
      cardType: "character",
      name: "Tinker Bell",
      version: "Snowflake Collector",
      cost: 3,
      strength: 3,
      willpower: 3,
      lore: 1,
      inkable: true,
      inkType: ["amethyst"],
    });
  });

  describe("FLURRY OF DELIGHT — While you have 4 or more cards in your hand, this character gains Evasive.", () => {
    it("does NOT have Evasive when fewer than 4 cards are in hand", () => {
      // 3 hand fillers = 3 cards in hand (below threshold)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellSnowflakeCollector],
        hand: [handFiller, handFiller, handFiller],
        deck: 2,
      });

      expect(testEngine.hasKeyword(tinkerBellSnowflakeCollector, "Evasive")).toBe(false);
    });

    it("gains Evasive when you have exactly 4 cards in hand", () => {
      // 4 hand fillers = 4 cards in hand (at threshold)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellSnowflakeCollector],
        hand: [handFiller, handFiller, handFiller, handFiller],
        deck: 2,
      });

      expect(testEngine.hasKeyword(tinkerBellSnowflakeCollector, "Evasive")).toBe(true);
    });

    it("gains Evasive when you have more than 4 cards in hand", () => {
      // 6 hand fillers = 6 cards in hand (above threshold)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellSnowflakeCollector],
        hand: [handFiller, handFiller, handFiller, handFiller, handFiller, handFiller],
        deck: 2,
      });

      expect(testEngine.hasKeyword(tinkerBellSnowflakeCollector, "Evasive")).toBe(true);
    });
  });

  describe("SPECTACULAR FIND — While you have 7 or more cards in your hand, this character gets +3 lore.", () => {
    it("has base lore of 1 when fewer than 7 cards are in hand", () => {
      // 4 hand fillers = 4 cards in hand (below 7 threshold)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellSnowflakeCollector],
        hand: [handFiller, handFiller, handFiller, handFiller],
        deck: 2,
      });

      const card = testEngine.asPlayerOne().getCard(tinkerBellSnowflakeCollector);
      expect(card.lore).toBe(1);
    });

    it("gets +3 lore when you have exactly 7 cards in hand", () => {
      // 7 hand fillers = 7 cards in hand (at threshold)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellSnowflakeCollector],
        hand: [handFiller, handFiller, handFiller, handFiller, handFiller, handFiller, handFiller],
        deck: 2,
      });

      const card = testEngine.asPlayerOne().getCard(tinkerBellSnowflakeCollector);
      expect(card.lore).toBe(4);
    });

    it("gets +3 lore when you have more than 7 cards in hand", () => {
      // 8 hand fillers = 8 cards in hand (above threshold)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellSnowflakeCollector],
        hand: [
          handFiller,
          handFiller,
          handFiller,
          handFiller,
          handFiller,
          handFiller,
          handFiller,
          handFiller,
        ],
        deck: 2,
      });

      const card = testEngine.asPlayerOne().getCard(tinkerBellSnowflakeCollector);
      expect(card.lore).toBe(4);
    });

    it("has both Evasive and +3 lore when you have 7 or more cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellSnowflakeCollector],
        hand: [handFiller, handFiller, handFiller, handFiller, handFiller, handFiller, handFiller],
        deck: 2,
      });

      expect(testEngine.hasKeyword(tinkerBellSnowflakeCollector, "Evasive")).toBe(true);
      const card = testEngine.asPlayerOne().getCard(tinkerBellSnowflakeCollector);
      expect(card.lore).toBe(4);
    });
  });
});

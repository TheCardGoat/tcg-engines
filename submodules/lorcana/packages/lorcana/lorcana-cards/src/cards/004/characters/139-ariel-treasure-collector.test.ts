import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielTreasureCollector } from "./139-ariel-treasure-collector";
import { fortisphere } from "../items/200-fortisphere";
import { miracleCandle } from "../items/031-miracle-candle";

describe("Ariel - Treasure Collector", () => {
  describe("THE GIRL WHO HAS EVERYTHING - While you have more items in play than each opponent, this character gets +2 lore", () => {
    it("should get +2 lore when you have more items in play than opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielTreasureCollector, fortisphere],
        },
        {},
      );

      expect(testEngine.asPlayerOne().getCard(arielTreasureCollector)?.lore).toBe(
        arielTreasureCollector.lore + 2,
      );
    });

    it("should NOT get +2 lore when opponent has equal items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielTreasureCollector, fortisphere],
        },
        {
          play: [miracleCandle],
        },
      );

      expect(testEngine.asPlayerOne().getCard(arielTreasureCollector)?.lore).toBe(
        arielTreasureCollector.lore,
      );
    });

    it("should NOT get +2 lore when you have no items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielTreasureCollector],
        },
        {},
      );

      expect(testEngine.asPlayerOne().getCard(arielTreasureCollector)?.lore).toBe(
        arielTreasureCollector.lore,
      );
    });

    it("should get +2 lore when you have 1 item and opponent has 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielTreasureCollector, miracleCandle],
        },
        {},
      );

      expect(testEngine.asPlayerOne().getCard(arielTreasureCollector)?.lore).toBe(
        arielTreasureCollector.lore + 2,
      );
    });
  });

  it("has Ward keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielTreasureCollector],
    });

    const card = testEngine.asPlayerOne().getCard(arielTreasureCollector);
    expect(card?.keywords).toContain("Ward");
  });
});

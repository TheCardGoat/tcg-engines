import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peterPanShadowFinder } from "./054-peter-pan-shadow-finder";
import { ticktockEverpresentPursuer } from "./056-tick-tock-ever-present-pursuer";

const nonEvasiveCharacter = createMockCharacter({
  id: "ppsf-non-evasive",
  name: "Goofy",
  version: "Super Goof",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Peter Pan - Shadow Finder", () => {
  it("has Rush and Evasive keywords", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [peterPanShadowFinder],
    });

    expect(testEngine.hasKeyword(peterPanShadowFinder, "Rush")).toBe(true);
    expect(testEngine.hasKeyword(peterPanShadowFinder, "Evasive")).toBe(true);
  });

  describe("FLY, OF COURSE! - Your other characters with Evasive gain Rush.", () => {
    it("grants Rush to your other characters with Evasive while in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: peterPanShadowFinder.cost,
        hand: [peterPanShadowFinder],
        play: [ticktockEverpresentPursuer],
      });

      // Tick-Tock has Evasive but should not have Rush before Peter Pan is played
      expect(testEngine.hasKeyword(ticktockEverpresentPursuer, "Evasive")).toBe(true);
      expect(testEngine.hasKeyword(ticktockEverpresentPursuer, "Rush")).toBe(false);

      // Play Peter Pan
      expect(testEngine.asPlayerOne().playCard(peterPanShadowFinder)).toBeSuccessfulCommand();

      // Tick-Tock should now have Rush from FLY, OF COURSE!
      expect(testEngine.hasKeyword(ticktockEverpresentPursuer, "Evasive")).toBe(true);
      expect(testEngine.hasKeyword(ticktockEverpresentPursuer, "Rush")).toBe(true);
    });

    it("does NOT grant Rush to characters without Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: peterPanShadowFinder.cost,
        hand: [peterPanShadowFinder],
        play: [nonEvasiveCharacter],
      });

      expect(testEngine.hasKeyword(nonEvasiveCharacter, "Evasive")).toBe(false);
      expect(testEngine.hasKeyword(nonEvasiveCharacter, "Rush")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(peterPanShadowFinder)).toBeSuccessfulCommand();

      // Non-evasive character should still not have Rush
      expect(testEngine.hasKeyword(nonEvasiveCharacter, "Rush")).toBe(false);
    });

    it("Rush is removed from Evasive characters when Peter Pan leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: peterPanShadowFinder.cost,
        hand: [peterPanShadowFinder],
        play: [ticktockEverpresentPursuer],
        deck: 2,
      });

      // Play Peter Pan
      expect(testEngine.asPlayerOne().playCard(peterPanShadowFinder)).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(ticktockEverpresentPursuer, "Rush")).toBe(true);

      // Banish Peter Pan by setting damage equal to willpower
      expect(
        testEngine.asServer().manualSetDamage(peterPanShadowFinder, peterPanShadowFinder.willpower),
      ).toBeSuccessfulCommand();

      // Peter Pan should be banished
      expect(testEngine.asPlayerOne().getCardZone(peterPanShadowFinder)).toBe("discard");

      // Tick-Tock should no longer have Rush
      expect(testEngine.hasKeyword(ticktockEverpresentPursuer, "Evasive")).toBe(true);
      expect(testEngine.hasKeyword(ticktockEverpresentPursuer, "Rush")).toBe(false);
    });
  });
});

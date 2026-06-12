import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fangmeyerIcyOfficer } from "./010-fangmeyer-icy-officer";
import { mchornIcecoldOfficer } from "./181-mchorn-ice-cold-officer";

const nonDetectiveCharacter = createMockCharacter({
  id: "fangmeyer-non-detective",
  name: "Non-Detective Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Fangmeyer - Icy Officer", () => {
  describe("REQUEST REINFORCEMENTS - When you play this character, you may return a Detective character card from your discard to your hand", () => {
    it("triggers when Fangmeyer is played and creates a bag effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [fangmeyerIcyOfficer],
        inkwell: fangmeyerIcyOfficer.cost,
        discard: [mchornIcecoldOfficer],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(fangmeyerIcyOfficer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(fangmeyerIcyOfficer)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("is optional — can be declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [fangmeyerIcyOfficer],
        inkwell: fangmeyerIcyOfficer.cost,
        discard: [mchornIcecoldOfficer],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(fangmeyerIcyOfficer)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(fangmeyerIcyOfficer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // McHorn should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(mchornIcecoldOfficer)).toBe("discard");
    });

    it("returns a Detective character from discard to hand when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [fangmeyerIcyOfficer],
        inkwell: fangmeyerIcyOfficer.cost,
        discard: [mchornIcecoldOfficer],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardZone(mchornIcecoldOfficer)).toBe("discard");

      expect(testEngine.asPlayerOne().playCard(fangmeyerIcyOfficer)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fangmeyerIcyOfficer, {
          targets: [mchornIcecoldOfficer],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mchornIcecoldOfficer)).toBe("hand");
    });

    it("only targets Detective characters — non-Detective cards in discard are not valid targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [fangmeyerIcyOfficer],
        inkwell: fangmeyerIcyOfficer.cost,
        discard: [mchornIcecoldOfficer, nonDetectiveCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(fangmeyerIcyOfficer)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fangmeyerIcyOfficer, {
          targets: [mchornIcecoldOfficer],
        }),
      ).toBeSuccessfulCommand();

      // Only McHorn (Detective) was returned
      expect(testEngine.asPlayerOne().getCardZone(mchornIcecoldOfficer)).toBe("hand");
      // Non-Detective stays in discard
      expect(testEngine.asPlayerOne().getCardZone(nonDetectiveCharacter)).toBe("discard");
    });

    it("does not create a bag effect when no Detective characters are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [fangmeyerIcyOfficer],
        inkwell: fangmeyerIcyOfficer.cost,
        discard: [nonDetectiveCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(fangmeyerIcyOfficer)).toBeSuccessfulCommand();

      // No bag effect should be created since there are no valid targets
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(nonDetectiveCharacter)).toBe("discard");
    });

    it("does not create a bag effect when discard is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [fangmeyerIcyOfficer],
        inkwell: fangmeyerIcyOfficer.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(fangmeyerIcyOfficer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("updates zone counts correctly after returning McHorn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [fangmeyerIcyOfficer],
        inkwell: fangmeyerIcyOfficer.cost,
        discard: [mchornIcecoldOfficer],
        deck: 2,
      });

      const initialCounts = testEngine.asPlayerOne().getZonesCardCount();

      expect(testEngine.asPlayerOne().playCard(fangmeyerIcyOfficer)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fangmeyerIcyOfficer, {
          targets: [mchornIcecoldOfficer],
        }),
      ).toBeSuccessfulCommand();

      const finalCounts = testEngine.asPlayerOne().getZonesCardCount();

      // Fangmeyer was played (hand -1), McHorn returned to hand (+1) — net zero change
      expect(finalCounts.hand).toBe(initialCounts.hand);
      // McHorn left discard (discard -1)
      expect(finalCounts.discard).toBe(initialCounts.discard - 1);
      // Fangmeyer entered play (+1)
      expect(finalCounts.play).toBe(initialCounts.play + 1);
    });
  });
});

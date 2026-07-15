import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { yenSidPowerfulSorcererEpic } from "./223-yen-sid-powerful-sorcerer-epic";
import { magicBroomAerialCleaner } from "./185-magic-broom-aerial-cleaner";
import { magicBroomIlluminaryKeeper } from "./048-magic-broom-illuminary-keeper";

const drawnCard = createMockCharacter({
  id: "yen-sid-epic-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Yen Sid - Powerful Sorcerer (Epic)", () => {
  describe("TIMELY INTERVENTION - When you play this character, if you have a character named Magic Broom in play, you may draw a card.", () => {
    it("draws a card when Magic Broom is in play and the optional draw is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yenSidPowerfulSorcererEpic],
        inkwell: yenSidPowerfulSorcererEpic.cost,
        play: [magicBroomAerialCleaner],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(yenSidPowerfulSorcererEpic)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(yenSidPowerfulSorcererEpic),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("does not draw a card when no Magic Broom is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yenSidPowerfulSorcererEpic],
        inkwell: yenSidPowerfulSorcererEpic.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(yenSidPowerfulSorcererEpic)).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(yenSidPowerfulSorcererEpic),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });

    it("can decline the optional draw when Magic Broom is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yenSidPowerfulSorcererEpic],
        inkwell: yenSidPowerfulSorcererEpic.cost,
        play: [magicBroomAerialCleaner],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(yenSidPowerfulSorcererEpic)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(yenSidPowerfulSorcererEpic, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });
  });

  describe("ARCANE STUDY - While you have 2 or more Broom characters in play, this character gets +2 lore.", () => {
    it("gets +2 lore when 2 Broom characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yenSidPowerfulSorcererEpic, magicBroomAerialCleaner, magicBroomIlluminaryKeeper],
      });

      expect(testEngine.asPlayerOne().getCard(yenSidPowerfulSorcererEpic)?.lore).toBe(
        yenSidPowerfulSorcererEpic.lore + 2,
      );
    });

    it("does NOT get +2 lore when only 1 Broom character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yenSidPowerfulSorcererEpic, magicBroomAerialCleaner],
      });

      expect(testEngine.asPlayerOne().getCard(yenSidPowerfulSorcererEpic)?.lore).toBe(
        yenSidPowerfulSorcererEpic.lore,
      );
    });

    it("does NOT get +2 lore when no Broom characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yenSidPowerfulSorcererEpic],
      });

      expect(testEngine.asPlayerOne().getCard(yenSidPowerfulSorcererEpic)?.lore).toBe(
        yenSidPowerfulSorcererEpic.lore,
      );
    });
  });
});

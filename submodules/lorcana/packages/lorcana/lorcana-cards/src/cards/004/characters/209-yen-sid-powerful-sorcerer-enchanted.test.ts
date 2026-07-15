import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { yenSidPowerfulSorcererEnchanted } from "./209-yen-sid-powerful-sorcerer-enchanted";
import { magicBroomAerialCleaner } from "./185-magic-broom-aerial-cleaner";
import { magicBroomIlluminaryKeeper } from "./048-magic-broom-illuminary-keeper";

const drawnCard = createMockCharacter({
  id: "yen-sid-enchanted-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Yen Sid - Powerful Sorcerer (Enchanted)", () => {
  describe("TIMELY INTERVENTION - When you play this character, if you have a character named Magic Broom in play, you may draw a card.", () => {
    it("draws a card when Magic Broom is in play and the optional draw is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yenSidPowerfulSorcererEnchanted],
        inkwell: yenSidPowerfulSorcererEnchanted.cost,
        play: [magicBroomAerialCleaner],
        deck: [drawnCard],
      });

      expect(
        testEngine.asPlayerOne().playCard(yenSidPowerfulSorcererEnchanted),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(yenSidPowerfulSorcererEnchanted),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("does not draw a card when no Magic Broom is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yenSidPowerfulSorcererEnchanted],
        inkwell: yenSidPowerfulSorcererEnchanted.cost,
        deck: [drawnCard],
      });

      expect(
        testEngine.asPlayerOne().playCard(yenSidPowerfulSorcererEnchanted),
      ).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(yenSidPowerfulSorcererEnchanted),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });

    it("can decline the optional draw when Magic Broom is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yenSidPowerfulSorcererEnchanted],
        inkwell: yenSidPowerfulSorcererEnchanted.cost,
        play: [magicBroomAerialCleaner],
        deck: [drawnCard],
      });

      expect(
        testEngine.asPlayerOne().playCard(yenSidPowerfulSorcererEnchanted),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(yenSidPowerfulSorcererEnchanted, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });
  });

  describe("ARCANE STUDY - While you have 2 or more Broom characters in play, this character gets +2 lore.", () => {
    it("gets +2 lore when 2 Broom characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          yenSidPowerfulSorcererEnchanted,
          magicBroomAerialCleaner,
          magicBroomIlluminaryKeeper,
        ],
      });

      expect(testEngine.asPlayerOne().getCard(yenSidPowerfulSorcererEnchanted)?.lore).toBe(
        yenSidPowerfulSorcererEnchanted.lore + 2,
      );
    });

    it("does NOT get +2 lore when only 1 Broom character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yenSidPowerfulSorcererEnchanted, magicBroomAerialCleaner],
      });

      expect(testEngine.asPlayerOne().getCard(yenSidPowerfulSorcererEnchanted)?.lore).toBe(
        yenSidPowerfulSorcererEnchanted.lore,
      );
    });

    it("does NOT get +2 lore when no Broom characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yenSidPowerfulSorcererEnchanted],
      });

      expect(testEngine.asPlayerOne().getCard(yenSidPowerfulSorcererEnchanted)?.lore).toBe(
        yenSidPowerfulSorcererEnchanted.lore,
      );
    });
  });
});

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { magicBroomIlluminaryKeeper } from "./048-magic-broom-illuminary-keeper";
import { yenSidPowerfulSorcerer } from "./059-yen-sid-powerful-sorcerer";
import { magicBroomAerialCleaner } from "./185-magic-broom-aerial-cleaner";

const deckCard = createMockCharacter({
  id: "yen-sid-deck-card",
  name: "Deck Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Yen Sid - Powerful Sorcerer", () => {
  describe("TIMELY INTERVENTION - When you play this character, if you have a character named Magic Broom in play, you may draw a card.", () => {
    it("draws a card when Magic Broom is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yenSidPowerfulSorcerer],
        inkwell: yenSidPowerfulSorcerer.cost,
        play: [magicBroomAerialCleaner],
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(yenSidPowerfulSorcerer)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(yenSidPowerfulSorcerer, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("hand");
    });

    it("does not draw a card when no Magic Broom character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yenSidPowerfulSorcerer],
        inkwell: yenSidPowerfulSorcerer.cost,
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(yenSidPowerfulSorcerer)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bagEffect of bagEffects) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(yenSidPowerfulSorcerer, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    });

    it("can decline the optional draw when Magic Broom is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [yenSidPowerfulSorcerer],
        inkwell: yenSidPowerfulSorcerer.cost,
        play: [magicBroomAerialCleaner],
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(yenSidPowerfulSorcerer)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(yenSidPowerfulSorcerer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    });
  });

  describe("ARCANE STUDY - While you have 2 or more Broom characters in play, this character gets +2 {L}.", () => {
    it("gets +2 lore when 2 Broom characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yenSidPowerfulSorcerer, magicBroomAerialCleaner, magicBroomIlluminaryKeeper],
      });

      const card = testEngine.asPlayerOne().getCard(yenSidPowerfulSorcerer);
      expect(card?.lore).toBe(yenSidPowerfulSorcerer.lore + 2);
    });

    it("does NOT get +2 lore when only 1 Broom character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yenSidPowerfulSorcerer, magicBroomAerialCleaner],
      });

      const card = testEngine.asPlayerOne().getCard(yenSidPowerfulSorcerer);
      expect(card?.lore).toBe(yenSidPowerfulSorcerer.lore);
    });

    it("does NOT get +2 lore when no Broom characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yenSidPowerfulSorcerer],
      });

      const card = testEngine.asPlayerOne().getCard(yenSidPowerfulSorcerer);
      expect(card?.lore).toBe(yenSidPowerfulSorcerer.lore);
    });
  });
});

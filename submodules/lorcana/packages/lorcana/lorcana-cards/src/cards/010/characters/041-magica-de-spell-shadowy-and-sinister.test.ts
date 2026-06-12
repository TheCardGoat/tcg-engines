import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { magicaDeSpellShadowyAndSinister } from "./041-magica-de-spell-shadowy-and-sinister";

const otherCard = createMockCharacter({
  id: "other-card",
  name: "Other Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Magica De Spell - Shadowy and Sinister", () => {
  describe("DARK INCANTATION - When you play this character, you may shuffle a card from chosen player's discard into their deck.", () => {
    it("should shuffle a card from own discard into own deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [magicaDeSpellShadowyAndSinister],
        inkwell: magicaDeSpellShadowyAndSinister.cost,
        discard: [otherCard],
        deck: 5,
      });

      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(
        testEngine.asPlayerOne().playCard(magicaDeSpellShadowyAndSinister),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicaDeSpellShadowyAndSinister, {
          resolveOptional: true,
          targets: [otherCard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(otherCard)).toBe("deck");
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(
        initialDeckCount + 1,
      );
    });

    it("should shuffle a card from opponent's discard into their deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicaDeSpellShadowyAndSinister],
          inkwell: magicaDeSpellShadowyAndSinister.cost,
          deck: 5,
        },
        {
          discard: [otherCard],
          deck: 5,
        },
      );

      const initialOpponentDeckCount = testEngine
        .asPlayerTwo()
        .getZonesCardCount("player_two").deck;

      expect(
        testEngine.asPlayerOne().playCard(magicaDeSpellShadowyAndSinister),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicaDeSpellShadowyAndSinister, {
          resolveOptional: true,
          targets: [otherCard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(otherCard)).toBe("deck");
      expect(testEngine.asPlayerTwo().getZonesCardCount("player_two").deck).toBe(
        initialOpponentDeckCount + 1,
      );
    });

    it("should be optional - player can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [magicaDeSpellShadowyAndSinister],
        inkwell: magicaDeSpellShadowyAndSinister.cost,
        discard: [otherCard],
        deck: 5,
      });

      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(
        testEngine.asPlayerOne().playCard(magicaDeSpellShadowyAndSinister),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(magicaDeSpellShadowyAndSinister, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(otherCard)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(initialDeckCount);
    });
  });
});

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { zootopiaTundratown } from "../locations/034-zootopia-tundratown";
import { elsaIceArtisanEnchanted } from "./233-elsa-ice-artisan-enchanted";

const weakCharacter = createMockCharacter({
  id: "elsa-enchanted-weak-target",
  name: "Weak Target",
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const strongCharacter = createMockCharacter({
  id: "elsa-enchanted-strong-target",
  name: "Strong Target",
  cost: 4,
  strength: 6,
  willpower: 6,
  lore: 2,
});

describe("Elsa - Ice Artisan (Enchanted)", () => {
  it("has Shift keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [elsaIceArtisanEnchanted],
    });

    const cardUnderTest = testEngine.getCardModel(elsaIceArtisanEnchanted);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  describe("ENDLESS WINTER - When you play this character", () => {
    it("on play: may exert chosen character with 3 strength or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: elsaIceArtisanEnchanted.cost,
        hand: [elsaIceArtisanEnchanted],
        play: [weakCharacter],
        deck: 5,
      });

      const weakId = testEngine.findCardInstanceId(weakCharacter, "play");
      expect(testEngine.asPlayerOne().getCard(weakCharacter)?.exerted).toBe(false);

      expect(testEngine.asPlayerOne().playCard(elsaIceArtisanEnchanted)).toBeSuccessfulCommand();

      // Resolve the on-play ENDLESS WINTER trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaIceArtisanEnchanted, {
          resolveOptional: true,
          targets: [weakId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(weakCharacter)?.exerted).toBe(true);
    });

    it("on play: may decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: elsaIceArtisanEnchanted.cost,
        hand: [elsaIceArtisanEnchanted],
        play: [weakCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCard(weakCharacter)?.exerted).toBe(false);

      expect(testEngine.asPlayerOne().playCard(elsaIceArtisanEnchanted)).toBeSuccessfulCommand();

      // Decline the on-play ENDLESS WINTER trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaIceArtisanEnchanted, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(weakCharacter)?.exerted).toBe(false);
    });

    it("on play: cannot target a character with strength > 3", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: elsaIceArtisanEnchanted.cost,
        hand: [elsaIceArtisanEnchanted],
        play: [strongCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCard(strongCharacter)?.exerted).toBe(false);

      expect(testEngine.asPlayerOne().playCard(elsaIceArtisanEnchanted)).toBeSuccessfulCommand();

      // If there are no valid targets, the pending effect should auto-skip
      // (The strong character has 6 strength, so it's not a valid target)
      expect(testEngine.asPlayerOne().getCard(strongCharacter)?.exerted).toBe(false);
    });
  });

  describe("ENDLESS WINTER - Whenever you play a location", () => {
    it("on location play: may exert chosen character with 3 strength or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: zootopiaTundratown.cost,
        hand: [zootopiaTundratown],
        play: [elsaIceArtisanEnchanted, weakCharacter],
        deck: 5,
      });

      const weakId = testEngine.findCardInstanceId(weakCharacter, "play");
      expect(testEngine.asPlayerOne().getCard(weakCharacter)?.exerted).toBe(false);

      expect(testEngine.asPlayerOne().playCard(zootopiaTundratown)).toBeSuccessfulCommand();

      // Resolve the ENDLESS WINTER trigger from location play
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaIceArtisanEnchanted, {
          resolveOptional: true,
          targets: [weakId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(weakCharacter)?.exerted).toBe(true);
    });
  });

  describe("DISTANT CALL - While this character is at a location, she gets +3 lore", () => {
    it("does not get +3 lore when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [elsaIceArtisanEnchanted],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(elsaIceArtisanEnchanted)).toBe(
        elsaIceArtisanEnchanted.lore,
      );
    });

    it("gets +3 lore when at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: elsaIceArtisanEnchanted, atLocation: zootopiaTundratown },
          zootopiaTundratown,
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(elsaIceArtisanEnchanted)).toBe(
        elsaIceArtisanEnchanted.lore + 3,
      );
    });
  });
});

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ladyMissParkAvenue } from "./028-lady-miss-park-avenue";

const discardCharOne = createMockCharacter({
  id: "lady-mpa-discard-1",
  name: "Discard Character One",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const discardCharTwo = createMockCharacter({
  id: "lady-mpa-discard-2",
  name: "Discard Character Two",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const expensiveDiscardChar = createMockCharacter({
  id: "lady-mpa-discard-expensive",
  name: "Expensive Discard Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Lady - Miss Park Avenue", () => {
  describe("Shift 3", () => {
    it("has Shift keyword with cost 3", () => {
      const testEngine = new LorcanaTestEngine({
        play: [ladyMissParkAvenue],
      });
      const cardModel = testEngine.getCardModel(ladyMissParkAvenue);
      expect(cardModel.hasShift()).toBe(true);
      expect(cardModel.shiftInkCost).toBe(3);
    });
  });

  describe("SOMETHING WONDERFUL — When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.", () => {
    it("returns up to 2 characters from discard to hand when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyMissParkAvenue],
        inkwell: ladyMissParkAvenue.cost,
        discard: [discardCharOne, discardCharTwo],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ladyMissParkAvenue)).toBeSuccessfulCommand();

      // Accept the optional triggered ability and choose both discard characters
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyMissParkAvenue, {
          resolveOptional: true,
          targets: [discardCharOne, discardCharTwo],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardCharOne)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(discardCharTwo)).toBe("hand");
    });

    it("allows returning only 1 character (up to 2 is optional count)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyMissParkAvenue],
        inkwell: ladyMissParkAvenue.cost,
        discard: [discardCharOne, discardCharTwo],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ladyMissParkAvenue)).toBeSuccessfulCommand();

      // Accept the optional triggered ability but choose only 1 character
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyMissParkAvenue, {
          resolveOptional: true,
          targets: [discardCharOne],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardCharOne)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(discardCharTwo)).toBe("discard");
    });

    it("does not return characters when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyMissParkAvenue],
        inkwell: ladyMissParkAvenue.cost,
        discard: [discardCharOne, discardCharTwo],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ladyMissParkAvenue)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ladyMissParkAvenue, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardCharOne)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(discardCharTwo)).toBe("discard");
    });

    it("cannot return characters with cost 3 or more from discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyMissParkAvenue],
        inkwell: ladyMissParkAvenue.cost,
        discard: [expensiveDiscardChar, discardCharOne],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ladyMissParkAvenue)).toBeSuccessfulCommand();

      // Accept the optional triggered ability and choose only the eligible card
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyMissParkAvenue, {
          resolveOptional: true,
          targets: [discardCharOne],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardCharOne)).toBe("hand");
      // expensiveDiscardChar still in discard (cost 3 > 2)
      expect(testEngine.asPlayerOne().getCardZone(expensiveDiscardChar)).toBe("discard");
    });

    it("lady miss park avenue is in play after the trigger resolves", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyMissParkAvenue],
        inkwell: ladyMissParkAvenue.cost,
        discard: [discardCharOne],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ladyMissParkAvenue)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyMissParkAvenue, {
          resolveOptional: true,
          targets: [discardCharOne],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ladyMissParkAvenue)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(discardCharOne)).toBe("hand");
    });

    it("only returns characters, not items or actions from discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyMissParkAvenue],
        inkwell: ladyMissParkAvenue.cost,
        discard: [discardCharOne],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ladyMissParkAvenue)).toBeSuccessfulCommand();

      // Get the bag effects to inspect what's available
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyMissParkAvenue, {
          resolveOptional: true,
          targets: [discardCharOne],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardCharOne)).toBe("hand");
    });

    it("zone counts are correct after returning 2 characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyMissParkAvenue],
        inkwell: ladyMissParkAvenue.cost,
        discard: [discardCharOne, discardCharTwo],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ladyMissParkAvenue)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyMissParkAvenue, {
          resolveOptional: true,
          targets: [discardCharOne, discardCharTwo],
        }),
      ).toBeSuccessfulCommand();

      const zones = testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE);
      expect(zones.discard).toBe(0);
      // hand contains discardCharOne + discardCharTwo (2 returned cards)
      expect(zones.hand).toBe(2);
      // play contains ladyMissParkAvenue
      expect(zones.play).toBe(1);
    });
  });
});

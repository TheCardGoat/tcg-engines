import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { minnieMousePirateLookout } from "./120-minnie-mouse-pirate-lookout";

const inkCard1 = createMockCharacter({
  id: "minnie-pirate-ink-1",
  name: "Ink Card 1",
  cost: 1,
  inkable: true,
});

const inkCard2 = createMockCharacter({
  id: "minnie-pirate-ink-2",
  name: "Ink Card 2",
  cost: 1,
  inkable: true,
});

const locationInDiscard1 = createMockLocation({
  id: "minnie-pirate-location-1",
  name: "Location In Discard 1",
  cost: 2,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

const locationInDiscard2 = createMockLocation({
  id: "minnie-pirate-location-2",
  name: "Location In Discard 2",
  cost: 3,
  moveCost: 2,
  willpower: 5,
  lore: 2,
});

const characterInDiscard = createMockCharacter({
  id: "minnie-pirate-char-discard",
  name: "Character In Discard",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Minnie Mouse - Pirate Lookout", () => {
  describe("LAND, HO! - Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.", () => {
    it("triggers when you ink a card, allows returning a location from discard to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard1, inkCard2],
          play: [minnieMousePirateLookout],
          discard: [locationInDiscard1, characterInDiscard, locationInDiscard2],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      // Ink a card - should trigger "Land, Ho!"
      expect(testEngine.asPlayerOne().ink(inkCard1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      // Accept the optional ability
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMousePirateLookout),
      ).toBeSuccessfulCommand();
      // Choose a location card from discard
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [locationInDiscard1],
        }),
      ).toBeSuccessfulCommand();

      // Location is returned to hand
      expect(testEngine.asPlayerOne().getCardZone(locationInDiscard1)).toBe("hand");
      // Other location stays in discard
      expect(testEngine.asPlayerOne().getCardZone(locationInDiscard2)).toBe("discard");
      // Character stays in discard (not a location)
      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("discard");
    });

    it("ability is optional - declining does not return anything", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard1],
          play: [minnieMousePirateLookout],
          discard: [locationInDiscard1],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      // Ink a card - triggers the ability
      expect(testEngine.asPlayerOne().ink(inkCard1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMousePirateLookout, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Location stays in discard
      expect(testEngine.asPlayerOne().getCardZone(locationInDiscard1)).toBe("discard");
    });

    it("does not trigger during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 3,
          play: [minnieMousePirateLookout],
          discard: [locationInDiscard1],
        },
        {
          deck: 3,
          hand: [inkCard1],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent inks a card — should NOT trigger
      expect(testEngine.asPlayerTwo().ink(inkCard1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});

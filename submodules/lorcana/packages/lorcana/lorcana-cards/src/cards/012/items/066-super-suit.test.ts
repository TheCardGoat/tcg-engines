import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { superSuit } from "./066-super-suit";

const heroCharacter = createMockCharacter({
  id: "super-suit-hero",
  name: "Hero Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

const nonHeroCharacter = createMockCharacter({
  id: "super-suit-non-hero",
  name: "Villain Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Villain"],
});

const deckCard = createMockCharacter({
  id: "super-suit-deck-card",
  name: "Deck Card",
  cost: 1,
});

describe("Super Suit", () => {
  describe("SIMPLE, ELEGANT - When you play this item, if you have a Hero character in play, gain 1 lore.", () => {
    it("gains 1 lore when a Hero character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [superSuit],
          play: [heroCharacter],
          inkwell: superSuit.cost,
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(superSuit)).toBeSuccessfulCommand();

      // Resolve any pending triggered effects
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(testEngine.asPlayerOne().resolvePendingByCard(superSuit)).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does not gain lore when no Hero character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [superSuit],
          play: [nonHeroCharacter],
          inkwell: superSuit.cost,
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(superSuit)).toBeSuccessfulCommand();

      // Per CRD 6.2.7: ability is enqueued then fizzles because the condition fails at resolution.
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(testEngine.asPlayerOne().resolvePendingByCard(superSuit)).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("does not gain lore when no characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [superSuit],
          inkwell: superSuit.cost,
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(superSuit)).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(testEngine.asPlayerOne().resolvePendingByCard(superSuit)).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });
  });

  describe("SUIT UP - {E}, 2 {I} — If you played a Hero character this turn, draw a card.", () => {
    it("draws a card when a Hero character was played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heroCharacter],
          play: [superSuit],
          inkwell: heroCharacter.cost + 2,
          deck: [deckCard],
        },
        {
          deck: 3,
        },
      );

      // Play a Hero character this turn
      expect(testEngine.asPlayerOne().playCard(heroCharacter)).toBeSuccessfulCommand();

      // Activate SUIT UP: exert + 2 ink
      expect(testEngine.asPlayerOne().activateAbility(superSuit)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getCard(superSuit)).toMatchObject({
        zone: "play",
        exerted: true,
      });
    });

    it("cannot be activated when no Hero character was played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nonHeroCharacter],
          play: [superSuit],
          inkwell: nonHeroCharacter.cost + 2,
          deck: [deckCard],
        },
        {
          deck: 3,
        },
      );

      // Play a non-Hero character this turn (does not satisfy SUIT UP condition)
      expect(testEngine.asPlayerOne().playCard(nonHeroCharacter)).toBeSuccessfulCommand();

      // Activating SUIT UP should fail since no Hero was played this turn
      const result = testEngine.asPlayerOne().activateAbility(superSuit);
      expect(result.success).toBe(false);

      // No card drawn; Super Suit stays ready
      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
      expect(testEngine.asPlayerOne().getCard(superSuit)).toMatchObject({
        zone: "play",
        exerted: false,
      });
    });

    it("cannot be activated when no character was played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [superSuit],
          inkwell: 2,
          deck: [deckCard],
        },
        {
          deck: 3,
        },
      );

      // No character played this turn
      const result = testEngine.asPlayerOne().activateAbility(superSuit);
      expect(result.success).toBe(false);

      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    });
  });
});

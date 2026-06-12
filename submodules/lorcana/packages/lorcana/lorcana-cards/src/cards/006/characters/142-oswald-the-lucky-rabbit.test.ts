import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { oswaldTheLuckyRabbit } from "./142-oswald-the-lucky-rabbit";

const keepTheAncientWays = createMockAction({
  id: "oswald-keep-the-ancient-ways",
  name: "Keep the Ancient Ways",
  cost: 2,
  text: "Opponents can't play actions or items until the start of your next turn.",
  abilities: [
    {
      id: "8ke-1",
      type: "action",
      text: "Opponents can't play actions or items until the start of your next turn.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "cant-play-actions",
            target: "OPPONENTS",
            duration: "until-start-of-next-turn",
          },
          {
            type: "restriction",
            restriction: "cant-play-items",
            target: "OPPONENTS",
            duration: "until-start-of-next-turn",
          },
        ],
      },
    },
  ],
});

const inkCard = createMockCharacter({
  id: "oswald-ink-card",
  name: "Ink Card",
  cost: 1,
  inkable: true,
});

const mockItem = createMockItem({
  id: "oswald-mock-item",
  name: "Mock Item",
  cost: 3,
});

const mockCharacter = createMockCharacter({
  id: "oswald-mock-char",
  name: "Mock Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const anotherCharacter = createMockCharacter({
  id: "oswald-another-char",
  name: "Another Character",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Oswald - The Lucky Rabbit", () => {
  describe("FAVORABLE CHANCE - During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it's an item card, you may play that item for free and it enters play exerted. Otherwise, put it on the bottom of your deck.", () => {
    it("triggers when inking, reveals item, and plays it for free exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard],
          play: [oswaldTheLuckyRabbit],
          deck: [anotherCharacter, mockItem],
        },
        {
          deck: 3,
        },
      );

      // Ink a card - should trigger Favorable Chance
      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      // Triggered ability is in the bag (optional)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(oswaldTheLuckyRabbit, {
          resolveOptional: true,
          destinations: [{ zone: "play", cards: [mockItem] }],
        }),
      ).toBeSuccessfulCommand();

      // Item should be in play and exerted
      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(mockItem)).toBe(true);

      // Deck should have 1 card remaining
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        play: 2,
        inkwell: 1,
        deck: 1,
        hand: 0,
        discard: 0,
      });
    });

    it("reveals item but player declines to play it - put on bottom of deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard],
          play: [oswaldTheLuckyRabbit],
          deck: [mockItem, anotherCharacter],
        },
        {
          deck: 3,
        },
      );

      // Ink a card
      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(oswaldTheLuckyRabbit, {
          resolveOptional: true,
          destinations: [{ zone: "deck-bottom", cards: [mockItem] }],
        }),
      ).toBeSuccessfulCommand();

      // Item should be on bottom of deck (deck still has 2 cards)
      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        play: 1,
        inkwell: 1,
        deck: 2,
        hand: 0,
        discard: 0,
      });
    });

    it("reveals a non-item card - puts it on bottom of deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard],
          play: [oswaldTheLuckyRabbit],
          deck: [mockCharacter, anotherCharacter],
        },
        {
          deck: 3,
        },
      );

      // Ink a card
      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(oswaldTheLuckyRabbit, {
          resolveOptional: true,
          destinations: [{ zone: "deck-bottom", cards: [mockCharacter] }],
        }),
      ).toBeSuccessfulCommand();

      // Non-item card should be on the bottom of the deck
      expect(testEngine.asPlayerOne().getCardZone(mockCharacter)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        play: 1,
        inkwell: 1,
        deck: 2,
        hand: 0,
        discard: 0,
      });
    });

    it("player can decline the optional trigger entirely", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard],
          play: [oswaldTheLuckyRabbit],
          deck: [mockItem, anotherCharacter],
        },
        {
          deck: 3,
        },
      );

      // Ink a card
      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional trigger
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(oswaldTheLuckyRabbit, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Item should still be in deck
      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        play: 1,
        inkwell: 1,
        deck: 2,
        hand: 0,
        discard: 0,
      });
    });

    it("does not trigger during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 3,
          play: [oswaldTheLuckyRabbit],
        },
        {
          deck: 3,
          hand: [inkCard],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent inks - should NOT trigger
      expect(testEngine.asPlayerTwo().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("regression: does not play items when Keep the Ancient Ways restriction is active", () => {
      const singer = createMockCharacter({
        id: "oswald-singer",
        name: "Singer",
        cost: 3,
        strength: 2,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [keepTheAncientWays],
          inkwell: keepTheAncientWays.cost,
          play: [{ card: singer, isDrying: false }],
          deck: 2,
        },
        {
          play: [oswaldTheLuckyRabbit],
          hand: [inkCard],
          deck: [mockItem, anotherCharacter],
        },
      );

      // Player one plays Keep the Ancient Ways to restrict opponent from playing items
      expect(testEngine.asPlayerOne().playCard(keepTheAncientWays)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two (Oswald's controller) inks - triggers Favorable Chance
      expect(testEngine.asPlayerTwo().ink(inkCard)).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerTwo().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
        // Even if the top card is an item, Oswald should not be able to play it
        // because of the Keep the Ancient Ways restriction
        const result = testEngine.asPlayerTwo().resolvePendingByCard(oswaldTheLuckyRabbit, {
          resolveOptional: true,
          destinations: [{ zone: "play", cards: [mockItem] }],
        });
        // If the item is on top, trying to play it should fail or it should stay in deck
        // The item should NOT end up in play
      }

      expect(testEngine.asPlayerTwo().getCardZone(mockItem)).not.toBe("play");
    });
  });
});

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { ednaModeFashionDesigner } from "./054-edna-mode-fashion-designer";

const cheapItem = createMockItem({
  id: "edna-cheap-item",
  name: "Cheap Item",
  cost: 2,
});

const expensiveItem = createMockItem({
  id: "edna-expensive-item",
  name: "Expensive Item",
  cost: 3,
});

const superAlly = createMockCharacter({
  id: "edna-super-ally",
  name: "Super Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Super"],
});

const secondSuperAlly = createMockCharacter({
  id: "edna-second-super-ally",
  name: "Second Super Ally",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  classifications: ["Storyborn", "Super"],
});

const nonSuperAlly = createMockCharacter({
  id: "edna-non-super-ally",
  name: "Non Super Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Edna Mode - Fashion Designer", () => {
  describe("NO CAPES! - When you play this character, you may return chosen item with cost 2 or less to its player's hand. If you do, its player draws a card.", () => {
    it("returns an opponent's item with cost 2 to their hand and that player draws a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ednaModeFashionDesigner],
          inkwell: ednaModeFashionDesigner.cost,
          deck: 3,
        },
        {
          play: [cheapItem],
          deck: 3,
        },
      );

      const playerOne = testEngine.asPlayerOne();
      const opponentHandBefore = playerOne.getCardsInZone("hand", PLAYER_TWO).count;
      const opponentDeckBefore = playerOne.getCardsInZone("deck", PLAYER_TWO).count;

      expect(playerOne.playCard(ednaModeFashionDesigner)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(ednaModeFashionDesigner, {
          resolveOptional: true,
          targets: [cheapItem],
        }),
      ).toBeSuccessfulCommand();

      // Item returned to opponent's hand, plus the drawn card: +2
      expect(playerOne.getCardsInZone("hand", PLAYER_TWO).count).toBe(opponentHandBefore + 2);
      expect(playerOne.getCardZone(cheapItem)).toBe("hand");
      // Opponent drew 1 card
      expect(playerOne.getCardsInZone("deck", PLAYER_TWO).count).toBe(opponentDeckBefore - 1);
    });

    it("returns own item with cost 2 to hand and the controller draws a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ednaModeFashionDesigner],
        inkwell: ednaModeFashionDesigner.cost,
        play: [cheapItem],
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();
      const deckBefore = playerOne.getCardsInZone("deck", PLAYER_ONE).count;

      expect(playerOne.playCard(ednaModeFashionDesigner)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(ednaModeFashionDesigner, {
          resolveOptional: true,
          targets: [cheapItem],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(cheapItem)).toBe("hand");
      // Controller drew 1 card
      expect(playerOne.getCardsInZone("deck", PLAYER_ONE).count).toBe(deckBefore - 1);
    });

    it("does nothing when the controller declines the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ednaModeFashionDesigner],
        inkwell: ednaModeFashionDesigner.cost,
        play: [cheapItem],
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();
      const deckBefore = playerOne.getCardsInZone("deck", PLAYER_ONE).count;

      expect(playerOne.playCard(ednaModeFashionDesigner)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      expect(
        playerOne.resolvePendingByCard(ednaModeFashionDesigner, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Item remains in play, no card drawn
      expect(playerOne.getCardZone(cheapItem)).toBe("play");
      expect(playerOne.getCardsInZone("deck", PLAYER_ONE).count).toBe(deckBefore);
    });

    it("cannot target an item with cost greater than 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ednaModeFashionDesigner],
          inkwell: ednaModeFashionDesigner.cost,
          deck: 3,
        },
        {
          play: [expensiveItem],
          deck: 3,
        },
      );

      const playerOne = testEngine.asPlayerOne();
      const opponentHandBefore = playerOne.getCardsInZone("hand", PLAYER_TWO).count;
      const opponentDeckBefore = playerOne.getCardsInZone("deck", PLAYER_TWO).count;

      expect(playerOne.playCard(ednaModeFashionDesigner)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBe(1);

      // Decline because no legal target exists
      expect(
        playerOne.resolvePendingByCard(ednaModeFashionDesigner, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Expensive item stays in play; opponent's hand unchanged, no card drawn
      expect(playerOne.getCardZone(expensiveItem)).toBe("play");
      expect(playerOne.getCardsInZone("hand", PLAYER_TWO).count).toBe(opponentHandBefore);
      expect(playerOne.getCardsInZone("deck", PLAYER_TWO).count).toBe(opponentDeckBefore);
    });
  });

  describe("MAKING SUPERS FABULOUS - Whenever this character quests, your Super characters get +1 {L} this turn.", () => {
    it("gives +1 lore to your Super characters when Edna quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: ednaModeFashionDesigner, isDrying: false },
          { card: superAlly, isDrying: false },
          { card: secondSuperAlly, isDrying: false },
        ],
      });

      const initialSuperLore = testEngine.asPlayerOne().getCardLore(superAlly);
      const initialSecondSuperLore = testEngine.asPlayerOne().getCardLore(secondSuperAlly);

      expect(testEngine.asPlayerOne().quest(ednaModeFashionDesigner)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(superAlly)).toBe(initialSuperLore + 1);
      expect(testEngine.asPlayerOne().getCardLore(secondSuperAlly)).toBe(
        initialSecondSuperLore + 1,
      );
    });

    it("does not give +1 lore to non-Super characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: ednaModeFashionDesigner, isDrying: false },
          { card: nonSuperAlly, isDrying: false },
        ],
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(nonSuperAlly);

      expect(testEngine.asPlayerOne().quest(ednaModeFashionDesigner)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(nonSuperAlly)).toBe(initialLore);
    });

    it("lore bonus lasts only for the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: ednaModeFashionDesigner, isDrying: false },
          { card: superAlly, isDrying: false },
        ],
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(superAlly);

      expect(testEngine.asPlayerOne().quest(ednaModeFashionDesigner)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(superAlly)).toBe(initialLore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(superAlly)).toBe(initialLore);
    });
  });
});

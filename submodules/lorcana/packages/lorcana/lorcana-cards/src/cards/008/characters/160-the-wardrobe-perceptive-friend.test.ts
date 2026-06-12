import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { theWardrobePerceptiveFriend } from "./160-the-wardrobe-perceptive-friend";

const itemInHand = createMockItem({
  id: "wardrobe-item-in-hand",
  name: "Item In Hand",
  cost: 2,
});

const drawnCard1 = createMockCharacter({
  id: "wardrobe-drawn-card-1",
  name: "Drawn Card 1",
  cost: 1,
});

const drawnCard2 = createMockCharacter({
  id: "wardrobe-drawn-card-2",
  name: "Drawn Card 2",
  cost: 1,
});

const nonItemInHand = createMockCharacter({
  id: "wardrobe-non-item-in-hand",
  name: "Non Item In Hand",
  cost: 1,
});

describe("The Wardrobe - Perceptive Friend", () => {
  describe("I HAVE JUST THE THING! {E}, Choose and discard an item card — Draw 2 cards.", () => {
    it("discards a chosen item from hand and draws 2 cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theWardrobePerceptiveFriend, isDrying: false }],
        hand: [itemInHand],
        deck: [drawnCard1, drawnCard2],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theWardrobePerceptiveFriend, {
          costs: {
            discardCards: [itemInHand],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(itemInHand)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard1)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard2)).toBe("hand");
    });

    it("cannot activate without an item card in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theWardrobePerceptiveFriend, isDrying: false }],
        hand: [nonItemInHand],
        deck: [drawnCard1, drawnCard2],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theWardrobePerceptiveFriend, {
          costs: {
            discardCards: [nonItemInHand],
          },
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("cannot activate when already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theWardrobePerceptiveFriend, exerted: true, isDrying: false }],
        hand: [itemInHand],
        deck: [drawnCard1, drawnCard2],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theWardrobePerceptiveFriend, {
          costs: {
            discardCards: [itemInHand],
          },
        }),
      ).not.toBeSuccessfulCommand();
    });
  });
});

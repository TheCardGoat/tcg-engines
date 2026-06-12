import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mamaOdieMysticalMaven } from "./151-mama-odie-mystical-maven";
import { theBareNecessities } from "../actions/028-the-bare-necessities";

const topDeckCard = createMockCharacter({
  id: "mama-odie-deck-card",
  name: "Deck Card",
  cost: 1,
});

describe("Mama Odie - Mystical Maven", () => {
  describe("THIS GOING TO BE GOOD - Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("triggers when you play a song and can put top card into inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: mamaOdieMysticalMaven.cost + theBareNecessities.cost,
          hand: [mamaOdieMysticalMaven, theBareNecessities],
          deck: [topDeckCard],
          play: [],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mamaOdieMysticalMaven)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(theBareNecessities)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mamaOdieMysticalMaven),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("inkwell");
    });

    it("is optional - can decline to put card into inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: mamaOdieMysticalMaven.cost + theBareNecessities.cost,
          hand: [mamaOdieMysticalMaven, theBareNecessities],
          deck: [topDeckCard],
          play: [],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mamaOdieMysticalMaven)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(theBareNecessities)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mamaOdieMysticalMaven, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("deck");
    });
  });
});

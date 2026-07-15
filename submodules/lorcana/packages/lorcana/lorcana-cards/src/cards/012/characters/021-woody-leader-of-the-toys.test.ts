import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { woodyLeaderOfTheToys } from "./021-woody-leader-of-the-toys";

const toyCharacter = createMockCharacter({
  id: "woody-test-toy-char",
  name: "Buzz Lightyear",
  cost: 3,
  classifications: ["Storyborn", "Hero", "Toy"],
});

const nonToyCharacterA = createMockCharacter({
  id: "woody-test-non-toy-a",
  name: "Mickey Mouse",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const nonToyCharacterB = createMockCharacter({
  id: "woody-test-non-toy-b",
  name: "Donald Duck",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const andysRoomLocation = createMockLocation({
  id: "woody-test-andys-room",
  name: "Andy's Room",
  cost: 2,
});

const otherLocation = createMockLocation({
  id: "woody-test-other-loc",
  name: "Other Place",
  cost: 2,
});

describe("Woody - Leader of the Toys", () => {
  describe("LET'S GO HOME - When you play this character, look at the top 4 cards of your deck. You may reveal a Toy character card or a location card named Andy's Room and put it into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("picks a Toy character card to hand and puts the rest on bottom when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [woodyLeaderOfTheToys],
        inkwell: woodyLeaderOfTheToys.cost,
        deck: [nonToyCharacterA, toyCharacter, otherLocation, nonToyCharacterB],
      });

      expect(testEngine.asPlayerOne().playCard(woodyLeaderOfTheToys)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(woodyLeaderOfTheToys, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [toyCharacter] },
            { zone: "deck-bottom", cards: [nonToyCharacterA, otherLocation, nonToyCharacterB] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(toyCharacter)).toBe("hand");
    });

    it("picks an Andy's Room location card to hand when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [woodyLeaderOfTheToys],
        inkwell: woodyLeaderOfTheToys.cost,
        deck: [nonToyCharacterA, andysRoomLocation, otherLocation, nonToyCharacterB],
      });

      expect(testEngine.asPlayerOne().playCard(woodyLeaderOfTheToys)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(woodyLeaderOfTheToys, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [andysRoomLocation] },
            { zone: "deck-bottom", cards: [nonToyCharacterA, otherLocation, nonToyCharacterB] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(andysRoomLocation)).toBe("hand");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [woodyLeaderOfTheToys],
        inkwell: woodyLeaderOfTheToys.cost,
        deck: [nonToyCharacterA, toyCharacter, otherLocation, nonToyCharacterB],
      });

      expect(testEngine.asPlayerOne().playCard(woodyLeaderOfTheToys)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(woodyLeaderOfTheToys, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Toy character should remain in the deck, not moved to hand
      expect(testEngine.asPlayerOne().getCardZone(toyCharacter)).toBe("deck");
    });
  });
});

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { amazusInkcaster } from "./134-amazus-inkcaster";

const locationCard = createMockLocation({
  id: "amazus-inkcaster-location",
  name: "Hidden Location",
  cost: 3,
});

const characterA = createMockCharacter({
  id: "amazus-inkcaster-char-a",
  name: "Character A",
  cost: 2,
});

const characterB = createMockCharacter({
  id: "amazus-inkcaster-char-b",
  name: "Character B",
  cost: 2,
});

const characterC = createMockCharacter({
  id: "amazus-inkcaster-char-c",
  name: "Character C",
  cost: 2,
});

const characterD = createMockCharacter({
  id: "amazus-inkcaster-char-d",
  name: "Character D",
  cost: 2,
});

describe("Amazu's Inkcaster", () => {
  describe("ON THE HORIZON - {E}, 1 {I} — Look at the top 4 cards of your deck. You may reveal a location card and put it into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("reveals a location card among the top 4 and puts it into hand, placing the rest on the bottom of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        play: [amazusInkcaster],
        deck: [characterA, locationCard, characterB, characterC],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(amazusInkcaster, {
          ability: "ON THE HORIZON",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(amazusInkcaster, {
          destinations: [
            { zone: "hand", cards: [locationCard] },
            { zone: "deck-bottom", cards: [characterA, characterB, characterC] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(locationCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(characterA)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(characterB)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(characterC)).toBe("deck");
    });

    it("can choose to take no card and send all four to the bottom of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        play: [amazusInkcaster],
        deck: [characterA, locationCard, characterB, characterC],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(amazusInkcaster, {
          ability: "ON THE HORIZON",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(amazusInkcaster, {
          destinations: [
            { zone: "hand", cards: [] },
            {
              zone: "deck-bottom",
              cards: [characterA, locationCard, characterB, characterC],
            },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(locationCard)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(characterA)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(characterB)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(characterC)).toBe("deck");
    });

    it("does not let you put a non-location card into your hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        play: [amazusInkcaster],
        deck: [characterA, characterB, characterC, characterD],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(amazusInkcaster, {
          ability: "ON THE HORIZON",
        }),
      ).toBeSuccessfulCommand();

      const result = testEngine.asPlayerOne().resolvePendingEffect(amazusInkcaster, {
        destinations: [
          { zone: "hand", cards: [characterA] },
          { zone: "deck-bottom", cards: [characterB, characterC, characterD] },
        ],
      });

      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(characterA)).not.toBe("hand");
    });

    it("exerts the item and spends 1 ink to activate", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        play: [amazusInkcaster],
        deck: [characterA, locationCard, characterB, characterC],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(amazusInkcaster, {
          ability: "ON THE HORIZON",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(amazusInkcaster)).toBe("play");
    });
  });
});

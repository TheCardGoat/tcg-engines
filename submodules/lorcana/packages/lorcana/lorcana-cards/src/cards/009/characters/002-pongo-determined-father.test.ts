import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { pongoDeterminedFather } from "./002-pongo-determined-father";

const characterCard = createMockCharacter({
  id: "pongo-009-df-character",
  name: "Character Card",
  cost: 2,
});

const nonCharacterCard = createMockItem({
  id: "pongo-009-df-item",
  name: "Non Character Card",
  cost: 2,
});

const fillerA = createMockCharacter({
  id: "pongo-009-df-filler-a",
  name: "Filler A",
  cost: 1,
});

const fillerB = createMockCharacter({
  id: "pongo-009-df-filler-b",
  name: "Filler B",
  cost: 1,
});

describe("Pongo - Determined Father", () => {
  describe("TWILIGHT BARK - Once per turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.", () => {
    it("puts the top card into hand when it's a character card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: pongoDeterminedFather, isDrying: false }],
        inkwell: 2,
        deck: [fillerA, characterCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(pongoDeterminedFather, {
          ability: "TWILIGHT BARK",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [{ zone: "hand", cards: [characterCard] }],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(characterCard)).toBe("hand");
    });

    it("puts the top card on the bottom of the deck when it's not a character card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: pongoDeterminedFather, isDrying: false }],
        inkwell: 2,
        deck: [fillerA, fillerB, nonCharacterCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(pongoDeterminedFather, {
          ability: "TWILIGHT BARK",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
      ).toBeSuccessfulCommand();

      // The item card should remain in the deck (put on the bottom)
      expect(testEngine.asPlayerOne().getCardZone(nonCharacterCard)).toBe("deck");

      // Deck should still have 3 cards
      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds).toHaveLength(3);

      // nonCharacterCard should be at the bottom (index 0)
      expect(deckIds[0]).toBe(nonCharacterCard.id);
    });

    it("costs 2 ink to activate", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: pongoDeterminedFather, isDrying: false }],
        inkwell: 1,
        deck: [characterCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(pongoDeterminedFather, {
          ability: "TWILIGHT BARK",
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("can only be activated once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: pongoDeterminedFather, isDrying: false }],
        inkwell: 10,
        deck: [fillerA, characterCard, fillerB],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(pongoDeterminedFather, {
          ability: "TWILIGHT BARK",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().activateAbility(pongoDeterminedFather, {
          ability: "TWILIGHT BARK",
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("cannot be activated when Pongo is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pongoDeterminedFather],
        inkwell: 2,
        deck: [characterCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(pongoDeterminedFather, {
          ability: "TWILIGHT BARK",
        }),
      ).not.toBeSuccessfulCommand();
    });
  });
});

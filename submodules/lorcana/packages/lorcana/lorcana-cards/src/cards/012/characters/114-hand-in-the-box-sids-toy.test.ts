import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { handintheboxSidsToy } from "./114-hand-in-the-box-sids-toy";

const toyInDiscard = createMockCharacter({
  id: "toy-in-discard",
  name: "Toy In Discard",
  cost: 3,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const nonToyInDiscard = createMockCharacter({
  id: "non-toy-in-discard",
  name: "Non Toy",
  cost: 3,
  classifications: ["Storyborn", "Hero"],
});

describe("Hand-in-the-Box - Sid's Toy", () => {
  describe("SPRING-LOADED - You may put a Toy character card from your discard on the bottom of your deck to play this character for free.", () => {
    it("can be played for free by putting a Toy character card from discard on the bottom of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [handintheboxSidsToy],
        discard: [toyInDiscard],
        inkwell: 0,
      });

      const deckBottomTarget = testEngine.findCardInstanceId(toyInDiscard, "discard");

      expect(
        testEngine.asPlayerOne().playCard(handintheboxSidsToy, {
          cost: { cost: "put-on-deck-bottom", deckBottomTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(toyInDiscard)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(handintheboxSidsToy)).toBe("play");
    });

    it("can still be played normally with ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [handintheboxSidsToy],
        inkwell: handintheboxSidsToy.cost,
      });

      expect(testEngine.asPlayerOne().playCard(handintheboxSidsToy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handintheboxSidsToy)).toBe("play");
    });

    it("cannot use the alternative cost with a non-Toy character in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [handintheboxSidsToy],
        discard: [nonToyInDiscard],
        inkwell: 0,
      });

      const deckBottomTarget = testEngine.findCardInstanceId(nonToyInDiscard, "discard");

      expect(
        testEngine.asPlayerOne().playCard(handintheboxSidsToy, {
          cost: { cost: "put-on-deck-bottom", deckBottomTarget },
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("cannot use the alternative cost targeting a card not in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [handintheboxSidsToy, toyInDiscard],
        inkwell: 0,
      });

      const invalidTarget = testEngine.findCardInstanceId(toyInDiscard, "hand");

      expect(
        testEngine.asPlayerOne().playCard(handintheboxSidsToy, {
          cost: { cost: "put-on-deck-bottom", deckBottomTarget: invalidTarget },
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("appears in available moves when a Toy character is in discard and ink is 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [handintheboxSidsToy],
        discard: [toyInDiscard],
        inkwell: 0,
      });
      const handintheboxId = testEngine.findCardInstanceId(handintheboxSidsToy, "hand");

      const availableMoves = testEngine.asPlayerOne().getAvailableMoves();
      const playCardMove = availableMoves.find((m) => m.moveId === "playCard");
      expect(playCardMove).toBeDefined();
      expect(playCardMove!.selectableCardIds).toContain(handintheboxId);
    });

    it("does not appear in available moves when no Toy character is in discard and ink is 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [handintheboxSidsToy],
        discard: [nonToyInDiscard],
        inkwell: 0,
      });

      const availableMoves = testEngine.asPlayerOne().getAvailableMoves();
      const playCardMove = availableMoves.find((m) => m.moveId === "playCard");
      if (playCardMove) {
        const handintheboxId = testEngine.findCardInstanceId(handintheboxSidsToy, "hand");
        expect(playCardMove.selectableCardIds).not.toContain(handintheboxId);
      }
    });
  });
});

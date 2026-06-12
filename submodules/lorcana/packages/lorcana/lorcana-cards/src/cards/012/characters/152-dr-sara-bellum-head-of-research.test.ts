import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { drSaraBellumHeadOfResearch } from "./152-dr-sara-bellum-head-of-research";

// Deck is indexed as [bottom, ..., top]: bottomCard sits at the bottom, topCard sits on top.
const bottomCard = createMockCharacter({
  id: "sara-bellum-bottom-card",
  name: "Bottom Card",
  cost: 1,
});

const topCard = createMockCharacter({
  id: "sara-bellum-top-card",
  name: "Top Card",
  cost: 2,
});

describe("Dr. Sara Bellum - Head of Research", () => {
  describe("SCIENTIFIC SCRUTINY - When you play this character, look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
    it("lets the controller keep the top card on top of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [drSaraBellumHeadOfResearch],
        inkwell: drSaraBellumHeadOfResearch.cost,
        deck: [bottomCard, topCard],
      });

      expect(testEngine.asPlayerOne().playCard(drSaraBellumHeadOfResearch)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(drSaraBellumHeadOfResearch, {
          destinations: [
            { zone: "deck-top", cards: [topCard] },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).toBeSuccessfulCommand();

      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds).toEqual([bottomCard.id, topCard.id]);
      expect(testEngine.asPlayerOne().getCardZone(drSaraBellumHeadOfResearch)).toBe("play");
    });

    it("lets the controller send the top card to the bottom of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [drSaraBellumHeadOfResearch],
        inkwell: drSaraBellumHeadOfResearch.cost,
        deck: [bottomCard, topCard],
      });

      expect(testEngine.asPlayerOne().playCard(drSaraBellumHeadOfResearch)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(drSaraBellumHeadOfResearch, {
          destinations: [
            { zone: "deck-top", cards: [] },
            { zone: "deck-bottom", cards: [topCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds).toEqual([topCard.id, bottomCard.id]);
      expect(testEngine.asPlayerOne().getCardZone(topCard)).toBe("deck");
    });
  });
});

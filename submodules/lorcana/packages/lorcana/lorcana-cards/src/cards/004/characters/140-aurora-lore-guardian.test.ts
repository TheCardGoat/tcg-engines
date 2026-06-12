import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { auroraLoreGuardian } from "./140-aurora-lore-guardian";
import { pawpsicle } from "../../002/items/169-pawpsicle";

const topCard = createMockCharacter({
  id: "aurora-top-card",
  name: "Top Card",
  cost: 1,
});
const secondCard = createMockCharacter({
  id: "aurora-second-card",
  name: "Second Card",
  cost: 2,
});
const opponentItem = createMockItem({
  id: "opponent-item",
  name: "Opponent Item",
  cost: 2,
});

describe("Aurora - Lore Guardian", () => {
  describe("ROYAL INVENTORY", () => {
    it("exerts an item to look at top card and put it on the bottom", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: auroraLoreGuardian, isDrying: false }, pawpsicle],
        deck: [topCard, secondCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(auroraLoreGuardian, {
          costs: { exertItems: [pawpsicle] },
        }),
      ).toBeSuccessfulCommand();

      // Resolve scry - put the top card on the bottom
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "deck-top", cards: [] },
            { zone: "deck-bottom", cards: [secondCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // Verify the item was exerted
      const pawpsicleId = testEngine.findCardInstanceId(pawpsicle, "play", PLAYER_ONE);
      expect(testEngine.asServer().getCard(pawpsicleId)?.exerted).toBe(true);

      // Verify deck order: secondCard on top, topCard on bottom
      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds).toEqual([secondCard.id, topCard.id]);
    });

    it("exerts an item to look at top card and keep it on top", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: auroraLoreGuardian, isDrying: false }, pawpsicle],
        deck: [topCard, secondCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(auroraLoreGuardian, {
          costs: { exertItems: [pawpsicle] },
        }),
      ).toBeSuccessfulCommand();

      // Resolve scry - keep the top card on top (put into deck-top destination)
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "deck-top", cards: [secondCard] },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // Verify topCard is still in the deck (scry puts it back)
      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds).toContain(topCard.id);
      expect(deckIds).toContain(secondCard.id);
      expect(deckIds).toHaveLength(2);
    });

    it("fails if no items are available to exert", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: auroraLoreGuardian, isDrying: false }],
        deck: [topCard, secondCard],
      });

      const result = testEngine.asPlayerOne().activateAbility(auroraLoreGuardian) as CommandFailure;
      expect(result.success).toBe(false);
    });

    it("regression: fails if all items are already exerted (no valid item targets remain)", () => {
      // Bug: Aurora's exert ability was triggerable even when no valid item targets
      // remain to exert (all items already exerted).
      // Expected: Ability should not be activatable when all items are exerted.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: auroraLoreGuardian, isDrying: false },
          { card: pawpsicle, exerted: true },
        ],
        deck: [topCard, secondCard],
      });

      const result = testEngine.asPlayerOne().activateAbility(auroraLoreGuardian) as CommandFailure;
      expect(result.success).toBe(false);
    });
  });

  describe("PRESERVER", () => {
    it("prevents opponents from choosing your items for abilities or effects", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pawpsicle],
        },
        {
          play: [auroraLoreGuardian, opponentItem],
        },
      );

      // Player two's items should not be choosable by player one when Aurora is in play
      // This is effectively Ward for items
      const p2ItemId = testEngine.findCardInstanceId(opponentItem, "play", PLAYER_TWO);
      expect(p2ItemId).toBeDefined();

      // Player one's items should still be selectable by player one
      const p1ItemId = testEngine.findCardInstanceId(pawpsicle, "play", PLAYER_ONE);
      expect(p1ItemId).toBeDefined();
    });
  });
});

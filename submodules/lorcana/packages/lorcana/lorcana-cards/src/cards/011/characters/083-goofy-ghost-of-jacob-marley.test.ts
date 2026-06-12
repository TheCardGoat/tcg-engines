import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { goofyGhostOfJacobMarley } from "./083-goofy-ghost-of-jacob-marley";

const handFodder1 = createMockCharacter({
  id: "goofy-marley-hand-fodder-1",
  name: "Hand Fodder 1",
  cost: 1,
});

const handFodder2 = createMockCharacter({
  id: "goofy-marley-hand-fodder-2",
  name: "Hand Fodder 2",
  cost: 1,
});

const handFodder3 = createMockCharacter({
  id: "goofy-marley-hand-fodder-3",
  name: "Hand Fodder 3",
  cost: 1,
});

describe("Goofy - Ghost of Jacob Marley", () => {
  describe("GRAVE OUTCOME - When this character is banished, each opponent chooses and discards a card for each card that was under him", () => {
    it("One card under - forces opponent to discard 1 card", () => {
      // Player Two owns Goofy, so "each opponent" = Player One
      // Player One has Dragon Fire + 3 hand fodders
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire, handFodder1, handFodder2, handFodder3],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [goofyGhostOfJacobMarley],
          deck: 5,
        },
      );

      // Put 1 card under Goofy
      const goofyIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_TWO);
      const goofyId = goofyIds.find(
        (id) => testEngine.getCardDefinitionId(id) === goofyGhostOfJacobMarley.id,
      );
      expect(goofyId).toBeDefined();

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      const deckCard = deckCards[0];
      expect(deckCard).toBeDefined();

      testEngine.putCardUnder(goofyId!, deckCard!);
      expect(testEngine.getCardsUnder(goofyId!)).toHaveLength(1);

      // Player 1 plays Dragon Fire to banish Goofy
      // Hand goes from 4 → 3 (Dragon Fire played)
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [goofyGhostOfJacobMarley],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(goofyGhostOfJacobMarley)).toBe("discard");

      // GRAVE OUTCOME triggers: Player One (opponent) must discard 1 card
      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(goofyGhostOfJacobMarley),
        ).toBeSuccessfulCommand();
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [handFodder1] }),
        ).toBeSuccessfulCommand();
      }

      // Started with 4, played Dragon Fire (-1), discarded 1 more (-1) = 2
      const opponentHandAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(opponentHandAfter).toBe(2);
    });

    it("Two cards under - forces opponent to discard 2 cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire, handFodder1, handFodder2, handFodder3],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [goofyGhostOfJacobMarley],
          deck: 5,
        },
      );

      const goofyIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_TWO);
      const goofyId = goofyIds.find(
        (id) => testEngine.getCardDefinitionId(id) === goofyGhostOfJacobMarley.id,
      );
      expect(goofyId).toBeDefined();

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      const deckCard1 = deckCards[0];
      const deckCard2 = deckCards[1];
      expect(deckCard1).toBeDefined();
      expect(deckCard2).toBeDefined();

      testEngine.putCardUnder(goofyId!, deckCard1!);
      testEngine.putCardUnder(goofyId!, deckCard2!);
      expect(testEngine.getCardsUnder(goofyId!)).toHaveLength(2);

      // Player 1 banishes Goofy
      // Hand goes from 4 → 3 (Dragon Fire played)
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [goofyGhostOfJacobMarley],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(goofyGhostOfJacobMarley)).toBe("discard");

      // GRAVE OUTCOME triggers: Player One (opponent) must discard 2 cards
      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(goofyGhostOfJacobMarley),
        ).toBeSuccessfulCommand();
        expect(
          testEngine.asPlayerOne().resolveNextPending({
            targets: [handFodder1, handFodder2],
          }),
        ).toBeSuccessfulCommand();
      }

      // Started with 4, played Dragon Fire (-1), discarded 2 more (-2) = 1
      const opponentHandAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(opponentHandAfter).toBe(1);
    });

    it("No cards under - no discard occurs", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire, handFodder1, handFodder2],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [goofyGhostOfJacobMarley],
          deck: 5,
        },
      );

      // Player 1 plays Dragon Fire to banish Goofy (no cards under)
      // Hand goes from 3 → 2 (Dragon Fire played)
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [goofyGhostOfJacobMarley],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(goofyGhostOfJacobMarley)).toBe("discard");

      // With 0 cards under, the dynamic amount is 0 so no discard should occur
      // Started with 3, played Dragon Fire (-1) = 2
      const opponentHandAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(opponentHandAfter).toBe(2);
    });
  });
});

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { goldieOgiltCunningProspector } from "./087-goldie-ogilt-cunning-prospector";

const mockLocation = createMockLocation({
  id: "test-location-a",
  name: "Test Location",
  cost: 2,
  moveCost: 1,
  willpower: 5,
  lore: 1,
});

const mockLocationB = createMockLocation({
  id: "test-location-b",
  name: "Test Location B",
  cost: 3,
  moveCost: 1,
  willpower: 5,
  lore: 1,
});

const mockCharacter = createMockCharacter({
  id: "test-char-a",
  name: "Test Character",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Goldie O'Gilt - Cunning Prospector", () => {
  describe("CLAIM JUMPER - When you play this character, chosen opponent reveals their hand and discards a location card of your choice.", () => {
    it("forces chosen opponent to reveal their hand and discard a location card on play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [goldieOgiltCunningProspector],
          inkwell: goldieOgiltCunningProspector.cost,
        },
        {
          hand: [mockLocation, mockCharacter],
        },
      );

      const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(goldieOgiltCunningProspector),
      ).toBeSuccessfulCommand();

      // Controller chooses the location card to discard
      const locationCardId = testEngine.findCardInstanceId(mockLocation, "hand", PLAYER_TWO);
      expect(testEngine.asPlayerOne().respondWith(locationCardId)).toBeSuccessfulCommand();

      // Location card should be discarded
      expect(testEngine.asPlayerTwo().getCardZone(mockLocation)).toBe("discard");

      // Non-location card remains in hand
      expect(testEngine.asPlayerTwo().getCardZone(mockCharacter)).toBe("hand");

      // All opponent hand cards should have been revealed
      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBe(true);
      }
    });

    it("does nothing if the chosen opponent has no location cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [goldieOgiltCunningProspector],
          inkwell: goldieOgiltCunningProspector.cost,
        },
        {
          hand: [mockCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(goldieOgiltCunningProspector),
      ).toBeSuccessfulCommand();

      // No location in hand - discard step auto-resolves with no effect
      expect(testEngine.asPlayerTwo().getCardZone(mockCharacter)).toBe("hand");
    });
  });

  describe("STRIKE GOLD - Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.", () => {
    it("gains 1 lore when controller puts a location card from chosen player's discard to bottom of their deck on quest", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: goldieOgiltCunningProspector, isDrying: false }],
          deck: 5,
        },
        {
          discard: [mockLocation],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(goldieOgiltCunningProspector)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const locationId = testEngine.findCardInstanceId(mockLocation, "discard", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goldieOgiltCunningProspector, {
          resolveOptional: true,
          targets: [locationId],
        }),
      ).toBeSuccessfulCommand();

      // Location card should be moved to deck (bottom)
      expect(testEngine.asPlayerTwo().getCardZone(mockLocation)).toBe("deck");

      // Lore gained: quest lore + 1 from STRIKE GOLD
      expect(testEngine.getLore(PLAYER_ONE)).toBe(goldieOgiltCunningProspector.lore + 1);
    });

    it("does not gain lore if no location card is moved (optional effect declined)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: goldieOgiltCunningProspector, isDrying: false }],
          deck: 5,
        },
        {
          discard: [mockLocation],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(goldieOgiltCunningProspector)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goldieOgiltCunningProspector, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Location card should still be in discard
      expect(testEngine.asPlayerTwo().getCardZone(mockLocation)).toBe("discard");

      // Only quest lore
      expect(testEngine.getLore(PLAYER_ONE)).toBe(goldieOgiltCunningProspector.lore);
    });

    it("does nothing if chosen player has no location cards in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: goldieOgiltCunningProspector, isDrying: false }],
          deck: 5,
        },
        {
          discard: [mockCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(goldieOgiltCunningProspector)).toBeSuccessfulCommand();

      // The optional bag effect may appear but accepting it with no valid targets does nothing
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(goldieOgiltCunningProspector, {
            resolveOptional: true,
          }),
        ).toBeSuccessfulCommand();
      }

      // Character stays in discard (not a location, not affected)
      expect(testEngine.asPlayerTwo().getCardZone(mockCharacter)).toBe("discard");

      // Only quest lore
      expect(testEngine.getLore(PLAYER_ONE)).toBe(goldieOgiltCunningProspector.lore);
    });

    it("can target own discard to put a location card on the bottom of own deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: goldieOgiltCunningProspector, isDrying: false }],
        discard: [mockLocationB],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(goldieOgiltCunningProspector)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const locationId = testEngine.findCardInstanceId(mockLocationB, "discard", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goldieOgiltCunningProspector, {
          resolveOptional: true,
          targets: [locationId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockLocationB)).toBe("deck");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(goldieOgiltCunningProspector.lore + 1);
    });
  });
});

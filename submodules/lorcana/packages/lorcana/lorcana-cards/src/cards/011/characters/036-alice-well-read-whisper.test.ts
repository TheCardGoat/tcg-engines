import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { aliceWellreadWhisper } from "./036-alice-well-read-whisper";

describe("Alice - Well-Read Whisper", () => {
  describe("Boost 2 - Once during your turn, you may pay 2 ink to put the top card of your deck facedown under this character", () => {
    it("should activate Boost 2 and put a card from deck under Alice", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aliceWellreadWhisper],
        deck: 5,
        inkwell: 10,
      });

      const aliceIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);
      const aliceId = aliceIds.find(
        (id) => testEngine.getCardDefinitionId(id) === aliceWellreadWhisper.id,
      );
      expect(aliceId).toBeDefined();

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(
        testEngine.asPlayerOne().activateAbility(aliceWellreadWhisper, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore - 1);
      expect(testEngine.getCardsUnder(aliceId!)).toHaveLength(1);
    });

    it("should only trigger once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aliceWellreadWhisper],
        deck: 5,
        inkwell: 10,
      });

      const aliceIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);
      const aliceId = aliceIds.find(
        (id) => testEngine.getCardDefinitionId(id) === aliceWellreadWhisper.id,
      );
      expect(aliceId).toBeDefined();

      // First activation should work
      expect(
        testEngine.asPlayerOne().activateAbility(aliceWellreadWhisper, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(aliceId!)).toHaveLength(1);

      // Second activation should not work (once per turn)
      const result = testEngine
        .asPlayerOne()
        .activateAbility(aliceWellreadWhisper, { ability: "Boost" });
      expect(result.success).toBe(false);
      expect(testEngine.getCardsUnder(aliceId!)).toHaveLength(1);
    });
  });

  describe("MYSTICAL INSIGHT - Whenever this character quests, put all cards from under her into your hand", () => {
    it("should put all cards from under Alice into hand when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aliceWellreadWhisper],
        deck: 5,
        inkwell: 10,
      });

      const aliceIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);
      const aliceId = aliceIds.find(
        (id) => testEngine.getCardDefinitionId(id) === aliceWellreadWhisper.id,
      );
      expect(aliceId).toBeDefined();

      // Use Boost to put a card under Alice
      expect(
        testEngine.asPlayerOne().activateAbility(aliceWellreadWhisper, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(aliceId!)).toHaveLength(1);

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      // Quest with Alice - MYSTICAL INSIGHT should trigger and auto-resolve
      expect(testEngine.asPlayerOne().quest(aliceWellreadWhisper)).toBeSuccessfulCommand();

      // Resolve the triggered ability if it requires resolution
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const effect of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(aliceWellreadWhisper);
      }

      // Card should now be in hand
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
      expect(testEngine.getCardsUnder(aliceId!)).toHaveLength(0);
    });

    it("should put multiple cards from under Alice into hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aliceWellreadWhisper],
        deck: 5,
        inkwell: 10,
      });

      const aliceIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);
      const aliceId = aliceIds.find(
        (id) => testEngine.getCardDefinitionId(id) === aliceWellreadWhisper.id,
      );
      expect(aliceId).toBeDefined();

      // Put 2 cards under Alice manually
      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      const deckCard1 = deckCards[0];
      const deckCard2 = deckCards[1];
      expect(deckCard1).toBeDefined();
      expect(deckCard2).toBeDefined();

      testEngine.putCardUnder(aliceId!, deckCard1!);
      testEngine.putCardUnder(aliceId!, deckCard2!);
      expect(testEngine.getCardsUnder(aliceId!)).toHaveLength(2);

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      // Quest with Alice - MYSTICAL INSIGHT should trigger
      expect(testEngine.asPlayerOne().quest(aliceWellreadWhisper)).toBeSuccessfulCommand();

      // Resolve the triggered ability if it requires resolution
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const effect of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(aliceWellreadWhisper);
      }

      // Both cards should now be in hand
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 2);
      expect(testEngine.getCardsUnder(aliceId!)).toHaveLength(0);
    });

    it("should NOT trigger when no cards are under Alice", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: aliceWellreadWhisper, isDrying: false }],
        deck: 5,
      });

      const aliceIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);
      const aliceId = aliceIds.find(
        (id) => testEngine.getCardDefinitionId(id) === aliceWellreadWhisper.id,
      );
      expect(aliceId).toBeDefined();
      expect(testEngine.getCardsUnder(aliceId!)).toHaveLength(0);

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      // Quest with Alice - should NOT trigger MYSTICAL INSIGHT since no cards under
      expect(testEngine.asPlayerOne().quest(aliceWellreadWhisper)).toBeSuccessfulCommand();

      // No bag effects should be created
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore);
    });
  });
});

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { merlinCompletingHisResearch } from "./058-merlin-completing-his-research";

const opponentChallenger = createMockCharacter({
  id: "merlin-test-opponent",
  name: "Opponent Challenger",
  cost: 2,
  strength: 3,
  willpower: 5,
});

describe("Merlin - Completing His Research", () => {
  describe("Boost 2", () => {
    it("has Boost keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [merlinCompletingHisResearch],
      });

      expect(testEngine.hasKeyword(merlinCompletingHisResearch, "Boost")).toBe(true);
    });

    it("can activate Boost 2 to put top card of deck under Merlin", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 2,
        deck: 3,
        play: [merlinCompletingHisResearch],
      });

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(
        testEngine.asPlayerOne().activateAbility(merlinCompletingHisResearch, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore - 1);
      expect(testEngine.getCardsUnder(merlinCompletingHisResearch)).toHaveLength(1);
    });

    it("can only use Boost once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 4,
        deck: 5,
        play: [merlinCompletingHisResearch],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(merlinCompletingHisResearch, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(merlinCompletingHisResearch)).toHaveLength(1);

      const result = testEngine
        .asPlayerOne()
        .activateAbility(merlinCompletingHisResearch, { ability: "Boost" });
      expect(result.success).toBe(false);
      expect(testEngine.getCardsUnder(merlinCompletingHisResearch)).toHaveLength(1);
    });
  });

  describe("LEGACY OF LEARNING - When this character is banished in a challenge, if he had a card under him, draw 2 cards", () => {
    it("triggers when banished by opponent in a challenge with a card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: merlinCompletingHisResearch, exerted: true }],
          deck: 5,
          inkwell: 2,
        },
        {
          play: [opponentChallenger],
        },
      );

      const merlinId = testEngine.findCardInstanceId(
        merlinCompletingHisResearch,
        "play",
        PLAYER_ONE,
      );

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      testEngine.putCardUnder(merlinId, deckCards[0]!);
      expect(testEngine.getCardsUnder(merlinId)).toHaveLength(1);

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().challenge(opponentChallenger, merlinCompletingHisResearch),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(merlinCompletingHisResearch)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("draws 2 cards when Merlin challenges and gets banished with a card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [merlinCompletingHisResearch],
          deck: 5,
          inkwell: 2,
        },
        {
          play: [{ card: opponentChallenger, exerted: true }],
        },
      );

      const merlinId = testEngine.findCardInstanceId(
        merlinCompletingHisResearch,
        "play",
        PLAYER_ONE,
      );

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      testEngine.putCardUnder(merlinId, deckCards[0]!);
      expect(testEngine.getCardsUnder(merlinId)).toHaveLength(1);

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(merlinCompletingHisResearch, opponentChallenger),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(merlinCompletingHisResearch)).toBe("discard");

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      if (bagEffect) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(merlinCompletingHisResearch),
        ).toBeSuccessfulCommand();
      }

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 2);
    });

    it("does NOT trigger when banished without a card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: merlinCompletingHisResearch, exerted: true }],
          deck: 5,
        },
        {
          play: [opponentChallenger],
        },
      );

      const merlinId = testEngine.findCardInstanceId(
        merlinCompletingHisResearch,
        "play",
        PLAYER_ONE,
      );

      expect(testEngine.getCardsUnder(merlinId)).toHaveLength(0);

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().challenge(opponentChallenger, merlinCompletingHisResearch),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(merlinCompletingHisResearch)).toBe("discard");
      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // No card under him, so no ability triggered and no cards drawn
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(0);
    });
  });
});

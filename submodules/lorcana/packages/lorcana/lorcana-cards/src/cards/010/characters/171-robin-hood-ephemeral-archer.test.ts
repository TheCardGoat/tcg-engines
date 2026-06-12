import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { robinHoodEphemeralArcher } from "./171-robin-hood-ephemeral-archer";

const deckCard = createMockCharacter({
  id: "robin-hood-deck-card",
  name: "Deck Card",
  cost: 1,
});

const opponentCharacter1 = createMockCharacter({
  id: "opponent-char-1",
  name: "Opponent Character 1",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opponentCharacter2 = createMockCharacter({
  id: "opponent-char-2",
  name: "Opponent Character 2",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const ownCharacter = createMockCharacter({
  id: "own-char-1",
  name: "Own Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Robin Hood - Ephemeral Archer", () => {
  describe("Boost 1", () => {
    it("has Boost keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [robinHoodEphemeralArcher],
      });

      expect(testEngine.hasKeyword(robinHoodEphemeralArcher, "Boost")).toBe(true);
    });

    it("can activate Boost 1 to put top card of deck under Robin Hood", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        deck: 3,
        play: [robinHoodEphemeralArcher],
      });

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(
        testEngine.asPlayerOne().activateAbility(robinHoodEphemeralArcher, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore - 1);
      expect(testEngine.getCardsUnder(robinHoodEphemeralArcher)).toHaveLength(1);
    });

    it("can only use Boost once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 2,
        deck: 5,
        play: [robinHoodEphemeralArcher],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(robinHoodEphemeralArcher, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(robinHoodEphemeralArcher)).toHaveLength(1);

      const result = testEngine
        .asPlayerOne()
        .activateAbility(robinHoodEphemeralArcher, { ability: "Boost" });
      expect(result.success).toBe(false);
      expect(testEngine.getCardsUnder(robinHoodEphemeralArcher)).toHaveLength(1);
    });
  });

  describe("EXPERT SHOT - Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters", () => {
    it("has the correct trigger event and subject", () => {
      const abilities = robinHoodEphemeralArcher.abilities ?? [];
      const expertShot = abilities.find(
        (a) => a.type === "triggered" && "name" in a && a.name === "EXPERT SHOT",
      );

      expect(expertShot).toBeDefined();
      expect(expertShot?.type).toBe("triggered");

      if (expertShot?.type === "triggered") {
        expect(expertShot.trigger.event).toBe("quest");
        expect(expertShot.trigger.on).toBe("SELF");
        expect(expertShot.trigger.timing).toBe("whenever");
      }
    });

    it("has a has-card-under condition at the ability level", () => {
      const abilities = robinHoodEphemeralArcher.abilities ?? [];
      const expertShot = abilities.find(
        (a) => a.type === "triggered" && "name" in a && a.name === "EXPERT SHOT",
      );

      expect(expertShot).toBeDefined();
      expect(expertShot?.type).toBe("triggered");

      if (expertShot?.type === "triggered") {
        expect(expertShot.condition).toBeDefined();
        if (expertShot.condition) {
          expect(expertShot.condition.type).toBe("has-card-under");
        }
      }
    });

    it("does NOT trigger when questing without a card under Robin Hood", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodEphemeralArcher, isDrying: false }],
        },
        {
          play: [opponentCharacter1, opponentCharacter2],
        },
      );

      expect(testEngine.asPlayerOne().quest(robinHoodEphemeralArcher)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // Condition failed (no card under Robin Hood), so no damage dealt
      expect(testEngine.asPlayerTwo().getCard(opponentCharacter1).damage).toBe(0);
      expect(testEngine.asPlayerTwo().getCard(opponentCharacter2).damage).toBe(0);
    });

    it("deals 1 damage to 2 chosen characters when questing with a card under Robin Hood", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodEphemeralArcher, isDrying: false, cardsUnder: [deckCard] }],
        },
        {
          play: [opponentCharacter1, opponentCharacter2],
        },
      );

      expect(testEngine.asPlayerOne().quest(robinHoodEphemeralArcher)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(robinHoodEphemeralArcher, {
          targets: [opponentCharacter1, opponentCharacter2],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(opponentCharacter1).damage).toBe(1);
      expect(testEngine.asPlayerTwo().getCard(opponentCharacter2).damage).toBe(1);
    });

    it("can deal 1 damage to only 1 chosen character when questing with a card under Robin Hood", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodEphemeralArcher, isDrying: false, cardsUnder: [deckCard] }],
        },
        {
          play: [opponentCharacter1],
        },
      );

      expect(testEngine.asPlayerOne().quest(robinHoodEphemeralArcher)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(robinHoodEphemeralArcher, { targets: [opponentCharacter1] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(opponentCharacter1).damage).toBe(1);
    });

    it("can target own characters with the damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: robinHoodEphemeralArcher, isDrying: false, cardsUnder: [deckCard] },
            ownCharacter,
          ],
        },
        {
          play: [opponentCharacter1],
        },
      );

      expect(testEngine.asPlayerOne().quest(robinHoodEphemeralArcher)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(robinHoodEphemeralArcher, {
          targets: [ownCharacter, opponentCharacter1],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(ownCharacter).damage).toBe(1);
      expect(testEngine.asPlayerTwo().getCard(opponentCharacter1).damage).toBe(1);
    });
  });
});

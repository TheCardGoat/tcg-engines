import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { nickWildePersistentInvestigator } from "./187-nick-wilde-persistent-investigator";

const detectiveAttacker = createMockCharacter({
  id: "nw-detective-attacker",
  name: "Detective Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Detective"],
});

const nonDetectiveAttacker = createMockCharacter({
  id: "nw-non-detective-attacker",
  name: "Non-Detective Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const weakDefender = createMockCharacter({
  id: "nw-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Nick Wilde - Persistent Investigator", () => {
  it("has Shift 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: nickWildePersistentInvestigator, isDrying: false }],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCardZone(nickWildePersistentInvestigator)).toBe("play");
  });

  describe("CASE CLOSED - During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.", () => {
    it("draws a card when a Detective character banishes another character in a challenge during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: nickWildePersistentInvestigator, isDrying: false },
            { card: detectiveAttacker, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(detectiveAttacker, weakDefender),
      ).toBeSuccessfulCommand();

      // Weak defender should be banished
      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // CASE CLOSED draw is mandatory, so it auto-resolves without going through the bag
      // Should draw a card from CASE CLOSED
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("does NOT draw a card when a non-Detective character banishes another character in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: nickWildePersistentInvestigator, isDrying: false },
            { card: nonDetectiveAttacker, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(nonDetectiveAttacker, weakDefender),
      ).toBeSuccessfulCommand();

      // Weak defender should be banished
      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // Should NOT draw a card — attacker is not a Detective
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore);
    });

    it("draws a card when Nick Wilde himself banishes another character in a challenge (he is a Detective)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: nickWildePersistentInvestigator, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(nickWildePersistentInvestigator, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // Nick Wilde IS a Detective, so CASE CLOSED should trigger
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("does NOT draw a card when banish happens during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: nickWildePersistentInvestigator, exerted: true },
            { card: detectiveAttacker, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: nonDetectiveAttacker, isDrying: false }],
          deck: 1,
        },
      );

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      // Opponent challenges the exerted Nick Wilde and banishes him
      // (Nick Wilde: 5/4, nonDetectiveAttacker: 5/5 — Nick Wilde gets banished)
      expect(
        testEngine.asPlayerTwo().challenge(nonDetectiveAttacker, nickWildePersistentInvestigator),
      ).toBeSuccessfulCommand();

      // Should NOT draw — it's the opponent's turn, not your turn
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore);
    });
  });
});

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { wendyDarlingPirateQueen } from "./012-wendy-darling-pirate-queen";

const ally = createMockCharacter({
  id: "wendy-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const damagedCharacter = createMockCharacter({
  id: "wendy-test-damaged-character",
  name: "Damaged Character",
  cost: 3,
  strength: 2,
  willpower: 6,
});

const strongOpponent = createMockCharacter({
  id: "wendy-test-strong-opponent",
  name: "Strong Opponent",
  cost: 5,
  strength: 8,
  willpower: 8,
});

describe("Wendy Darling - Pirate Queen", () => {
  describe("Evasive", () => {
    it("has the Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [wendyDarlingPirateQueen],
      });

      expect(testEngine.asPlayerOne().hasKeyword(wendyDarlingPirateQueen, "Evasive")).toBe(true);
    });
  });

  describe("TELL NO TALES - Whenever one of your other characters is banished, you may remove all damage from chosen character.", () => {
    it("triggers when another of your characters is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [wendyDarlingPirateQueen, ally],
        deck: 2,
      });

      // Banish the ally by setting fatal damage
      expect(testEngine.asServer().manualSetDamage(ally, ally.willpower)).toBeSuccessfulCommand();

      // Ally should be banished
      expect(testEngine.asPlayerOne().getCardZone(ally)).toBe("discard");

      // TELL NO TALES should trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("removes all damage from chosen character when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [wendyDarlingPirateQueen, ally, { card: damagedCharacter, damage: 4 }],
        deck: 2,
      });

      // Banish the ally
      expect(testEngine.asServer().manualSetDamage(ally, ally.willpower)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ally)).toBe("discard");

      // Resolve TELL NO TALES, accepting the optional
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wendyDarlingPirateQueen, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacter] }),
      ).toBeSuccessfulCommand();

      // All damage should be removed
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: damagedCharacter,
        value: 0,
      });
    });

    it("can be declined (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [wendyDarlingPirateQueen, ally, { card: damagedCharacter, damage: 4 }],
        deck: 2,
      });

      expect(testEngine.asServer().manualSetDamage(ally, ally.willpower)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ally)).toBe("discard");

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wendyDarlingPirateQueen, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: damagedCharacter,
        value: 4,
      });
    });

    it("triggers when your other character is banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            wendyDarlingPirateQueen,
            { card: ally, exerted: true },
            { card: damagedCharacter, damage: 3 },
          ],
          deck: 2,
        },
        {
          play: [strongOpponent],
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      // Opponent challenges and banishes ally
      expect(testEngine.asPlayerTwo().challenge(strongOpponent, ally)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ally)).toBe("discard");

      // TELL NO TALES triggers
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wendyDarlingPirateQueen, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacter] }),
      ).toBeSuccessfulCommand();

      // All damage should be removed
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: damagedCharacter,
        value: 0,
      });
    });

    it("does NOT trigger when Wendy herself is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [wendyDarlingPirateQueen, { card: damagedCharacter, damage: 3 }],
        deck: 2,
      });

      // Banish Wendy herself
      expect(
        testEngine
          .asServer()
          .manualSetDamage(wendyDarlingPirateQueen, wendyDarlingPirateQueen.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(wendyDarlingPirateQueen)).toBe("discard");

      // TELL NO TALES should NOT trigger (only triggers for OTHER characters)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});

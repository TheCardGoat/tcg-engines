import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rayaHeadstrong } from "./127-raya-headstrong";

// Raya: strength 2, willpower 3
const weakDefender = createMockCharacter({
  id: "raya-headstrong-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const toughDefender = createMockCharacter({
  id: "raya-headstrong-tough-defender",
  name: "Tough Defender",
  cost: 5,
  strength: 5,
  willpower: 10,
});

describe("Raya - Headstrong (set 009)", () => {
  describe("NOTE TO SELF, DON'T DIE — During your turn, whenever this character banishes another character in a challenge, you may ready this character. If you do, she can't quest for the rest of this turn.", () => {
    it("triggers an optional bag effect when Raya banishes a defender in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rayaHeadstrong, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rayaHeadstrong, weakDefender),
      ).toBeSuccessfulCommand();

      // Weak defender should be banished
      expect(testEngine.asPlayerTwo().getCardZone(weakDefender)).toBe("discard");

      // Optional ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("does NOT trigger when Raya challenges but does not banish the defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rayaHeadstrong, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: toughDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rayaHeadstrong, toughDefender),
      ).toBeSuccessfulCommand();

      // Tough defender survives
      expect(testEngine.asPlayerTwo().getCardZone(toughDefender)).toBe("play");

      // No bag effect should be triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("readies Raya when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rayaHeadstrong, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rayaHeadstrong, weakDefender),
      ).toBeSuccessfulCommand();

      // Raya is exerted after challenging
      expect(testEngine.asPlayerOne().isExerted(rayaHeadstrong)).toBe(true);

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rayaHeadstrong, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Raya should now be readied
      expect(testEngine.asPlayerOne().isExerted(rayaHeadstrong)).toBe(false);
    });

    it("applies cant-quest restriction to Raya after being readied", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rayaHeadstrong, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rayaHeadstrong, weakDefender),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rayaHeadstrong, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Raya is ready but cannot quest this turn
      expect(testEngine.asPlayerOne().isExerted(rayaHeadstrong)).toBe(false);
      expect(testEngine.asPlayerOne().getCard(rayaHeadstrong).hasQuestRestriction).toBe(true);
    });

    it("quest restriction is lifted after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rayaHeadstrong, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rayaHeadstrong, weakDefender),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rayaHeadstrong, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(rayaHeadstrong).hasQuestRestriction).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Quest restriction should now be gone
      expect(testEngine.asPlayerOne().getCard(rayaHeadstrong).hasQuestRestriction).toBe(false);
    });

    it("Raya stays exerted when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rayaHeadstrong, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rayaHeadstrong, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(rayaHeadstrong)).toBe(true);

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rayaHeadstrong, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Raya stays exerted since the optional was declined
      expect(testEngine.asPlayerOne().isExerted(rayaHeadstrong)).toBe(true);
    });

    it("does NOT trigger during opponent's turn", () => {
      const attacker = createMockCharacter({
        id: "raya-headstrong-opp-attacker",
        name: "Opponent Attacker",
        cost: 3,
        strength: 5,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rayaHeadstrong, exerted: true }],
          deck: 2,
        },
        {
          play: [attacker],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges Raya and banishes her
      expect(testEngine.asPlayerTwo().challenge(attacker, rayaHeadstrong)).toBeSuccessfulCommand();

      // No bag effect for Raya's ability since it's not Raya's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});

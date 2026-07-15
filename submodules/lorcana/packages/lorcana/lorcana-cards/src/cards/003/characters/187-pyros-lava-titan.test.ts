import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { pyrosLavaTitan } from "./187-pyros-lava-titan";

const weakOpponent = createMockCharacter({
  id: "pyros-weak-opp",
  name: "Weak Opponent",
  cost: 1,
  willpower: 1,
  strength: 1,
});

const toughOpponent = createMockCharacter({
  id: "pyros-tough-opp",
  name: "Tough Opponent",
  cost: 3,
  willpower: 10,
  strength: 1,
});

const exertedAlly = createMockCharacter({
  id: "pyros-exerted-ally",
  name: "Exerted Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const strongAttacker = createMockCharacter({
  id: "pyros-strong-attacker",
  name: "Strong Attacker",
  cost: 4,
  strength: 10,
  willpower: 5,
});

describe("Pyros - Lava Titan", () => {
  describe("ERUPTION - During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.", () => {
    it("triggers an optional ability when Pyros banishes an opposing character in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pyrosLavaTitan, { card: exertedAlly, exerted: true }],
        },
        {
          play: [{ card: weakOpponent, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(pyrosLavaTitan, weakOpponent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(weakOpponent)).toBe("discard");

      // ERUPTION should trigger and put an optional ability in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("readies the chosen character when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pyrosLavaTitan, { card: exertedAlly, exerted: true }],
        },
        {
          play: [{ card: weakOpponent, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(true);

      expect(
        testEngine.asPlayerOne().challenge(pyrosLavaTitan, weakOpponent),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pyrosLavaTitan, {
          resolveOptional: true,
          targets: [exertedAlly],
        }),
      ).toBeSuccessfulCommand();

      // The chosen ally should now be ready
      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(false);
    });

    it("does not ready any character when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pyrosLavaTitan, { card: exertedAlly, exerted: true }],
        },
        {
          play: [{ card: weakOpponent, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(true);

      expect(
        testEngine.asPlayerOne().challenge(pyrosLavaTitan, weakOpponent),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pyrosLavaTitan, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // The ally should still be exerted
      expect(testEngine.asPlayerOne().isExerted(exertedAlly)).toBe(true);
    });

    it("does not trigger when Pyros does not banish the defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pyrosLavaTitan],
        },
        {
          play: [{ card: toughOpponent, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(pyrosLavaTitan, toughOpponent),
      ).toBeSuccessfulCommand();

      // Pyros (5 strength) does not banish tough opponent (10 willpower)
      expect(testEngine.asPlayerOne().getCardZone(toughOpponent)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not trigger during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: pyrosLavaTitan, exerted: true }],
        },
        {
          play: [strongAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const p2BagsBefore = testEngine.asPlayerTwo().getBagCount();
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, pyrosLavaTitan),
      ).toBeSuccessfulCommand();

      // Pyros is banished, but ERUPTION should not trigger on opponent's turn
      expect(testEngine.asPlayerOne().getCardZone(pyrosLavaTitan)).toBe("discard");
      // No extra bag entries from ERUPTION
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(p2BagsBefore);
    });

    it("can ready Pyros himself using ERUPTION", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pyrosLavaTitan],
        },
        {
          play: [{ card: weakOpponent, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(pyrosLavaTitan, weakOpponent),
      ).toBeSuccessfulCommand();

      // Pyros challenged and is now exerted
      expect(testEngine.asPlayerOne().isExerted(pyrosLavaTitan)).toBe(true);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pyrosLavaTitan, {
          resolveOptional: true,
          targets: [pyrosLavaTitan],
        }),
      ).toBeSuccessfulCommand();

      // Pyros should now be ready again
      expect(testEngine.asPlayerOne().isExerted(pyrosLavaTitan)).toBe(false);
    });
  });
});

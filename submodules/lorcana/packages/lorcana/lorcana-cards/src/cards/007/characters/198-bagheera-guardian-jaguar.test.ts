import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { bagheeraGuardianJaguar } from "./198-bagheera-guardian-jaguar";
import { dragonFire } from "../../001/actions/130-dragon-fire";

const opponentCharA = createMockCharacter({
  id: "bagheera-test-opponent-a",
  name: "Opponent Character A",
  cost: 3,
  strength: 3,
  willpower: 5,
});

const opponentCharB = createMockCharacter({
  id: "bagheera-test-opponent-b",
  name: "Opponent Character B",
  cost: 2,
  strength: 2,
  willpower: 1,
});

const allyCharacter = createMockCharacter({
  id: "bagheera-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Bagheera - Guardian Jaguar", () => {
  describe("Bodyguard", () => {
    it("has Bodyguard keyword", () => {
      const bodyguardAbility = (bagheeraGuardianJaguar.abilities ?? []).find(
        (a) => a.type === "keyword" && a.keyword === "Bodyguard",
      );
      expect(bodyguardAbility).toBeDefined();
    });
  });

  describe("YOU MUST BE BRAVE — When this character is banished during an opponent's turn, deal 2 damage to each opposing character.", () => {
    it("deals 2 damage to each opposing character when banished on opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bagheeraGuardianJaguar],
          deck: 2,
        },
        {
          play: [opponentCharA, opponentCharB],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      // Opponent plays Dragon Fire targeting Bagheera
      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [bagheeraGuardianJaguar] }),
      ).toBeSuccessfulCommand();

      // Bagheera should be banished
      expect(testEngine.asPlayerOne().getCardZone(bagheeraGuardianJaguar)).toBe("discard");

      // YOU MUST BE BRAVE triggers (mandatory)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(bagheeraGuardianJaguar, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Deal 2 damage to each opposing character (player two's characters)
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: opponentCharA,
        value: 2,
      });
      // opponentCharB has 1 willpower, 2 damage should banish it
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharB)).toBe("discard");
    });

    it("does NOT deal damage if banished on your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bagheeraGuardianJaguar],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 2,
        },
        {
          play: [opponentCharA],
          deck: 2,
        },
      );

      // Play Dragon Fire on own turn targeting own Bagheera
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [bagheeraGuardianJaguar] }),
      ).toBeSuccessfulCommand();

      // Bagheera should be banished
      expect(testEngine.asPlayerOne().getCardZone(bagheeraGuardianJaguar)).toBe("discard");

      // No bag items — ability should NOT trigger on own turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Opponent's character should NOT have damage
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: opponentCharA,
        value: 0,
      });
    });

    it("only damages opposing characters, not your own", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bagheeraGuardianJaguar, allyCharacter],
          deck: 2,
        },
        {
          play: [opponentCharA],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      // Opponent banishes Bagheera
      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [bagheeraGuardianJaguar] }),
      ).toBeSuccessfulCommand();

      // Bagheera banished
      expect(testEngine.asPlayerOne().getCardZone(bagheeraGuardianJaguar)).toBe("discard");

      // Resolve the triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(bagheeraGuardianJaguar, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Opponent's character takes 2 damage
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: opponentCharA,
        value: 2,
      });

      // Own ally should NOT take damage
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: allyCharacter,
        value: 0,
      });
    });

    it("regression: does not damage opposing Locations (cardTypes: ['character'] excludes locations)", () => {
      const opponentLocation = createMockLocation({
        id: "bagheera-test-location",
        name: "Library",
        cost: 3,
        willpower: 6,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bagheeraGuardianJaguar],
          deck: 2,
        },
        {
          play: [opponentCharA, opponentLocation],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [bagheeraGuardianJaguar] }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(bagheeraGuardianJaguar, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo()).toHaveDamage({ card: opponentCharA, value: 2 });
      // Library is a Location, not a character — must not take damage.
      expect(testEngine.asPlayerTwo()).toHaveDamage({ card: opponentLocation, value: 0 });
    });

    it("deals 2 damage when banished in a challenge on opponent's turn", () => {
      const strongOpponent = createMockCharacter({
        id: "bagheera-test-strong",
        name: "Strong Opponent",
        cost: 5,
        strength: 5,
        willpower: 5,
      });

      const weakOpponent = createMockCharacter({
        id: "bagheera-test-weak",
        name: "Weak Opponent",
        cost: 1,
        strength: 1,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: bagheeraGuardianJaguar, exerted: true }],
          deck: 2,
        },
        {
          play: [strongOpponent, weakOpponent],
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      // Opponent challenges Bagheera (5 str vs 3 willpower = banished)
      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, bagheeraGuardianJaguar),
      ).toBeSuccessfulCommand();

      // Bagheera should be banished
      expect(testEngine.asPlayerOne().getCardZone(bagheeraGuardianJaguar)).toBe("discard");

      // Resolve the triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(bagheeraGuardianJaguar, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // weakOpponent takes 2 from ability
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: weakOpponent,
        value: 2,
      });
    });
  });
});

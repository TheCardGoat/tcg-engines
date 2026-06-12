import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bellwetherMasterManipulator } from "./082-bellwether-master-manipulator";

const attacker = createMockCharacter({
  id: "bellwether-test-attacker",
  name: "Test Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const bystander = createMockCharacter({
  id: "bellwether-test-bystander",
  name: "Test Bystander",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Bellwether - Master Manipulator", () => {
  describe("VENDETTA - When this character is challenged and banished, put 1 damage counter on each opposing character", () => {
    it("triggers even when all opposing characters are banished in the challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [{ card: bellwetherMasterManipulator, exerted: true }],
          deck: 1,
        },
      );

      // Attacker challenges Bellwether, both have 3 str / 3 wp so both are banished
      expect(
        testEngine.asPlayerOne().challenge(attacker, bellwetherMasterManipulator),
      ).toBeSuccessfulCommand();

      // Bellwether should be banished
      expect(testEngine.asPlayerTwo().getCardZone(bellwetherMasterManipulator)).toBe("discard");
      // Attacker should also be banished from the challenge damage
      expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("discard");
    });

    it("puts 1 damage counter on each opposing character when challenged and banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker, bystander],
          deck: 1,
        },
        {
          play: [{ card: bellwetherMasterManipulator, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, bellwetherMasterManipulator),
      ).toBeSuccessfulCommand();

      // Check if there's a bag effect to resolve
      const bagCount = testEngine.asPlayerTwo().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(bellwetherMasterManipulator),
        ).toBeSuccessfulCommand();
      }

      // Bellwether should be banished
      expect(testEngine.asPlayerTwo().getCardZone(bellwetherMasterManipulator)).toBe("discard");
      // Attacker should also be banished (3 str vs 3 wp)
      expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("discard");
      // Bystander should have 1 damage from VENDETTA
      expect(testEngine.asPlayerOne().getDamage(bystander)).toBe(1);
    });

    it("damages all opposing characters in play", () => {
      const bystander2 = createMockCharacter({
        id: "bellwether-test-bystander-2",
        name: "Test Bystander 2",
        cost: 2,
        strength: 2,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker, bystander, bystander2],
          deck: 1,
        },
        {
          play: [{ card: bellwetherMasterManipulator, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, bellwetherMasterManipulator),
      ).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerTwo().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(bellwetherMasterManipulator),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().getCardZone(bellwetherMasterManipulator)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("discard");
      // Both bystanders should have 1 damage
      expect(testEngine.asPlayerOne().getDamage(bystander)).toBe(1);
      expect(testEngine.asPlayerOne().getDamage(bystander2)).toBe(1);
    });

    it("only damages opposing characters, not own characters", () => {
      const ownBystander = createMockCharacter({
        id: "bellwether-own-bystander",
        name: "Own Bystander",
        cost: 2,
        strength: 2,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker, bystander],
          deck: 1,
        },
        {
          play: [{ card: bellwetherMasterManipulator, exerted: true }, ownBystander],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, bellwetherMasterManipulator),
      ).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerTwo().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(bellwetherMasterManipulator),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().getCardZone(bellwetherMasterManipulator)).toBe("discard");
      // Own character should NOT be damaged
      expect(testEngine.asPlayerTwo().getDamage(ownBystander)).toBe(0);
      // Opposing bystander SHOULD be damaged
      expect(testEngine.asPlayerOne().getDamage(bystander)).toBe(1);
    });

    it("regression: does NOT trigger when another character (not Bellwether) is challenged and banished", () => {
      const allyChar = createMockCharacter({
        id: "bellwether-ally-char",
        name: "Bellwether Ally",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [bellwetherMasterManipulator, { card: allyChar, exerted: true }],
          deck: 1,
        },
      );

      // Player 1 challenges the ally, NOT Bellwether
      expect(testEngine.asPlayerOne().challenge(attacker, allyChar)).toBeSuccessfulCommand();

      // The ally is banished (2 wp, 3 str attacker)
      expect(testEngine.asPlayerTwo().getCardZone(allyChar)).toBe("discard");

      // Bellwether's VENDETTA should NOT trigger because she wasn't the one challenged and banished
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);

      // No damage should be on any opposing characters from VENDETTA
      expect(testEngine.asPlayerOne().getDamage(attacker)).toBe(2); // only combat damage from allyChar
    });

    it("can banish opposing characters if damage exceeds their willpower", () => {
      const weakBystander = createMockCharacter({
        id: "bellwether-weak-bystander",
        name: "Weak Bystander",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker, weakBystander],
          deck: 1,
        },
        {
          play: [{ card: bellwetherMasterManipulator, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, bellwetherMasterManipulator),
      ).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerTwo().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(bellwetherMasterManipulator),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().getCardZone(bellwetherMasterManipulator)).toBe("discard");
      // Weak bystander has 1 willpower, 1 damage = banished
      expect(testEngine.asPlayerOne().getCardZone(weakBystander)).toBe("discard");
    });
  });
});

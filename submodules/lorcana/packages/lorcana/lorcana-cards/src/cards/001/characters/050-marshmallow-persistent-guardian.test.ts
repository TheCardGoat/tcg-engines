import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { marshmallowPersistentGuardian } from "./050-marshmallow-persistent-guardian";
import { dragonFire } from "../actions/130-dragon-fire";

const strongCharacter = createMockCharacter({
  id: "marshmallow-test-strong",
  name: "Strong Character",
  cost: 8,
  strength: 8,
  willpower: 8,
});

describe("Marshmallow - Persistent Guardian", () => {
  describe("DURABLE — When this character is banished in a challenge, you may return this card to your hand.", () => {
    it("should NOT return to hand when banished outside a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [marshmallowPersistentGuardian],
          deck: 2,
        },
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [marshmallowPersistentGuardian] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(marshmallowPersistentGuardian)).toBe("discard");
    });

    it("as an attacker, should return to hand when banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [marshmallowPersistentGuardian],
          deck: 2,
        },
        {
          play: [{ card: strongCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(marshmallowPersistentGuardian, strongCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(marshmallowPersistentGuardian)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(marshmallowPersistentGuardian, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(marshmallowPersistentGuardian)).toBe("hand");
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: strongCharacter,
        value: marshmallowPersistentGuardian.strength,
      });
    });

    it("as a defender, should return to hand when banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: marshmallowPersistentGuardian, exerted: true }],
          deck: 2,
        },
        {
          play: [strongCharacter],
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().challenge(strongCharacter, marshmallowPersistentGuardian),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(marshmallowPersistentGuardian)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(marshmallowPersistentGuardian, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(marshmallowPersistentGuardian)).toBe("hand");
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: strongCharacter,
        value: marshmallowPersistentGuardian.strength,
      });
    });

    it("should NOT return to hand if player declines the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [marshmallowPersistentGuardian],
          deck: 2,
        },
        {
          play: [{ card: strongCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(marshmallowPersistentGuardian, strongCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(marshmallowPersistentGuardian)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(marshmallowPersistentGuardian, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(marshmallowPersistentGuardian)).toBe("discard");
    });
  });
});

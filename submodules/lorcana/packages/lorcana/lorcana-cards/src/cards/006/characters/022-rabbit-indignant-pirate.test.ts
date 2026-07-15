import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rabbitIndignantPirate } from "./022-rabbit-indignant-pirate";

const damagedCharacter = createMockCharacter({
  id: "rabbit-indignant-pirate-test-damaged-character",
  name: "Damaged Character",
  cost: 3,
  strength: 2,
  willpower: 6,
});

describe("Rabbit - Indignant Pirate", () => {
  describe("BE MORE CAREFUL - When you play this character, you may remove up to 1 damage from chosen character.", () => {
    it("removes 1 damage from chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rabbitIndignantPirate],
          play: [{ card: damagedCharacter, damage: 3 }],
          inkwell: rabbitIndignantPirate.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const damagedCharacterId = testEngine.findCardInstanceId(damagedCharacter, "play");

      expect(testEngine.asPlayerOne().playCard(rabbitIndignantPirate)).toBeSuccessfulCommand();

      // Optional triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rabbitIndignantPirate, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the damaged character as target for remove-damage
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacterId] }),
      ).toBeSuccessfulCommand();

      // Should have removed 1 damage (from 3 to 2)
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(2);
    });

    it("removes all damage when character has less than 1 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rabbitIndignantPirate],
          play: [{ card: damagedCharacter, damage: 0 }],
          inkwell: rabbitIndignantPirate.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rabbitIndignantPirate)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rabbitIndignantPirate, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // No targets with damage; the effect resolves with no change
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(0);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rabbitIndignantPirate],
          play: [{ card: damagedCharacter, damage: 2 }],
          inkwell: rabbitIndignantPirate.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rabbitIndignantPirate)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rabbitIndignantPirate, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(2);
    });
  });
});

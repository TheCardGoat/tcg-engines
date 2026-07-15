import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { plutoRescueDog } from "./020-pluto-rescue-dog";

const damagedCharacter = createMockCharacter({
  id: "pluto-rescue-test-damaged-character",
  name: "Damaged Character",
  cost: 3,
  strength: 2,
  willpower: 6,
});

describe("Pluto - Rescue Dog", () => {
  describe("TO THE RESCUE - When you play this character, you may remove up to 3 damage from one of your characters.", () => {
    it("removes up to 3 damage from chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [plutoRescueDog],
          play: [{ card: damagedCharacter, damage: 5 }],
          inkwell: plutoRescueDog.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const damagedCharacterId = testEngine.findCardInstanceId(damagedCharacter, "play");

      expect(testEngine.asPlayerOne().playCard(plutoRescueDog)).toBeSuccessfulCommand();

      // Optional triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(plutoRescueDog, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the damaged character as target for remove-damage
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacterId] }),
      ).toBeSuccessfulCommand();

      // Should have removed 3 damage (from 5 to 2)
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(2);
    });

    it("removes all damage when character has less than 3 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [plutoRescueDog],
          play: [{ card: damagedCharacter, damage: 2 }],
          inkwell: plutoRescueDog.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const damagedCharacterId = testEngine.findCardInstanceId(damagedCharacter, "play");

      expect(testEngine.asPlayerOne().playCard(plutoRescueDog)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(plutoRescueDog, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacterId] }),
      ).toBeSuccessfulCommand();

      // Should have removed all 2 damage (from 2 to 0)
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(0);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [plutoRescueDog],
          play: [{ card: damagedCharacter, damage: 3 }],
          inkwell: plutoRescueDog.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(plutoRescueDog)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(plutoRescueDog, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(3);
    });
  });
});

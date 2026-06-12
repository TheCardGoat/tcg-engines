import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pennyBoltsPerson } from "./021-penny-bolts-person";

const damagedCharacter = createMockCharacter({
  id: "penny-test-damaged-character",
  name: "Damaged Character",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Penny - Bolt's Person", () => {
  describe("ENDURING LOYALTY - When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn.", () => {
    it("removes up to 2 damage from chosen character and grants Resist +1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pennyBoltsPerson],
          play: [{ card: damagedCharacter, damage: 3 }],
          inkwell: pennyBoltsPerson.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const damagedCharacterId = testEngine.findCardInstanceId(damagedCharacter, "play");

      expect(testEngine.asPlayerOne().playCard(pennyBoltsPerson)).toBeSuccessfulCommand();

      // Optional triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pennyBoltsPerson, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the damaged character as target for remove-damage
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacterId] }),
      ).toBeSuccessfulCommand();

      // Should have removed 2 damage (from 3 to 1)
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(1);

      // Should have gained Resist +1
      expect(testEngine.getKeywordValue(damagedCharacter, "Resist")).toBe(1);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pennyBoltsPerson],
          play: [{ card: damagedCharacter, damage: 2 }],
          inkwell: pennyBoltsPerson.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(pennyBoltsPerson)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pennyBoltsPerson, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(2);

      // Should NOT have gained Resist
      expect(testEngine.getKeywordValue(damagedCharacter, "Resist")).toBeNull();
    });

    it("Resist +1 expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pennyBoltsPerson],
          play: [{ card: damagedCharacter, damage: 2 }],
          inkwell: pennyBoltsPerson.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const damagedCharacterId = testEngine.findCardInstanceId(damagedCharacter, "play");

      expect(testEngine.asPlayerOne().playCard(pennyBoltsPerson)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pennyBoltsPerson, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacterId] }),
      ).toBeSuccessfulCommand();

      // Should have Resist +1 now
      expect(testEngine.getKeywordValue(damagedCharacter, "Resist")).toBe(1);

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Resist should still be active during opponent's turn
      expect(testEngine.getKeywordValue(damagedCharacter, "Resist")).toBe(1);

      // Pass player two's turn (back to player one)
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Resist should have expired at the start of player one's next turn
      expect(testEngine.getKeywordValue(damagedCharacter, "Resist")).toBeNull();
    });
  });
});

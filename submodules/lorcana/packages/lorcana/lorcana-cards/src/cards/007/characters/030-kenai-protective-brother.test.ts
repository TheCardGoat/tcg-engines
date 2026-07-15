import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kenaiProtectiveBrother } from "./030-kenai-protective-brother";

const damagedAlly = createMockCharacter({
  id: "kenai-protective-brother-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Kenai - Protective Brother", () => {
  describe("HE NEEDS ME - At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.", () => {
    it("readies chosen ally and removes all damage when Kenai is exerted at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: kenaiProtectiveBrother, exerted: true, isDrying: false },
            { card: damagedAlly, exerted: true, damage: damagedAlly.willpower - 1 },
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Kenai is exerted, so the end-of-turn trigger should fire
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Should have a bag effect for the optional triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional and choose the damaged ally to ready and heal
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kenaiProtectiveBrother, {
          resolveOptional: true,
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      // Ally should now be readied and have no damage
      expect(testEngine.asPlayerOne().isExerted(damagedAlly)).toBe(false);
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
    });

    it("does NOT trigger when Kenai is NOT exerted at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: kenaiProtectiveBrother, isDrying: false }, // NOT exerted
            { card: damagedAlly, exerted: true, damage: 2 },
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Ally should still be exerted with damage
      expect(testEngine.asPlayerOne().isExerted(damagedAlly)).toBe(true);
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(2);
    });

    it("does not ready the ally when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: kenaiProtectiveBrother, exerted: true, isDrying: false },
            { card: damagedAlly, exerted: true, damage: 3 },
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kenaiProtectiveBrother, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Ally should still be exerted with damage
      expect(testEngine.asPlayerOne().isExerted(damagedAlly)).toBe(true);
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(3);
    });
  });
});

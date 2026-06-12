import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pawpsicle } from "./169-pawpsicle";

const damagedCharacter = createMockCharacter({
  id: "pawpsicle-damaged-char",
  name: "Damaged Character",
  cost: 2,
  willpower: 5,
});

describe("Pawpsicle", () => {
  describe("JUMBO POP — When you play this item, you may draw a card.", () => {
    it("puts a draw-card effect in the bag when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pawpsicle],
        inkwell: pawpsicle.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(pawpsicle)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("draws a card when the optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pawpsicle],
        inkwell: pawpsicle.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(pawpsicle)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(pawpsicle)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 1 });
    });

    it("does not draw a card when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pawpsicle],
        inkwell: pawpsicle.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(pawpsicle)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pawpsicle, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 2 });
    });
  });

  describe("THAT'S REDWOOD — Banish this item − Remove up to 2 damage from chosen character.", () => {
    it("banishes itself and removes up to 2 damage from chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pawpsicle, damagedCharacter],
      });

      testEngine.asServer().manualSetDamage(damagedCharacter, 2);

      const result = testEngine.asPlayerOne().activateAbility(pawpsicle, {
        ability: "THAT'S REDWOOD",
        targets: [damagedCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(pawpsicle)).toBe("discard");
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(0);
    });

    it("removes only up to 2 damage when more than 2 damage is present", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pawpsicle, damagedCharacter],
      });

      // Set 4 damage (less than willpower of 5 to keep character alive)
      testEngine.asServer().manualSetDamage(damagedCharacter, 4);

      const result = testEngine.asPlayerOne().activateAbility(pawpsicle, {
        ability: "THAT'S REDWOOD",
        targets: [damagedCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(2);
    });

    it("regression: allows targeting undamaged characters (up to 2 means 0 is valid)", () => {
      const undamagedCharacter = createMockCharacter({
        id: "pawpsicle-undamaged-char",
        name: "Undamaged Character",
        cost: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pawpsicle, undamagedCharacter],
      });

      // Character has 0 damage - should still be a valid target for "up to 2"
      const result = testEngine.asPlayerOne().activateAbility(pawpsicle, {
        ability: "THAT'S REDWOOD",
        targets: [undamagedCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(pawpsicle)).toBe("discard");
      expect(testEngine.asPlayerOne().getDamage(undamagedCharacter)).toBe(0);
    });

    it("regression: removes only 1 damage when character has exactly 1 damage (not requiring exactly 2)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [pawpsicle, damagedCharacter],
      });

      testEngine.asServer().manualSetDamage(damagedCharacter, 1);

      const result = testEngine.asPlayerOne().activateAbility(pawpsicle, {
        ability: "THAT'S REDWOOD",
        targets: [damagedCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(0);
    });
  });
});

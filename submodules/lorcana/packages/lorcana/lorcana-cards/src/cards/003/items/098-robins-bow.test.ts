import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { robinHoodDaydreamer } from "../characters";
import { robinsBow } from "./098-robins-bow";

const damagedCharacter = createMockCharacter({
  id: "robins-bow-damaged-char",
  name: "Damaged Character",
  cost: 2,
  willpower: 5,
});

describe("Robin's Bow", () => {
  describe("FOREST'S GIFT — {E} — Deal 1 damage to chosen damaged character or location.", () => {
    it("deals 1 damage to a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [robinsBow, damagedCharacter],
      });

      testEngine.asServer().manualSetDamage(damagedCharacter, 1);

      const result = testEngine.asPlayerOne().activateAbility(robinsBow, {
        ability: "FOREST'S GIFT",
        targets: [damagedCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(robinsBow)).toBe(true);
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(2);
    });
  });

  describe("A BIT OF A LARK — Whenever a character of yours named Robin Hood quests, you may ready this item.", () => {
    it("readies the item when a Robin Hood character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [robinsBow, { card: robinHoodDaydreamer, isDrying: false }],
      });

      // Exert the bow first so we can observe readying
      testEngine.asServer().manualExertCard(robinsBow);
      expect(testEngine.asPlayerOne().isExerted(robinsBow)).toBe(true);

      expect(testEngine.asPlayerOne().quest(robinHoodDaydreamer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(robinsBow)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(robinsBow)).toBe(false);
    });

    it("does not trigger when a non-Robin Hood character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [robinsBow, { card: damagedCharacter, isDrying: false }],
      });

      testEngine.asServer().manualExertCard(robinsBow);

      expect(testEngine.asPlayerOne().quest(damagedCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().isExerted(robinsBow)).toBe(true);
    });
  });
});

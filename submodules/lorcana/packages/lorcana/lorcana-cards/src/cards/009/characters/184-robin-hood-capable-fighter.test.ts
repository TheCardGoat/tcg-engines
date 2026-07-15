import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { robinHoodCapableFighter } from "./184-robin-hood-capable-fighter";

const targetCharacter = createMockCharacter({
  id: "robin-hood-cf-009-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Robin Hood - Capable Fighter (set 009)", () => {
  describe("SKIRMISH — {E} — Deal 1 damage to chosen character.", () => {
    it("deals 1 damage to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodCapableFighter, isDrying: false }],
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(robinHoodCapableFighter, {
        targets: [targetCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(robinHoodCapableFighter)).toBe(true);
      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(1);
    });

    it("deals 1 damage to chosen own character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodCapableFighter, isDrying: false }, targetCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(robinHoodCapableFighter, {
        targets: [targetCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(robinHoodCapableFighter)).toBe(true);
      expect(testEngine.asPlayerOne().getDamage(targetCharacter)).toBe(1);
    });

    it("exerts Robin Hood when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodCapableFighter, isDrying: false }],
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().isExerted(robinHoodCapableFighter)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(robinHoodCapableFighter, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(robinHoodCapableFighter)).toBe(true);
    });

    it("cannot be activated when already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodCapableFighter, exerted: true, isDrying: false }],
          deck: 2,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(robinHoodCapableFighter, {
        targets: [targetCharacter],
      });

      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(0);
    });
  });
});

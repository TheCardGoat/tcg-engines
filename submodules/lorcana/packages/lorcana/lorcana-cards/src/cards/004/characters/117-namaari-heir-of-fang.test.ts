import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { namaariHeirOfFang } from "./117-namaari-heir-of-fang";

const defender = createMockCharacter({
  id: "namaari-test-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 10,
  lore: 1,
});

const otherTarget = createMockCharacter({
  id: "namaari-test-other-target",
  name: "Other Target",
  cost: 2,
  strength: 1,
  willpower: 10,
  lore: 1,
});

const attacker = createMockCharacter({
  id: "namaari-test-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 10,
  lore: 1,
});

describe("Namaari - Heir of Fang", () => {
  describe("TWO-WEAPON FIGHTING — During your turn, whenever this character deals damage to another character in a challenge, you may deal the same amount of damage to another chosen character.", () => {
    it("deals the same amount of damage to another chosen character when challenging", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: namaariHeirOfFang, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }, { card: otherTarget }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(namaariHeirOfFang, defender),
      ).toBeSuccessfulCommand();

      // Namaari's TWO-WEAPON FIGHTING triggers - resolve the optional bag effect with a target
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(namaariHeirOfFang, {
          targets: [otherTarget],
        }),
      ).toBeSuccessfulCommand();

      // Both defender and otherTarget should have taken damage equal to Namaari's strength (2)
      expect(testEngine.asPlayerOne().getDamage(defender)).toBe(namaariHeirOfFang.strength);
      expect(testEngine.asPlayerOne().getDamage(otherTarget)).toBe(namaariHeirOfFang.strength);
    });

    it("is optional - can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: namaariHeirOfFang, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }, { card: otherTarget }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(namaariHeirOfFang, defender),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(namaariHeirOfFang, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Defender still took damage from the challenge, but otherTarget should not have
      expect(testEngine.asPlayerOne().getDamage(defender)).toBe(namaariHeirOfFang.strength);
      expect(testEngine.asPlayerOne().getDamage(otherTarget)).toBe(0);
    });

    it("does NOT trigger during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: namaariHeirOfFang, exerted: true }, { card: otherTarget }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, namaariHeirOfFang),
      ).toBeSuccessfulCommand();

      // No bag effects should be created since it's not Namaari's controller's turn
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});

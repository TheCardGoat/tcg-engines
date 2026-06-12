import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { motherGothelVainSorceress } from "./064-mother-gothel-vain-sorceress";

const defender = createMockCharacter({
  id: "gothel-test-defender",
  name: "Tough Defender",
  cost: 3,
  strength: 3,
  willpower: 6,
});

const attacker = createMockCharacter({
  id: "gothel-test-attacker",
  name: "Attacker",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const weakAttacker = createMockCharacter({
  id: "gothel-test-weak-attacker",
  name: "Weak Attacker",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const damagedOpposingSource = createMockCharacter({
  id: "gothel-test-damaged-opposing-source",
  name: "Damaged Opposing Source",
  cost: 2,
  strength: 1,
  willpower: 5,
});

describe("Mother Gothel - Vain Sorceress", () => {
  describe("NOW YOU'VE UPSET ME - Whenever one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.", () => {
    it("moves 1 damage from chosen character to chosen opposing character when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: motherGothelVainSorceress, damage: 2 },
            { card: attacker, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      // Should have a triggered ability in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability and move 1 damage from Gothel to defender
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelVainSorceress, {
          resolveOptional: true,
          targets: [motherGothelVainSorceress, defender],
        }),
      ).toBeSuccessfulCommand();

      // Gothel had 2 damage, moved 1 away, now has 1
      expect(testEngine.asPlayerOne().getDamage(motherGothelVainSorceress)).toBe(1);
      // Defender took challenge damage (attacker.strength=2) plus 1 moved damage = 3
      expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(attacker.strength + 1);
    });

    it("does not move damage when ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [motherGothelVainSorceress, { card: attacker, damage: 2, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(motherGothelVainSorceress, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage on attacker is unchanged (still 2, though combat damage from defender might add more)
      // The attacker had 2 damage + defender.strength (3) = 5 total, willpower 4, so attacker is banished
      // Let's check that no damage was moved to defender (only combat damage)
      expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(attacker.strength);
    });

    it("triggers when any of your characters challenges, not just Gothel", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: motherGothelVainSorceress, damage: 2 },
            { card: attacker, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      // Should trigger from any of your characters challenging
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelVainSorceress, {
          resolveOptional: true,
          targets: [motherGothelVainSorceress, defender],
        }),
      ).toBeSuccessfulCommand();

      // Gothel had 2 damage, now has 1
      expect(testEngine.asPlayerOne().getDamage(motherGothelVainSorceress)).toBe(1);
      // Defender took combat damage + 1 moved
      expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(attacker.strength + 1);
    });

    it("can move damage from one opposing character to another opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [motherGothelVainSorceress, { card: attacker, isDrying: false }],
          deck: 3,
        },
        {
          play: [
            { card: damagedOpposingSource, damage: 2 },
            { card: defender, exerted: true },
          ],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelVainSorceress, {
          resolveOptional: true,
          targets: {
            kind: "move-damage",
            from: [damagedOpposingSource],
            to: [defender],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(damagedOpposingSource)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(attacker.strength + 1);
    });

    it("does NOT trigger when opponent's character challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: motherGothelVainSorceress, damage: 2, exerted: true }],
          deck: 3,
        },
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 3,
        },
      );

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(attacker, motherGothelVainSorceress),
      ).toBeSuccessfulCommand();

      // Should NOT trigger - it's the opponent challenging
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("moves damage before challenge combat resolves (regression: attacker survives by moving damage away)", () => {
      // Gothel has willpower 4, give her 3 damage. Defender has strength 3.
      // Without moving damage: 3 + 3 = 6 >= 4, so Gothel is banished.
      // With moving 1 damage away: 2 + 3 = 5 >= 4, still banished.
      // So let's use different numbers: Gothel has 2 damage, defender has strength 1.
      // Without move: 2 + 1 = 3 < 4, survives. With move: 1 + 1 = 2 < 4, survives.
      // Better test: attacker with willpower=4, damage=3, defender strength=1.
      // Without move: 3+1=4 >= 4, banished. With move: 2+1=3 < 4, survives!
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: motherGothelVainSorceress, damage: 3, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: weakAttacker, exerted: true }],
          deck: 3,
        },
      );

      // Gothel (strength=1, willpower=4, damage=3) challenges weakAttacker (strength=1, willpower=1)
      // weakAttacker has strength=1, so gothel takes 1 more damage = 4, which is lethal
      // But if she moves 1 damage to weakAttacker before combat, she has damage=2, then takes 1 = 3 < 4, survives
      expect(
        testEngine.asPlayerOne().challenge(motherGothelVainSorceress, weakAttacker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept and move 1 damage from Gothel to weak attacker
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelVainSorceress, {
          resolveOptional: true,
          targets: [motherGothelVainSorceress, weakAttacker],
        }),
      ).toBeSuccessfulCommand();

      // Gothel should survive: had 3 damage, moved 1 away = 2.
      // WeakAttacker was banished by the moved damage (1 >= 1 willpower), so it deals no combat damage back.
      expect(testEngine.asPlayerOne().getCardZone(motherGothelVainSorceress)).toBe("play");
      expect(testEngine.asPlayerOne().getDamage(motherGothelVainSorceress)).toBe(2);

      // Weak attacker should be banished: took 1 moved + 1 from combat = 2 >= 1 willpower
      expect(testEngine.asPlayerTwo().getCardZone(weakAttacker)).toBe("discard");
    });

    it("cannot move damage caused during combat (damage is moved before combat damage)", () => {
      // If attacker has no prior damage, there's no damage to move before combat
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [motherGothelVainSorceress, { card: attacker, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept but try to move damage from attacker - attacker has 0 damage before combat
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelVainSorceress, {
          resolveOptional: true,
          targets: [attacker, defender],
        }),
      ).toBeSuccessfulCommand();

      // Attacker had 0 pre-combat damage, so nothing to move
      // Combat damage: attacker takes defender.strength(3), defender takes attacker.strength(2)
      expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(attacker.strength);
    });
  });
});

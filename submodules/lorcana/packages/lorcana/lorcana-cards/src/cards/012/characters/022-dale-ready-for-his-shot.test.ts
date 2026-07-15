import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { challenger } from "../../../helpers/abilities/challenger";
import { support } from "../../../helpers/abilities/support";
import { rangerTeamup } from "../actions/028-ranger-team-up";
import { daleReadyForHisShot } from "./022-dale-ready-for-his-shot";

// Attacker has low strength but high willpower — under SPIKE SUIT, the
// attacker deals damage equal to their {W} (4) instead of {S} (1).
const weakButResilientAttacker = createMockCharacter({
  id: "dale-ready-attacker",
  name: "Resilient Attacker",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
});

const exertedDefender = createMockCharacter({
  id: "dale-ready-defender",
  name: "Target",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const sturdyExertedDefender = createMockCharacter({
  id: "dale-ready-sturdy-defender",
  name: "Sturdy Target",
  cost: 5,
  strength: 2,
  willpower: 10,
  lore: 1,
});

const challengerAttacker = createMockCharacter({
  id: "dale-ready-challenger-attacker",
  name: "Challenger Attacker",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  abilities: [challenger(3)],
});

const lowWillpowerSupportedAttacker = createMockCharacter({
  id: "dale-ready-low-willpower-supported-attacker",
  name: "Low Willpower Supported Attacker",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const supportCharacter = createMockCharacter({
  id: "dale-ready-support-character",
  name: "Support Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  abilities: [support],
});

describe("Dale - Ready for His Shot", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daleReadyForHisShot],
      inkwell: daleReadyForHisShot.cost,
    });

    expect(testEngine.asPlayerOne().playCard(daleReadyForHisShot)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(daleReadyForHisShot)).toBe("play");
  });

  describe("SPIKE SUIT - During challenges, your characters deal damage with their {W} instead of their {S}.", () => {
    it("a friendly attacker deals damage equal to its willpower instead of its strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: daleReadyForHisShot, isDrying: false },
            { card: weakButResilientAttacker, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(weakButResilientAttacker, exertedDefender),
      ).toBeSuccessfulCommand();

      // With SPIKE SUIT active, attacker deals {W}=4 damage to the defender
      // (instead of its printed {S}=1).
      expect(testEngine.asPlayerTwo().getDamage(exertedDefender)).toBe(4);
    });

    it("release notes ruling: a strength modifier does NOT change challenge damage under SPIKE SUIT", () => {
      // Q&A: Spike Suit replaces the value used for challenge damage from {S}
      // to {W}; modifiers to {S} do not affect challenge damage; modifiers to
      // {W} DO affect challenge damage. Use Ranger Team-Up to grant +{S}
      // equal to {W} (here +4 {S}). The attacker still deals damage equal to
      // its current {W} (4), not its boosted strength.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: daleReadyForHisShot, isDrying: false },
            { card: weakButResilientAttacker, isDrying: false },
          ],
          hand: [rangerTeamup],
          inkwell: rangerTeamup.cost,
          deck: 5,
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
          deck: 5,
        },
      );

      // Apply +S equal to W (4) modifier.
      expect(
        testEngine.asPlayerOne().playCard(rangerTeamup, { targets: [weakButResilientAttacker] }),
      ).toBeSuccessfulCommand();

      // Confirm strength was actually boosted.
      expect(testEngine.asPlayerOne().getCardStrength(weakButResilientAttacker)).toBe(
        weakButResilientAttacker.strength + weakButResilientAttacker.willpower,
      );

      expect(
        testEngine.asPlayerOne().challenge(weakButResilientAttacker, exertedDefender),
      ).toBeSuccessfulCommand();

      // Damage in challenge equals {W} (4), NOT boosted strength.
      expect(testEngine.asPlayerTwo().getDamage(exertedDefender)).toBe(
        weakButResilientAttacker.willpower,
      );
    });

    it("release notes ruling: Challenger does NOT add to challenge damage under SPIKE SUIT", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: daleReadyForHisShot, isDrying: false },
            { card: challengerAttacker, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: sturdyExertedDefender, exerted: true }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().getKeywordValue(challengerAttacker, "Challenger")).toBe(3);

      expect(
        testEngine.asPlayerOne().challenge(challengerAttacker, sturdyExertedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(sturdyExertedDefender)).toBe(
        challengerAttacker.willpower,
      );
    });

    it("release notes ruling: Support does NOT add to challenge damage under SPIKE SUIT", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: daleReadyForHisShot, isDrying: false },
            { card: supportCharacter, isDrying: false },
            { card: lowWillpowerSupportedAttacker, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: sturdyExertedDefender, exerted: true }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(supportCharacter)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(supportCharacter, {
          resolveOptional: true,
          targets: [lowWillpowerSupportedAttacker],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(lowWillpowerSupportedAttacker)).toBe(
        lowWillpowerSupportedAttacker.strength + supportCharacter.strength,
      );

      expect(
        testEngine.asPlayerOne().challenge(lowWillpowerSupportedAttacker, sturdyExertedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(sturdyExertedDefender)).toBe(
        lowWillpowerSupportedAttacker.willpower,
      );
    });

    it("does not apply when Dale is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: weakButResilientAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(weakButResilientAttacker, exertedDefender),
      ).toBeSuccessfulCommand();

      // Without SPIKE SUIT, the attacker deals its printed {S}=1.
      expect(testEngine.asPlayerTwo().getDamage(exertedDefender)).toBe(1);
    });
  });
});

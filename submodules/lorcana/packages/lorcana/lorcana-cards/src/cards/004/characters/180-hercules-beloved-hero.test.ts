import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { herculesBelovedHero } from "./180-hercules-beloved-hero";

const attacker3Strength = createMockCharacter({
  id: "hercules-beloved-hero-attacker-3",
  name: "Attacker 3 Strength",
  cost: 3,
  strength: 3,
  willpower: 5,
});

const attacker1Strength = createMockCharacter({
  id: "hercules-beloved-hero-attacker-1",
  name: "Attacker 1 Strength",
  cost: 1,
  strength: 1,
  willpower: 5,
});

const nonBodyguard = createMockCharacter({
  id: "hercules-beloved-hero-non-bodyguard",
  name: "Non Bodyguard",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Hercules - Beloved Hero", () => {
  it("has the expected printed metadata", () => {
    expect(herculesBelovedHero).toMatchObject({
      id: "FCJ",
      cardType: "character",
      name: "Hercules",
      version: "Beloved Hero",
      set: "004",
      cardNumber: 180,
      cost: 6,
      strength: 6,
      willpower: 5,
      lore: 2,
      inkable: true,
    });
  });

  describe("Bodyguard", () => {
    it("has Bodyguard keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [herculesBelovedHero],
      });

      expect(testEngine.asPlayerOne().hasKeyword(herculesBelovedHero, "Bodyguard")).toBe(true);
    });

    it("may enter play exerted via Bodyguard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [herculesBelovedHero],
        inkwell: herculesBelovedHero.cost,
      });

      expect(
        testEngine.asPlayerOne().playCardOptional(herculesBelovedHero, true),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(herculesBelovedHero)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(herculesBelovedHero)).toBe(true);
    });

    it("may enter play ready when Bodyguard is not used", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [herculesBelovedHero],
        inkwell: herculesBelovedHero.cost,
      });

      expect(testEngine.asPlayerOne().playCard(herculesBelovedHero)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(herculesBelovedHero)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(herculesBelovedHero)).toBe(false);
    });

    it("forces attackers to challenge Hercules while he is exerted instead of other characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker3Strength],
        },
        {
          play: [
            { card: herculesBelovedHero, exerted: true },
            { card: nonBodyguard, exerted: true },
          ],
        },
      );

      // Attacking the non-bodyguard should fail because Hercules (Bodyguard) can be challenged
      const result = testEngine.asPlayerOne().challenge(attacker3Strength, nonBodyguard);
      expect(result.success).toBe(false);
    });

    it("allows challenging Hercules as the Bodyguard target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker3Strength],
        },
        {
          play: [
            { card: herculesBelovedHero, exerted: true },
            { card: nonBodyguard, exerted: true },
          ],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker3Strength, herculesBelovedHero),
      ).toBeSuccessfulCommand();
    });
  });

  describe("Resist +1", () => {
    it("has Resist keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [herculesBelovedHero],
      });

      expect(testEngine.asPlayerOne().hasKeyword(herculesBelovedHero, "Resist")).toBe(true);
    });

    it("Resist +1 reduces damage by 1 when challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: herculesBelovedHero, exerted: true }],
        },
        {
          play: [attacker3Strength],
        },
      );

      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      // Attacker has 3 strength, Hercules has Resist +1 so takes 3-1 = 2 damage
      expect(
        testEngine.asPlayerTwo().challenge(attacker3Strength, herculesBelovedHero),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: herculesBelovedHero,
        value: 2,
      });
    });

    it("Resist +1 reduces 1 strength attack to 0 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: herculesBelovedHero, exerted: true }],
        },
        {
          play: [attacker1Strength],
        },
      );

      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      // Attacker has 1 strength, Hercules has Resist +1 so takes max(0, 1-1) = 0 damage
      expect(
        testEngine.asPlayerTwo().challenge(attacker1Strength, herculesBelovedHero),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: herculesBelovedHero,
        value: 0,
      });
    });
  });
});

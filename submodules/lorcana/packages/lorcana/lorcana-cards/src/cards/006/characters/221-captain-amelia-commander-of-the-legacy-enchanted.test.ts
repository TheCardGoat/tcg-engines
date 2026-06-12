import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { captainAmeliaCommanderOfTheLegacyEnchanted } from "./221-captain-amelia-commander-of-the-legacy-enchanted";

const pirateAttacker = createMockCharacter({
  id: "pirate-attacker",
  name: "Pirate Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Pirate"],
});

const nonPirateAttacker = createMockCharacter({
  id: "non-pirate-attacker",
  name: "Non Pirate Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

const allyDefender = createMockCharacter({
  id: "ally-defender",
  name: "Ally Defender",
  cost: 3,
  strength: 1,
  willpower: 6,
  classifications: ["Storyborn", "Ally"],
});

describe("Captain Amelia - Commander of the Legacy (Enchanted)", () => {
  it("DRIVELING GALOOTS - can't be challenged by Pirate characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [pirateAttacker, nonPirateAttacker],
      },
      {
        play: [{ card: captainAmeliaCommanderOfTheLegacyEnchanted, exerted: true }],
      },
    );

    // Pirate character should NOT be able to challenge Amelia
    const pirateResult = testEngine
      .asPlayerOne()
      .challenge(pirateAttacker, captainAmeliaCommanderOfTheLegacyEnchanted);
    expect(pirateResult).not.toBeSuccessfulCommand();

    // Non-pirate character SHOULD be able to challenge Amelia
    const nonPirateResult = testEngine
      .asPlayerOne()
      .challenge(nonPirateAttacker, captainAmeliaCommanderOfTheLegacyEnchanted);
    expect(nonPirateResult).toBeSuccessfulCommand();
  });

  it("EVERYTHING SHIPSHAPE - your other characters gain Resist +1 while being challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [nonPirateAttacker],
      },
      {
        play: [captainAmeliaCommanderOfTheLegacyEnchanted, { card: allyDefender, exerted: true }],
      },
    );

    // Challenge the ally defender (not Amelia)
    expect(
      testEngine.asPlayerOne().challenge(nonPirateAttacker, allyDefender),
    ).toBeSuccessfulCommand();

    // Ally defender should have taken attacker strength (3) minus Resist +1 = 2 damage
    expect(testEngine.asPlayerOne().getDamage(allyDefender)).toBe(2);
  });

  it("EVERYTHING SHIPSHAPE - does not grant Resist to self (only 'other' characters)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [nonPirateAttacker],
      },
      {
        play: [{ card: captainAmeliaCommanderOfTheLegacyEnchanted, exerted: true }, allyDefender],
      },
    );

    // Challenge Amelia herself - she should NOT get Resist from her own ability
    expect(
      testEngine
        .asPlayerOne()
        .challenge(nonPirateAttacker, captainAmeliaCommanderOfTheLegacyEnchanted),
    ).toBeSuccessfulCommand();

    // Amelia should take full damage (3) with no Resist reduction
    expect(testEngine.asPlayerOne().getDamage(captainAmeliaCommanderOfTheLegacyEnchanted)).toBe(3);
  });

  it("EVERYTHING SHIPSHAPE - does not trigger when your characters are challenging (not being challenged)", () => {
    const enemyDefender = createMockCharacter({
      id: "enemy-defender",
      name: "Enemy Defender",
      cost: 3,
      strength: 3,
      willpower: 6,
      classifications: ["Storyborn", "Hero"],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [captainAmeliaCommanderOfTheLegacyEnchanted, allyDefender],
      },
      {
        play: [{ card: enemyDefender, exerted: true }],
      },
    );

    // Ally attacks (is the challenger, not being challenged) - should NOT get Resist
    expect(testEngine.asPlayerOne().challenge(allyDefender, enemyDefender)).toBeSuccessfulCommand();

    // Ally should take full counter-damage (3) with no Resist reduction
    expect(testEngine.asPlayerOne().getDamage(allyDefender)).toBe(3);
  });
});

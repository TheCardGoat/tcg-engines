import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { beastThickskinned } from "./176-beast-thick-skinned";

// Beast - Thick-Skinned: 3 cost, 2 strength, 3 willpower, 1 lore, Resist +1
// Resist +1: Damage dealt to this character is reduced by 1

const attacker3Strength = createMockCharacter({
  id: "beast-test-attacker-3",
  name: "Attacker 3 Strength",
  cost: 3,
  strength: 3,
  willpower: 5,
});

const attacker1Strength = createMockCharacter({
  id: "beast-test-attacker-1",
  name: "Attacker 1 Strength",
  cost: 1,
  strength: 1,
  willpower: 5,
});

describe("Beast - Thick-Skinned", () => {
  it("should have Resist keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [beastThickskinned],
    });

    expect(testEngine.asPlayerOne().hasKeyword(beastThickskinned, "Resist")).toBe(true);
  });

  it("Resist +1 reduces damage by 1 when challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: beastThickskinned, exerted: true }],
      },
      {
        play: [attacker3Strength],
      },
    );

    // Pass player one's turn so player two can act
    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

    // Attacker has 3 strength, Beast has Resist +1, so Beast takes 3-1 = 2 damage
    expect(
      testEngine.asPlayerTwo().challenge(attacker3Strength, beastThickskinned),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: beastThickskinned,
      value: 2,
    });
  });

  it("Resist +1 reduces 1 strength attack to 0 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: beastThickskinned, exerted: true }],
      },
      {
        play: [attacker1Strength],
      },
    );

    // Pass player one's turn so player two can act
    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

    // Attacker has 1 strength, Beast has Resist +1, so Beast takes max(0, 1-1) = 0 damage
    expect(
      testEngine.asPlayerTwo().challenge(attacker1Strength, beastThickskinned),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: beastThickskinned,
      value: 0,
    });
  });
});

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { owlLogicalLecturer, rabbitReluctantHost } from "../characters";
import { gumboPot } from "./167-gumbo-pot";

const opposingCharacter = createMockCharacter({
  id: "gumbo-pot-opposing-character",
  name: "Gumbo Pot Opposing Character",
  cost: 2,
  willpower: 4,
});

describe("Gumbo Pot", () => {
  it("removes 1 damage from up to 2 chosen characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gumboPot, rabbitReluctantHost, owlLogicalLecturer],
    });

    testEngine.asServer().manualSetDamage(rabbitReluctantHost, 1);
    testEngine.asServer().manualSetDamage(owlLogicalLecturer, 1);

    const result = testEngine.asPlayerOne().activateAbility(gumboPot, {
      targets: [rabbitReluctantHost, owlLogicalLecturer],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(rabbitReluctantHost)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(owlLogicalLecturer)).toBe(0);
  });

  it("can remove 1 damage from only 1 chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gumboPot, rabbitReluctantHost, owlLogicalLecturer],
    });

    testEngine.asServer().manualSetDamage(rabbitReluctantHost, 1);
    testEngine.asServer().manualSetDamage(owlLogicalLecturer, 1);

    const result = testEngine.asPlayerOne().activateAbility(gumboPot, {
      targets: [rabbitReluctantHost],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(rabbitReluctantHost)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(owlLogicalLecturer)).toBe(1);
  });

  it("can remove damage from your characters and opposing characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [gumboPot, rabbitReluctantHost],
      },
      {
        play: [opposingCharacter],
      },
    );

    testEngine.asServer().manualSetDamage(rabbitReluctantHost, 1);
    testEngine.asServer().manualSetDamage(opposingCharacter, 1);

    const result = testEngine.asPlayerOne().activateAbility(gumboPot, {
      targets: [rabbitReluctantHost, opposingCharacter],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(rabbitReluctantHost)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
  });
});

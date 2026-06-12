import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { grandDukeAdvisorToTheKing, pigletVerySmallAnimal } from "../characters";
import { bindingContract } from "./065-binding-contract";

const dryingCharacter = createMockCharacter({
  id: "binding-contract-drying",
  name: "Drying Character",
  cost: 2,
});

describe("Binding Contract", () => {
  it("exerts one of your characters as a cost, then exerts the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [bindingContract, grandDukeAdvisorToTheKing],
      },
      {
        play: [pigletVerySmallAnimal],
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(bindingContract, {
      costs: {
        exertCharacters: [grandDukeAdvisorToTheKing],
      },
      targets: [pigletVerySmallAnimal],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(bindingContract)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(grandDukeAdvisorToTheKing)).toBe(true);
    expect(testEngine.asPlayerTwo().isExerted(pigletVerySmallAnimal)).toBe(true);
  });

  it("rejects a drying character as the additional exert cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [bindingContract, { card: dryingCharacter, isDrying: true }],
      },
      {
        play: [pigletVerySmallAnimal],
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(bindingContract, {
      costs: {
        exertCharacters: [dryingCharacter],
      },
      targets: [pigletVerySmallAnimal],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(bindingContract)).toBe(false);
    expect(testEngine.asPlayerTwo().isExerted(pigletVerySmallAnimal)).toBe(false);
  });
});

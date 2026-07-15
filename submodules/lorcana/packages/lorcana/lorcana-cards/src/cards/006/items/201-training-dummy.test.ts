import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { trainingDummy } from "./201-training-dummy";

const protectedCharacter = createMockCharacter({
  id: "training-dummy-protected-character",
  name: "Protected Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Training Dummy", () => {
  it("gives the chosen character Bodyguard until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      inkwell: 2,
      play: [trainingDummy, protectedCharacter],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(trainingDummy, {
        targets: [protectedCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(protectedCharacter, "Bodyguard")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(protectedCharacter, "Bodyguard")).toBe(false);
  });
});

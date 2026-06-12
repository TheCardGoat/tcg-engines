import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pixieDust } from "./067-pixie-dust";

const fairyTarget = createMockCharacter({
  id: "pixie-dust-fairy-target",
  name: "Fairy Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Pixie Dust", () => {
  it("gives the chosen character Challenger and Evasive until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      inkwell: 2,
      play: [pixieDust, fairyTarget],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(pixieDust, {
        targets: [fairyTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(fairyTarget, "Challenger")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(fairyTarget, "Evasive")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(fairyTarget, "Challenger")).toBe(false);
    expect(testEngine.asPlayerOne().hasKeyword(fairyTarget, "Evasive")).toBe(false);
  });
});

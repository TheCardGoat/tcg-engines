import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { iceBlock } from "./168-ice-block";

const frozenTarget = createMockCharacter({
  id: "ice-block-target",
  name: "Frozen Target",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Ice Block", () => {
  it("gives the chosen character -1 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [iceBlock, frozenTarget],
      },
      {
        deck: 1,
      },
    );

    const baseStrength = testEngine.asPlayerOne().getCardStrength(frozenTarget);

    expect(
      testEngine.asPlayerOne().activateAbility(iceBlock, {
        targets: [frozenTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(frozenTarget)).toBe(baseStrength - 1);
    expect(testEngine.asPlayerOne().isExerted(iceBlock)).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(frozenTarget)).toBe(baseStrength);
  });
});

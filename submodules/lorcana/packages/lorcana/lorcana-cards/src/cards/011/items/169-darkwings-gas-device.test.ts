import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { darkwingDuckDrakeMallard } from "../characters";
import { darkwingsGasDevice } from "./169-darkwings-gas-device";

const gasTarget = createMockCharacter({
  id: "darkwings-gas-device-target",
  name: "Gas Target",
  cost: 2,
  strength: 4,
});

describe("Darkwing's Gas Device", () => {
  it("gives the chosen character -1 strength this turn without Darkwing Duck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        inkwell: 1,
        play: [darkwingsGasDevice],
      },
      {
        deck: 2,
        play: [gasTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsGasDevice, {
        targets: [gasTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(gasTarget)).toBe(3);
  });

  it("gives the chosen character -2 strength this turn if you have a Darkwing Duck in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        inkwell: 1,
        play: [darkwingsGasDevice, darkwingDuckDrakeMallard],
      },
      {
        deck: 2,
        play: [gasTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsGasDevice, {
        targets: [gasTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(gasTarget)).toBe(2);
  });
});

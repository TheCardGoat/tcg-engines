import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { longboat } from "./132-longboat";

const evasivePassenger = createMockCharacter({
  id: "longboat-evasive-passenger",
  name: "Evasive Passenger",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Longboat", () => {
  it("gives the chosen character of yours Evasive until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      inkwell: 2,
      play: [longboat, evasivePassenger],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(longboat, {
        targets: [evasivePassenger],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(evasivePassenger, "Evasive")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(evasivePassenger, "Evasive")).toBe(false);
  });
});

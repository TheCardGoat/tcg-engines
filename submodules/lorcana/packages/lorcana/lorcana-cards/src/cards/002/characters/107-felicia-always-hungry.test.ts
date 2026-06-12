import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { feliciaAlwaysHungry } from "./107-felicia-always-hungry";

const opposingCharacter = createMockCharacter({
  id: "felicia-always-hungry-opponent",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Felicia - Always Hungry", () => {
  it("cannot quest and must challenge if able", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [feliciaAlwaysHungry], deck: 2 },
      { play: [{ card: opposingCharacter, exerted: true, isDrying: false }], deck: 2 },
    );

    expect(testEngine.asPlayerOne().quest(feliciaAlwaysHungry)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).not.toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().challenge(feliciaAlwaysHungry, opposingCharacter),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });
});

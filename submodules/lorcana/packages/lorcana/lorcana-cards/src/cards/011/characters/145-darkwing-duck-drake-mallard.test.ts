import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { darkwingDuckDrakeMallard } from "./145-darkwing-duck-drake-mallard";

const opposingCharacter = createMockCharacter({
  id: "darkwing-duck-drake-mallard-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Darkwing Duck - Drake Mallard", () => {
  it("cannot be chosen by an opposing action because of Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [darkwingDuckDrakeMallard],
        deck: 5,
      },
      {
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(dragonFire, {
        targets: [darkwingDuckDrakeMallard],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(darkwingDuckDrakeMallard)).toBe("play");
  });

  it("can still be challenged normally", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: darkwingDuckDrakeMallard, exerted: true, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: opposingCharacter, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingCharacter, darkwingDuckDrakeMallard),
    ).toBeSuccessfulCommand();
  });
});

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { bigMamaCleverAndCalming } from "./071-big-mama-clever-and-calming";

const opposingAttacker = createMockCharacter({
  id: "big-mama-opposing-attacker",
  name: "Opposing Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Big Mama - Clever and Calming", () => {
  it("cannot be chosen by an opposing action because of Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: bigMamaCleverAndCalming, isDrying: false }],
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
        targets: [bigMamaCleverAndCalming],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bigMamaCleverAndCalming)).toBe("play");
  });

  it("can still be challenged normally", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: bigMamaCleverAndCalming, exerted: true, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: opposingAttacker, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, bigMamaCleverAndCalming),
    ).toBeSuccessfulCommand();
  });
});

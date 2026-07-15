import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { meridaDefiantDaughter } from "./069-merida-defiant-daughter";

const opposingAttacker = createMockCharacter({
  id: "merida-defiant-daughter-opposing-attacker",
  name: "Opposing Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Merida - Defiant Daughter", () => {
  it("cannot be chosen by an opposing action because of Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: meridaDefiantDaughter, isDrying: false }],
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
        targets: [meridaDefiantDaughter],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(meridaDefiantDaughter)).toBe("play");
  });

  it("can still be challenged normally", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: meridaDefiantDaughter, exerted: true, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: opposingAttacker, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, meridaDefiantDaughter),
    ).toBeSuccessfulCommand();
  });
});

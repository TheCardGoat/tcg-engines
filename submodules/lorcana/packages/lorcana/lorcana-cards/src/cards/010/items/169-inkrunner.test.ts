import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { inkrunner } from "./169-inkrunner";

const flightManual = createMockCharacter({
  id: "inkrunner-flight-manual",
  name: "Flight Manual",
  cost: 1,
});

const alertTarget = createMockCharacter({
  id: "inkrunner-alert-target",
  name: "Alert Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveDefender = createMockCharacter({
  id: "inkrunner-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  abilities: [
    {
      id: "inkrunner-evasive-defender-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Inkrunner", () => {
  it("draws a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [flightManual],
      hand: [inkrunner],
      inkwell: inkrunner.cost,
    });

    expect(testEngine.asPlayerOne().playCard(inkrunner)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(flightManual)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("gives the chosen character Alert this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [inkrunner, alertTarget],
      },
      {
        play: [{ card: evasiveDefender, exerted: true, isDrying: false }],
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(alertTarget, evasiveDefender)).toBe(false);
    expect(
      testEngine.asPlayerOne().activateAbility(inkrunner, {
        ability: "READY TO RIDE",
        targets: [alertTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().canChallenge(alertTarget, evasiveDefender)).toBe(true);
  });
});

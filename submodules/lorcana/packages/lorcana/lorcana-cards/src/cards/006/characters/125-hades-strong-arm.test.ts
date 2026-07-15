import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hadesStrongArm } from "./125-hades-strong-arm";

const sacrificialAlly = createMockCharacter({
  id: "hades-strong-arm-sacrificial-ally",
  name: "Sacrificial Ally",
  cost: 2,
});

const opposingTarget = createMockCharacter({
  id: "hades-strong-arm-opposing-target",
  name: "Opposing Target",
  cost: 3,
});

describe("Hades - Strong Arm", () => {
  it("exerts, pays 3 ink, banishes one of your characters, and banishes a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: hadesStrongArm.cost,
        play: [hadesStrongArm, sacrificialAlly],
      },
      {
        play: [opposingTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(hadesStrongArm, {
        ability: "WHAT ARE YOU GONNA DO?",
        costs: {
          banishCharacters: [testEngine.findCardInstanceId(sacrificialAlly, "play", "player_one")],
        },
        targets: [opposingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(hadesStrongArm)).toBe(true);
    expect(testEngine.asPlayerOne().getAvailableInk("player_one")).toBe(2);
    expect(testEngine.asPlayerOne().getCardZone(sacrificialAlly)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(opposingTarget)).toBe("discard");
  });

  it("regression: activated ability should be usable when all costs can be paid", () => {
    // Bug: Hades' activated ability was not usable despite having all costs available.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: hadesStrongArm.cost,
        play: [hadesStrongArm, sacrificialAlly],
      },
      {
        play: [opposingTarget],
      },
    );

    // The ability should be activatable
    const result = testEngine.asPlayerOne().activateAbility(hadesStrongArm, {
      ability: "WHAT ARE YOU GONNA DO?",
      costs: {
        banishCharacters: [testEngine.findCardInstanceId(sacrificialAlly, "play", "player_one")],
      },
      targets: [opposingTarget],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(hadesStrongArm)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(sacrificialAlly)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(opposingTarget)).toBe("discard");
  });
});

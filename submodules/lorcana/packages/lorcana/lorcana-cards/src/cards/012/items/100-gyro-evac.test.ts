import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { gyroevac } from "./100-gyro-evac";

const evacPassenger = createMockCharacter({
  id: "gyro-evac-passenger",
  name: "Evac Passenger",
  cost: 2,
});

const inkReserve = createMockCharacter({
  id: "gyro-evac-ink-reserve",
  name: "Ink Reserve",
  cost: 1,
});

describe("Gyro-Evac", () => {
  it("TAKE HER UP - gives a chosen character of yours Evasive until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [gyroevac, evacPassenger],
        inkwell: [inkReserve],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(evacPassenger, "Evasive")).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(gyroevac, {
        ability: "TAKE HER UP",
        targets: [evacPassenger],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(evacPassenger, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(gyroevac)).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // Still Evasive during opponent's turn
    expect(testEngine.asPlayerOne().hasKeyword(evacPassenger, "Evasive")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    // Expires at the start of your next turn
    expect(testEngine.asPlayerOne().hasKeyword(evacPassenger, "Evasive")).toBe(false);
  });

  it("CRASH LANDING - banishes this item and each player loses 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [gyroevac],
        lore: 5,
      },
      {
        deck: 2,
        lore: 4,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(gyroevac, {
        ability: "CRASH LANDING",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(gyroevac)).toBe("discard");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
  });
});

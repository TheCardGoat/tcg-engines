import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { goGoTomagoCuttingEdge } from "./107-go-go-tomago-cutting-edge";

const shiftBase = createMockCharacter({
  id: "go-go-shift-base",
  name: "Go Go Tomago",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const opposingCharacter = createMockCharacter({
  id: "go-go-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Go Go Tomago - Cutting Edge", () => {
  it("can put a chosen character into their player's inkwell when played with Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [shiftBase],
        hand: [goGoTomagoCuttingEdge],
        inkwell: 4,
      },
      {
        play: [opposingCharacter],
      },
    );

    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(goGoTomagoCuttingEdge, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goGoTomagoCuttingEdge, {
        resolveOptional: true,
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opposingCharacter)).toBe("inkwell");
  });

  it("does not trigger ZERO RESISTANCE when not played with Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goGoTomagoCuttingEdge],
        inkwell: goGoTomagoCuttingEdge.cost,
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(goGoTomagoCuttingEdge)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goGoTomagoCuttingEdge),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(opposingCharacter)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(goGoTomagoCuttingEdge)).toBe("play");
  });
});

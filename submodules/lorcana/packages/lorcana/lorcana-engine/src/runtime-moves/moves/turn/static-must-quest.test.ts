import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "../../../testing";

const quester = createMockCharacter({
  id: "static-must-quest",
  name: "Required Quester",
  cost: 1,
  abilities: [
    {
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          { type: "restriction", restriction: "cant-challenge", target: "SELF" },
          { type: "restriction", restriction: "must-quest", target: "SELF" },
        ],
      },
    },
  ],
});

describe("static must-quest restriction", () => {
  it("blocks passing with an eligible quester until it quests", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: quester, isDrying: false }], deck: 3 },
      { deck: 3 },
    );
    expect(
      game
        .asPlayerOne()
        .getAvailableMoves()
        .some((move) => move.moveId === "passTurn"),
    ).toBe(false);
    expect(game.asPlayerOne().passTurn()).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .getAvailableMoves()
        .some((move) => move.moveId === "passTurn"),
    ).toBe(true);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });
  it("allows passing when the required quester is drying or exerted", () => {
    for (const state of [{ isDrying: true }, { exerted: true }]) {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: quester, ...state }], deck: 3 },
        { deck: 3 },
      );
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    }
  });
  it("does not require an opponent's character to quest", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 3 },
      { play: [{ card: quester, isDrying: false }], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).not.toBeSuccessfulCommand();
  });
});

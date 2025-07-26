import { describe, expect, test } from "bun:test";
import { LorcanaTestEngine } from "../../../testing/lorcana-test-engine";

describe("3.1. Starting a Game", () => {
  test("Starting a Game, choosing first player and altering both hand should move the game to the 'during game' segment", () => {
    const testEngine = new LorcanaTestEngine(
      {
        deck: 30,
      },
      {
        deck: 30,
      },
      { skipPreGame: false },
    );

    expect(testEngine.getGameSegment()).toEqual("startingAGame");
    expect(testEngine.getGamePhase()).toEqual("chooseFirstPlayer");

    expect(testEngine.getCtx().otp).toEqual(undefined);
    testEngine.chooseWhoGoesFirst("player_one");
    expect(testEngine.getCtx().otp).toEqual("player_one");

    expect(testEngine.getGamePhase()).toEqual("alterHand");

    expect(testEngine.getPriorityPlayers()).toContain("player_one");
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(false);

    testEngine.alterHand([]);

    expect(testEngine.getPriorityPlayers()).not.toContain("player_one");
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(true);

    expect(testEngine.getPriorityPlayers()).toContain("player_two");
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_two"),
    ).toBe(false);

    testEngine.changeActivePlayer("player_two");
    testEngine.alterHand([]);

    expect(testEngine.getPriorityPlayers()).not.toContain("player_two");
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_two"),
    ).toBe(true);

    expect(testEngine.getGameSegment()).toEqual("duringGame");
    expect(testEngine.getPriorityPlayers()).toContain("player_one");
  });

  test("Choosing player_two should give player_two priority", () => {
    const testEngine = new LorcanaTestEngine({}, {}, { skipPreGame: false });

    testEngine.chooseWhoGoesFirst("player_two");

    expect(testEngine.getCtx().otp).toEqual("player_two");

    testEngine.changeActivePlayer("player_two");
    testEngine.alterHand([]);

    testEngine.changeActivePlayer("player_one");
    testEngine.alterHand([]);

    expect(testEngine.getGameSegment()).toEqual("duringGame");
    expect(testEngine.getPriorityPlayers()).toContain("player_two");
    expect(testEngine.getTurnPlayer()).toEqual("player_two");
  });
});

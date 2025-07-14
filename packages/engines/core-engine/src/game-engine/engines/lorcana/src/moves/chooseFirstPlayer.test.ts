import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "../testing/lorcana-test-engine";

describe("Move: Choose First Player", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    testEngine = new LorcanaTestEngine(
      { hand: 7, deck: 10 },
      { hand: 7, deck: 10 },
      { skipPreGame: false },
    );

    expect(testEngine.getGameSegment()).toBe("startingAGame");
    expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");
  });

  afterEach(() => {
    testEngine.dispose();
  });

  it("Choosing player_one", () => {
    testEngine.chooseWhoGoesFirst("player_one");
    expect(testEngine.getCtx().otp).toBe("player_one");

    testEngine.changeActivePlayer("player_one");
    testEngine.alterHand([]);

    testEngine.changeActivePlayer("player_two");
    testEngine.alterHand([]);

    expect(testEngine.getGameSegment()).toBe("duringGame");
    expect(testEngine.getGamePhase()).toBe("mainPhase");
    expect(testEngine.getTurnPlayer()).toBe("player_one");
    expect(testEngine.getPriorityPlayers()).toEqual(["player_one"]);
  });

  it("Choosing player_two", () => {
    testEngine.changeActivePlayer("player_one");
    testEngine.chooseWhoGoesFirst("player_two");
    expect(testEngine.getCtx().otp).toBe("player_two");

    testEngine.changeActivePlayer("player_two");
    testEngine.alterHand([]);

    testEngine.changeActivePlayer("player_one");
    testEngine.alterHand([]);

    expect(testEngine.getGameSegment()).toBe("duringGame");
    expect(testEngine.getGamePhase()).toBe("mainPhase");
    expect(testEngine.getPriorityPlayers()).toEqual(["player_two"]);
    expect(testEngine.getTurnPlayer()).toBe("player_two");
  });

  it("Only one of the players can choose first player", () => {
    // Checking that player_one has the priority
    expect(testEngine.getPriorityPlayers()).toEqual(["player_one"]);
    expect(testEngine.getTurnPlayer()).toBe("player_one");

    // Incorrectly trying to choose first player as player_two
    testEngine.changeActivePlayer("player_two");
    try {
      testEngine.chooseWhoGoesFirst("player_two");
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Game Phase should still be chooseFirstPlayer
    expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");
    expect(testEngine.getCtx().otp).toBe(undefined);

    // Checking that player_one still has the priority
    expect(testEngine.getPriorityPlayers()).toEqual(["player_one"]);
    expect(testEngine.getTurnPlayer()).toBe("player_one");
  });
});

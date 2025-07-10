import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "../../testing/lorcana-test-engine.ts";

describe("**3.1. Starting a Game**", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    testEngine = new LorcanaTestEngine(
      { hand: 7, deck: 10 },
      { hand: 7, deck: 10 },
      { skipPreGame: false },
    );
  });

  afterEach(() => {
    testEngine.dispose();
  });

  it("Happy Path", () => {
    expect(testEngine.getGameSegment()).toBe("startingAGame");
    expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");
    expect(testEngine.getPriorityPlayers()).toEqual(["player_one"]);

    expect(testEngine.potentialMoves()).toEqual([
      {
        move: "chooseWhoGoesFirstMove",
        type: "player",
        targets: ["player_one", "player_two"],
      },
    ]);

    testEngine.chooseWhoGoesFirst("player_one");

    expect(testEngine.getGamePhase()).toBe("alterHand");
    expect(testEngine.getPriorityPlayers()).toEqual(["player_one"]);
    testEngine.changeActivePlayer("player_one");

    const playerOneCardsInHand: string[] = testEngine
      .getCardsInZone("hand", "player_one")
      .map((card) => card.instanceId);
    expect(testEngine.potentialMoves()).toEqual([
      {
        move: "alterHand",
        targets: playerOneCardsInHand,
        min: 0,
        max: playerOneCardsInHand.length,
      },
    ]);

    // Player one alters their hand (choosing no cards to alter)
    testEngine.alterHand([]);

    expect(testEngine.getGamePhase()).toBe("alterHand");
    // In Disney Lorcana, only one player can alter their hand at a time.
    expect(testEngine.getPriorityPlayers()).toEqual(["player_two"]);
    testEngine.changeActivePlayer("player_two");

    const playerTwoCardsInHand: string[] = testEngine
      .getCardsInZone("hand", "player_two")
      .map((card) => card.instanceId);
    expect(testEngine.potentialMoves()).toEqual([
      {
        move: "alterHand",
        targets: playerTwoCardsInHand,
        min: 0,
        max: playerTwoCardsInHand.length,
      },
    ]);

    // Player two alters their hand (choosing no cards to alter)
    testEngine.alterHand([]);

    // After both players have altered their hands, the game segment should change to "duringGame"
    expect(testEngine.getGameSegment()).toBe("duringGame");
    expect(testEngine.getPriorityPlayers()).toEqual(["player_one"]);
    expect(testEngine.getTurnPlayer()).toEqual("player_one");
    expect(testEngine.getNumTurns()).toEqual(1);
  });
});

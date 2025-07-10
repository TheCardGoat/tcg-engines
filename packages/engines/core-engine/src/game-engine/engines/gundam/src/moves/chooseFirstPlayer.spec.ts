import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../testing/gundam-test-engine";

describe("Gundam Engine - Choose First Player Action", () => {
  const initialState = {
    deck: 50,
    resourceDeck: 10,
    resourceArea: 0,
    battleArea: 0,
    shieldBase: 0,
    shieldSection: 0,
    removalArea: 0,
    hand: 0,
    trash: 0,
  };
  const testEngine = new GundamTestEngine(initialState, initialState, {
    skipPreGame: false,
  });

  it("properly sets the first player", () => {
    testEngine.chooseFirstPlayer("player_one");

    expect(testEngine.getCtx().otp).toBe("player_one");
    expect(testEngine.getCtx().turnPlayer).toBe("player_one");
    expect(testEngine.getCtx().priorityPlayer).toBe("player_one");

    expect(testEngine.getCtx().pendingMulligan).toEqual(
      new Set(["player_one", "player_two"]),
    );
    expect(testEngine.getGameSegment()).toBe("startingAGame");
    expect(testEngine.getGamePhase()).toBe("redrawHand");
  });
});

import { describe, expect, it } from "bun:test";
import { buildAcceptedMove } from "./game-mode-message-router";

describe("buildAcceptedMove", () => {
  it("uses the previous turn for canonical turnStart updates", () => {
    const acceptedMove = buildAcceptedMove(
      "player_one",
      "passTurn",
      7,
      [{ stateVersion: 7, log: { moveType: "turnStart", playerId: "player_two" } }],
      { ctx: { status: { turn: 4 } } },
    );

    expect(acceptedMove?.turnNumber).toBe(3);
  });

  it("uses the state turn when the move did not advance the turn", () => {
    const acceptedMove = buildAcceptedMove(
      "player_one",
      "playCard",
      7,
      [{ stateVersion: 7, log: { moveType: "playCard", playerId: "player_one" } }],
      { ctx: { status: { turn: 4 } } },
    );

    expect(acceptedMove?.turnNumber).toBe(4);
  });
});

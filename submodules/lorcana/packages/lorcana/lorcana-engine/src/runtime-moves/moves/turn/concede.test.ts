import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Effect } from "@tcg/lorcana-types";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../../testing";
import type { LorcanaMatchState, PendingActionEffect } from "../../../types";

describe("concede", () => {
  it("ends the game and emits a concede log entry", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({ deck: 1 }, { deck: 1 });

    expect(engine.asPlayerOne().concede(PLAYER_ONE).success).toBe(true);
    expect(engine.asServer().isGameOver()).toBe(true);
    expect(engine.asServer().getWinner()).toBe(PLAYER_TWO);

    const concedeEntry = engine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "concede");
    expect(concedeEntry).toMatchObject({
      moveType: "concede",
      playerId: PLAYER_ONE,
    });
  });

  it("allows conceding while a pending effect is waiting on a non-priority chooser", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({ deck: 1 }, { deck: 2 });
    const state = engine.asServer().getState() as LorcanaMatchState;
    const sourceId = "pending-concede-source" as CardInstanceId;

    state.ctx.priority.holder = PLAYER_ONE;
    state.ctx.priority.windowOpen = true;
    state.ctx.priority.pendingChoice = {
      type: "action-effect",
      playerID: PLAYER_TWO,
      requestID: "pending:concede:1",
    };
    state.G.pendingEffects = [
      {
        id: "pending:concede:1",
        type: "action-effect",
        kind: "name-card-selection",
        sourceId,
        sourceCardId: sourceId,
        controllerId: PLAYER_ONE,
        chooserId: PLAYER_TWO,
        cardPlayed: {
          playerId: PLAYER_ONE,
          cardId: sourceId,
          cardType: "action",
          costType: "standard",
        },
        effect: {
          type: "name-a-card",
        } satisfies Effect,
        resolutionInput: {},
      } satisfies PendingActionEffect,
    ];

    engine.loadState(state);

    expect(engine.asServer().concede(PLAYER_TWO).success).toBe(true);
    expect(engine.asServer().isGameOver()).toBe(true);
    expect(engine.asServer().getWinner()).toBe(PLAYER_ONE);
  });
});

import { describe, expect, it } from "vite-plus/test";

import { reduceLiveGatewayMessage } from "./liveMessages.ts";
import type { EngineInteractionView } from "@tcg/protocol";
import type { LiveMatchView } from "./matchContext.ts";

describe("reduceLiveGatewayMessage", () => {
  it("carries interaction views from game_joined messages", () => {
    const effect = reduceLiveGatewayMessage(
      view(),
      {
        type: "game_joined",
        gameId: "g_1",
        role: "player",
        state: state(),
        stateVersion: 5,
        players: [],
        interactionView: interactionView(5),
      },
      { matchId: "m_1", gameId: "g_1", search: "" },
    );

    expect(effect).toMatchObject({
      type: "state",
      view: {
        version: 5,
        state: state(),
        interactionView: interactionView(5),
      },
    });
  });

  it("preserves the last interaction view when a later state update omits it", () => {
    const effect = reduceLiveGatewayMessage(
      { ...view(), interactionView: interactionView(5) },
      {
        type: "state_update",
        gameId: "g_1",
        state: state(),
        stateVersion: 6,
        patches: [],
        engineLogs: [],
        animations: [],
      },
      { matchId: "m_1", gameId: "g_1", search: "" },
    );

    expect(effect).toMatchObject({
      type: "state",
      view: {
        version: 6,
        interactionView: interactionView(5),
      },
    });
  });
});

function view(): LiveMatchView {
  return {
    matchId: "m_1",
    gameId: "g_1",
    playerId: "p1",
    version: 0,
    state: null,
    ended: null,
  };
}

function state(): Record<string, unknown> {
  return { ctx: { _stateID: 5 } };
}

function interactionView(stateVersion: number): EngineInteractionView {
  return {
    protocolVersion: 1,
    gameSlug: "gundam",
    actorId: "p1",
    stateVersion,
    status: "ready",
    actions: [],
  };
}

import { describe, expect, it } from "vite-plus/test";

import { asPlayerId, type FilteredMatchView } from "@tcg/gundam-engine";
import { reduceLiveGatewayMessage } from "./liveMessages.ts";
import type { EngineInteractionView } from "@tcg/protocol";
import type { LiveMatchView } from "./matchContext.ts";
import { createDevRuntime, DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";

describe("reduceLiveGatewayMessage", () => {
  it("carries interaction views from game_joined messages", () => {
    const projection = state();
    const effect = reduceLiveGatewayMessage(
      view(),
      {
        type: "game_joined",
        gameId: "g_1",
        role: "player",
        state: projection,
        stateVersion: 5,
        players: [],
        interactionView: interactionView(5),
        undoable: true,
      },
      { gameId: "g_1" },
    );

    expect(effect).toMatchObject({
      type: "state",
      view: {
        version: 5,
        state: projection,
        interactionView: interactionView(5),
        canUndo: true,
      },
    });
  });

  it("invalidates the stored interaction view when state advances without one", () => {
    const effect = reduceLiveGatewayMessage(
      { ...view(), version: 5, interactionView: interactionView(5) },
      {
        type: "state_update",
        gameId: "g_1",
        state: state(6),
        stateVersion: 6,
        patches: [],
        engineLogs: [],
        animationPlan: null,
      },
      { gameId: "g_1" },
    );

    expect(effect.type).toBe("state");
    if (effect.type !== "state") return;
    expect(effect.view.version).toBe(6);
    // The version-5 view must not survive a version-6 state — submitting
    // against it is exactly the "Server did not publish a compatible
    // interaction" failure.
    expect(effect.view.interactionView).toBeUndefined();
    expect(effect.resyncInteractionView).toBe(true);
  });

  it("revokes undo when an advanced state omits undoability", () => {
    const effect = reduceLiveGatewayMessage(
      { ...view(), version: 5, canUndo: true },
      {
        type: "state_update",
        gameId: "g_1",
        state: state(6),
        stateVersion: 6,
        patches: [],
        engineLogs: [],
        animationPlan: null,
      },
      { gameId: "g_1" },
    );

    expect(effect).toMatchObject({ type: "state", view: { canUndo: false } });
  });

  it("keeps the stored view when a view-less sync arrives for the same version", () => {
    const effect = reduceLiveGatewayMessage(
      { ...view(), version: 5, interactionView: interactionView(5) },
      {
        type: "state_sync",
        gameId: "g_1",
        state: state(5),
        stateVersion: 5,
        engineLogs: [],
        animationPlan: null,
      },
      { gameId: "g_1" },
    );

    expect(effect).toMatchObject({
      type: "state",
      resyncInteractionView: false,
      view: {
        version: 5,
        interactionView: interactionView(5),
      },
    });
  });

  it("replaces the stored view when a state update publishes a fresh one", () => {
    const effect = reduceLiveGatewayMessage(
      { ...view(), version: 5, interactionView: interactionView(5) },
      {
        type: "state_update",
        gameId: "g_1",
        state: state(6),
        stateVersion: 6,
        patches: [],
        engineLogs: [],
        animationPlan: null,
        interactionView: interactionView(6),
      },
      { gameId: "g_1" },
    );

    expect(effect).toMatchObject({
      type: "state",
      resyncInteractionView: false,
      view: {
        version: 6,
        interactionView: interactionView(6),
      },
    });
  });

  it("retains the authoritative canonical plan for the remote adapter", () => {
    const effect = reduceLiveGatewayMessage(
      view(),
      {
        type: "state_update",
        gameId: "g_1",
        state: state(6, 3),
        stateVersion: 6,
        patches: [],
        engineLogs: [],
        animationPlan: {
          id: "draw-1",
          version: 2,
          steps: [
            {
              id: "draw-1:step",
              type: "entityTransfer",
              entity: { kind: "entity", id: "viewer-safe-card-id" },
              from: { kind: "zone", id: "deck:p2", ownerId: "p2" },
              to: { kind: "zone", id: "hand:p2", ownerId: "p2" },
              sourceFace: "hidden",
              destinationFace: "hidden",
            },
          ],
        },
      },
      { gameId: "g_1" },
    );

    expect(effect).toMatchObject({
      type: "state",
      view: {
        animationPackets: [
          {
            stateVersion: 6,
            turnNumber: 3,
            plan: { id: "draw-1", version: 2 },
          },
        ],
      },
    });
  });

  it("rejects raw engine snapshots on the live channel", () => {
    const rawState = createDevRuntime().runtime.getState();

    const effect = reduceLiveGatewayMessage(
      view(),
      {
        type: "state_update",
        gameId: "g_1",
        state: rawState,
        stateVersion: rawState.ctx._stateID,
        patches: [],
        engineLogs: [],
        animationPlan: null,
      },
      { gameId: "g_1" },
    );

    expect(effect).toEqual({
      type: "invalid_state",
      reason: "Live state was not a privacy-filtered Gundam projection.",
    });
  });

  it.each(["completed", "abandoned"] as const)(
    "keeps the match page open when the match state is %s",
    (status) => {
      const effect = reduceLiveGatewayMessage(
        view(),
        {
          type: "match_state",
          matchId: "m_1",
          status,
          player1Score: 0,
          player2Score: 0,
          gameIds: ["g_1"],
        },
        { gameId: "g_1" },
      );

      expect(effect).toEqual({ type: "ignore" });
    },
  );
});

function view(): LiveMatchView {
  return {
    matchId: "m_1",
    gameId: "g_1",
    playerId: "p1",
    version: 0,
    state: null,
    canUndo: false,
    animationPackets: [],
    engineLogRecords: [],
    ended: null,
  };
}

describe("reduceLiveGatewayMessage presentation accumulation", () => {
  it("widens the presentation from state_sync cards maps and keeps it on later updates", () => {
    const first = reduceLiveGatewayMessage(
      view(),
      {
        type: "state_sync",
        gameId: "g_1",
        stateVersion: 5,
        engineLogs: [],
        animationPlan: null,
        state: state(5),
        cardsMaps: {
          cardInstances: { i_1: "ST01-001" },
          owners: { p1: ["i_1"] },
          presentation: { printingIdByInstanceId: { i_1: "ST01-001_p1" } },
        },
      },
      { gameId: "g_1" },
    );
    expect(first.type).toBe("state");
    if (first.type !== "state") return;
    expect(first.view.presentation?.printingIdByInstanceId).toEqual({ i_1: "ST01-001_p1" });

    // A later state_update carries no cards maps: earlier entries survive.
    const second = reduceLiveGatewayMessage(
      first.view,
      {
        type: "state_update",
        gameId: "g_1",
        stateVersion: 6,
        patches: [],
        engineLogs: [],
        animationPlan: null,
        state: state(6),
      },
      { gameId: "g_1" },
    );
    expect(second.type).toBe("state");
    if (second.type !== "state") return;
    expect(second.view.presentation?.printingIdByInstanceId).toEqual({ i_1: "ST01-001_p1" });

    // A later sync revealing more cards unions both maps; a sparser map
    // must never drop already-revealed entries.
    const third = reduceLiveGatewayMessage(
      second.view,
      {
        type: "state_sync",
        gameId: "g_1",
        stateVersion: 7,
        engineLogs: [],
        animationPlan: null,
        state: state(7),
        cardsMaps: {
          cardInstances: { i_2: "ST01-002" },
          owners: { p1: ["i_2"] },
          presentation: {
            printingIdByInstanceId: { i_2: "ST01-002_p1" },
            printingIdBySetupSlotByOwnerId: { p1: { "ex-base": "EXBP-002" } },
          },
        },
      },
      { gameId: "g_1" },
    );
    expect(third.type).toBe("state");
    if (third.type !== "state") return;
    expect(third.view.presentation?.printingIdByInstanceId).toEqual({
      i_1: "ST01-001_p1",
      i_2: "ST01-002_p1",
    });
    expect(third.view.presentation?.printingIdBySetupSlotByOwnerId).toEqual({
      p1: { "ex-base": "EXBP-002" },
    });
  });
});

function state(stateID = 5, turn?: number): FilteredMatchView {
  const projection = createDevRuntime().runtime.getFilteredView({
    role: "player",
    playerId: asPlayerId(DEV_PLAYER_ONE),
  });
  return {
    ...projection,
    stateID,
    status: turn === undefined ? projection.status : { ...projection.status, turn },
  };
}

function interactionView(stateVersion: number): EngineInteractionView {
  return {
    protocolVersion: 2,
    gameSlug: "gundam",
    actorId: "p1",
    stateVersion,
    status: "ready",
    actions: [],
  };
}

import { describe, expect, it } from "vite-plus/test";
import type { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";
import { simulatorExternalCommandGateFor } from "@tcg/simulator-runtime/animation";

import { createDevRuntime, DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";
import { createRemoteEngineAdapter } from "./remoteAdapter.ts";
import { asMoveName, asViewerId } from "../../game/types.ts";

describe("createRemoteEngineAdapter", () => {
  it("routes hosted drop and skip through platform stall recovery, not execute_move", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const recoveries: Array<{ kind: string; version: number }> = [];
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId: asViewerId(DEV_PLAYER_ONE) },
      () => {
        throw new Error("must not submit an interaction");
      },
      () => undefined,
      () => [],
      () => [],
      () => undefined,
      () => false,
      (kind, version) => recoveries.push({ kind, version }),
    );

    expect(adapter.submit(asMoveName("dropOpponent"), {}).ok).toBe(true);
    expect(adapter.submit(asMoveName("skipOpponentTurn"), {}).ok).toBe(true);
    expect(recoveries).toEqual([
      { kind: "drop_player", version: runtime.getState().ctx._stateID },
      { kind: "skip_opponent_turn", version: runtime.getState().ctx._stateID },
    ]);
  });

  it("returns a failed submit outcome when stall recovery throws", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId: asViewerId(DEV_PLAYER_ONE) },
      () => undefined,
      () => undefined,
      () => [],
      () => [],
      () => undefined,
      () => false,
      () => {
        throw new Error("Gateway is not connected.");
      },
    );

    expect(adapter.submit(asMoveName("dropOpponent"), {})).toEqual({
      ok: false,
      errorCode: "REMOTE_DISPATCH_FAILED",
      error: "Gateway is not connected.",
    });
  });

  it("submits undo only when the server publishes it as available", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const versions: number[] = [];
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId: asViewerId(DEV_PLAYER_ONE) },
      () => undefined,
      () => undefined,
      () => [],
      () => [],
      (version) => versions.push(version),
      () => true,
    );

    expect(adapter.canUndo()).toBe(true);
    expect(adapter.undo()).toEqual({ ok: true, stateId: runtime.getState().ctx._stateID });
    expect(versions).toEqual([runtime.getState().ctx._stateID]);
  });

  it("translates simulator moves to protocol submissions inside the adapter boundary", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const submissions: InteractionSubmission[] = [];
    const adapter = createRemoteEngineAdapter(
      {
        runtime,
        staticResources,
        viewerId: asViewerId(DEV_PLAYER_ONE),
      },
      (submission) => {
        submissions.push(submission);
      },
      () => viewWithActions(["passTurn"], runtime.getState().ctx._stateID),
      () => [],
      () => [],
    );

    const result = adapter.submit(asMoveName("passTurn"), {});

    expect(result.ok).toBe(true);
    expect(submissions).toEqual([
      {
        protocolVersion: 2,
        stateVersion: runtime.getState().ctx._stateID,
        requestId: `gundam:${runtime.getState().ctx._stateID}:passTurn`,
        actionId: "passTurn",
        values: {},
      },
    ]);
  });

  it("rejects remote submits when the server did not publish a compatible action", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const adapter = createRemoteEngineAdapter(
      {
        runtime,
        staticResources,
        viewerId: asViewerId(DEV_PLAYER_ONE),
      },
      () => {
        throw new Error("should not submit");
      },
      () => viewWithActions(["concede"], runtime.getState().ctx._stateID),
      () => [],
      () => [],
    );

    expect(adapter.submit(asMoveName("passTurn"), {})).toEqual({
      ok: false,
      errorCode: "REMOTE_DISPATCH_FAILED",
      error: "Server did not publish a compatible interaction for this move.",
    });
  });

  it("does not dispatch remote commands while the animation gate is blocked", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const submissions: InteractionSubmission[] = [];
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId: asViewerId(DEV_PLAYER_ONE) },
      (submission) => submissions.push(submission),
      () => viewWithActions(["passTurn"], runtime.getState().ctx._stateID),
      () => [],
      () => [],
    );
    const commandGate = simulatorExternalCommandGateFor(runtime);
    commandGate.setBlocked(true);

    expect(adapter.submit(asMoveName("passTurn"), {})).toEqual({
      ok: false,
      errorCode: "animation-active",
      error: "Commands are blocked while the board transition is active.",
    });
    expect(submissions).toEqual([]);

    commandGate.setBlocked(false);
    expect(adapter.submit(asMoveName("passTurn"), {}).ok).toBe(true);
    expect(submissions).toHaveLength(1);
  });

  it("serializes declared setup inputs without move-specific client handling", () => {
    const { runtime, staticResources } = createDevRuntime();
    const submissions: InteractionSubmission[] = [];
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId: asViewerId(DEV_PLAYER_ONE) },
      (submission) => submissions.push(submission),
      () => ({
        ...viewWithActions(["chooseFirstPlayer"], runtime.getState().ctx._stateID),
        actions: [
          {
            ...viewWithActions(["chooseFirstPlayer"], runtime.getState().ctx._stateID).actions[0]!,
            inputs: [
              {
                kind: "option-selection",
                id: "playerId",
                text: { key: "gundam.setup.chooseFirstPlayer" },
                required: true,
                min: 1,
                max: 1,
                options: [{ id: DEV_PLAYER_ONE, text: { key: "player" }, enabled: true }],
              },
            ],
          },
        ],
      }),
      () => [],
      () => [],
    );

    expect(adapter.submit(asMoveName("chooseFirstPlayer"), { playerId: DEV_PLAYER_ONE }).ok).toBe(
      true,
    );
    expect(submissions[0]?.values).toEqual({ playerId: DEV_PLAYER_ONE });
  });

  it("exposes the server-published interaction view to the UI", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const published = viewWithActions(["passTurn"], runtime.getState().ctx._stateID);
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId: asViewerId(DEV_PLAYER_ONE) },
      () => undefined,
      () => published,
      () => [],
      () => [],
    );

    // The UI must render affordances from exactly what the server
    // published — never a locally recomputed view.
    expect(adapter.interactionView()).toBe(published);
  });

  it("falls back to an empty waiting view when no server view is available", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId: asViewerId(DEV_PLAYER_ONE) },
      () => undefined,
      () => undefined,
      () => [],
      () => [],
    );

    const view = adapter.interactionView();
    expect(view.status).toBe("waiting");
    expect(view.actions).toEqual([]);
    expect(view.actorId).toBe(DEV_PLAYER_ONE);
    expect(view.stateVersion).toBe(runtime.getState().ctx._stateID);
  });

  it("passes canonical authoritative plans into the animation trail", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId: asViewerId(DEV_PLAYER_ONE) },
      () => undefined,
      () => undefined,
      () => [
        {
          stateVersion: 4,
          turnNumber: 2,
          plan: {
            id: "draw-1",
            version: 2,
            steps: [
              {
                id: "draw-1:step",
                type: "entityTransfer",
                entity: { kind: "entity", id: "viewer-safe-card" },
                from: { kind: "zone", id: "deck:p2", ownerId: "p2" },
                to: { kind: "zone", id: "hand:p2", ownerId: "p2" },
                sourceFace: "hidden",
                destinationFace: "hidden",
              },
            ],
          },
        },
      ],
      () => [],
    );

    expect(adapter.packetAnimations()).toHaveLength(1);
    expect(adapter.packetAnimations()[0]).toMatchObject({
      stateID: 4,
      turnNumber: 2,
      plan: { id: "draw-1", version: 2 },
    });
  });
});

function viewWithActions(actionIds: string[], stateVersion: number): EngineInteractionView {
  return {
    protocolVersion: 2,
    gameSlug: "gundam",
    actorId: DEV_PLAYER_ONE,
    stateVersion,
    status: "ready",
    actions: actionIds.map((id) => ({
      id,
      requestId: `gundam:${stateVersion}:${id}`,
      intent: "custom",
      text: { key: `move.${id}` },
      enabled: true,
      inputs: [],
    })),
  };
}

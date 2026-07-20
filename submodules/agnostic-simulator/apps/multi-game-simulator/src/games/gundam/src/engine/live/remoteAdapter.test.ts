import { describe, expect, it } from "vite-plus/test";
import type { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";

import { createDevRuntime, DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";
import { createRemoteEngineAdapter } from "./remoteAdapter.ts";
import { asMoveName, asViewerId } from "../../game/types.ts";

describe("createRemoteEngineAdapter", () => {
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
    );

    const result = adapter.submit(asMoveName("passTurn"), {});

    expect(result.ok).toBe(true);
    expect(submissions).toEqual([
      {
        protocolVersion: 1,
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
    );

    expect(adapter.submit(asMoveName("passTurn"), {})).toEqual({
      ok: false,
      errorCode: "REMOTE_DISPATCH_FAILED",
      error: "Server did not publish a compatible interaction for this move.",
    });
  });

  it("maps only validated authoritative packets into the animation trail", () => {
    const { runtime, staticResources } = createDevRuntime({ skipToMainPhase: true });
    const adapter = createRemoteEngineAdapter(
      { runtime, staticResources, viewerId: asViewerId(DEV_PLAYER_ONE) },
      () => undefined,
      () => undefined,
      () => [
        {
          stateVersion: 4,
          turnNumber: 2,
          packet: {
            id: "draw-1",
            kind: "cardMove",
            payload: {
              kind: "cardMove",
              cardId: "p2-private-card-id",
              ownerId: "p2",
              fromZone: "deck",
              toZone: "hand",
            },
          },
        },
        {
          stateVersion: 4,
          turnNumber: 2,
          packet: { id: "invalid", kind: "cardMove", payload: { kind: "cardMove" } },
        },
      ],
    );

    expect(adapter.packetAnimations()).toHaveLength(1);
    expect(adapter.packetAnimations()[0]).toMatchObject({
      stateID: 4,
      turnNumber: 2,
      animation: { id: "draw-1", data: { kind: "cardMove" } },
    });
  });
});

function viewWithActions(actionIds: string[], stateVersion: number): EngineInteractionView {
  return {
    protocolVersion: 1,
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

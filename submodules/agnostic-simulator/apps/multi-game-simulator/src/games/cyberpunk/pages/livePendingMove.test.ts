import { describe, expect, test } from "vitest";
import {
  shouldClearPendingAfterAuthoritativeState,
  shouldClearPendingAfterSubmitInteractionOk,
  type PendingOptimisticMove,
} from "./livePendingMove";

type StateUpdateMessage = Parameters<typeof shouldClearPendingAfterAuthoritativeState>[1];

const pendingRemoteMove = {
  correlationId: "corr_1",
  gameId: "game_1",
  startingVersion: 7,
  localOptimisticStateId: 7,
  optimisticApplied: false,
  actionId: "playCard",
  side: "player",
} satisfies PendingOptimisticMove;

function stateUpdate(
  patch: Partial<StateUpdateMessage> & { correlationId?: string } = {},
): StateUpdateMessage {
  return {
    type: "state_update",
    gameId: "game_1",
    stateVersion: 8,
    patches: [],
    engineLogs: [],
    animations: [],
    state: {},
    ...patch,
  } as StateUpdateMessage;
}

describe("LiveMatch pending remote move guards", () => {
  test("keeps non-optimistic submissions pending through the early ok response", () => {
    expect(shouldClearPendingAfterSubmitInteractionOk(pendingRemoteMove, "corr_1")).toBe(false);
    expect(
      shouldClearPendingAfterSubmitInteractionOk(
        { ...pendingRemoteMove, optimisticApplied: true },
        "corr_1",
      ),
    ).toBe(true);
  });

  test("clears non-optimistic submissions only after a matching state update advances the version", () => {
    expect(shouldClearPendingAfterAuthoritativeState(pendingRemoteMove, stateUpdate())).toBe(true);
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({ stateVersion: pendingRemoteMove.startingVersion }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({ gameId: "other_game" }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({ correlationId: "other_corr" }),
      ),
    ).toBe(false);
  });
});

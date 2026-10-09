import { describe, expect, test, vi } from "vitest";
import type { InteractionAction } from "@tcg/protocol";
import {
  markPendingMoveAwaitingRecoverySync,
  startPendingMoveStateSyncWatchdog,
  shouldClearPendingAfterAuthoritativeMoveAccepted,
  shouldClearPendingAfterAuthoritativeState,
  type PendingOptimisticMove,
} from "./livePendingMove.js";

type AuthoritativeStateMessage = Parameters<typeof shouldClearPendingAfterAuthoritativeState>[1];
type MoveAcceptedMessage = Parameters<typeof shouldClearPendingAfterAuthoritativeMoveAccepted>[1];

const actionStub = (id: string): InteractionAction => ({
  id,
  requestId: `cyberpunk:7:${id}`,
  intent: "choose-option",
  text: { key: "test.action" },
  enabled: true,
  inputs: [],
});

const interactionViewStub = (
  stateVersion: number,
  actions: InteractionAction[],
): NonNullable<AuthoritativeStateMessage["interactionView"]> => ({
  protocolVersion: 2,
  gameSlug: "cyberpunk",
  actorId: "player-1",
  stateVersion,
  status: "choosing",
  actions,
});

const pendingRemoteMove = {
  correlationId: "corr_1",
  gameId: "game_1",
  startingVersion: 7,
  localOptimisticStateId: 7,
  optimisticApplied: false,
  awaitingRecoverySync: false,
  actionId: "playCard",
  startingInteractionSignature: JSON.stringify(
    interactionViewStub(7, [actionStub("resolveTrigger")]),
  ),
  side: "player",
} satisfies PendingOptimisticMove;

function stateUpdate(
  patch: Partial<AuthoritativeStateMessage> & { correlationId?: string } = {},
): AuthoritativeStateMessage {
  return {
    type: "state_update",
    gameId: "game_1",
    stateVersion: 8,
    patches: [],
    engineLogs: [],
    animationPlan: null,
    state: {},
    ...patch,
  } as AuthoritativeStateMessage;
}

function moveAccepted(
  state: MoveAcceptedMessage["state"],
  patch: Partial<MoveAcceptedMessage> = {},
): MoveAcceptedMessage {
  return {
    type: "move_accepted",
    gameId: "game_1",
    stateVersion: 8,
    patches: [],
    engineLogs: [],
    animationPlan: null,
    state,
    moveType: "interaction:resolveFirstPlayer",
    actorId: "player-1",
    correlationId: "corr_1",
    ...patch,
  };
}

describe("LiveMatch pending remote move guards", () => {
  test("clears only after the matching move response carries authoritative state", () => {
    expect(
      shouldClearPendingAfterAuthoritativeMoveAccepted(pendingRemoteMove, moveAccepted({})),
    ).toBe(true);
    expect(
      shouldClearPendingAfterAuthoritativeMoveAccepted(pendingRemoteMove, moveAccepted(null)),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeMoveAccepted(
        pendingRemoteMove,
        moveAccepted({}, { correlationId: "other_corr" }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeMoveAccepted(
        pendingRemoteMove,
        moveAccepted({}, { gameId: "other_game" }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeMoveAccepted(
        pendingRemoteMove,
        moveAccepted({}, { stateVersion: pendingRemoteMove.startingVersion }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeMoveAccepted(
        pendingRemoteMove,
        moveAccepted({}, { stateVersion: pendingRemoteMove.startingVersion - 1 }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeMoveAccepted(
        pendingRemoteMove,
        moveAccepted({}, { correlationId: undefined }),
      ),
    ).toBe(false);
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
  });

  test("clears after a newer authoritative state even when a server follow-up changes correlation", () => {
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({ correlationId: "other_corr" }),
      ),
    ).toBe(true);
  });

  test("uses correlation as the fallback for an unversioned authoritative update", () => {
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({ stateVersion: undefined, correlationId: "other_corr" }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({ stateVersion: undefined, correlationId: "corr_1" }),
      ),
    ).toBe(true);
  });

  test("keeps the latch through a stale snapshot and clears it after a newer snapshot", () => {
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({ type: "state_sync", stateVersion: pendingRemoteMove.startingVersion }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({ type: "state_sync", stateVersion: pendingRemoteMove.startingVersion + 1 }),
      ),
    ).toBe(true);
  });

  test("clears after a same-version snapshot replaces the pending interaction", () => {
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({
          type: "state_sync",
          stateVersion: pendingRemoteMove.startingVersion,
          interactionView: interactionViewStub(7, [actionStub("resolveEffectTarget")]),
        }),
      ),
    ).toBe(true);
    expect(
      shouldClearPendingAfterAuthoritativeState(
        pendingRemoteMove,
        stateUpdate({
          type: "state_sync",
          stateVersion: pendingRemoteMove.startingVersion,
          interactionView: interactionViewStub(7, [actionStub("resolveTrigger")]),
        }),
      ),
    ).toBe(false);
  });

  test("clears after the requested recovery sync confirms the same authoritative version", () => {
    const rejectedPending = markPendingMoveAwaitingRecoverySync(pendingRemoteMove);
    expect(
      shouldClearPendingAfterAuthoritativeState(
        rejectedPending,
        stateUpdate({
          type: "state_sync",
          stateVersion: pendingRemoteMove.startingVersion,
          interactionView: undefined,
        }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeState(
        rejectedPending,
        stateUpdate({
          type: "state_sync",
          stateVersion: pendingRemoteMove.startingVersion + 1,
          interactionView: undefined,
        }),
      ),
    ).toBe(false);
    expect(
      shouldClearPendingAfterAuthoritativeState(
        rejectedPending,
        stateUpdate({
          type: "state_sync",
          stateVersion: pendingRemoteMove.startingVersion,
          interactionView: interactionViewStub(7, [actionStub("resolveTrigger")]),
        }),
      ),
    ).toBe(true);
  });

  test("requests snapshots while the submitted move still awaits authoritative state", () => {
    vi.useFakeTimers();
    let current: PendingOptimisticMove | null = pendingRemoteMove;
    const requestStateSync = vi.fn();
    const stop = startPendingMoveStateSyncWatchdog({
      correlationId: pendingRemoteMove.correlationId,
      readPending: () => current,
      readStateVersion: () => 7,
      requestStateSync,
      retryMs: 100,
    });

    vi.advanceTimersByTime(200);
    expect(requestStateSync).toHaveBeenNthCalledWith(1, 7);
    expect(requestStateSync).toHaveBeenNthCalledWith(2, 7);

    current = null;
    vi.advanceTimersByTime(100);
    expect(requestStateSync).toHaveBeenCalledTimes(2);

    stop();
    vi.useRealTimers();
  });
});

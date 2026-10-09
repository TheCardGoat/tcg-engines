import type { Side } from "../engine";
import type { LiveGatewayMessage } from "../engine/live/liveGateway";

export interface PendingOptimisticMove {
  correlationId: string;
  gameId: string;
  startingVersion: number;
  localOptimisticStateId: number;
  optimisticApplied: boolean;
  awaitingRecoverySync: boolean;
  actionId: string;
  startingInteractionSignature: string;
  side: Side;
}

export const PENDING_MOVE_SYNC_RETRY_MS = 3_000;

export function matchesPendingCorrelation(
  pending: PendingOptimisticMove,
  correlationId: string | undefined,
): boolean {
  return correlationId === undefined || pending.correlationId === correlationId;
}

export function shouldClearPendingAfterAuthoritativeMoveAccepted(
  pending: PendingOptimisticMove | null,
  message: Extract<LiveGatewayMessage, { type: "move_accepted" }>,
): boolean {
  return Boolean(
    pending &&
    message.gameId === pending.gameId &&
    typeof message.stateVersion === "number" &&
    message.stateVersion > pending.startingVersion &&
    message.state &&
    typeof message.state === "object" &&
    message.correlationId === pending.correlationId,
  );
}

export function shouldClearPendingAfterAuthoritativeState(
  pending: PendingOptimisticMove | null,
  message: Extract<LiveGatewayMessage, { type: "state_sync" | "state_update" }>,
): boolean {
  if (!pending || message.gameId !== pending.gameId) {
    return false;
  }
  if (
    pending.awaitingRecoverySync &&
    message.type === "state_sync" &&
    message.interactionView === undefined
  ) {
    // Recovery snapshots must replace the rejected controls. This guard must
    // run before the newer-version fast path because a projection failure can
    // omit the view at any authoritative version.
    return false;
  }
  if (typeof message.stateVersion === "number") {
    // A newer authoritative state proves that the server has moved beyond the
    // version on which this submission was based. Some server-side follow-up
    // processing publishes that state with its own correlation id, so keeping
    // the old client latch in that case deadlocks the newly projected prompt:
    // its controls render, but every dispatch is rejected as still pending.
    if (message.stateVersion > pending.startingVersion) {
      return true;
    }
    if (message.stateVersion < pending.startingVersion) {
      return false;
    }
    if (pending.awaitingRecoverySync && message.type === "state_sync") {
      return true;
    }
    const syncedInteractionSignature =
      "interactionView" in message && message.interactionView
        ? interactionViewSyncSignature(message.interactionView)
        : null;
    return (
      syncedInteractionSignature !== null &&
      syncedInteractionSignature !== pending.startingInteractionSignature
    );
  }
  const messageCorrelationId = readMessageCorrelationId(message);
  return matchesPendingCorrelation(pending, messageCorrelationId);
}

export function interactionViewSyncSignature(view: object): string {
  return JSON.stringify(view);
}

export function markPendingMoveAwaitingRecoverySync(
  pending: PendingOptimisticMove,
): PendingOptimisticMove {
  return { ...pending, awaitingRecoverySync: true };
}

export function startPendingMoveStateSyncWatchdog({
  correlationId,
  readPending,
  readStateVersion,
  requestStateSync,
  retryMs = PENDING_MOVE_SYNC_RETRY_MS,
}: {
  correlationId: string;
  readPending: () => PendingOptimisticMove | null;
  readStateVersion: () => number | null;
  requestStateSync: (version: number) => void;
  retryMs?: number;
}): () => void {
  const timer = setInterval(() => {
    if (readPending()?.correlationId !== correlationId) {
      return;
    }
    const version = readStateVersion();
    if (version !== null) {
      requestStateSync(version);
    }
  }, retryMs);
  return () => clearInterval(timer);
}

export function readMessageCorrelationId(message: object): string | undefined {
  return "correlationId" in message && typeof message.correlationId === "string"
    ? message.correlationId
    : undefined;
}

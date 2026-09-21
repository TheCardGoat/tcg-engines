import type { Side } from "../engine";
import type { LiveGatewayMessage } from "../engine/live/liveGateway";

export interface PendingOptimisticMove {
  correlationId: string;
  gameId: string;
  startingVersion: number;
  localOptimisticStateId: number;
  optimisticApplied: boolean;
  actionId: string;
  side: Side;
}

export function matchesPendingCorrelation(
  pending: PendingOptimisticMove,
  correlationId: string | undefined,
): boolean {
  return correlationId === undefined || pending.correlationId === correlationId;
}

export function shouldClearPendingAfterSubmitInteractionOk(
  pending: PendingOptimisticMove | null,
  correlationId: string | undefined,
): boolean {
  return Boolean(pending?.optimisticApplied && matchesPendingCorrelation(pending, correlationId));
}

export function shouldClearPendingAfterAuthoritativeState(
  pending: PendingOptimisticMove | null,
  message: Extract<LiveGatewayMessage, { type: "state_update" }>,
): boolean {
  if (!pending || message.gameId !== pending.gameId) {
    return false;
  }
  if (typeof message.stateVersion === "number") {
    // A newer authoritative state proves that the server has moved beyond the
    // version on which this submission was based. Some server-side follow-up
    // processing publishes that state with its own correlation id, so keeping
    // the old client latch in that case deadlocks the newly projected prompt:
    // its controls render, but every dispatch is rejected as still pending.
    return message.stateVersion > pending.startingVersion;
  }
  const messageCorrelationId = readMessageCorrelationId(message);
  return matchesPendingCorrelation(pending, messageCorrelationId);
}

export function readMessageCorrelationId(message: object): string | undefined {
  return "correlationId" in message && typeof message.correlationId === "string"
    ? message.correlationId
    : undefined;
}

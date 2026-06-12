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
  const messageCorrelationId = readMessageCorrelationId(message);
  if (messageCorrelationId && !matchesPendingCorrelation(pending, messageCorrelationId)) {
    return false;
  }
  return typeof message.stateVersion === "number"
    ? message.stateVersion > pending.startingVersion
    : true;
}

export function readMessageCorrelationId(message: object): string | undefined {
  return "correlationId" in message && typeof message.correlationId === "string"
    ? message.correlationId
    : undefined;
}

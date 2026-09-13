import { fabGameEndReasonLabel } from "@tcg/flesh-and-blood-engine/log";

/**
 * Present a persisted end-reason token from one participant's perspective.
 * Timeout and disconnect are only terminal after the other player explicitly
 * claims the win; the winner id therefore identifies whose clock/connection
 * caused the claimed result.
 */
export function fabEndReasonForViewer(
  reason: string,
  winnerId: string | null,
  viewerId: string,
): string {
  if (reason === "timeout") {
    return winnerId === viewerId ? "Opponent timed out" : "You timed out";
  }
  if (reason === "disconnect") {
    return winnerId === viewerId ? "Opponent disconnected" : "You disconnected";
  }
  return fabGameEndReasonLabel(reason);
}

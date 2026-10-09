import type { PreparationCommand, PreparationCommandResult } from "@tcg/protocol/preparation";
import { logBrowserInfo } from "../observability/browser";

type RejectionCode = Extract<PreparationCommandResult, { status: "rejected" }>["code"];
type RecoveryReason =
  | "new_game_credentials"
  | "gameplay_bootstrap"
  | "preparation_command"
  | "lifecycle_revision"
  | "match_state"
  | "authenticated"
  | "visibility"
  | "revision_check"
  | "transport_fallback"
  | "preparation_deadline"
  | "manual";

/** Closed attributes only: no identities, credentials, selections, or error text. */
type PreparationMeasurement =
  | {
      type: "command_reply";
      command: PreparationCommand["type"];
      transport: "websocket" | "http";
      outcome: "accepted" | RejectionCode | "transport_error";
      duration_ms: number;
    }
  | { type: "http_read"; reason: RecoveryReason; outcome: "ok" | "error"; duration_ms: number }
  | { type: "command_fallback"; reason: "disconnected" | "socket_reply_failed" }
  | { type: "socket_recovery"; duration_ms: number }
  | { type: "snapshot_render"; duration_ms: number };

export function preparationRecoveryReason(reason: string): RecoveryReason {
  switch (reason) {
    case "new_game_credentials":
    case "gameplay_bootstrap":
    case "preparation_command":
    case "lifecycle_revision":
    case "match_state":
    case "authenticated":
    case "visibility":
    case "revision_check":
    case "transport_fallback":
    case "preparation_deadline":
      return reason;
    default:
      return "manual";
  }
}

export function recordPreparationMeasurement(measurement: PreparationMeasurement): void {
  const { type, ...attributes } = measurement;
  logBrowserInfo(`preparation.${type}`, attributes);
}

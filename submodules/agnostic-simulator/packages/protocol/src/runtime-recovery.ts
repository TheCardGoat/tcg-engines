/** Codes travel in the existing `error` envelope so previous clients can read them. */
export type RuntimeRecoveryCode =
  | "game_state_incompatible"
  | "game_engine_failed"
  | "game_operation_failed"
  | "match_operation_failed";

export function isRuntimeRecoveryCode(code: string | undefined): code is RuntimeRecoveryCode {
  return (
    code === "game_state_incompatible" ||
    code === "game_engine_failed" ||
    code === "game_operation_failed" ||
    code === "match_operation_failed"
  );
}

export function runtimeRecoveryMessage(code: RuntimeRecoveryCode): string {
  if (code === "game_state_incompatible") {
    return "This saved game cannot run on the current server version. A server update is needed before play can continue.";
  }
  if (code === "game_engine_failed") {
    return "The server could not process your action. Refresh the board before trying again.";
  }
  if (code === "match_operation_failed") {
    return "The server could not complete this request. Try again.";
  }
  return "The server could not confirm your action. Check the latest board before trying again.";
}

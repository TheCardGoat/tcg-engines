import {
  decodeFabCommand,
  isFabMoveName,
  type FabCommandFailure,
  type FabCommandSuccess,
} from "../moves.ts";
import { FabMatchRuntime } from "../runtime.ts";

type FabTestCommandResult =
  | (FabCommandSuccess & { readonly accepted: true })
  | (FabCommandFailure & { readonly accepted: false });

/**
 * Test-only convenience for fixtures that still describe a wire-shaped move.
 * It deliberately decodes before reaching the runtime, so production and rule
 * tests exercise the same typed `applyCommand` boundary.
 */
export function dispatchTestCommand(
  runtime: FabMatchRuntime,
  move: string,
  actorId: string,
  payload: Record<string, unknown>,
): FabTestCommandResult {
  if (!isFabMoveName(move)) {
    return {
      success: false,
      accepted: false,
      error: `Unknown move: ${move}`,
      errorCode: "unknown_move",
      currentStateID: runtime.getStateID(),
    };
  }
  const command = decodeFabCommand(move, payload);
  if (!command) {
    return {
      success: false,
      accepted: false,
      error: "FAB command payload is malformed or uses a legacy field.",
      errorCode: "invalid_command_payload",
      currentStateID: runtime.getStateID(),
    };
  }
  const result = runtime.applyCommand(actorId, command);
  return result.success ? { ...result, accepted: true } : { ...result, accepted: false };
}

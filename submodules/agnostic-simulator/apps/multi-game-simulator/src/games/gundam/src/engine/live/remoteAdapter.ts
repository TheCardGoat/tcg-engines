import type { EngineAdapter, EngineAdapterConfig } from "../../game/adapter.ts";
import { createEngineAdapter } from "../../game/adapter.ts";
import type { MoveName, PartialInput, SubmitOutcome } from "../../game/types.ts";
import type { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";
import { moveToInteractionSubmission } from "./actionToInteraction.ts";

export type RemoteSubmitFn = (submission: InteractionSubmission, expectedVersion: number) => void;

/**
 * Build an {@link EngineAdapter} whose `submit` routes every move
 * through the supplied `remoteSubmit` callback instead of executing
 * locally against the runtime.
 *
 * State still flows back through the local runtime — `applyLiveStateUpdate`
 * is what advances it on each server `state_sync`. So:
 *   - `view`, `interactionView`, `pendingChoice`, etc. all read from
 *     the live runtime as usual (the existing GundamGameProvider tree
 *     wires up the subscriptions).
 *   - `submit` short-circuits, hands the move off to the gateway, and
 *     returns optimistically with the current local stateId. The
 *     server's `state_sync` (or `move_rejected`) is the authoritative
 *     resolution.
 *   - `undo` is disabled — server-authoritative play has no undo until
 *     the server protocol supports it.
 */
export function createRemoteEngineAdapter(
  config: EngineAdapterConfig,
  remoteSubmit: RemoteSubmitFn,
  getInteractionView: () => EngineInteractionView | undefined,
): EngineAdapter {
  const local = createEngineAdapter(config);
  const remote: EngineAdapter = {
    ...local,
    submit: (move: MoveName, partialInput: PartialInput): SubmitOutcome => {
      const stateId = config.runtime.getState().ctx._stateID;
      try {
        const submission = moveToInteractionSubmission(move, partialInput, getInteractionView());
        if (!submission) {
          return {
            ok: false,
            errorCode: "REMOTE_DISPATCH_FAILED",
            error: "Server did not publish a compatible interaction for this move.",
          };
        }
        remoteSubmit(submission, stateId);
        return { ok: true, stateId };
      } catch (error) {
        return {
          ok: false,
          errorCode: "REMOTE_DISPATCH_FAILED",
          error: error instanceof Error ? error.message : "Failed to send move to gateway.",
        };
      }
    },
    canUndo: () => false,
    undo: () => null,
  };
  return remote;
}

import type { EngineAdapter, EngineAdapterConfig } from "../../game/adapter.ts";
import { createEngineAdapter } from "../../game/adapter.ts";
import type { MoveName, PartialInput, SubmitOutcome } from "../../game/types.ts";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";
import type { InteractionSubmission } from "@tcg/protocol";
import { asPlayerId } from "@tcg/gundam-engine";
import type { LiveAnimationPacket, LiveEngineLogRecord } from "./matchContext.ts";
import { moveToInteractionSubmission } from "./actionToInteraction.ts";
import { reconstructGundamMoveLogs } from "./liveEngineLogs.ts";

export type RemoteSubmitFn = (submission: InteractionSubmission, expectedVersion: number) => void;
export type RemoteUndoFn = (expectedVersion: number) => void;
export type RemoteStallRecoveryFn = (
  kind: "drop_player" | "skip_opponent_turn",
  expectedVersion: number,
) => void;

/**
 * Build an {@link EngineAdapter} whose `submit` routes every move
 * through the supplied `remoteSubmit` callback instead of executing
 * locally against the runtime.
 *
 * State still flows back through the local runtime — `applyLiveProjectionUpdate`
 * is what advances it on each server `state_sync`. So:
 *   - `view`, `interactionView`, `pendingChoice`, etc. all read from
 *     the live runtime as usual (the existing GundamGameProvider tree
 *     wires up the subscriptions).
 *   - `submit` short-circuits, hands the move off to the gateway, and
 *     returns optimistically with the current local stateId. The
 *     server's `state_sync` (or `move_rejected`) is the authoritative
 *     resolution.
 *   - `undo` is sent as a versioned server command. The browser never
 *     restores a checkpoint itself; it waits for the authoritative sync.
 *   - `interactionView` reads the server-published view, NOT a locally
 *     recomputed one. The UI renders its affordances (priority buttons,
 *     playable-card highlights, targeting) from this view, so it can only
 *     ever offer actions the server actually published. When no view has
 *     been published yet (pre-join, or invalidated after a view-less
 *     state advance) an empty "waiting" view is returned instead.
 *   - `moveLogs` are reconstructed from the viewer-safe engine log
 *     records the gateway broadcasts. The local runtime never executes
 *     commands in live mode, and `loadState` snapshots don't carry the
 *     runtime's move-log history — without this the battle log is empty.
 */
export function createRemoteEngineAdapter(
  config: EngineAdapterConfig,
  remoteSubmit: RemoteSubmitFn,
  getInteractionView: () => EngineInteractionView | undefined,
  getAnimationPackets: () => readonly LiveAnimationPacket[],
  getEngineLogRecords: () => readonly LiveEngineLogRecord[],
  remoteUndo: RemoteUndoFn = () => undefined,
  getCanUndo: () => boolean = () => false,
  remoteStallRecovery: RemoteStallRecoveryFn = () => undefined,
): EngineAdapter {
  const local = createEngineAdapter(config);
  const remote: EngineAdapter = {
    ...local,
    interactionView: () => getInteractionView() ?? waitingInteractionView(config),
    moveLogs: () => {
      const records = getEngineLogRecords();
      // Replay playback and fixtures drive the runtime locally, so its
      // own move-log history is the source of truth there; only live
      // matches (which never execute locally) need the gateway records.
      if (records.length === 0) return local.moveLogs();
      return reconstructGundamMoveLogs(records).map((log) => ({
        // Privacy was already applied server-side per viewer, so no
        // client-side stripping here — unlike the local adapter.
        log,
        turnNumber:
          log.turnNumber ??
          config.runtime.getFilteredView({
            role: "player",
            playerId: asPlayerId(String(config.viewerId)),
          }).status.turn,
      }));
    },
    submit: (move: MoveName, partialInput: PartialInput): SubmitOutcome => {
      if (local.commandGate.isBlocked()) {
        return {
          ok: false,
          errorCode: "animation-active",
          error: "Commands are blocked while the board transition is active.",
        };
      }
      const stateId = config.runtime.getState().ctx._stateID;
      if (move === "dropOpponent" || move === "skipOpponentTurn") {
        try {
          remoteStallRecovery(
            move === "dropOpponent" ? "drop_player" : "skip_opponent_turn",
            stateId,
          );
          return { ok: true, stateId };
        } catch (error) {
          return {
            ok: false,
            errorCode: "REMOTE_DISPATCH_FAILED",
            error: error instanceof Error ? error.message : "Failed to send recovery to gateway.",
          };
        }
      }
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
    canUndo: () => getCanUndo() && !local.commandGate.isBlocked(),
    undo: () => {
      if (!getCanUndo()) return null;
      if (local.commandGate.isBlocked()) {
        return {
          ok: false,
          errorCode: "animation-active",
          error: "Commands are blocked while the board transition is active.",
        };
      }
      const stateId = config.runtime.getState().ctx._stateID;
      try {
        remoteUndo(stateId);
        return { ok: true, stateId };
      } catch (error) {
        return {
          ok: false,
          errorCode: "REMOTE_DISPATCH_FAILED",
          error: error instanceof Error ? error.message : "Failed to send undo to gateway.",
        };
      }
    },
    packetAnimations: () =>
      getAnimationPackets().map(({ plan, stateVersion, turnNumber }) => ({
        plan,
        stateID: stateVersion,
        turnNumber,
      })),
  };
  return remote;
}

/**
 * Empty view returned while no server-published view is available
 * (before the first `game_joined` sync, or after a view-less state
 * advance invalidated the stored one). `status: "waiting"` with no
 * actions means the UI offers nothing until the server republishes.
 */
function waitingInteractionView(config: EngineAdapterConfig): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "gundam",
    actorId: String(config.viewerId),
    stateVersion: config.runtime.getState().ctx._stateID,
    status: "waiting",
    actions: [],
  };
}

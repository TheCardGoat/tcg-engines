import type { EngineAdapter, EngineAdapterConfig } from "../../game/adapter.ts";
import { createEngineAdapter } from "../../game/adapter.ts";
import type { MoveName, PartialInput, SubmitOutcome } from "../../game/types.ts";
import type { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";
import type { AnimationData, PacketAnimation } from "@tcg/gundam-engine";
import type { LiveAnimationPacket } from "./matchContext.ts";
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
  getAnimationPackets: () => readonly LiveAnimationPacket[],
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
    packetAnimations: () =>
      getAnimationPackets().flatMap(({ packet, stateVersion, turnNumber }) => {
        const data = animationDataFromUnknown(packet.payload);
        if (!data) return [];
        const animation: PacketAnimation = {
          id: packet.id,
          type: packet.kind,
          duration: packet.durationMs ?? 320,
          data,
        };
        return [{ animation, stateID: stateVersion, turnNumber }];
      }),
  };
  return remote;
}

function animationDataFromUnknown(value: unknown): AnimationData | null {
  if (!isRecord(value) || typeof value.kind !== "string") return null;
  switch (value.kind) {
    case "cardMove":
      if (
        typeof value.cardId !== "string" ||
        typeof value.fromZone !== "string" ||
        typeof value.toZone !== "string"
      )
        return null;
      return {
        kind: "cardMove",
        cardId: value.cardId,
        fromZone: value.fromZone,
        toZone: value.toZone,
        ...(typeof value.ownerId === "string" ? { ownerId: value.ownerId } : {}),
        ...(typeof value.fromIndex === "number" ? { fromIndex: value.fromIndex } : {}),
        ...(typeof value.toIndex === "number" ? { toIndex: value.toIndex } : {}),
      };
    case "cardFlip":
      return typeof value.cardId === "string" && typeof value.faceDown === "boolean"
        ? { kind: "cardFlip", cardId: value.cardId, faceDown: value.faceDown }
        : null;
    case "damage":
      return typeof value.targetId === "string" &&
        typeof value.amount === "number" &&
        typeof value.damageType === "string"
        ? {
            kind: "damage",
            targetId: value.targetId,
            amount: value.amount,
            damageType: value.damageType,
            ...(typeof value.sourceId === "string" ? { sourceId: value.sourceId } : {}),
          }
        : null;
    case "shake":
      return typeof value.targetId === "string" && typeof value.intensity === "number"
        ? { kind: "shake", targetId: value.targetId, intensity: value.intensity }
        : null;
    case "generic":
      return typeof value.name === "string" && isRecord(value.params)
        ? { kind: "generic", name: value.name, params: value.params }
        : null;
    default:
      return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

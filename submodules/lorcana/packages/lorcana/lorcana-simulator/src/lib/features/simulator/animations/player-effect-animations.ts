import type { EnginePacketUpdate } from "@tcg/lorcana-engine";
import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";

export interface QueuedPlayerEffectAnimation {
  id: string;
  actorSide: LorcanaPlayerSide;
  targetSides: readonly LorcanaPlayerSide[];
  durationMs: number;
}

type PlayerEffectPacketPayload = {
  actorSide: LorcanaPlayerSide;
  cardId: string;
  targetSides: readonly ("playerOne" | "playerTwo")[];
};

export function deriveQueuedPlayerEffectAnimationsFromPacket(
  packet: EnginePacketUpdate | null,
  durationMs: number,
): QueuedPlayerEffectAnimation[] {
  if (!packet || packet.animations.length === 0) {
    return [];
  }

  const queued: QueuedPlayerEffectAnimation[] = [];

  for (const animation of packet.animations) {
    if (animation.kind !== "lorcana.playerEffect") {
      continue;
    }

    const payload = animation.payload as Partial<PlayerEffectPacketPayload>;
    if (
      !payload ||
      !Array.isArray(payload.targetSides) ||
      payload.targetSides.length === 0 ||
      (payload.actorSide !== "playerOne" && payload.actorSide !== "playerTwo")
    ) {
      continue;
    }

    queued.push({
      id: animation.id,
      actorSide: payload.actorSide,
      targetSides: payload.targetSides.filter(
        (s): s is LorcanaPlayerSide => s === "playerOne" || s === "playerTwo",
      ),
      durationMs,
    });
  }

  return queued;
}

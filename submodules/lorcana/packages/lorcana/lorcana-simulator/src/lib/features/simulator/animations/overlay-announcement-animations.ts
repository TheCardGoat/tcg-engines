import type { EnginePacketUpdate } from "@tcg/lorcana-engine";
import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";

export type OverlayAnnouncementKind = "turn-change" | "concede" | "mulligan";

export interface QueuedOverlayAnnouncement {
  id: string;
  kind: OverlayAnnouncementKind;
  durationMs: number;
  turnChange?: {
    nextPlayerSide: LorcanaPlayerSide;
    turnNumber: number;
  };
  concede?: {
    concedingSide: LorcanaPlayerSide;
  };
  mulligan?: {
    actorSide: LorcanaPlayerSide;
    mulliganCount: number;
  };
}

export type ResolvedOverlayAnnouncement = QueuedOverlayAnnouncement;

type TurnChangePacketPayload = {
  previousPlayerId: string;
  nextPlayerId: string;
  nextPlayerSide: LorcanaPlayerSide;
  turnNumber: number;
};

type ConcedePacketPayload = {
  concedingPlayerId: string;
  concedingSide: LorcanaPlayerSide;
};

type MulliganPacketPayload = {
  actorSide: LorcanaPlayerSide;
  mulliganCount: number;
};

export function deriveQueuedOverlayAnnouncementsFromPacket(
  packet: EnginePacketUpdate | null,
  durationMs: number,
): QueuedOverlayAnnouncement[] {
  if (!packet || packet.animations.length === 0) {
    return [];
  }

  const queued: QueuedOverlayAnnouncement[] = [];

  for (const animation of packet.animations) {
    if (animation.kind === "lorcana.turnChange") {
      const payload = animation.payload as Partial<TurnChangePacketPayload>;
      if (
        !payload ||
        (payload.nextPlayerSide !== "playerOne" && payload.nextPlayerSide !== "playerTwo") ||
        typeof payload.turnNumber !== "number"
      ) {
        continue;
      }

      queued.push({
        id: animation.id,
        kind: "turn-change",
        durationMs,
        turnChange: {
          nextPlayerSide: payload.nextPlayerSide,
          turnNumber: payload.turnNumber,
        },
      });
    }

    if (animation.kind === "lorcana.concede") {
      const payload = animation.payload as Partial<ConcedePacketPayload>;
      if (
        !payload ||
        (payload.concedingSide !== "playerOne" && payload.concedingSide !== "playerTwo")
      ) {
        continue;
      }

      queued.push({
        id: animation.id,
        kind: "concede",
        durationMs: Math.round(durationMs * 1.5),
        concede: {
          concedingSide: payload.concedingSide,
        },
      });
    }

    if (animation.kind === "lorcana.mulligan") {
      const payload = animation.payload as Partial<MulliganPacketPayload>;
      if (
        !payload ||
        (payload.actorSide !== "playerOne" && payload.actorSide !== "playerTwo") ||
        typeof payload.mulliganCount !== "number"
      ) {
        continue;
      }

      queued.push({
        id: animation.id,
        kind: "mulligan",
        durationMs: Math.round(durationMs * 0.8),
        mulligan: {
          actorSide: payload.actorSide,
          mulliganCount: payload.mulliganCount,
        },
      });
    }
  }

  return queued;
}

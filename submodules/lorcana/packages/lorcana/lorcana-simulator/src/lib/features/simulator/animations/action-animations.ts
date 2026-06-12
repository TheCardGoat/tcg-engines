import type { EnginePacketUpdate } from "@tcg/lorcana-engine";
import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";
import {
  createCardAnchorId,
  createSeatHandAnchorId,
  createZoneAnchorId,
  type BoardAnchorSnapshot,
  type BoardLocalRect,
} from "@/features/simulator/animations/board-move-animations.js";
import {
  resolveAnchorRect,
  toLocalRect,
} from "@/features/simulator/animations/animation-shared.js";

export interface ResolvedActionAnimationTarget {
  cardId: string;
  wasBanished: boolean;
  targetRect: BoardLocalRect | null;
}

export interface ResolvedActionAnimation {
  id: string;
  actorSide: LorcanaPlayerSide;
  actionCardId: string;
  actionCardSourceRect: BoardLocalRect | null;
  targets: ResolvedActionAnimationTarget[];
  durationMs: number;
}

type ActionPacketPayload = {
  actorSide: LorcanaPlayerSide;
  actionCardId: string;
  targets: readonly Partial<ResolvedActionAnimationTarget>[];
};

export function deriveResolvedActionAnimationsFromPacket(
  packet: EnginePacketUpdate | null,
  durationMs: number,
  boardAnchors: BoardAnchorSnapshot | null = null,
  resolveTargetSide: (cardId: string) => LorcanaPlayerSide | null = () => null,
): ResolvedActionAnimation[] {
  if (!packet || packet.animations.length === 0) {
    return [];
  }

  const resolved: ResolvedActionAnimation[] = [];

  for (const animation of packet.animations) {
    if (animation.kind !== "lorcana.action") {
      continue;
    }

    const payload = animation.payload as Partial<ActionPacketPayload>;
    if (
      !payload ||
      typeof payload.actionCardId !== "string" ||
      (payload.actorSide !== "playerOne" && payload.actorSide !== "playerTwo") ||
      !Array.isArray(payload.targets)
    ) {
      continue;
    }

    const targets = payload.targets
      .filter(
        (target): target is Partial<ResolvedActionAnimationTarget> & { cardId: string } =>
          typeof target.cardId === "string",
      )
      .map((target) => ({
        cardId: target.cardId,
        wasBanished: target.wasBanished === true,
        targetRect: resolvePlayTargetRect(target.cardId, boardAnchors, resolveTargetSide),
      }));

    if (targets.length === 0) {
      continue;
    }

    resolved.push({
      id: animation.id,
      actorSide: payload.actorSide,
      actionCardId: payload.actionCardId,
      actionCardSourceRect: resolveActionCardSourceRect(
        payload.actionCardId,
        payload.actorSide,
        boardAnchors,
      ),
      targets,
      durationMs,
    });
  }

  return resolved;
}

function resolveActionCardSourceRect(
  cardId: string,
  actorSide: LorcanaPlayerSide,
  boardAnchors: BoardAnchorSnapshot | null,
): BoardLocalRect | null {
  if (!boardAnchors) {
    return null;
  }

  const rect = resolveAnchorRect(boardAnchors, {
    primaryId: createCardAnchorId(actorSide, "hand", cardId),
    fallbackId: createSeatHandAnchorId(actorSide),
  });

  return rect ? toLocalRect(rect, boardAnchors.boardRect) : null;
}

function resolvePlayTargetRect(
  cardId: string,
  boardAnchors: BoardAnchorSnapshot | null,
  resolveTargetSide: (cardId: string) => LorcanaPlayerSide | null,
): BoardLocalRect | null {
  if (!boardAnchors) {
    return null;
  }

  const targetSide = resolveTargetSide(cardId);
  if (!targetSide) {
    return null;
  }

  const rect = resolveAnchorRect(boardAnchors, {
    primaryId: createCardAnchorId(targetSide, "play", cardId),
    fallbackId: createZoneAnchorId(targetSide, "play"),
  });

  return rect ? toLocalRect(rect, boardAnchors.boardRect) : null;
}

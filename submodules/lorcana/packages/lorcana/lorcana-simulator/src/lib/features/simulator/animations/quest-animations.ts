import type { EnginePacketUpdate } from "@tcg/lorcana-engine";
import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";
import {
  createCardAnchorId,
  type BoardAnchorSnapshot,
} from "@/features/simulator/animations/board-move-animations.js";
import {
  type AnchorReference,
  resolveAnchorRect,
  toLocalRect,
} from "@/features/simulator/animations/animation-shared.js";
import type { BoardLocalRect } from "@/features/simulator/animations/board-move-animations.js";

export function createLoreBadgeAnchorId(side: LorcanaPlayerSide): string {
  return `lore-badge:${side}`;
}

export interface QueuedQuestAnimation {
  id: string;
  actorSide: LorcanaPlayerSide;
  cardId: string;
  loreGained: number;
  source: AnchorReference;
  destination: AnchorReference;
  durationMs: number;
}

export interface ResolvedQuestAnimation {
  id: string;
  cardId: string;
  loreGained: number;
  sourceRect: BoardLocalRect;
  destinationRect: BoardLocalRect;
  durationMs: number;
}

type QuestPacketPayload = {
  actorPlayerId: string;
  actorSide: LorcanaPlayerSide;
  cardId: string;
  loreGained: number;
};

export function deriveQueuedQuestAnimationsFromPacket(
  packet: EnginePacketUpdate | null,
  durationMs: number,
): QueuedQuestAnimation[] {
  if (!packet || packet.animations.length === 0) {
    return [];
  }

  const queued: QueuedQuestAnimation[] = [];

  for (const animation of packet.animations) {
    if (animation.kind !== "lorcana.quest") {
      continue;
    }

    const payload = animation.payload as Partial<QuestPacketPayload>;
    if (
      !payload ||
      typeof payload.cardId !== "string" ||
      typeof payload.loreGained !== "number" ||
      (payload.actorSide !== "playerOne" && payload.actorSide !== "playerTwo")
    ) {
      continue;
    }

    queued.push({
      id: animation.id,
      actorSide: payload.actorSide,
      cardId: payload.cardId,
      loreGained: payload.loreGained,
      source: {
        primaryId: createCardAnchorId(payload.actorSide, "play", payload.cardId),
      },
      destination: {
        primaryId: createLoreBadgeAnchorId(payload.actorSide),
      },
      durationMs,
    });
  }

  return queued;
}

export function resolveQueuedQuestAnimation(
  animation: QueuedQuestAnimation,
  previousAnchors: BoardAnchorSnapshot | null,
  nextAnchors: BoardAnchorSnapshot | null,
): ResolvedQuestAnimation | null {
  if (!nextAnchors) {
    return null;
  }

  const sourceRect =
    resolveAnchorRect(previousAnchors, animation.source) ??
    resolveAnchorRect(nextAnchors, animation.source);
  const destinationRect = resolveAnchorRect(nextAnchors, animation.destination);

  if (!sourceRect || !destinationRect) {
    return null;
  }

  const boardRect = nextAnchors.boardRect;

  return {
    id: animation.id,
    cardId: animation.cardId,
    loreGained: animation.loreGained,
    sourceRect: toLocalRect(sourceRect, boardRect),
    destinationRect: toLocalRect(destinationRect, boardRect),
    durationMs: animation.durationMs,
  };
}

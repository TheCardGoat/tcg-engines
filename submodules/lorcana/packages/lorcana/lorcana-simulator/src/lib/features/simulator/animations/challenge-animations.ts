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

export interface ChallengeAnimationPreview {
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  defenderKind: "character" | "location";
  attackerWouldBeBanished: boolean;
  defenderWouldBeBanished: boolean;
  attackerDamageIsReduced: boolean;
  defenderDamageIsReduced: boolean;
}

export interface QueuedChallengeAnimation {
  id: string;
  actorSide: LorcanaPlayerSide;
  attackerId: string;
  defenderId: string;
  source: AnchorReference;
  destination: AnchorReference;
  preview: ChallengeAnimationPreview;
  durationMs: number;
}

export interface ResolvedChallengeAnimation {
  id: string;
  actorSide: LorcanaPlayerSide;
  attackerId: string;
  defenderId: string;
  sourceRect: BoardLocalRect;
  destinationRect: BoardLocalRect;
  preview: ChallengeAnimationPreview;
  durationMs: number;
}

type ChallengePacketPayload = {
  actorSide: LorcanaPlayerSide;
  attackerId: string;
  defenderId: string;
  defenderKind: "character" | "location";
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  attackerWouldBeBanished: boolean;
  defenderWouldBeBanished: boolean;
  attackerDamageIsReduced: boolean;
  defenderDamageIsReduced: boolean;
};

function getOpponentSide(side: LorcanaPlayerSide): LorcanaPlayerSide {
  return side === "playerOne" ? "playerTwo" : "playerOne";
}

export function deriveQueuedChallengeAnimationsFromPacket(
  packet: EnginePacketUpdate | null,
  durationMs: number,
): QueuedChallengeAnimation[] {
  if (!packet || packet.animations.length === 0) {
    return [];
  }

  const queued: QueuedChallengeAnimation[] = [];

  for (const animation of packet.animations) {
    if (animation.kind !== "lorcana.challenge") {
      continue;
    }

    const payload = animation.payload as Partial<ChallengePacketPayload>;
    if (
      !payload ||
      typeof payload.attackerId !== "string" ||
      typeof payload.defenderId !== "string" ||
      (payload.actorSide !== "playerOne" && payload.actorSide !== "playerTwo") ||
      (payload.defenderKind !== "character" && payload.defenderKind !== "location")
    ) {
      continue;
    }

    const opponentSide = getOpponentSide(payload.actorSide);

    queued.push({
      id: animation.id,
      actorSide: payload.actorSide,
      attackerId: payload.attackerId,
      defenderId: payload.defenderId,
      source: {
        primaryId: createCardAnchorId(payload.actorSide, "play", payload.attackerId),
      },
      destination: {
        primaryId: createCardAnchorId(opponentSide, "play", payload.defenderId),
      },
      preview: {
        attackerDamageDealt: payload.attackerDamageDealt ?? 0,
        defenderDamageDealt: payload.defenderDamageDealt ?? 0,
        defenderKind: payload.defenderKind,
        attackerWouldBeBanished: payload.attackerWouldBeBanished ?? false,
        defenderWouldBeBanished: payload.defenderWouldBeBanished ?? false,
        attackerDamageIsReduced: payload.attackerDamageIsReduced ?? false,
        defenderDamageIsReduced: payload.defenderDamageIsReduced ?? false,
      },
      durationMs,
    });
  }

  return queued;
}

export function resolveQueuedChallengeAnimation(
  animation: QueuedChallengeAnimation,
  previousAnchors: BoardAnchorSnapshot | null,
  nextAnchors: BoardAnchorSnapshot | null,
): ResolvedChallengeAnimation | null {
  if (!nextAnchors) {
    return null;
  }

  const sourceRect =
    resolveAnchorRect(previousAnchors, animation.source) ??
    resolveAnchorRect(nextAnchors, animation.source);
  const destinationRect =
    resolveAnchorRect(previousAnchors, animation.destination) ??
    resolveAnchorRect(nextAnchors, animation.destination);

  if (!sourceRect || !destinationRect) {
    return null;
  }

  const boardRect = nextAnchors.boardRect;

  return {
    id: animation.id,
    actorSide: animation.actorSide,
    attackerId: animation.attackerId,
    defenderId: animation.defenderId,
    sourceRect: toLocalRect(sourceRect, boardRect),
    destinationRect: toLocalRect(destinationRect, boardRect),
    preview: animation.preview,
    durationMs: animation.durationMs,
  };
}

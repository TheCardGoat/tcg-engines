import type { EnginePacketUpdate } from "@tcg/lorcana-engine";
import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";
import {
  createCardAnchorId,
  createZoneAnchorId,
  type BoardAnchorSnapshot,
} from "@/features/simulator/animations/board-move-animations.js";
import {
  type AnchorReference,
  resolveAnchorRect,
  toLocalRect,
} from "@/features/simulator/animations/animation-shared.js";
import type { BoardLocalRect } from "@/features/simulator/animations/board-move-animations.js";
import type { CardSnapshotMap } from "@/features/simulator/model/board-utils.js";

export interface QueuedCardEffectDamageTarget {
  cardId: string;
  amount: number;
  wasBanished: boolean;
  target: AnchorReference;
}

export interface ResolvedCardEffectDamageTarget {
  cardId: string;
  amount: number;
  wasBanished: boolean;
  targetRect: BoardLocalRect;
}

export interface CardEffectDamageResult {
  amount: number;
  wasBanished: boolean;
}

export type CardEffectKind = "activate-ability" | "sing" | "resolve-effect";

export interface QueuedCardEffectAnimation {
  id: string;
  actorSide: LorcanaPlayerSide;
  cardId: string;
  effectKind: CardEffectKind;
  source: AnchorReference;
  damageTargets: QueuedCardEffectDamageTarget[];
  durationMs: number;
}

export interface ResolvedCardEffectAnimation {
  id: string;
  cardId: string;
  effectKind: CardEffectKind;
  sourceRect: BoardLocalRect;
  damageTargets: ResolvedCardEffectDamageTarget[];
  durationMs: number;
}

type CardEffectPacketPayload = {
  actorSide: LorcanaPlayerSide;
  cardId: string;
  effectKind: CardEffectKind;
};

export function deriveQueuedCardEffectAnimationsFromPacket(
  packet: EnginePacketUpdate | null,
  durationMs: number,
  previousCardSnapshotsById: CardSnapshotMap = {},
  nextCardSnapshotsById: CardSnapshotMap = {},
): QueuedCardEffectAnimation[] {
  if (!packet || packet.animations.length === 0) {
    return [];
  }

  const queued: QueuedCardEffectAnimation[] = [];

  for (const animation of packet.animations) {
    if (animation.kind !== "lorcana.cardEffect") {
      continue;
    }

    const payload = animation.payload as Partial<CardEffectPacketPayload>;
    if (
      !payload ||
      typeof payload.cardId !== "string" ||
      (payload.actorSide !== "playerOne" && payload.actorSide !== "playerTwo") ||
      (payload.effectKind !== "activate-ability" &&
        payload.effectKind !== "sing" &&
        payload.effectKind !== "resolve-effect")
    ) {
      continue;
    }

    queued.push({
      id: animation.id,
      actorSide: payload.actorSide,
      cardId: payload.cardId,
      effectKind: payload.effectKind,
      source: {
        primaryId: createCardAnchorId(payload.actorSide, "play", payload.cardId),
        fallbackId: createZoneAnchorId(payload.actorSide, "play"),
      },
      damageTargets: deriveCardEffectDamageTargets(
        previousCardSnapshotsById,
        nextCardSnapshotsById,
      ),
      durationMs,
    });
  }

  return queued;
}

export function resolveQueuedCardEffectAnimation(
  animation: QueuedCardEffectAnimation,
  previousAnchors: BoardAnchorSnapshot | null,
  nextAnchors: BoardAnchorSnapshot | null,
): ResolvedCardEffectAnimation | null {
  if (!nextAnchors) {
    return null;
  }

  const sourceRect =
    resolveAnchorRect(previousAnchors, animation.source) ??
    resolveAnchorRect(nextAnchors, animation.source);

  if (!sourceRect) {
    return null;
  }

  const boardRect = nextAnchors.boardRect;
  const damageTargets = animation.damageTargets
    .map((target) => {
      const targetRect =
        resolveAnchorRect(previousAnchors, target.target) ??
        resolveAnchorRect(nextAnchors, target.target);
      if (!targetRect) {
        return null;
      }

      return {
        cardId: target.cardId,
        amount: target.amount,
        wasBanished: target.wasBanished,
        targetRect: toLocalRect(targetRect, boardRect),
      };
    })
    .filter((target): target is ResolvedCardEffectDamageTarget => target !== null);

  return {
    id: animation.id,
    cardId: animation.cardId,
    effectKind: animation.effectKind,
    sourceRect: toLocalRect(sourceRect, boardRect),
    damageTargets,
    durationMs: animation.durationMs,
  };
}

export function deriveCardEffectDamageResult(
  previousCard: CardSnapshotMap[string],
  nextCard: CardSnapshotMap[string],
): CardEffectDamageResult {
  const previousDamage = previousCard.damage ?? 0;
  const nextDamage = nextCard.damage ?? previousDamage;
  const damageDelta = nextDamage - previousDamage;
  const wasBanished = nextCard.zoneId !== "play";
  const willpowerFallback = previousDamage + 1;
  const willpower = previousCard.willpower ?? willpowerFallback;
  const finishingDamage = Math.max(0, willpower - previousDamage);
  const amount = damageDelta > 0 ? damageDelta : wasBanished ? finishingDamage : 0;

  return {
    amount,
    wasBanished,
  };
}

function deriveCardEffectDamageTargets(
  previousCardSnapshotsById: CardSnapshotMap,
  nextCardSnapshotsById: CardSnapshotMap,
): QueuedCardEffectDamageTarget[] {
  const targets: QueuedCardEffectDamageTarget[] = [];

  for (const previousCard of Object.values(previousCardSnapshotsById)) {
    if (
      previousCard.zoneId !== "play" ||
      (previousCard.cardType !== "character" && previousCard.cardType !== "location")
    ) {
      continue;
    }

    const nextCard = nextCardSnapshotsById[previousCard.cardId] ?? null;
    if (!nextCard) {
      continue;
    }

    const { amount, wasBanished } = deriveCardEffectDamageResult(previousCard, nextCard);

    if (amount <= 0) {
      continue;
    }

    targets.push({
      cardId: previousCard.cardId,
      amount,
      wasBanished,
      target: {
        primaryId: createCardAnchorId(previousCard.ownerSide, "play", previousCard.cardId),
        fallbackId: createZoneAnchorId(previousCard.ownerSide, "play"),
      },
    });
  }

  return targets;
}

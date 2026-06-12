import type { EnginePacketUpdate } from "@tcg/lorcana-engine";
import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import type {
  CardFacePresentation,
  LorcanaCardSnapshot,
  LorcanaPlayerSide,
  LorcanaZoneId,
  MoveLogEntrySnapshot,
} from "@/features/simulator/model/contracts.js";
import { getSideForOwnerId, getZoneCardIds } from "@/features/simulator/model/contracts.js";
import {
  type AnchorReference,
  resolveAnchorRect,
  toLocalRect,
} from "@/features/simulator/animations/animation-shared.js";

export const BOARD_CENTER_ANCHOR_ID = "board:center";
const DEBUG_BOARD_ANIMATIONS = false;

export type BoardMoveAnimationVariant =
  | "banish"
  | "draw"
  | "ink-faceDown"
  | "ink-faceUp"
  | "move-to-location"
  | "play-character"
  | "play-character-shift"
  | "play-item"
  | "play-location"
  | "play-action"
  | "play-action-sing"
  | "play-action-preview";

export type BoardMoveAnimationPlayback = "parallel" | "serial";
export type BoardMoveAnimationPhase = "cause" | "consequence";

export type SimulatorDebugAnimationPlayer = "player_one" | "player_two";

export interface SimulatorDebugAnimationRequest {
  id: string;
  kind: "play.action" | "lorcana.boardMove";
  payload: {
    cardId: string;
    player: SimulatorDebugAnimationPlayer;
    variant?: BoardMoveAnimationVariant;
  };
}

export interface BoardAnchorRect {
  left: number;
  top: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface BoardLocalRect {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface BoardAnchorSnapshot {
  revision: number;
  boardRect: BoardAnchorRect;
  anchors: Record<string, BoardAnchorRect>;
}

export type { AnchorReference } from "@/features/simulator/animations/animation-shared.js";

export interface QueuedBoardMoveAnimation {
  actorSide: LorcanaPlayerSide;
  card: LorcanaCardSnapshot;
  destination: AnchorReference;
  destinationZoneId: LorcanaZoneId;
  durationMs: number;
  groupId: string;
  id: string;
  impactAt: "destination" | "via";
  moveLogId: string;
  phase: BoardMoveAnimationPhase;
  playback: BoardMoveAnimationPlayback;
  renderFace: CardFacePresentation;
  source: AnchorReference;
  sourceZoneId: LorcanaZoneId;
  variant: BoardMoveAnimationVariant;
  via?: AnchorReference;
}

export interface ResolvedBoardMoveAnimation {
  actorSide: LorcanaPlayerSide;
  card: LorcanaCardSnapshot;
  destinationRect: BoardLocalRect;
  destinationZoneId: LorcanaZoneId;
  durationMs: number;
  groupId: string;
  id: string;
  impactAt: "destination" | "via";
  impactRect: BoardLocalRect;
  phase: BoardMoveAnimationPhase;
  playback: BoardMoveAnimationPlayback;
  renderFace: CardFacePresentation;
  sourceRect: BoardLocalRect;
  sourceZoneId: LorcanaZoneId;
  variant: BoardMoveAnimationVariant;
  viaRect?: BoardLocalRect;
}

type CardLocation = {
  card: LorcanaCardSnapshot;
  side: LorcanaPlayerSide;
  zoneId: LorcanaZoneId;
};

export const VARIANT_DURATION_MS: Record<BoardMoveAnimationVariant, number> = {
  banish: 350,
  draw: 325,
  "ink-faceDown": 500,
  "ink-faceUp": 500,
  "move-to-location": 400,
  "play-action": 1100,
  "play-action-preview": 1000,
  "play-action-sing": 1200,
  "play-character": 625,
  "play-character-shift": 575,
  "play-item": 575,
  "play-location": 575,
};

export function getAnimationSpeedMultiplier(speed: "off" | "fast" | "normal" | "slow"): number {
  switch (speed) {
    case "off":
      return 0;
    case "fast":
      return 0.6;
    case "normal":
      return 1.0;
    case "slow":
      return 1.5;
    default: {
      const _exhaustive: never = speed;
      return 1.0;
    }
  }
}

type BoardMovePacketPayload = {
  actorPlayerId: string;
  actorSide: LorcanaPlayerSide;
  cardId: string;
  destinationZoneId: LorcanaZoneId;
  groupId: string;
  impactAt: "destination" | "via";
  phase: BoardMoveAnimationPhase;
  playback: BoardMoveAnimationPlayback;
  renderFace: CardFacePresentation;
  sourceZoneId: LorcanaZoneId;
  variant: BoardMoveAnimationVariant;
  viaAnchorId?: string;
};

export function createZoneAnchorId(side: LorcanaPlayerSide, zoneId: LorcanaZoneId): string {
  return `zone:${side}:${zoneId}`;
}

export function createCardAnchorId(
  side: LorcanaPlayerSide,
  zoneId: LorcanaZoneId,
  cardId: string,
): string {
  return `card:${side}:${zoneId}:${cardId}`;
}

export function createSeatHandAnchorId(side: LorcanaPlayerSide): string {
  return `seat-hand:${side}`;
}

export function createInkwellEntryAnchorId(side: LorcanaPlayerSide): string {
  return `inkwell-entry:${side}`;
}

export function measureBoardAnchorRect(
  rect: Pick<DOMRect, "left" | "top" | "width" | "height">,
): BoardAnchorRect {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}

export function getNewMoveLogEntries(
  previousEntries: MoveLogEntrySnapshot[],
  nextEntries: MoveLogEntrySnapshot[],
): MoveLogEntrySnapshot[] {
  if (nextEntries.length === 0) {
    return [];
  }

  if (previousEntries.length === 0) {
    return nextEntries;
  }

  const previousIds = new Set(previousEntries.map((entry) => entry.id));
  return nextEntries.filter((entry) => !previousIds.has(entry.id));
}

export function deriveQueuedBoardMoveAnimations(
  previousSnapshot: LorcanaProjectedBoardView | null,
  nextSnapshot: LorcanaProjectedBoardView | null,
  newEntries: MoveLogEntrySnapshot[],
  resolveCard: (cardId: string) => LorcanaCardSnapshot | null,
): QueuedBoardMoveAnimation[] {
  if (!previousSnapshot || !nextSnapshot || newEntries.length === 0) {
    if (DEBUG_BOARD_ANIMATIONS && newEntries.length > 0) {
      console.log("[board-move-animations] Skipping derive due to missing snapshot", {
        hasPreviousSnapshot: previousSnapshot !== null,
        hasNextSnapshot: nextSnapshot !== null,
        newEntryIds: newEntries.map((entry) => entry.id),
      });
    }
    return [];
  }

  const queued: QueuedBoardMoveAnimation[] = [];

  for (const entry of newEntries) {
    const moveId = entry.moveId;
    const params = entry.params ?? {};
    const cardId = getMoveCardId(entry);

    if (DEBUG_BOARD_ANIMATIONS) {
      console.log("[board-move-animations] Considering move-log entry", {
        entryId: entry.id,
        moveId,
        actorSide: entry.actorSide ?? null,
        params,
        cardId: cardId ?? null,
      });
    }

    if (moveId === "putCardIntoInkwell" && typeof cardId === "string") {
      const queuedInk = deriveInkAnimation(
        previousSnapshot,
        nextSnapshot,
        entry,
        cardId,
        resolveCard,
      );
      if (queuedInk) {
        queued.push(queuedInk);
        if (DEBUG_BOARD_ANIMATIONS) {
          console.log("[board-move-animations] Derived ink animation", {
            id: queuedInk.id,
            cardId: queuedInk.card.cardId,
            source: queuedInk.source,
            destination: queuedInk.destination,
            renderFace: queuedInk.renderFace,
            variant: queuedInk.variant,
          });
        }
      } else if (DEBUG_BOARD_ANIMATIONS) {
        console.log("[board-move-animations] No ink animation derived", {
          entryId: entry.id,
          cardId,
        });
      }
      continue;
    }

    if (moveId === "playCard" && typeof cardId === "string") {
      const queuedPlay = derivePlayAnimation(
        previousSnapshot,
        nextSnapshot,
        entry,
        cardId,
        resolveCard,
      );
      if (queuedPlay) {
        queued.push(queuedPlay);
        if (DEBUG_BOARD_ANIMATIONS) {
          console.log("[board-move-animations] Derived play animation", {
            id: queuedPlay.id,
            cardId: queuedPlay.card.cardId,
            source: queuedPlay.source,
            via: queuedPlay.via ?? null,
            destination: queuedPlay.destination,
            variant: queuedPlay.variant,
          });
        }
      } else if (DEBUG_BOARD_ANIMATIONS) {
        console.log("[board-move-animations] No play animation derived", {
          entryId: entry.id,
          cardId,
        });
      }
    }
  }

  if (DEBUG_BOARD_ANIMATIONS) {
    console.log("[board-move-animations] Finished derive", {
      queuedCount: queued.length,
      queuedIds: queued.map((animation) => animation.id),
    });
  }

  return queued;
}

export function deriveQueuedBoardMoveAnimationsFromPacket(
  previousSnapshot: LorcanaProjectedBoardView | null,
  nextSnapshot: LorcanaProjectedBoardView | null,
  packet: EnginePacketUpdate | null,
  resolveCard: (cardId: string) => LorcanaCardSnapshot | null,
  durationMultiplier = 1,
): QueuedBoardMoveAnimation[] {
  if (!previousSnapshot || !nextSnapshot || !packet || packet.animations.length === 0) {
    return [];
  }

  const queued: QueuedBoardMoveAnimation[] = [];
  for (const animation of packet.animations) {
    if (animation.kind !== "lorcana.boardMove") {
      continue;
    }

    const payload = animation.payload as Partial<BoardMovePacketPayload>;
    if (
      !payload ||
      typeof payload.cardId !== "string" ||
      typeof payload.sourceZoneId !== "string" ||
      typeof payload.destinationZoneId !== "string" ||
      typeof payload.groupId !== "string" ||
      typeof payload.variant !== "string" ||
      (payload.impactAt !== "destination" && payload.impactAt !== "via") ||
      (payload.phase !== "cause" && payload.phase !== "consequence") ||
      (payload.playback !== "parallel" && payload.playback !== "serial") ||
      (payload.renderFace !== "faceDown" && payload.renderFace !== "faceUp") ||
      (payload.actorSide !== "playerOne" && payload.actorSide !== "playerTwo")
    ) {
      continue;
    }

    const nextLocation = findCardLocation(nextSnapshot, payload.cardId, resolveCard);
    if (!nextLocation) {
      continue;
    }

    queued.push({
      actorSide: payload.actorSide,
      card: nextLocation.card,
      destination:
        payload.destinationZoneId === "discard"
          ? {
              primaryId: createCardAnchorId(nextLocation.side, "discard", payload.cardId),
              fallbackId: createZoneAnchorId(nextLocation.side, "discard"),
            }
          : buildCardDestination(nextLocation),
      destinationZoneId: payload.destinationZoneId,
      durationMs: Math.round(VARIANT_DURATION_MS[payload.variant] * durationMultiplier),
      groupId: payload.groupId,
      id: animation.id,
      impactAt: payload.impactAt,
      moveLogId: packet.processedCommand.commandID,
      phase: payload.phase,
      playback: payload.playback,
      renderFace:
        payload.variant === "draw"
          ? nextLocation.card.isMasked
            ? "faceDown"
            : "faceUp"
          : payload.renderFace,
      source: buildPacketSourceAnchor(payload.actorSide, payload.sourceZoneId, payload.cardId),
      sourceZoneId: payload.sourceZoneId,
      variant: payload.variant,
      via: payload.viaAnchorId
        ? { primaryId: payload.viaAnchorId }
        : payload.variant === "ink-faceDown" || payload.variant === "ink-faceUp"
          ? { primaryId: BOARD_CENTER_ANCHOR_ID }
          : undefined,
    });
  }

  return queued;
}

function getMoveCardId(entry: MoveLogEntrySnapshot): string | null {
  const paramsCardId = entry.params?.cardId;
  if (typeof paramsCardId === "string" && paramsCardId.trim().length > 0) {
    return paramsCardId;
  }

  return null;
}

export function resolveQueuedBoardMoveAnimation(
  animation: QueuedBoardMoveAnimation,
  previousAnchors: BoardAnchorSnapshot | null,
  nextAnchors: BoardAnchorSnapshot | null,
): ResolvedBoardMoveAnimation | null {
  if (!nextAnchors) {
    if (DEBUG_BOARD_ANIMATIONS) {
      console.log("[board-move-animations] Cannot resolve animation without next anchors", {
        id: animation.id,
      });
    }
    return null;
  }

  const sourceRect =
    resolveAnchorRect(previousAnchors, animation.source) ??
    resolveAnchorRect(nextAnchors, animation.source);
  const destinationRect = resolveAnchorRect(nextAnchors, animation.destination);
  const viaRect = animation.via ? resolveAnchorRect(nextAnchors, animation.via) : undefined;

  if (!sourceRect || !destinationRect) {
    if (DEBUG_BOARD_ANIMATIONS) {
      console.log("[board-move-animations] Failed to resolve animation anchors", {
        id: animation.id,
        source: animation.source,
        destination: animation.destination,
        via: animation.via ?? null,
        hasPreviousAnchors: previousAnchors !== null,
        hasSourceRect: sourceRect !== null,
        hasDestinationRect: destinationRect !== null,
        previousAnchorIds: previousAnchors ? Object.keys(previousAnchors.anchors) : [],
        nextAnchorIds: Object.keys(nextAnchors.anchors),
      });
    }
    return null;
  }

  const boardRect = nextAnchors.boardRect;
  const resolvedViaRect = viaRect ? toLocalRect(viaRect, boardRect) : undefined;
  const impactRect =
    animation.impactAt === "via" && resolvedViaRect
      ? resolvedViaRect
      : toLocalRect(destinationRect, boardRect);

  if (DEBUG_BOARD_ANIMATIONS) {
    const localSourceRect = toLocalRect(sourceRect, boardRect);
    const localDestinationRect = toLocalRect(destinationRect, boardRect);
    console.log("[board-move-animations] Resolved animation", {
      id: animation.id,
      variant: animation.variant,
      source: animation.source,
      destination: animation.destination,
      via: animation.via ?? null,
      sourceRect: localSourceRect,
      destinationRect: localDestinationRect,
      viaRect: resolvedViaRect ?? null,
      dx: localDestinationRect.centerX - localSourceRect.centerX,
      dy: localDestinationRect.centerY - localSourceRect.centerY,
    });
  }

  return {
    actorSide: animation.actorSide,
    card: animation.card,
    destinationRect: toLocalRect(destinationRect, boardRect),
    destinationZoneId: animation.destinationZoneId,
    durationMs: animation.durationMs,
    groupId: animation.groupId,
    id: animation.id,
    impactAt: animation.impactAt,
    impactRect,
    phase: animation.phase,
    playback: animation.playback,
    renderFace: animation.renderFace,
    sourceRect: toLocalRect(sourceRect, boardRect),
    sourceZoneId: animation.sourceZoneId,
    variant: animation.variant,
    viaRect: resolvedViaRect,
  };
}

function deriveInkAnimation(
  previousSnapshot: LorcanaProjectedBoardView,
  nextSnapshot: LorcanaProjectedBoardView,
  entry: MoveLogEntrySnapshot,
  cardId: string,
  resolveCard: (cardId: string) => LorcanaCardSnapshot | null,
): QueuedBoardMoveAnimation | null {
  const nextLocation = findCardLocation(nextSnapshot, cardId, resolveCard);
  if (!nextLocation || nextLocation.zoneId !== "inkwell") {
    return null;
  }

  const previousLocation = findCardLocation(previousSnapshot, cardId, resolveCard);
  const actorSide = entry.actorSide ?? nextLocation.side;
  // Determine face from the SOURCE position, not the inkwell destination.
  // Cards in hand that belong to the actor are visible (face-up); opponent/masked cards are face-down.
  const sourceWasMasked = previousLocation?.card.isMasked ?? previousLocation?.side !== actorSide;
  const renderFace: CardFacePresentation = sourceWasMasked ? "faceDown" : "faceUp";
  const variant = renderFace === "faceUp" ? "ink-faceUp" : "ink-faceDown";

  return {
    actorSide,
    card: nextLocation.card,
    destination: buildCardDestination(nextLocation),
    destinationZoneId: "inkwell",
    durationMs: VARIANT_DURATION_MS[variant],
    groupId: entry.id,
    id: `${entry.id}:ink:${cardId}`,
    impactAt: "destination",
    moveLogId: entry.id,
    phase: "cause",
    playback: "serial",
    renderFace,
    source: buildSourceAnchor(previousLocation, actorSide),
    sourceZoneId: previousLocation?.zoneId ?? "hand",
    variant,
  };
}

function derivePlayAnimation(
  previousSnapshot: LorcanaProjectedBoardView,
  nextSnapshot: LorcanaProjectedBoardView,
  entry: MoveLogEntrySnapshot,
  cardId: string,
  resolveCard: (cardId: string) => LorcanaCardSnapshot | null,
): QueuedBoardMoveAnimation | null {
  const nextLocation = findCardLocation(nextSnapshot, cardId, resolveCard);
  if (!nextLocation) {
    return null;
  }

  const previousLocation = findCardLocation(previousSnapshot, cardId, resolveCard);
  const actorSide = entry.actorSide ?? nextLocation.side;
  const variant = getPlayVariant(nextLocation.card.cardType);
  if (!variant) {
    return null;
  }

  const destination =
    nextLocation.zoneId === "discard"
      ? {
          primaryId: createCardAnchorId(nextLocation.side, "discard", cardId),
          fallbackId: createZoneAnchorId(nextLocation.side, "discard"),
        }
      : buildCardDestination(nextLocation);

  return {
    actorSide,
    card: nextLocation.card,
    destination,
    destinationZoneId: nextLocation.zoneId,
    durationMs: VARIANT_DURATION_MS[variant],
    groupId: entry.id,
    id: `${entry.id}:play:${cardId}`,
    impactAt: "via",
    moveLogId: entry.id,
    phase: "cause",
    playback: "serial",
    renderFace: "faceUp",
    source: buildSourceAnchor(previousLocation, actorSide),
    sourceZoneId: previousLocation?.zoneId ?? "hand",
    variant,
    via: { primaryId: BOARD_CENTER_ANCHOR_ID },
  };
}

function getPlayVariant(
  cardType: LorcanaCardSnapshot["cardType"],
): BoardMoveAnimationVariant | null {
  switch (cardType) {
    case "character":
      return "play-character";
    case "item":
      return "play-item";
    case "location":
      return "play-location";
    case "action":
      return "play-action";
    default:
      return null;
  }
}

function buildSourceAnchor(
  location: CardLocation | null,
  actorSide: LorcanaPlayerSide,
): AnchorReference {
  if (!location) {
    return {
      primaryId: createSeatHandAnchorId(actorSide),
      fallbackId: createZoneAnchorId(actorSide, "hand"),
    };
  }

  if (!location.card.isMasked) {
    return {
      primaryId: createCardAnchorId(location.side, location.zoneId, location.card.cardId),
      // For hand/play cards, fall back to the seat-hand anchor (a single-card-sized invisible
      // anchor) rather than the zone anchor (which spans the full container and would produce
      // an oversized sprite).
      fallbackId:
        location.zoneId === "hand" || location.zoneId === "play"
          ? createSeatHandAnchorId(actorSide)
          : createZoneAnchorId(location.side, location.zoneId),
    };
  }

  return {
    primaryId: createSeatHandAnchorId(actorSide),
    fallbackId: createZoneAnchorId(actorSide, "hand"),
  };
}

function buildCardDestination(location: CardLocation): AnchorReference {
  if (location.zoneId === "hand") {
    return {
      primaryId: createCardAnchorId(location.side, location.zoneId, location.card.cardId),
      fallbackId: createSeatHandAnchorId(location.side),
    };
  }

  if (location.zoneId === "inkwell") {
    return {
      primaryId: createCardAnchorId(location.side, location.zoneId, location.card.cardId),
      // Newly inked cards are hidden from the settled zone while in flight, so the
      // card-specific anchor often does not exist yet. Fall back to the fixed
      // leftmost inkwell entry slot instead of the full zone rect.
      fallbackId: createInkwellEntryAnchorId(location.side),
    };
  }

  return {
    primaryId: createCardAnchorId(location.side, location.zoneId, location.card.cardId),
    fallbackId: createZoneAnchorId(location.side, location.zoneId),
  };
}

function buildPacketSourceAnchor(
  actorSide: LorcanaPlayerSide,
  sourceZoneId: LorcanaZoneId,
  cardId: string,
): AnchorReference {
  if (sourceZoneId === "deck") {
    return {
      primaryId: createZoneAnchorId(actorSide, "deck"),
    };
  }

  if (sourceZoneId === "hand") {
    return {
      primaryId: createCardAnchorId(actorSide, "hand", cardId),
      fallbackId: createSeatHandAnchorId(actorSide),
    };
  }

  if (sourceZoneId === "play") {
    // The play zone anchor spans the entire play area — using it as a fallback
    // would render the animated card at board-sized dimensions. Fall back to the
    // seat-hand anchor (90×118px) so the card remains card-sized if the specific
    // play slot anchor is unavailable (e.g. card was in-flight from a prior animation).
    return {
      primaryId: createCardAnchorId(actorSide, "play", cardId),
      fallbackId: createSeatHandAnchorId(actorSide),
    };
  }

  return {
    primaryId: createCardAnchorId(actorSide, sourceZoneId, cardId),
    fallbackId: createZoneAnchorId(actorSide, sourceZoneId),
  };
}

function findCardLocation(
  snapshot: LorcanaProjectedBoardView,
  cardId: string,
  resolveCard: (cardId: string) => LorcanaCardSnapshot | null,
): CardLocation | null {
  for (const side of ["playerOne", "playerTwo"] as const) {
    for (const zoneId of ["deck", "hand", "play", "inkwell", "discard", "limbo"] as const) {
      const card = getZoneCardIds(snapshot, side, zoneId).includes(cardId)
        ? resolveCard(cardId)
        : null;
      if (card) {
        return { card, side, zoneId };
      }
    }
  }

  // Fallback: search the projected cards map directly. This catches cards in zones
  // that getZoneCardIds does not enumerate (e.g. limbo, deck) but that are still
  // present in the board projection. Without this, action cards with pending effect
  // resolution (which sit in limbo) silently lose their play animation.
  const projectedCard = snapshot.cards[cardId];
  if (projectedCard) {
    const card = resolveCard(cardId);
    if (card) {
      const side = getSideForOwnerId(snapshot, projectedCard.ownerId) ?? "playerOne";
      const zoneId = projectedCard.zone ?? "limbo";
      return { card, side, zoneId };
    }
  }

  return null;
}

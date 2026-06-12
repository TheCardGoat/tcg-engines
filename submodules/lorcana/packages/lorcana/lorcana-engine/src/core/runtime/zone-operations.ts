import type { EventCause, GameEvent, MatchState, TCGCtx, ZoneRevealWindow } from "./types";
import type { PlayerId } from "../types";
import type { CardQueryAPI, RuntimeCardWithDefinition } from "./card-runtime";
import type { BaseCardDefinition } from "./card-contracts";
import { emitLorcanaDomainEvent } from "../../types";
import type { ZoneRegistry } from "./zone-registry";
import { resolveZoneIdFromRegistry } from "./zone-registry";
import type { UndoBarrierReason } from "./match-runtime.types";
import { invalidateStaticEffects } from "../../runtime-moves/rules/static-effects-invalidation";

// =============================================================================
// Zone Operations API
// =============================================================================

export interface ZoneOperationsAPI extends ZoneQueryAPI, ZoneMutationAPI {}

export type ZoneRef = { zone: string; playerId?: string };
export type DrawCardsArgs = { from: ZoneRef; to: ZoneRef; count: number };

export interface ZoneQueryAPI {
  // Searching
  search: (zone: ZoneRef, predicate: (card: RuntimeCardWithDefinition) => boolean) => string[];
  searchAndPick: (
    zone: ZoneRef,
    count: number,
    predicate?: (card: RuntimeCardWithDefinition) => boolean,
  ) => string[];

  // Looking
  lookAt: (zone: ZoneRef, count: number, playerId: string) => string[];
  lookAtTop: (zone: ZoneRef, count: number, playerId: string) => string[];
  lookAtBottom: (zone: ZoneRef, count: number, playerId: string) => string[];

  // Queries
  getCards: (zone: ZoneRef) => string[];
  getCardCount: (zone: ZoneRef) => number;
  getTopCard: (zone: ZoneRef) => string | undefined;
  getBottomCard: (zone: ZoneRef) => string | undefined;
  getCardZone: (cardId: string) => string | undefined;
  getCardOwner: (cardId: string) => string | undefined;
  getCardController: (cardId: string) => string | undefined;

  // Zone properties
  isOrdered: (zone: ZoneRef) => boolean;
  isOwnerScoped: (zone: ZoneRef) => boolean;
  getVisibility: (zone: ZoneRef) => "public" | "private" | "secret";
}

export interface ZoneMutationAPI {
  // Card movement
  moveCard: (
    cardId: string,
    toZone: ZoneRef,
    options?: { index?: number; faceDown?: boolean },
  ) => void;
  moveCards: (cardIds: string[], toZone: ZoneRef, options?: { index?: number }) => void;

  // Drawing
  mill: (from: ZoneRef, to: ZoneRef, count: number) => string[];
  drawCards: (params: DrawCardsArgs) => string[];
  drawSpecificCard: (cardId: string, from: ZoneRef, to: ZoneRef) => boolean;

  // Shuffling
  shuffle: (zone: ZoneRef) => void;
  shuffleBottom: (zone: ZoneRef, count: number) => void;

  // Revealing
  reveal: (
    cardIds: string[],
    visibleTo: "all" | string[],
    options?: { stateID?: number; affectsUndo?: boolean },
  ) => string;
  revealTop: (zone: ZoneRef, count: number, visibleTo: "all" | string[]) => string[];
  clearReveal: (revealId: string) => void;
  clearRevealsByZone: (zone: ZoneRef, options?: { respectExpiry?: boolean }) => void;
}

interface ZoneOperationsOptions {
  cardQuery?: Pick<CardQueryAPI, "get">;
  onUndoBarrier?: (reason: UndoBarrierReason) => void;
  random?: () => number;
  onCardEnteredZone?: (cardId: string, toZone: string, ownerId: string) => void;
}

// =============================================================================
// Zone Operations Implementation
// =============================================================================

export function createZoneOperations(
  draft: { ctx: Pick<TCGCtx, "zones" | "_stateID">; G: { staticEffectsVersion?: number } },
  zoneRegistry: ZoneRegistry,
  emitEvent?: (event: GameEvent) => void,
  options?: ZoneOperationsOptions,
): ZoneOperationsAPI {
  const zones = draft.ctx.zones;
  const defaultCause: EventCause = { kind: "SYSTEM", source: "ZONE_OPERATION" };
  const random = options?.random ?? Math.random;
  const markUndoBarrier = options?.onUndoBarrier;
  const onCardEnteredZone = options?.onCardEnteredZone;

  function getZoneDef(zoneId: string) {
    return zoneRegistry[zoneId];
  }

  function resolveZoneId(zone: ZoneRef): string {
    return resolveZoneIdFromRegistry(zone, zoneRegistry, zones.private.cardIndex);
  }

  function getZoneCards(zoneId: string): string[] {
    return zones.private.zoneCards[zoneId] || [];
  }

  function updateZoneSummary(zoneId: string) {
    const cards = getZoneCards(zoneId);
    const summary = zones.public.zoneSummaries[zoneId];
    if (summary) {
      summary.count = cards.length;
      summary.revision++;
      const zoneDef = getZoneDef(zoneId);
      if (zoneDef?.visibility === "public" && !zoneDef.faceDown && cards.length > 0) {
        summary.topPublicCardID = cards[cards.length - 1];
      } else {
        summary.topPublicCardID = undefined;
      }
    }
  }

  function allocateRevealId(): string {
    const nextSeq = zones.reveals.nextSeq ?? zones.reveals.active.length;
    zones.reveals.nextSeq = nextSeq + 1;
    return `reveal-${nextSeq}`;
  }

  function markHiddenZoneBarrier(zoneId: string, reason: UndoBarrierReason): void {
    if (!markUndoBarrier) {
      return;
    }

    const visibility = getZoneDef(zoneId)?.visibility ?? "public";
    if (visibility !== "public") {
      markUndoBarrier(reason);
    }
  }

  function getSearchView(cardId: string): RuntimeCardWithDefinition {
    const resolved = options?.cardQuery?.get(cardId);
    if (resolved) {
      return resolved;
    }

    const indexEntry = zones.private.cardIndex[cardId];
    return {
      instanceId: cardId,
      definitionId: cardId,
      definition: {
        id: cardId,
        canonicalId: cardId,
        name: "Unknown Card",
      } as BaseCardDefinition,
      ownerID: indexEntry?.ownerID ?? ("unknown" as PlayerId),
      controllerID: indexEntry?.controllerID ?? indexEntry?.ownerID ?? ("unknown" as PlayerId),
      zoneID: indexEntry?.zoneKey,
      zoneIndex: indexEntry?.index,
      meta: zones.private.cardMeta[cardId] || {},
    };
  }

  function shuffleArrayInPlace<T>(items: T[]): void {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
  }

  function setCardZone(cardId: string, zoneId: string, index?: number) {
    // Remove from old zone
    const oldEntry = zones.private.cardIndex[cardId];
    const fromZone = oldEntry?.zoneKey;
    if (oldEntry) {
      const oldZoneCards = zones.private.zoneCards[oldEntry.zoneKey];
      if (oldZoneCards) {
        const oldIndex = oldZoneCards.indexOf(cardId);
        if (oldIndex !== -1) {
          oldZoneCards.splice(oldIndex, 1);
          updateZoneSummary(oldEntry.zoneKey);
        }
      }
    }

    // Add to new zone
    if (!zones.private.zoneCards[zoneId]) {
      zones.private.zoneCards[zoneId] = [];
    }

    const newZoneCards = zones.private.zoneCards[zoneId];
    if (index !== undefined && index >= 0 && index <= newZoneCards.length) {
      newZoneCards.splice(index, 0, cardId);
    } else {
      newZoneCards.push(cardId);
    }

    // Update card index
    const ownerId =
      oldEntry?.ownerID || zones.private.cardIndex[cardId]?.ownerID || ("unknown" as PlayerId);
    const controllerId =
      oldEntry?.controllerID || zones.private.cardIndex[cardId]?.controllerID || ownerId;

    zones.private.cardIndex[cardId] = {
      zoneKey: zoneId,
      index: index ?? newZoneCards.length - 1,
      ownerID: ownerId,
      controllerID: controllerId,
    };

    updateZoneSummary(zoneId);

    return {
      fromZone,
      ownerId,
      controllerId,
    };
  }

  return {
    // -------------------------------------------------------------------------
    // Card Movement
    // -------------------------------------------------------------------------

    moveCard(cardId: string, toZone: ZoneRef, options?: { index?: number; faceDown?: boolean }) {
      const resolvedToZone = resolveZoneId(toZone);
      const previous = setCardZone(cardId, resolvedToZone, options?.index);

      onCardEnteredZone?.(cardId, resolvedToZone, previous.ownerId);

      // Invalidate the static-effect registry when cards enter or leave a zone whose
      // contents are referenced by static-ability conditions: play (which cards emit
      // abilities), hand (`cards-in-hand` resource counts), inkwell (THE-971 — registry
      // cache keys on staticEffectsVersion, so e.g. limbo→inkwell would otherwise skip
      // invalidation vs play→inkwell), discard (`cards-in-discard` resource counts), and
      // deck (covers shuffle-back, return-from-discard-to-deck, and any future
      // deck-count condition).
      const zoneMatches = (zoneKey: string | undefined, prefix: string): boolean =>
        typeof zoneKey === "string" && (zoneKey === prefix || zoneKey.startsWith(`${prefix}:`));
      const STATIC_ZONES = ["play", "hand", "inkwell", "discard", "deck"] as const;
      const fromAffectsStatic = STATIC_ZONES.some((p) => zoneMatches(previous.fromZone, p));
      const toAffectsStatic = STATIC_ZONES.some((p) => zoneMatches(resolvedToZone, p));
      if (fromAffectsStatic || toAffectsStatic) {
        invalidateStaticEffects(draft);
      }

      if (previous.fromZone) {
        emitEvent?.({
          kind: "CARD_LEFT_ZONE",
          cardId,
          fromZone: previous.fromZone,
          cause: defaultCause,
        });
      }

      emitEvent?.({
        kind: "CARD_MOVED",
        cardId,
        fromZone: previous.fromZone,
        toZone: resolvedToZone,
        index: options?.index,
        faceDown: options?.faceDown,
        cause: defaultCause,
      });

      emitEvent?.({
        kind: "CARD_ENTERED_ZONE",
        cardId,
        toZone: resolvedToZone,
        controllerId: previous.controllerId,
        ownerId: previous.ownerId,
        cause: defaultCause,
      });
    },

    moveCards(cardIds: string[], toZone: ZoneRef, options?: { index?: number }) {
      const resolvedToZone = resolveZoneId(toZone);
      const startIndex = options?.index ?? getZoneCards(resolvedToZone).length;
      for (let i = 0; i < cardIds.length; i++) {
        this.moveCard(
          cardIds[i],
          { zone: resolvedToZone, playerId: toZone.playerId },
          {
            index: startIndex + i,
          },
        );
      }
    },

    // -------------------------------------------------------------------------
    // Drawing
    // -------------------------------------------------------------------------

    drawCards({ from, to, count: normalizedCount }: DrawCardsArgs): string[] {
      if (normalizedCount > 0) {
        markUndoBarrier?.("draw");
      }
      const normalizedFromZone = resolveZoneId(from);
      const normalizedToZone = resolveZoneId(to);

      const zoneDef = getZoneDef(normalizedFromZone);
      const fromCards = getZoneCards(normalizedFromZone);

      if (zoneDef?.ownerScoped) {
        const ownedCards = [...fromCards]
          .reverse()
          .filter((cardId) => zones.private.cardIndex[cardId]?.ownerID === from.playerId);
        const toDraw = Math.min(Math.max(0, normalizedCount), ownedCards.length);
        const drawnCards = ownedCards.slice(0, toDraw);

        for (const cardId of drawnCards) {
          this.moveCard(cardId, { zone: normalizedToZone, playerId: to.playerId });
        }

        emitEvent?.({
          kind: "CARDS_DRAWN",
          cardIds: drawnCards,
          fromZone: normalizedFromZone,
          toZone: normalizedToZone,
          playerId: from.playerId,
          cause: defaultCause,
        });

        return drawnCards;
      }

      const toDraw = Math.min(Math.max(0, normalizedCount), fromCards.length);
      const drawnCards = toDraw === 0 ? [] : fromCards.slice(-toDraw).reverse();

      for (const cardId of drawnCards) {
        this.moveCard(cardId, { zone: normalizedToZone, playerId: to.playerId });
      }

      emitEvent?.({
        kind: "CARDS_DRAWN",
        cardIds: drawnCards,
        fromZone: normalizedFromZone,
        toZone: normalizedToZone,
        playerId: from.playerId,
        cause: defaultCause,
      });

      return drawnCards;
    },

    drawSpecificCard(cardId: string, from: ZoneRef, to: ZoneRef): boolean {
      const fromZone = resolveZoneId(from);
      const toZone = resolveZoneId(to);
      const fromCards = getZoneCards(fromZone);
      if (!fromCards.includes(cardId)) {
        return false;
      }

      this.moveCard(cardId, to);

      return true;
    },

    mill(from: ZoneRef, to: ZoneRef, count: number): string[] {
      if (count > 0) {
        markUndoBarrier?.("mill");
      }
      const normalizedFromZone = resolveZoneId(from);
      const normalizedToZone = resolveZoneId(to);
      const zoneDef = getZoneDef(normalizedFromZone);
      const fromCards = getZoneCards(normalizedFromZone);

      let milledCards: string[];
      if (zoneDef?.ownerScoped && from.playerId) {
        const ownedTopToBottom = [...fromCards]
          .reverse()
          .filter((cardId) => zones.private.cardIndex[cardId]?.ownerID === from.playerId);
        milledCards = ownedTopToBottom.slice(0, Math.max(0, count));
      } else {
        const toMill = Math.min(Math.max(0, count), fromCards.length);
        milledCards = fromCards.slice(-toMill).reverse();
      }

      for (const cardId of milledCards) {
        this.moveCard(cardId, { zone: normalizedToZone, playerId: to.playerId });
      }

      emitEvent?.({
        kind: "CARDS_MILLED",
        cardIds: milledCards,
        fromZone: normalizedFromZone,
        toZone: normalizedToZone,
        playerId: from.playerId,
        cause: defaultCause,
      });

      return milledCards;
    },

    // -------------------------------------------------------------------------
    // Shuffling
    // -------------------------------------------------------------------------

    shuffle(zone: ZoneRef) {
      const resolvedZoneId = resolveZoneId(zone);
      const playerId = zone.playerId;
      const zoneDef = getZoneDef(resolvedZoneId);
      const cards = getZoneCards(resolvedZoneId);

      if (zoneDef?.ownerScoped && playerId) {
        const ownedCardIndexes: number[] = [];
        const ownedCards: string[] = [];
        for (let i = 0; i < cards.length; i++) {
          if (zones.private.cardIndex[cards[i]]?.ownerID === playerId) {
            ownedCardIndexes.push(i);
            ownedCards.push(cards[i]);
          }
        }

        shuffleArrayInPlace(ownedCards);
        for (let i = 0; i < ownedCardIndexes.length; i++) {
          cards[ownedCardIndexes[i]] = ownedCards[i];
        }
        updateZoneSummary(resolvedZoneId);
        emitEvent?.({
          kind: "ZONE_SHUFFLED",
          zoneId: resolvedZoneId,
          playerId,
          cause: defaultCause,
        });
        return;
      }

      shuffleArrayInPlace(cards);
      updateZoneSummary(resolvedZoneId);

      emitEvent?.({
        kind: "ZONE_SHUFFLED",
        zoneId: resolvedZoneId,
        playerId,
        cause: defaultCause,
      });
    },

    shuffleBottom(zone: ZoneRef, count: number) {
      const zoneId = resolveZoneId(zone);
      const cards = getZoneCards(zoneId);
      const bottomCards = cards.slice(0, Math.min(count, cards.length));

      shuffleArrayInPlace(bottomCards);
      for (let i = 0; i < bottomCards.length; i++) {
        cards[i] = bottomCards[i];
      }

      updateZoneSummary(zoneId);

      if (emitEvent) {
        emitLorcanaDomainEvent({ emit: emitEvent }, "zoneBottomShuffled", {
          zoneId,
          count,
        });
      }
    },

    // -------------------------------------------------------------------------
    // Revealing
    // -------------------------------------------------------------------------

    reveal(
      cardIds: string[],
      visibleTo: "all" | string[],
      options?: { stateID?: number; affectsUndo?: boolean },
    ): string {
      if (cardIds.length > 0 && options?.affectsUndo !== false) {
        markUndoBarrier?.("reveal");
      }
      const revealId = allocateRevealId();

      const revealWindow: ZoneRevealWindow = {
        revealID: revealId,
        cardIDs: cardIds,
        visibleTo,
        expiresAtStateID: options?.stateID,
      };

      zones.reveals.active.push(revealWindow);

      emitEvent?.({
        kind: "REVEAL_CREATED",
        revealId,
        cardIds,
        visibleTo,
        cause: defaultCause,
      });

      return revealId;
    },

    revealTop(zone: ZoneRef, count: number, visibleTo: "all" | string[]): string[] {
      const zoneId = resolveZoneId(zone);
      const cards = getZoneCards(zoneId);
      const topCards = cards.slice(-Math.min(count, cards.length)).reverse();

      this.reveal(topCards, visibleTo);

      return topCards;
    },

    clearReveal(revealId: string) {
      const index = zones.reveals.active.findIndex((r) => r.revealID === revealId);
      if (index !== -1) {
        zones.reveals.active.splice(index, 1);

        emitEvent?.({
          kind: "REVEAL_CLEARED",
          revealId,
          cause: defaultCause,
        });
      }
    },

    clearRevealsByZone(zone: ZoneRef, clearOptions?: { respectExpiry?: boolean }): void {
      const zoneId = resolveZoneId(zone);
      const zoneCardSet = new Set(getZoneCards(zoneId));
      const currentStateID = draft.ctx._stateID;
      const toRemove = zones.reveals.active
        .filter((r) => {
          if (!r.cardIDs.some((id) => zoneCardSet.has(id))) return false;
          // When respectExpiry is set, skip reveals that have a valid stateID-based
          // expiry that hasn't been reached yet — let expireReveals() handle those.
          if (
            clearOptions?.respectExpiry &&
            r.expiresAtStateID !== undefined &&
            r.expiresAtStateID > currentStateID
          ) {
            return false;
          }
          return true;
        })
        .map((r) => r.revealID);
      for (const revealId of toRemove) {
        this.clearReveal(revealId);
      }
    },

    // -------------------------------------------------------------------------
    // Searching
    // -------------------------------------------------------------------------

    search(zone: ZoneRef, predicate: (card: RuntimeCardWithDefinition) => boolean): string[] {
      const zoneId = resolveZoneId(zone);
      markHiddenZoneBarrier(zoneId, "search-hidden-zone");
      const cards = getZoneCards(zoneId);
      return cards.filter((cardId) => predicate(getSearchView(cardId)));
    },

    searchAndPick(
      zone: ZoneRef,
      count: number,
      predicate?: (card: RuntimeCardWithDefinition) => boolean,
    ): string[] {
      const zoneId = resolveZoneId(zone);
      markHiddenZoneBarrier(zoneId, "search-hidden-zone");
      let candidates = getZoneCards(zoneId);

      if (predicate) {
        candidates = candidates.filter((cardId) => predicate(getSearchView(cardId)));
      }

      return candidates.slice(0, count);
    },

    // -------------------------------------------------------------------------
    // Looking
    // -------------------------------------------------------------------------

    lookAt(zone: ZoneRef, count: number, playerId: string): string[] {
      const zoneId = resolveZoneId(zone);
      markHiddenZoneBarrier(zoneId, "look-hidden-zone");
      const cards = getZoneCards(zoneId);
      const lookedCards = cards.slice(0, Math.min(count, cards.length));

      if (lookedCards.length > 0) {
        this.reveal(lookedCards, [playerId]);
      }

      return lookedCards;
    },

    lookAtTop(zone: ZoneRef, count: number, playerId: string): string[] {
      const zoneId = resolveZoneId(zone);
      markHiddenZoneBarrier(zoneId, "look-hidden-zone");
      const cards = getZoneCards(zoneId);
      const topCards = cards.slice(-Math.min(count, cards.length)).reverse();

      if (topCards.length > 0) {
        this.reveal(topCards, [playerId]);
      }

      return topCards;
    },

    lookAtBottom(zone: ZoneRef, count: number, playerId: string): string[] {
      return this.lookAt(zone, count, playerId);
    },

    // -------------------------------------------------------------------------
    // Queries
    // -------------------------------------------------------------------------

    getCards(zone: ZoneRef): string[] {
      const zoneId = resolveZoneId(zone);
      return [...getZoneCards(zoneId)];
    },

    getCardCount(zone: ZoneRef): number {
      const zoneId = resolveZoneId(zone);
      return getZoneCards(zoneId).length;
    },

    getTopCard(zone: ZoneRef): string | undefined {
      const zoneId = resolveZoneId(zone);
      const cards = getZoneCards(zoneId);
      return cards.length > 0 ? cards[cards.length - 1] : undefined;
    },

    getBottomCard(zone: ZoneRef): string | undefined {
      const zoneId = resolveZoneId(zone);
      const cards = getZoneCards(zoneId);
      return cards.length > 0 ? cards[0] : undefined;
    },

    getCardZone(cardId: string): string | undefined {
      return zones.private.cardIndex[cardId]?.zoneKey;
    },

    getCardOwner(cardId: string): string | undefined {
      return zones.private.cardIndex[cardId]?.ownerID;
    },

    getCardController(cardId: string): string | undefined {
      return zones.private.cardIndex[cardId]?.controllerID;
    },

    isOrdered(zone: ZoneRef): boolean {
      const zoneId = resolveZoneId(zone);
      return getZoneDef(zoneId)?.ordered ?? false;
    },

    isOwnerScoped(zone: ZoneRef): boolean {
      const zoneId = resolveZoneId(zone);
      return getZoneDef(zoneId)?.ownerScoped ?? false;
    },

    getVisibility(zone: ZoneRef): "public" | "private" | "secret" {
      const zoneId = resolveZoneId(zone);
      return getZoneDef(zoneId)?.visibility ?? "public";
    },
  };
}

// =============================================================================
// Expire Reveals
// =============================================================================

/**
 * Expire reveal windows that have passed their expiration stateID
 */
export function expireReveals(state: MatchState): MatchState {
  const currentStateID = state.ctx._stateID;
  state.ctx.zones.reveals.active = state.ctx.zones.reveals.active.filter(
    (reveal) => reveal.expiresAtStateID === undefined || reveal.expiresAtStateID > currentStateID,
  );
  return state;
}

// =============================================================================
// Mulligan
// =============================================================================

export interface MulliganResult {
  success: boolean;
  mulliganedCards: string[];
  drawnCards: string[];
  remainingMulligans: number;
}

export function performMulligan(
  draft: MatchState,
  zoneRegistry: ZoneRegistry,
  playerId: string,
  handZoneId: string,
  deckZoneId: string,
  handSize: number,
  remainingMulligans: number,
  emitEvent?: (event: GameEvent) => void,
  onUndoBarrier?: (reason: UndoBarrierReason) => void,
): MulliganResult {
  if (remainingMulligans <= 0) {
    return { success: false, mulliganedCards: [], drawnCards: [], remainingMulligans: 0 };
  }

  const zones = draft.ctx.zones;
  const handCards = zones.private.zoneCards[handZoneId] || [];
  const playerHandCards = handCards.filter(
    (cardId) => zones.private.cardIndex[cardId]?.ownerID === playerId,
  );

  // Move hand to bottom of deck
  onUndoBarrier?.("mulligan");
  const ops = createZoneOperations(draft, zoneRegistry, emitEvent, {
    onUndoBarrier,
  });
  for (const cardId of playerHandCards) {
    ops.moveCard(cardId, { zone: deckZoneId, playerId }, { index: 0 });
  }

  // Shuffle
  ops.shuffle({ zone: deckZoneId, playerId });

  // Draw new hand
  const drawnCards = ops.drawCards({
    from: { zone: deckZoneId, playerId },
    to: { zone: handZoneId, playerId },
    count: handSize,
  });

  emitEvent?.({
    kind: "MULLIGAN_PERFORMED",
    playerId,
    returnedCardIds: playerHandCards,
    drawnCardIds: drawnCards,
    cause: { kind: "SYSTEM", source: "ZONE_OPERATION" },
  });

  return {
    success: true,
    mulliganedCards: playerHandCards,
    drawnCards,
    remainingMulligans: remainingMulligans - 1,
  };
}

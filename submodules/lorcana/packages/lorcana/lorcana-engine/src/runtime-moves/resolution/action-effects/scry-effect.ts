import type { LorcanaCardDefinition, ScryDestination, ScryEffect } from "@tcg/lorcana-types";
import { compareOperator } from "../../../rules/operator-utils";
import type { CardInstanceId, PlayerId, RuntimeValidationResult } from "#core";
import type { CardPlayedPayload } from "../../../types/index";
import type { PlayCardExecutionContext } from "./types";
import { hasTemporaryPlayerRestriction } from "../../effects/temporary-effects";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { recordCardPutIntoInkwellThisTurn } from "../../state/turn-metrics";
import { hasBodyguard, hasMayEnterPlayExertedOption } from "../../../card-utils";

export type ScryDestinationSelection = {
  zone: string;
  cards: CardInstanceId[];
};

type ResolvedScryEffectInput = {
  scryAmount?: number;
  destinations?: { zone: string; cards: CardInstanceId | CardInstanceId[] }[];
  selectedPlayerIds?: PlayerId[];
  lookedAtCards?: readonly CardInstanceId[];
  revealWindowIds?: readonly string[];
  /**
   * Player-chosen "enter play exerted" decision for cards routed into the
   * play zone via scry. Honored for characters whose printed text grants
   * an entry-mode option — Bodyguard keyword or a static
   * `may-enter-play-exerted` ability (e.g. Hamish, Hubert & Harris;
   * Mickey Mouse — Expedition Leader). See triage 2026-05-11 #11
   * (Down in New Orleans).
   */
  enterPlayExerted?: boolean;
};

const VALID_SCRY_SELECTION: RuntimeValidationResult = { valid: true };

type ScryValidationContext = {
  cards: Pick<PlayCardExecutionContext["cards"], "getDefinition">;
  framework: {
    zones: Pick<PlayCardExecutionContext["framework"]["zones"], "getCards">;
  };
};

export function resolveScryDeckPlayerId(
  cardPlayed: CardPlayedPayload,
  selectedPlayerIds?: PlayerId[],
): PlayerId {
  return selectedPlayerIds && selectedPlayerIds.length > 0
    ? selectedPlayerIds[0]!
    : cardPlayed.playerId;
}

/**
 * Returns the top N cards of a player's deck for scry inspection.
 *
 * Deck ordering convention: index 0 = bottom, last index = top.
 * So "top N cards" are the last N elements of the zone array.
 */
export function getScryLookedAtCards(
  ctx: ScryValidationContext,
  deckPlayerId: PlayerId,
  amount?: number,
): CardInstanceId[] {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return [];
  }

  // Deck zone array: index 0 = bottom of deck, last index = top of deck.
  const deckCards = ctx.framework.zones.getCards({
    zone: "deck",
    playerId: deckPlayerId,
  }) as CardInstanceId[];

  const count = Math.min(amount, deckCards.length);
  // Slice the top N cards (last N elements).
  return deckCards.slice(deckCards.length - count);
}

function normalizeDestinationCards(cards: unknown): CardInstanceId[] {
  if (Array.isArray(cards)) {
    return cards
      .filter((cardId) => typeof cardId === "string")
      .map((cardId) => cardId as CardInstanceId);
  }

  return typeof cards === "string" ? [cards as CardInstanceId] : [];
}

export function isScryEffect(effect: unknown): effect is ScryEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "scry"
  );
}

function normalizeActionDestinationSelections(
  destinations: ResolvedScryEffectInput["destinations"],
): ScryDestinationSelection[] {
  if (!Array.isArray(destinations)) {
    return [];
  }

  return destinations
    .map((destination) => {
      if (!destination || typeof destination !== "object" || Array.isArray(destination)) {
        return undefined;
      }

      const destinationRecord = destination as Record<string, unknown>;
      const zone = destinationRecord.zone;
      const cards = destinationRecord.cards;
      if (typeof zone !== "string" || zone.length === 0) {
        return undefined;
      }

      const normalizedCards = normalizeDestinationCards(cards);

      return {
        cards: normalizedCards,
        zone,
      };
    })
    .filter((selection): selection is ScryDestinationSelection => Boolean(selection));
}

function normalizeScryFilters(filters: unknown): Record<string, unknown>[] {
  if (Array.isArray(filters)) {
    return filters.filter((entry): entry is Record<string, unknown> =>
      Boolean(entry && typeof entry === "object"),
    );
  }

  if (filters && typeof filters === "object") {
    return [filters as Record<string, unknown>];
  }

  return [];
}

function evaluateSingleFilter(
  ctx: ScryValidationContext,
  cardId: CardInstanceId,
  cardDefinition:
    | ({ cardType?: string; actionSubtype?: string } & Record<string, unknown>)
    | undefined,
  filter: Record<string, unknown>,
): boolean {
  // Use ctx and cardId to satisfy reactive dependency tracking in callers
  void ctx;
  void cardId;
  const filterType = String(filter.type ?? "");
  const cardType = cardDefinition?.cardType;
  switch (filterType) {
    case "and": {
      const subFilters = Array.isArray(filter.filters)
        ? (filter.filters as Record<string, unknown>[])
        : [];
      return subFilters.every((sub) => evaluateSingleFilter(ctx, cardId, cardDefinition, sub));
    }
    case "or": {
      const subFilters = Array.isArray(filter.filters)
        ? (filter.filters as Record<string, unknown>[])
        : [];
      return (
        subFilters.length === 0 ||
        subFilters.some((sub) => evaluateSingleFilter(ctx, cardId, cardDefinition, sub))
      );
    }
    case "not": {
      const inner = filter.filter as Record<string, unknown> | undefined;
      if (!inner || typeof inner !== "object") {
        return true;
      }
      return !evaluateSingleFilter(ctx, cardId, cardDefinition, inner);
    }
    case "card-type":
      return typeof filter.cardType === "string" && cardType === (filter.cardType as string);
    case "cost":
    case "cost-comparison": {
      const cardCost =
        typeof cardDefinition?.cost === "number" ? (cardDefinition.cost as number) : 0;
      const threshold =
        typeof filter.value === "number" ? (filter.value as number) : Number(filter.value ?? 0);
      const comparison = String(filter.comparison ?? "eq");
      return compareOperator(cardCost, comparison, threshold);
    }
    case "classification":
    case "has-classification": {
      if (typeof filter.classification !== "string") {
        return false;
      }
      const classifications = Array.isArray(cardDefinition?.classifications)
        ? (cardDefinition.classifications as unknown[])
        : [];
      return classifications.includes(filter.classification);
    }
    case "song":
      return cardDefinition?.cardType === "action" && cardDefinition?.actionSubtype === "song";
    default:
      return true;
  }
}

function passesScryFilter(
  ctx: ScryValidationContext,
  cardId: CardInstanceId,
  destination: ScryDestination,
): boolean {
  const filters = normalizeScryFilters(destination.filters ?? destination.filter);
  if (filters.length === 0) {
    return true;
  }

  const cardDefinition = ctx.cards.getDefinition(cardId) as
    | ({ cardType?: string; actionSubtype?: string } & Record<string, unknown>)
    | undefined;

  return filters.every((filter) => evaluateSingleFilter(ctx, cardId, cardDefinition, filter));
}

function getScryDestinationMin(destination: ScryDestination): number {
  return typeof destination.min === "number" &&
    Number.isFinite(destination.min) &&
    destination.min >= 0
    ? destination.min
    : 0;
}

function getScryDestinationMax(destination: ScryDestination): number {
  return typeof destination.max === "number" &&
    Number.isFinite(destination.max) &&
    destination.max >= 0
    ? destination.max
    : Number.POSITIVE_INFINITY;
}

function createInvalidScrySelection(error: string): RuntimeValidationResult {
  return {
    valid: false,
    error,
    errorCode: "INVALID_RESOLVE_EFFECT_SCRY_DESTINATIONS",
  };
}

export function validateScrySelection(
  ctx: ScryValidationContext,
  cardPlayed: CardPlayedPayload,
  effect: ScryEffect,
  resolvedInput: ResolvedScryEffectInput,
): RuntimeValidationResult {
  const destinations = effect.destinations ?? [];
  if (destinations.length === 0) {
    return VALID_SCRY_SELECTION;
  }

  // Top-of-deck cards that were looked at. Prefer the pre-resolved set (stored
  // in the pending effect) over re-reading from the deck zone.
  const lookedAtCards =
    resolvedInput.lookedAtCards && resolvedInput.lookedAtCards.length > 0
      ? [...resolvedInput.lookedAtCards]
      : (() => {
          const amount =
            typeof resolvedInput.scryAmount === "number" &&
            Number.isFinite(resolvedInput.scryAmount) &&
            resolvedInput.scryAmount > 0
              ? resolvedInput.scryAmount
              : undefined;
          if (!amount) {
            return [];
          }

          const deckPlayerId = resolveScryDeckPlayerId(cardPlayed, resolvedInput.selectedPlayerIds);
          return getScryLookedAtCards(ctx, deckPlayerId, amount);
        })();
  if (lookedAtCards.length === 0) {
    return VALID_SCRY_SELECTION;
  }

  const destinationSelections = normalizeActionDestinationSelections(resolvedInput.destinations);
  const selectionsByZone = new Map<string, CardInstanceId[][]>();
  for (const selection of destinationSelections) {
    const queuedSelections = selectionsByZone.get(selection.zone) ?? [];
    queuedSelections.push(selection.cards);
    selectionsByZone.set(selection.zone, queuedSelections);
  }

  const validLookedCards = new Set<CardInstanceId>(lookedAtCards);
  const explicitlySelectedCards = new Set<CardInstanceId>();

  for (const selection of destinationSelections) {
    for (const cardId of selection.cards) {
      if (!validLookedCards.has(cardId)) {
        return createInvalidScrySelection(
          "Selected scry cards must come from the looked-at cards.",
        );
      }

      if (explicitlySelectedCards.has(cardId)) {
        return createInvalidScrySelection(
          "Each looked-at card can only be selected for one scry destination.",
        );
      }

      explicitlySelectedCards.add(cardId);
    }
  }

  const assignedCards = new Set<CardInstanceId>();
  for (const destination of destinations) {
    const queuedSelections = selectionsByZone.get(destination.zone) ?? [];
    const requestedSelection = queuedSelections.length > 0 ? queuedSelections.shift()! : [];

    for (const cardId of requestedSelection) {
      if (!passesScryFilter(ctx, cardId, destination)) {
        return createInvalidScrySelection(
          `Selected card cannot be placed into scry destination ${destination.zone}.`,
        );
      }
    }

    const maxCards = getScryDestinationMax(destination);
    if (requestedSelection.length > maxCards) {
      return createInvalidScrySelection(
        `Too many cards were selected for scry destination ${destination.zone}.`,
      );
    }

    let cardsForDestination = [...requestedSelection];
    for (const cardId of requestedSelection) {
      assignedCards.add(cardId);
    }

    if (destination.remainder) {
      const remainderCards = lookedAtCards
        .filter((cardId) => !assignedCards.has(cardId))
        .filter((cardId) => passesScryFilter(ctx, cardId, destination));
      const remainingSlots = Number.isFinite(maxCards)
        ? Math.max(0, maxCards - cardsForDestination.length)
        : remainderCards.length;
      const addedFromRemainder = remainderCards.slice(0, remainingSlots);
      cardsForDestination = [...cardsForDestination, ...addedFromRemainder];
      for (const cardId of addedFromRemainder) {
        assignedCards.add(cardId);
      }
    }

    if (cardsForDestination.length < getScryDestinationMin(destination)) {
      return createInvalidScrySelection(
        `Not enough cards were selected for scry destination ${destination.zone}.`,
      );
    }
  }

  for (const queuedSelections of selectionsByZone.values()) {
    if (queuedSelections.length > 0) {
      return createInvalidScrySelection("Selected scry destinations do not match this effect.");
    }
  }

  return VALID_SCRY_SELECTION;
}

/**
 * Moves scry cards to their chosen destination zone.
 *
 * Deck ordering convention: index 0 = bottom, last index = top.
 * - "deck-bottom": inserts at index 0 (bottom of deck).
 * - "deck-top": appends to end (top of deck) — moveCard without an
 *   explicit index appends to the end by default.
 */
function moveDestinationCards(
  cardsForDestination: CardInstanceId[],
  destination: ScryDestination,
  zonePlayerId: string,
  ctx: PlayCardExecutionContext,
  options?: { enterPlayExerted?: boolean },
): void {
  switch (destination.zone) {
    case "hand":
      for (const cardId of cardsForDestination) {
        ctx.framework.zones.moveCard(cardId, {
          playerId: zonePlayerId,
          zone: "hand",
        });
      }
      break;
    case "deck-bottom": {
      // index 0 = bottom of deck
      for (const cardId of cardsForDestination) {
        ctx.framework.zones.moveCard(
          cardId,
          { playerId: zonePlayerId, zone: "deck" },
          { index: 0 },
        );
      }
      break;
    }
    case "deck-top":
      // No explicit index → appends to end = top of deck
      for (const cardId of cardsForDestination) {
        ctx.framework.zones.moveCard(cardId, {
          playerId: zonePlayerId,
          zone: "deck",
        });
      }
      break;
    case "discard":
      for (const cardId of cardsForDestination) {
        ctx.framework.zones.moveCard(cardId, {
          playerId: zonePlayerId,
          zone: "discard",
        });
      }
      break;
    case "inkwell":
      for (const cardId of cardsForDestination) {
        const sourceZoneKey = ctx.framework.zones.getCardZone(cardId);
        const isPrivateSource =
          typeof sourceZoneKey === "string" &&
          (sourceZoneKey === "hand" ||
            sourceZoneKey.startsWith("hand:") ||
            sourceZoneKey === "deck" ||
            sourceZoneKey.startsWith("deck:"));
        const isFaceUp = destination.facedown === false;
        ctx.framework.zones.moveCard(cardId, {
          playerId: zonePlayerId,
          zone: "inkwell",
        });
        recordCardPutIntoInkwellThisTurn(ctx, cardId);
        const state = destination.exerted === false ? "ready" : "exerted";
        ctx.cards.patchMeta(cardId, {
          publicFaceState: isFaceUp ? "faceUp" : "faceDown",
          state,
        });
        emitTriggeredLorcanaEvent(
          ctx,
          "cardInked",
          {
            playerId: zonePlayerId as PlayerId,
            cardId,
            from: sourceZoneKey ?? "unknown",
            to: `inkwell:${zonePlayerId}`,
            exerted: state === "exerted",
            private: isPrivateSource && !isFaceUp,
          },
          {
            event: "ink",
            playerId: zonePlayerId as PlayerId,
            subjectCardId: cardId,
            fromZone: sourceZoneKey,
          },
        );
      }
      break;
    case "play": {
      const playDest = destination as { entersExerted?: boolean };
      const currentTurn = ctx.framework.state.status.turn ?? 1;
      for (const cardId of cardsForDestination) {
        const definition = ctx.cards.getDefinition(cardId) as LorcanaCardDefinition | undefined;
        const cardType = definition?.cardType;
        const playerRestrictions = ctx.G.temporaryPlayerRestrictions;
        const isBlocked =
          hasTemporaryPlayerRestriction(
            playerRestrictions,
            zonePlayerId as PlayerId,
            currentTurn,
            "cant-play",
          ) ||
          (cardType === "action" &&
            hasTemporaryPlayerRestriction(
              playerRestrictions,
              zonePlayerId as PlayerId,
              currentTurn,
              "cant-play-actions",
            )) ||
          (cardType === "item" &&
            hasTemporaryPlayerRestriction(
              playerRestrictions,
              zonePlayerId as PlayerId,
              currentTurn,
              "cant-play-items",
            )) ||
          (cardType === "character" &&
            hasTemporaryPlayerRestriction(
              playerRestrictions,
              zonePlayerId as PlayerId,
              currentTurn,
              "cant-play-characters",
            ));
        if (isBlocked) {
          continue;
        }

        ctx.framework.zones.moveCard(cardId, {
          playerId: zonePlayerId,
          zone: "play",
        });
        // Per-destination `entersExerted` (from the scry rule definition) takes
        // precedence. Otherwise, honor the player's `enterPlayExerted` choice
        // for characters whose printed text grants a "may enter exerted"
        // option — either via the Bodyguard keyword or via the static
        // `may-enter-play-exerted` ability (e.g. Hamish, Hubert & Harris;
        // Mickey Mouse — Expedition Leader). The rest of the engine treats
        // both as entry-mode-bearing cards.
        const offersEntryModeChoice =
          options?.enterPlayExerted === true &&
          cardType === "character" &&
          definition !== undefined &&
          (hasBodyguard(definition) || hasMayEnterPlayExertedOption(definition));
        if (playDest.entersExerted === true || offersEntryModeChoice) {
          ctx.cards.patchMeta(cardId, { state: "exerted", isDrying: true });
        } else {
          ctx.cards.patchMeta(cardId, { isDrying: true });
        }
      }
      break;
    }
  }
}

export function resolveScryEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: ScryEffect,
  resolvedInput: ResolvedScryEffectInput,
): void {
  const amount =
    typeof resolvedInput.scryAmount === "number" &&
    Number.isFinite(resolvedInput.scryAmount) &&
    resolvedInput.scryAmount > 0
      ? resolvedInput.scryAmount
      : undefined;
  if (!amount) {
    return;
  }

  const deckPlayerId = resolveScryDeckPlayerId(cardPlayed, resolvedInput.selectedPlayerIds);
  // Top-of-deck cards to inspect. Prefer pre-resolved cards (from a preceding
  // reveal-top-card step) over re-reading from the deck zone.
  const lookedAtCards =
    resolvedInput.lookedAtCards && resolvedInput.lookedAtCards.length > 0
      ? [...resolvedInput.lookedAtCards]
      : getScryLookedAtCards(ctx, deckPlayerId, amount);
  const initialRevealIds = Array.isArray(resolvedInput.revealWindowIds)
    ? [...resolvedInput.revealWindowIds]
    : [];
  if (lookedAtCards.length > 0) {
    if (initialRevealIds.length === 0) {
      initialRevealIds.push(ctx.framework.zones.reveal(lookedAtCards, [cardPlayed.playerId]));
    }
  }

  if (lookedAtCards.length === 0) {
    return;
  }

  const currentStateID = ctx.framework.state.stateID ?? 0;

  const destinationSelections = normalizeActionDestinationSelections(resolvedInput.destinations);
  const selectedByZone = new Map<string, CardInstanceId[][]>();
  for (const selection of destinationSelections) {
    const queued = selectedByZone.get(selection.zone) ?? [];
    queued.push(selection.cards);
    selectedByZone.set(selection.zone, queued);
  }

  const selectedCards = new Set<CardInstanceId>();
  const validLookedCards = new Set<CardInstanceId>(lookedAtCards);
  const destinations = effect.destinations ?? [];
  const resolvedDestinationMoves: Array<{
    destination: ScryDestination;
    cards: CardInstanceId[];
  }> = [];

  for (const destination of destinations as ScryDestination[]) {
    const maxCards =
      typeof destination.max === "number" &&
      Number.isFinite(destination.max) &&
      destination.max >= 0
        ? destination.max
        : Number.POSITIVE_INFINITY;
    const queuedSelections = selectedByZone.get(destination.zone) ?? [];
    const requestedSelection = queuedSelections.length > 0 ? queuedSelections.shift()! : [];
    const requestedCards = requestedSelection
      .filter((cardId) => validLookedCards.has(cardId) && !selectedCards.has(cardId))
      .filter((cardId) => passesScryFilter(ctx, cardId, destination))
      .slice(0, maxCards);

    let cardsForDestination = [...requestedCards];
    for (const cardId of requestedCards) {
      selectedCards.add(cardId);
    }

    if (destination.remainder) {
      const remainderCards = lookedAtCards
        .filter((cardId) => !selectedCards.has(cardId))
        .filter((cardId) => passesScryFilter(ctx, cardId, destination));
      const remainingSlots = Number.isFinite(maxCards)
        ? Math.max(0, maxCards - cardsForDestination.length)
        : remainderCards.length;
      const addedFromRemainder = remainderCards.slice(0, remainingSlots);
      cardsForDestination = [...cardsForDestination, ...addedFromRemainder];
      for (const cardId of addedFromRemainder) {
        selectedCards.add(cardId);
      }
    }

    if (destination.reveal && cardsForDestination.length > 0) {
      // Persist reveal windows (stateID-scoped) so opponents see identity after
      // cards move zones; ephemeral reveals cleared at end of this resolver would
      // disappear before projection. Card meta backs views that key off `revealed`.
      ctx.framework.zones.reveal(cardsForDestination, "all", {
        stateID: currentStateID + 4,
      });
      for (const cardId of cardsForDestination) {
        ctx.cards.patchMeta(cardId, { revealed: true });
      }
    }

    resolvedDestinationMoves.push({ destination, cards: cardsForDestination });
  }

  for (const move of resolvedDestinationMoves.filter(
    (entry) => entry.destination.zone !== "play",
  )) {
    moveDestinationCards(move.cards, move.destination, deckPlayerId, ctx);
  }

  for (const move of resolvedDestinationMoves.filter(
    (entry) => entry.destination.zone === "play",
  )) {
    moveDestinationCards(move.cards, move.destination, deckPlayerId, ctx, {
      enterPlayExerted: resolvedInput.enterPlayExerted,
    });
  }

  // Always clear the initial scry reveal windows (private "look" windows)
  for (const revealId of initialRevealIds) {
    ctx.framework.zones.clearReveal(revealId);
  }
}

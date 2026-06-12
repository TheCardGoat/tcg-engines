import type { PromptScryDestination, PromptScryRevealedCard } from "@tcg/lorcana-interaction";

const SCRYPT_ZONE_DROP_ID_PREFIX = "scry-zone:";
const SCRYPT_CARD_DROP_ID_PREFIX = "scry-card:";
const SCRYPT_DRAG_ID_PREFIX = "scry-drag:";

export interface ScryDropTarget {
  destinationId: string;
  beforeCardId: string | null;
}

export function buildScryZoneDropId(destinationId: string): string {
  return `${SCRYPT_ZONE_DROP_ID_PREFIX}${destinationId}`;
}

export function buildScryCardDropId(destinationId: string, cardId: string): string {
  return `${SCRYPT_CARD_DROP_ID_PREFIX}${destinationId}:${cardId}`;
}

export function buildScryDragId(cardId: string): string {
  return `${SCRYPT_DRAG_ID_PREFIX}${cardId}`;
}

export function isScryDragSourceId(id: string | null | undefined): boolean {
  return Boolean(id && id.startsWith(SCRYPT_DRAG_ID_PREFIX));
}

export function parseScryDragId(id: string | null | undefined): string | null {
  if (!id || !id.startsWith(SCRYPT_DRAG_ID_PREFIX)) {
    return null;
  }

  return id.slice(SCRYPT_DRAG_ID_PREFIX.length) || null;
}

export function parseScryDropTarget(id: string | null | undefined): ScryDropTarget | null {
  if (!id) {
    return null;
  }

  if (id.startsWith(SCRYPT_ZONE_DROP_ID_PREFIX)) {
    const destinationId = id.slice(SCRYPT_ZONE_DROP_ID_PREFIX.length);
    return destinationId ? { destinationId, beforeCardId: null } : null;
  }

  if (id.startsWith(SCRYPT_CARD_DROP_ID_PREFIX)) {
    const payload = id.slice(SCRYPT_CARD_DROP_ID_PREFIX.length);
    const separatorIndex = payload.lastIndexOf(":");
    if (separatorIndex <= 0) {
      return null;
    }

    const destinationId = payload.slice(0, separatorIndex);
    const beforeCardId = payload.slice(separatorIndex + 1);
    return destinationId && beforeCardId ? { destinationId, beforeCardId } : null;
  }

  return null;
}

/* ------------------------------------------------------------------ *
 * View-shape-aware helpers (consume `PlayerInteractionView` slices). *
 * ------------------------------------------------------------------ */

export function findScryDestination(
  destinations: readonly PromptScryDestination[],
  destinationId: string,
): PromptScryDestination | null {
  return destinations.find((destination) => destination.id === destinationId) ?? null;
}

export function findScryRevealedCard(
  revealed: readonly PromptScryRevealedCard[],
  cardId: string,
): PromptScryRevealedCard | null {
  return revealed.find((card) => String(card.cardId) === cardId) ?? null;
}

export function findScryCardDestinationId(
  revealed: readonly PromptScryRevealedCard[],
  cardId: string,
): string | null {
  return findScryRevealedCard(revealed, cardId)?.currentDestinationId ?? null;
}

export function getScryRemainderDestination(
  destinations: readonly PromptScryDestination[],
): PromptScryDestination | null {
  return destinations.find((destination) => destination.remainder) ?? null;
}

export function getScryDestinationCountLabel(destination: PromptScryDestination): string {
  if (destination.max === null) {
    return `${destination.currentCardIds.length}`;
  }
  return `${destination.currentCardIds.length}/${destination.max}`;
}

/**
 * Whether a revealed card may legally be dropped on a destination.
 *
 * Two checks:
 *   1. Capacity — destination has room (or already holds the card).
 *   2. Eligibility — destination accepts this card per the engine's
 *      `filters`. The view layer pre-computes `eligibleDestinationIds` on
 *      each revealed card; `[]` means the engine returned no destination
 *      list (legacy view payloads), in which case we conservatively allow
 *      the drop and let the engine reject at submit time.
 */
export function canAssignScryCardToDestination(
  destinations: readonly PromptScryDestination[],
  revealed: readonly PromptScryRevealedCard[],
  cardId: string,
  destinationId: string,
): boolean {
  const destination = findScryDestination(destinations, destinationId);
  const card = findScryRevealedCard(revealed, cardId);
  if (!destination || !card) {
    return false;
  }

  const eligibilityList = card.eligibleDestinationIds;
  if (eligibilityList && eligibilityList.length > 0 && !eligibilityList.includes(destinationId)) {
    return false;
  }

  const currentDestinationId = card.currentDestinationId;
  const currentCount = destination.currentCardIds.length;
  const adjustedCount = currentDestinationId === destinationId ? currentCount : currentCount + 1;
  return destination.max === null || adjustedCount <= destination.max;
}

export function getScryTapDestination(
  destinations: readonly PromptScryDestination[],
  revealed: readonly PromptScryRevealedCard[],
  cardId: string,
): string | null {
  const currentDestinationId = findScryCardDestinationId(revealed, cardId);
  const remainderDestination = getScryRemainderDestination(destinations);

  // If the card is currently unassigned (not in any destination):
  // - With a remainder destination: assign to the first non-remainder destination that accepts it
  // - Without a remainder destination: assign to the first destination that accepts it
  if (!currentDestinationId) {
    for (const destination of destinations) {
      if (canAssignScryCardToDestination(destinations, revealed, cardId, destination.id)) {
        return destination.id;
      }
    }
    return null;
  }

  // Card is currently in a non-remainder destination — send it back to remainder (if any)
  if (remainderDestination && currentDestinationId !== remainderDestination.id) {
    return canAssignScryCardToDestination(destinations, revealed, cardId, remainderDestination.id)
      ? remainderDestination.id
      : null;
  }

  // Card is in the remainder destination (or there's no remainder) — cycle to the next
  // non-remainder destination that accepts it
  for (const destination of destinations) {
    if (destination.remainder) {
      continue;
    }

    if (canAssignScryCardToDestination(destinations, revealed, cardId, destination.id)) {
      return destination.id;
    }
  }

  return null;
}

/**
 * The engine places deck-top cards by appending in array order, so the LAST card in the array
 * ends up at the actual top (drawn first). Similarly, deck-bottom cards are inserted at index 0,
 * so the LAST card in the array ends up at the actual bottom.
 *
 * To make the display intuitive (left = drawn first for deck-top; left = deepest for deck-bottom),
 * we show ordered destinations in reversed visual order. This function maps a "before card X"
 * from the reversed visual display back to the correct insertion point in the original array.
 *
 * Visual "before X" in a reversed display means "after X" in the original array —
 * so we return the card at indexOf(X) + 1 in the original.
 */
export function mapReversedBeforeCardId(
  destination: PromptScryDestination,
  visualBeforeCardId: string | null,
): string | null {
  if (!destination.orderingEnabled || visualBeforeCardId === null) {
    return visualBeforeCardId;
  }

  const originalCards = destination.currentCardIds.map((cardId) => String(cardId));
  const idx = originalCards.indexOf(visualBeforeCardId);
  if (idx < 0) {
    return null;
  }

  return idx + 1 < originalCards.length ? originalCards[idx + 1] : null;
}

export function getScryDesiredOrder(
  destination: PromptScryDestination,
  draggedCardId: string,
  beforeCardId: string | null,
): string[] | null {
  const remainingCards = destination.currentCardIds
    .map((cardId) => String(cardId))
    .filter((cardId) => cardId !== draggedCardId);
  const insertIndex =
    beforeCardId === null ? remainingCards.length : remainingCards.indexOf(beforeCardId);

  if (insertIndex < 0) {
    return null;
  }

  remainingCards.splice(insertIndex, 0, draggedCardId);
  return remainingCards;
}

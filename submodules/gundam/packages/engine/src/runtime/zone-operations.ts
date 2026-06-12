/**
 * Zone Operations Runtime — All zone mutation and query operations.
 * Works on the ZoneRuntimeState structure stored in MatchState.ctx.zones.
 */

import type { PlayerId } from "../types/branded.ts";
import type { BaseCardMeta, RuntimeCard } from "../types/base-card.ts";
import type { ZoneConfig, ZoneRef, ZoneRuntimeState, ZoneVisibility } from "../types/zone-types.ts";
import type { ZoneOperationsAPI } from "../types/move-types.ts";
import { makeZoneKey } from "@tcg/engine-core";

export { makeZoneKey } from "@tcg/engine-core";

// ── Internal helpers ────────────────────────────────────────────────────────

function getConfig(zoneConfigs: Record<string, ZoneConfig>, zoneId: string): ZoneConfig {
  const config = zoneConfigs[zoneId];
  if (!config) {
    throw new Error(`Unknown zone config: ${zoneId}`);
  }
  return config;
}

function getCardsArray(zones: ZoneRuntimeState, key: string): string[] {
  let arr = zones.private.zoneCards[key];
  if (!arr) {
    arr = [];
    zones.private.zoneCards[key] = arr;
  }
  return arr;
}

function ensureSummary(
  zones: ZoneRuntimeState,
  key: string,
): { revision: number; count: number; topPublicCardID?: string } {
  let summary = zones.public.zoneSummaries[key];
  if (!summary) {
    summary = { revision: 0, count: 0 };
    zones.public.zoneSummaries[key] = summary;
  }
  return summary;
}

/**
 * Update public zone summary after a mutation.
 * Increments revision, sets count, and updates topPublicCardID for public zones.
 */
function syncSummary(
  zones: ZoneRuntimeState,
  key: string,
  zoneConfigs: Record<string, ZoneConfig>,
): void {
  const cards = zones.private.zoneCards[key] ?? [];
  const summary = ensureSummary(zones, key);
  summary.revision++;
  summary.count = cards.length;

  // Determine the base zone id (strip player suffix)
  const baseZoneId = key.includes(":") ? key.split(":")[0]! : key;
  const config = zoneConfigs[baseZoneId];

  if (config && config.visibility === "public" && cards.length > 0) {
    summary.topPublicCardID = cards[cards.length - 1];
  } else {
    summary.topPublicCardID = undefined;
  }
}

/**
 * Remove a card from its current zone and update the card index.
 * Returns the old zone key, or undefined if the card wasn't indexed.
 */
function removeCardFromCurrentZone(zones: ZoneRuntimeState, cardId: string): string | undefined {
  const entry = zones.private.cardIndex[cardId];
  if (!entry) return undefined;

  const oldKey = entry.zoneKey;
  const cards = zones.private.zoneCards[oldKey];
  if (cards) {
    const idx = cards.indexOf(cardId);
    if (idx !== -1) {
      cards.splice(idx, 1);
      // Reindex remaining cards after the removal point
      for (let i = idx; i < cards.length; i++) {
        const reindexEntry = zones.private.cardIndex[cards[i]!];
        if (reindexEntry) {
          reindexEntry.index = i;
        }
      }
    }
  }

  return oldKey;
}

/**
 * Add a card to a zone at the given index (defaults to end / "top").
 */
function addCardToZone(
  zones: ZoneRuntimeState,
  cardId: string,
  zoneKey: string,
  insertIndex?: number,
): void {
  const cards = getCardsArray(zones, zoneKey);
  const entry = zones.private.cardIndex[cardId];
  if (!entry) {
    throw new Error(`Card ${cardId} not found in card index`);
  }

  if (insertIndex !== undefined && insertIndex >= 0 && insertIndex < cards.length) {
    cards.splice(insertIndex, 0, cardId);
    // Reindex from insertion point
    for (let i = insertIndex; i < cards.length; i++) {
      const reindexEntry = zones.private.cardIndex[cards[i]!];
      if (reindexEntry) {
        reindexEntry.zoneKey = zoneKey;
        reindexEntry.index = i;
      }
    }
  } else {
    cards.push(cardId);
    entry.zoneKey = zoneKey;
    entry.index = cards.length - 1;
  }
}

// ── Factory ─────────────────────────────────────────────────────────────────

/**
 * Creates a ZoneOperationsAPI bound to the given mutable zone state.
 *
 * @param zones - The mutable ZoneRuntimeState (will be mutated in place)
 * @param zoneConfigs - Zone configuration definitions keyed by zone id
 * @param randomFn - Deterministic random function for shuffling
 * @param stateID - Current state ID (used for reveal expiration)
 */
export function createZoneOperations(
  zones: ZoneRuntimeState,
  zoneConfigs: Record<string, ZoneConfig>,
  randomFn: () => number,
  stateID: number,
): ZoneOperationsAPI {
  // ── Query methods ───────────────────────────────────────────────────────

  function getCards(zone: ZoneRef): string[] {
    const key = makeZoneKey(zone);
    return [...(zones.private.zoneCards[key] ?? [])];
  }

  function getCardCount(zone: ZoneRef): number {
    const key = makeZoneKey(zone);
    return (zones.private.zoneCards[key] ?? []).length;
  }

  function getTopCard(zone: ZoneRef): string | undefined {
    const key = makeZoneKey(zone);
    const cards = zones.private.zoneCards[key];
    if (!cards || cards.length === 0) return undefined;
    return cards[cards.length - 1];
  }

  function getBottomCard(zone: ZoneRef): string | undefined {
    const key = makeZoneKey(zone);
    const cards = zones.private.zoneCards[key];
    if (!cards || cards.length === 0) return undefined;
    return cards[0];
  }

  function getCardZone(cardId: string): string | undefined {
    const entry = zones.private.cardIndex[cardId];
    return entry?.zoneKey;
  }

  function getCardOwner(cardId: string): PlayerId | undefined {
    const entry = zones.private.cardIndex[cardId];
    return entry?.ownerID;
  }

  function getCardController(cardId: string): PlayerId | undefined {
    const entry = zones.private.cardIndex[cardId];
    return entry?.controllerID;
  }

  function search(zone: ZoneRef, _predicate: (card: RuntimeCard) => boolean): string[] {
    // search requires building RuntimeCards, but we don't have the derive
    // function here. We pass through the card IDs and let the predicate
    // work with whatever RuntimeCard shape is provided. The caller is
    // responsible for providing a predicate that can handle the cards.
    // Since we don't have access to the card derivation function at this
    // layer, we filter based on what's available in the zone and delegate
    // the predicate evaluation to the caller through the API composition.
    //
    // For now, return an empty array — the search method is properly
    // implemented at the framework level where card derivation is available.
    const key = makeZoneKey(zone);
    const cards = zones.private.zoneCards[key] ?? [];
    // We cannot build RuntimeCards here; return all cards and let the
    // framework-level wrapper handle predicate filtering.
    // This is a placeholder — the real implementation requires a
    // deriveRuntimeCard function injected at a higher level.
    return [...cards];
  }

  function isOrdered(zone: ZoneRef): boolean {
    const config = getConfig(zoneConfigs, zone.zone);
    return config.ordered;
  }

  function getVisibility(zone: ZoneRef): ZoneVisibility {
    const config = getConfig(zoneConfigs, zone.zone);
    return config.visibility;
  }

  // ── Mutation methods ──────────────────────────────────────────────────────

  function moveCard(
    cardId: string,
    toZone: ZoneRef,
    options?: { index?: number; faceDown?: boolean },
  ): void {
    const oldKey = removeCardFromCurrentZone(zones, cardId);
    const newKey = makeZoneKey(toZone);

    addCardToZone(zones, cardId, newKey, options?.index);

    // Sync summaries for both old and new zones
    if (oldKey && oldKey !== newKey) {
      syncSummary(zones, oldKey, zoneConfigs);
    }
    syncSummary(zones, newKey, zoneConfigs);
  }

  function moveCards(cardIds: string[], toZone: ZoneRef): void {
    const affectedKeys = new Set<string>();
    const newKey = makeZoneKey(toZone);

    for (const cardId of cardIds) {
      const oldKey = removeCardFromCurrentZone(zones, cardId);
      if (oldKey) affectedKeys.add(oldKey);
      addCardToZone(zones, cardId, newKey);
    }

    affectedKeys.add(newKey);
    for (const key of affectedKeys) {
      syncSummary(zones, key, zoneConfigs);
    }
  }

  function drawCards(params: { from: ZoneRef; to: ZoneRef; count: number }): string[] {
    const fromKey = makeZoneKey(params.from);
    const fromCards = zones.private.zoneCards[fromKey];
    if (!fromCards || fromCards.length === 0) return [];

    const drawn: string[] = [];
    const actualCount = Math.min(params.count, fromCards.length);

    for (let i = 0; i < actualCount; i++) {
      // Draw from the top (end of array)
      const cardId = fromCards[fromCards.length - 1];
      if (!cardId) break;
      removeCardFromCurrentZone(zones, cardId);
      const toKey = makeZoneKey(params.to);
      addCardToZone(zones, cardId, toKey);
      drawn.push(cardId);
    }

    syncSummary(zones, fromKey, zoneConfigs);
    syncSummary(zones, makeZoneKey(params.to), zoneConfigs);

    return drawn;
  }

  function drawSpecificCard(cardId: string, _from: ZoneRef, to: ZoneRef): boolean {
    const entry = zones.private.cardIndex[cardId];
    if (!entry) return false;

    const fromKey = entry.zoneKey;
    removeCardFromCurrentZone(zones, cardId);
    const toKey = makeZoneKey(to);
    addCardToZone(zones, cardId, toKey);

    syncSummary(zones, fromKey, zoneConfigs);
    if (toKey !== fromKey) {
      syncSummary(zones, toKey, zoneConfigs);
    }

    return true;
  }

  function mill(from: ZoneRef, to: ZoneRef, count: number): string[] {
    const fromKey = makeZoneKey(from);
    const fromCards = zones.private.zoneCards[fromKey];
    if (!fromCards || fromCards.length === 0) return [];

    const milled: string[] = [];
    const actualCount = Math.min(count, fromCards.length);

    for (let i = 0; i < actualCount; i++) {
      // Mill from the top (end of array)
      const cardId = fromCards[fromCards.length - 1];
      if (!cardId) break;
      removeCardFromCurrentZone(zones, cardId);
      const toKey = makeZoneKey(to);
      addCardToZone(zones, cardId, toKey);
      milled.push(cardId);
    }

    syncSummary(zones, fromKey, zoneConfigs);
    syncSummary(zones, makeZoneKey(to), zoneConfigs);

    return milled;
  }

  function shuffle(zone: ZoneRef): void {
    const key = makeZoneKey(zone);
    const cards = zones.private.zoneCards[key];
    if (!cards || cards.length <= 1) return;

    // Fisher-Yates shuffle using the deterministic random function
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1));
      const temp = cards[i]!;
      cards[i] = cards[j]!;
      cards[j] = temp;
    }

    // Reindex all cards in the zone
    for (let i = 0; i < cards.length; i++) {
      const entry = zones.private.cardIndex[cards[i]!];
      if (entry) {
        entry.index = i;
      }
    }

    syncSummary(zones, key, zoneConfigs);
  }

  function reveal(
    cardIds: string[],
    visibleTo: "all" | string[],
    options?: { stateID?: number },
  ): string {
    const id = String(zones.reveals.nextId);
    zones.reveals.nextId++;

    zones.reveals.active[id] = {
      cardIds: [...cardIds],
      visibleTo,
      expiresAtStateID: options?.stateID ?? stateID + 1,
    };

    return id;
  }

  function revealTop(zone: ZoneRef, count: number, visibleTo: "all" | string[]): string[] {
    const key = makeZoneKey(zone);
    const cards = zones.private.zoneCards[key];
    if (!cards || cards.length === 0) return [];

    const actualCount = Math.min(count, cards.length);
    // Top cards are at the end of the array
    const topCards = cards.slice(cards.length - actualCount).reverse();

    reveal(topCards, visibleTo);

    return topCards;
  }

  function clearReveal(revealId: string): void {
    delete zones.reveals.active[revealId];
  }

  function placeToken(
    instanceId: string,
    zoneRef: ZoneRef,
    ownerId: PlayerId,
    meta?: BaseCardMeta,
  ): void {
    const key = makeZoneKey(zoneRef);
    const zoneArr = getCardsArray(zones, key);

    zones.private.cardIndex[instanceId] = {
      zoneKey: key,
      index: zoneArr.length,
      ownerID: ownerId,
      controllerID: ownerId,
    };
    zones.private.cardMeta[instanceId] = meta ?? {};
    zoneArr.push(instanceId);

    syncSummary(zones, key, zoneConfigs);
  }

  // ── Return the API object ─────────────────────────────────────────────────

  return {
    // Query
    getCards,
    getCardCount,
    getTopCard,
    getBottomCard,
    getCardZone,
    getCardOwner,
    getCardController,
    search,
    isOrdered,
    getVisibility,

    // Mutation
    moveCard,
    moveCards,
    drawCards,
    drawSpecificCard,
    mill,
    shuffle,
    reveal,
    revealTop,
    clearReveal,
    placeToken,
  };
}

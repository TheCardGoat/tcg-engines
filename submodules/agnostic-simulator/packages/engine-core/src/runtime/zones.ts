import type { ZoneConfig, ZoneRef, ZoneRuntimeState, ZoneVisibility } from "../types/index.ts";

export function makeZoneKey<TZoneId extends string>(ref: ZoneRef<TZoneId>): string {
  if (ref.playerId) {
    return `${ref.zone}:${ref.playerId}`;
  }
  return ref.zone;
}

export function parseZoneKey(key: string): ZoneRef {
  const parts = key.split(":");
  if (parts.length === 2) {
    return { zone: parts[0]!, playerId: parts[1] };
  }
  return { zone: key };
}

export function createEmptyZoneState(): ZoneRuntimeState {
  return {
    public: { zoneSummaries: {} },
    private: { zoneCards: {}, cardIndex: {}, cardMeta: {} },
  };
}

export function initializeZoneState<TZoneId extends string>(
  zoneConfigs: Record<TZoneId, ZoneConfig<TZoneId>>,
  playerIds: string[],
): ZoneRuntimeState {
  const state = createEmptyZoneState();
  for (const zoneId of Object.keys(zoneConfigs) as TZoneId[]) {
    const config = zoneConfigs[zoneId];
    if (config.ownerScoped) {
      for (const playerId of playerIds) {
        const key = makeZoneKey({ zone: zoneId, playerId });
        state.private.zoneCards[key] = [];
        state.public.zoneSummaries[key] = { revision: 0, count: 0 };
      }
    } else {
      const key = makeZoneKey({ zone: zoneId });
      state.private.zoneCards[key] = [];
      state.public.zoneSummaries[key] = { revision: 0, count: 0 };
    }
  }
  return state;
}

export function getCardsInZone(state: ZoneRuntimeState, ref: ZoneRef): string[] {
  const key = makeZoneKey(ref);
  return [...(state.private.zoneCards[key] ?? [])];
}

export function getCardCount(state: ZoneRuntimeState, ref: ZoneRef): number {
  const key = makeZoneKey(ref);
  return state.private.zoneCards[key]?.length ?? 0;
}

export function getTopCard(state: ZoneRuntimeState, ref: ZoneRef): string | undefined {
  const cards = state.private.zoneCards[makeZoneKey(ref)];
  return cards?.[cards.length - 1];
}

export function getBottomCard(state: ZoneRuntimeState, ref: ZoneRef): string | undefined {
  const cards = state.private.zoneCards[makeZoneKey(ref)];
  return cards?.[0];
}

export function getCardZone(state: ZoneRuntimeState, cardId: string): string | undefined {
  return state.private.cardIndex[cardId]?.zoneKey;
}

export function getCardOwner(state: ZoneRuntimeState, cardId: string): string | undefined {
  return state.private.cardIndex[cardId]?.ownerId;
}

export function getCardController(state: ZoneRuntimeState, cardId: string): string | undefined {
  return state.private.cardIndex[cardId]?.controllerId;
}

export function isOrdered<TZoneId extends string>(
  state: ZoneRuntimeState,
  ref: ZoneRef<TZoneId>,
  zoneConfigs?: Record<TZoneId, ZoneConfig<TZoneId>>,
): boolean {
  const config = zoneConfigs?.[ref.zone];
  if (config) return config.ordered;

  const zoneKey = makeZoneKey(ref);
  return zoneKey in state.private.zoneCards;
}

/**
 * Moves a card to a zone, updating the card index and zone summaries.
 *
 * Intentionally mutates `state` in-place for performance. Callers that need
 * immutability (undo, time-travel) should deep-clone the state before calling.
 */
export function moveCardInState(
  state: ZoneRuntimeState,
  cardId: string,
  toRef: ZoneRef,
  options?: { index?: number; faceDown?: boolean },
): void {
  const toKey = makeZoneKey(toRef);
  const existing = state.private.cardIndex[cardId];

  if (existing) {
    const fromCards = state.private.zoneCards[existing.zoneKey];
    if (fromCards) {
      const idx = fromCards.indexOf(cardId);
      if (idx >= 0) {
        fromCards.splice(idx, 1);
        state.public.zoneSummaries[existing.zoneKey]!.count = fromCards.length;
        if (fromCards.length > 0) {
          state.public.zoneSummaries[existing.zoneKey]!.topPublicCardID =
            fromCards[fromCards.length - 1];
        } else {
          delete state.public.zoneSummaries[existing.zoneKey]!.topPublicCardID;
        }
        state.public.zoneSummaries[existing.zoneKey]!.revision++;

        // Reindex remaining cards in the source zone
        for (let i = idx; i < fromCards.length; i++) {
          const entry = state.private.cardIndex[fromCards[i]!];
          if (entry) entry.index = i;
        }
      }
    }
  }

  const toCards = state.private.zoneCards[toKey];
  if (!toCards) {
    state.private.zoneCards[toKey] = [];
  }

  const targetArray = state.private.zoneCards[toKey]!;
  const insertIndex = options?.index ?? targetArray.length;
  targetArray.splice(insertIndex, 0, cardId);

  state.private.cardIndex[cardId] = {
    zoneKey: toKey,
    index: insertIndex,
    ownerId: toRef.playerId ?? existing?.ownerId ?? "unknown",
    controllerId: toRef.playerId ?? existing?.controllerId ?? "unknown",
  };

  // Reindex cards shifted by the insertion
  for (let i = insertIndex + 1; i < targetArray.length; i++) {
    const entry = state.private.cardIndex[targetArray[i]!];
    if (entry) entry.index = i;
  }

  state.public.zoneSummaries[toKey]!.count = targetArray.length;
  state.public.zoneSummaries[toKey]!.topPublicCardID = targetArray[targetArray.length - 1];
  state.public.zoneSummaries[toKey]!.revision++;
}

export function removeCardFromState(state: ZoneRuntimeState, cardId: string): boolean {
  const existing = state.private.cardIndex[cardId];
  if (!existing) return false;

  const fromCards = state.private.zoneCards[existing.zoneKey];
  if (fromCards) {
    const idx = fromCards.indexOf(cardId);
    if (idx >= 0) {
      fromCards.splice(idx, 1);
      state.public.zoneSummaries[existing.zoneKey]!.count = fromCards.length;
      if (fromCards.length > 0) {
        state.public.zoneSummaries[existing.zoneKey]!.topPublicCardID =
          fromCards[fromCards.length - 1];
      } else {
        delete state.public.zoneSummaries[existing.zoneKey]!.topPublicCardID;
      }
      state.public.zoneSummaries[existing.zoneKey]!.revision++;
    }
  }

  delete state.private.cardIndex[cardId];
  return true;
}

// ── Zone Config Helpers ──────────────────────────────────────────────────────

/**
 * Asserts that a zone config exists for the given zone id.
 */
export function assertZoneConfigured<TZoneId extends string>(
  configs: Record<string, ZoneConfig<TZoneId>>,
  zoneId: string,
): ZoneConfig<TZoneId> {
  const config = configs[zoneId];
  if (!config) {
    throw new Error(`Unknown zone config: ${zoneId}`);
  }
  return config;
}

/**
 * Returns the visibility for a zone reference by looking up its config.
 */
export function getZoneVisibility<TZoneId extends string>(
  configs: Record<string, ZoneConfig<TZoneId>>,
  ref: ZoneRef<TZoneId>,
): ZoneVisibility {
  const config = assertZoneConfigured(configs, ref.zone);
  return config.visibility;
}

// ── Zone State View Helpers ──────────────────────────────────────────────────

/**
 * Strips private zone state for a specific viewer.
 *
 * - Public zones keep full card lists.
 * - Secret zones are reduced to counts only.
 * - Private zones are reduced to counts for non-owners.
 */
export function stripZoneStateForViewer<TCardId extends string>(
  state: ZoneRuntimeState<TCardId>,
  viewerId: string,
  configs: Record<string, ZoneConfig>,
): ZoneRuntimeState<TCardId>["public"] & {
  visibleCards: Record<string, TCardId[]>;
} {
  const visibleCards: Record<string, TCardId[]> = {};

  for (const [key, cards] of Object.entries(state.private.zoneCards)) {
    const ref = parseZoneKey(key);
    const config = configs[ref.zone];
    if (!config) continue;

    if (config.visibility === "public") {
      visibleCards[key] = [...cards];
    } else if (config.visibility === "private" && ref.playerId === viewerId) {
      visibleCards[key] = [...cards];
    } else {
      // secret or opponent private — hide contents
      visibleCards[key] = [];
    }
  }

  return {
    zoneSummaries: { ...state.public.zoneSummaries },
    visibleCards,
  };
}

// ── Summary Helpers ──────────────────────────────────────────────────────────

/**
 * Ensures a summary entry exists for a zone key.
 */
export function ensureSummary<TCardId extends string>(
  zones: ZoneRuntimeState<TCardId>,
  key: string,
): { revision: number; count: number; topPublicCardID?: TCardId } {
  let summary = zones.public.zoneSummaries[key];
  if (!summary) {
    summary = { revision: 0, count: 0 };
    zones.public.zoneSummaries[key] = summary;
  }
  return summary;
}

/**
 * Updates the public zone summary after a mutation.
 * Increments revision, sets count, and updates topPublicCardID for public zones.
 */
export function syncSummary<TCardId extends string>(
  zones: ZoneRuntimeState<TCardId>,
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

  if (!config) {
    summary.topPublicCardID = undefined;
    return;
  }

  if (config.visibility === "public" && cards.length > 0) {
    summary.topPublicCardID = cards[cards.length - 1];
  } else {
    summary.topPublicCardID = undefined;
  }
}

// ── Card Index Helpers ───────────────────────────────────────────────────────

/**
 * Removes a card from its current zone and updates the card index.
 * Returns the old zone key, or undefined if the card wasn't indexed.
 *
 * Note: This intentionally leaves the cardIndex entry intact (zoneKey/index
 * remain stale) because it's designed as a move helper — the caller should
 * immediately re-add the card via `addCardToZone`. For permanent removal,
 * use `removeCardFromState` instead.
 */
export function removeCardFromCurrentZone<TCardId extends string>(
  zones: ZoneRuntimeState<TCardId>,
  cardId: TCardId,
): string | undefined {
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
 * Adds a card to a zone at the given index (defaults to end / "top").
 */
export function addCardToZone<TCardId extends string>(
  zones: ZoneRuntimeState<TCardId>,
  cardId: TCardId,
  zoneKey: string,
  insertIndex?: number,
): void {
  const cards = zones.private.zoneCards[zoneKey] ?? [];
  zones.private.zoneCards[zoneKey] = cards;

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

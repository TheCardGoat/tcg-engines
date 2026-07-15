/**
 * Card Runtime — Card query and mutation APIs.
 * Works on zone state and card maps to provide RuntimeCard access.
 */

import type { Card } from "@tcg/gundam-types";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { BaseCardMeta, CardsMaps, RuntimeCard } from "../types/base-card.ts";
import type { ZoneConfig, ZoneRuntimeState } from "../types/zone-types.ts";
import type { CardReadAPI, CardRuntimeAPI } from "../types/move-types.ts";

// ── Derive function type ────────────────────────────────────────────────────

export type DeriveRuntimeCardFn = (
  instanceId: CardInstanceId,
  definitionId: string,
  meta: BaseCardMeta,
  definition: Card,
  ownerId: PlayerId,
  controllerId: PlayerId,
  zoneId: string,
) => RuntimeCard;

// ── Read API ────────────────────────────────────────────────────────────────

/**
 * Creates a read-only card API for querying card data.
 *
 * @param zones - The zone runtime state (read-only access)
 * @param cardMaps - Card instance and definition maps
 * @param zoneConfigs - Zone configurations (unused here but kept for API symmetry)
 * @param deriveRuntimeCard - Function to build a full RuntimeCard from raw data
 */
export function createCardReadAPI(
  zones: ZoneRuntimeState,
  cardMaps: CardsMaps,
  _zoneConfigs: Record<string, ZoneConfig>,
  deriveRuntimeCard: DeriveRuntimeCardFn,
): CardReadAPI {
  function get(cardId: string): RuntimeCard | undefined {
    const indexEntry = zones.private.cardIndex[cardId];
    if (!indexEntry) return undefined;

    const instanceData = cardMaps.instances.get(cardId);
    if (!instanceData) return undefined;

    const definition = cardMaps.definitions.get(instanceData.definitionId);
    if (!definition) return undefined;

    const meta = zones.private.cardMeta[cardId] ?? {};

    return deriveRuntimeCard(
      cardId as CardInstanceId,
      instanceData.definitionId,
      meta,
      definition,
      indexEntry.ownerID,
      indexEntry.controllerID,
      indexEntry.zoneKey,
    );
  }

  function getByIdentifier(id: string): RuntimeCard | undefined {
    // Search through all card instances for one matching the definition ID
    for (const entry of cardMaps.instances.entries()) {
      if (entry.definitionId === id) {
        return get(entry.instanceId);
      }
    }
    return undefined;
  }

  function getDefinition(cardId: string): Card | undefined {
    const instanceData = cardMaps.instances.get(cardId);
    if (!instanceData) return undefined;
    return cardMaps.definitions.get(instanceData.definitionId);
  }

  function getMeta(cardId: string): BaseCardMeta | undefined {
    return zones.private.cardMeta[cardId];
  }

  function getZone(cardId: string): string | undefined {
    const entry = zones.private.cardIndex[cardId];
    return entry?.zoneKey;
  }

  function getOwner(cardId: string): PlayerId | undefined {
    const entry = zones.private.cardIndex[cardId];
    return entry?.ownerID;
  }

  function getController(cardId: string): PlayerId | undefined {
    const entry = zones.private.cardIndex[cardId];
    return entry?.controllerID;
  }

  return {
    get,
    getByIdentifier,
    getDefinition,
    getMeta,
    getZone,
    getOwner,
    getController,
  };
}

// ── Runtime API (read + write) ──────────────────────────────────────────────

/**
 * Creates a full card runtime API with both read and mutation capabilities.
 *
 * @param zones - The mutable zone runtime state
 * @param cardMaps - Card instance and definition maps
 * @param zoneConfigs - Zone configurations
 * @param deriveRuntimeCard - Function to build a full RuntimeCard from raw data
 */
export function createCardRuntimeAPI(
  zones: ZoneRuntimeState,
  cardMaps: CardsMaps,
  zoneConfigs: Record<string, ZoneConfig>,
  deriveRuntimeCard: DeriveRuntimeCardFn,
): CardRuntimeAPI {
  const readAPI = createCardReadAPI(zones, cardMaps, zoneConfigs, deriveRuntimeCard);

  function setMeta(cardId: string, meta: BaseCardMeta): void {
    if (!zones.private.cardIndex[cardId]) {
      throw new Error(`Card ${cardId} not found in card index`);
    }
    zones.private.cardMeta[cardId] = meta;
  }

  function patchMeta(cardId: string, patch: Partial<BaseCardMeta>): BaseCardMeta {
    if (!zones.private.cardIndex[cardId]) {
      throw new Error(`Card ${cardId} not found in card index`);
    }
    const existing = zones.private.cardMeta[cardId] ?? {};
    const merged = { ...existing, ...patch };
    zones.private.cardMeta[cardId] = merged;
    return merged;
  }

  function clearMeta(cardId: string): void {
    if (!zones.private.cardIndex[cardId]) {
      throw new Error(`Card ${cardId} not found in card index`);
    }
    zones.private.cardMeta[cardId] = {};
  }

  function registerDefinition(instanceId: string, definition: Card, ownerId: PlayerId): void {
    cardMaps.instances.register(instanceId, { definitionId: instanceId, ownerID: ownerId });
    cardMaps.definitions.set(instanceId, definition);
    zones.private.cardIndex[instanceId] = {
      ownerID: ownerId,
      controllerID: ownerId,
      zoneKey: "",
      index: -1,
    };
  }

  function deregisterDefinition(instanceId: string): void {
    const instanceData = cardMaps.instances.get(instanceId);
    if (instanceData) {
      cardMaps.definitions.delete(instanceData.definitionId);
    }
    cardMaps.instances.delete(instanceId);
    delete zones.private.cardMeta[instanceId];
  }

  return {
    ...readAPI,
    setMeta,
    patchMeta,
    clearMeta,
    registerDefinition,
    deregisterDefinition,
  };
}

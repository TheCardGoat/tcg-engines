import type { ZoneDefinitions } from "./match-runtime.types";
import type { ZoneCardIndexEntry, ZoneRuntimeDef } from "./types";

export type ZoneRegistry = Record<string, ZoneRuntimeDef>;

type ZoneCardIndexLookup = Record<
  string,
  Pick<ZoneCardIndexEntry, "ownerID" | "controllerID"> | undefined
>;

type ZoneRefLike = { zone: string; playerId?: string };

export function buildZoneRegistry(
  zones: ZoneDefinitions,
  playerIds: readonly string[],
): ZoneRegistry {
  const zoneRegistry: ZoneRegistry = {};

  for (const [zoneId, zoneDef] of Object.entries(zones)) {
    zoneRegistry[zoneId] = { ...zoneDef };

    if (!zoneDef.ownerScoped) {
      continue;
    }

    for (const playerId of playerIds) {
      zoneRegistry[`${zoneId}:${playerId}`] = {
        ...zoneDef,
        id: `${zoneId}:${playerId}`,
      };
    }
  }

  return zoneRegistry;
}

export function initializeZoneStateFromRegistry(
  zoneSummaries: Record<string, unknown>,
  zoneCards: Record<string, unknown>,
  zoneRegistry: ZoneRegistry,
): void {
  for (const zoneId of Object.keys(zoneRegistry)) {
    zoneSummaries[zoneId] = { revision: 0, count: 0 };
    zoneCards[zoneId] = [];
  }
}

export function resolveZoneIdFromRegistry(
  zone: ZoneRefLike,
  zoneRegistry: ZoneRegistry,
  cardIndex: ZoneCardIndexLookup,
): string {
  const zoneId = zone.zone;

  if (zoneId.includes(":")) {
    if (zone.playerId && !zoneId.endsWith(`:${zone.playerId}`)) {
      throw new Error(`Zone player mismatch for ${zoneId}`);
    }
    if (!zoneRegistry[zoneId]) {
      throw new Error(`Unknown zone: ${zoneId}`);
    }
    return zoneId;
  }

  if (zone.playerId) {
    const scopedZoneId = `${zoneId}:${zone.playerId}`;
    if (zoneRegistry[scopedZoneId]) {
      return scopedZoneId;
    }
  }

  const unscopedDef = zoneRegistry[zoneId];
  if (!unscopedDef) {
    throw new Error(`Unknown zone: ${zoneId}`);
  }

  if (unscopedDef.ownerScoped) {
    const playerId = zone.playerId;
    if (!playerId) {
      throw new Error(`Owner-scoped zone requires player id: ${zoneId}`);
    }

    const hasPlayerCards = Object.values(cardIndex).some(
      (entry) => entry?.ownerID === playerId || entry?.controllerID === playerId,
    );
    if (!hasPlayerCards) {
      throw new Error(`Unknown zone: ${zoneId}`);
    }
  }

  return zoneId;
}

export function zoneOwnerFromKey(zoneKey: string): string | undefined {
  const parts = zoneKey.split(":");
  return parts.length > 1 ? parts[parts.length - 1] : undefined;
}

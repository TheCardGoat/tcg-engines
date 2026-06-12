import { createPlayerId, type PlayerId } from "#core";

type PlayerIdSource = {
  playerIds?: readonly PlayerId[] | null;
  _zonesPrivate?: {
    zoneCards?: Record<string, unknown>;
    cardIndex?: Record<string, { ownerID?: string }>;
  };
  /** @deprecated Use _zonesPrivate instead */
  ctx?: {
    zones?: {
      private?: {
        zoneCards?: Record<string, unknown>;
        cardIndex?: Record<string, { ownerID?: string }>;
      };
    };
  };
};

export function resolveRuntimePlayerIds(source: PlayerIdSource): PlayerId[] {
  if (Array.isArray(source.playerIds) && source.playerIds.length > 0) {
    return [...source.playerIds];
  }

  const playerIds: PlayerId[] = [];
  const seen = new Set<string>();
  const zoneCards = source._zonesPrivate?.zoneCards ?? source.ctx?.zones?.private?.zoneCards ?? {};

  for (const zoneId of Object.keys(zoneCards)) {
    const separatorIndex = zoneId.indexOf(":");
    if (separatorIndex <= 0 || separatorIndex >= zoneId.length - 1) {
      continue;
    }

    const playerId = zoneId.slice(separatorIndex + 1);
    if (!playerId || seen.has(playerId)) {
      continue;
    }

    seen.add(playerId);
    playerIds.push(createPlayerId(playerId));
  }

  if (playerIds.length > 0) {
    return playerIds;
  }

  const cardIndex = source._zonesPrivate?.cardIndex ?? source.ctx?.zones?.private?.cardIndex ?? {};
  for (const cardState of Object.values(cardIndex)) {
    const playerId = cardState?.ownerID;
    if (!playerId || seen.has(playerId)) {
      continue;
    }

    seen.add(playerId);
    playerIds.push(createPlayerId(playerId));
  }

  return playerIds;
}

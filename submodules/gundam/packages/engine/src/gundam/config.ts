/**
 * Gundam TCG — Runtime setup helpers
 *
 * These are used directly by MatchRuntime (hardcoded for Gundam).
 */

import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { Card } from "@tcg/gundam-types";
import type { BaseCardMeta, RuntimeCard } from "../types/base-card.ts";
import type { GundamG } from "./types.ts";

// =============================================================================
// Initial State Factory
// =============================================================================

export function createInitialGundamG(playerIds: string[]): GundamG {
  const players: GundamG["players"] = {};
  for (const id of playerIds) {
    players[id] = {};
  }

  return {
    players,
    damage: {},
    exhausted: {},
    pilotAssignments: {},
    turnMetadata: {
      attackedThisTurn: [],
      deployedThisTurn: [],
    },
    pendingEffects: [],
    continuousEffects: [],
    resolvedThisTurn: [],
    eventCounters: {},
  };
}

// =============================================================================
// Runtime Card Derivation
// =============================================================================

export function deriveGundamRuntimeCard(
  instanceId: CardInstanceId,
  definitionId: string,
  meta: BaseCardMeta,
  definition: Card,
  ownerId: PlayerId,
  controllerId: PlayerId,
  zoneId: string,
): RuntimeCard {
  return {
    instanceId,
    definitionId,
    ownerId,
    controllerId,
    zoneId,
    meta,
    definition,
  };
}

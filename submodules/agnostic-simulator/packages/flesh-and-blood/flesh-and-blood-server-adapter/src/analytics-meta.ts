import type {
  FabGameAnalyticsV2,
  FabHandActionKindV2,
  FabAnalyticsZoneV2,
  FabAnalyticsDefenseOriginV2,
} from "./analytics-v2.ts";

export const FAB_GAMEPLAY_META_PROJECTION_VERSION = 1 as const;

export interface FabGameplayMetaAction {
  readonly kind: FabHandActionKindV2;
  readonly canonicalCardId: string;
  readonly origin: FabAnalyticsZoneV2 | FabAnalyticsDefenseOriginV2 | null;
  readonly destination: FabAnalyticsZoneV2 | null;
}

export type FabGameplayMetaLine =
  | {
      readonly kind: "hand";
      readonly ordinal: number;
      readonly startingCanonicalCardIds: readonly string[];
      readonly carriedCanonicalCardIds: readonly string[];
      readonly endingCanonicalCardIds: readonly string[];
      readonly actions: readonly FabGameplayMetaAction[];
    }
  | {
      readonly kind: "turn";
      readonly ordinal: number;
      readonly actions: readonly FabGameplayMetaAction[];
    };

export interface FabGameplayMetaPlayer {
  readonly playerId: string;
  readonly seat: 1 | 2;
  readonly heroCanonicalId: string;
  readonly won: boolean;
  readonly lines: readonly FabGameplayMetaLine[];
  readonly excludedLines: number;
  readonly unresolvedActions: number;
}

export interface FabGameplayMetaProjection {
  readonly projectionVersion: typeof FAB_GAMEPLAY_META_PROJECTION_VERSION;
  readonly gameId: string;
  readonly players: readonly FabGameplayMetaPlayer[];
}

/**
 * Remove instance and printing identity before platform-wide aggregation.
 * A line containing any unresolved card is excluded instead of being grouped
 * under a locale, printing, display name, or runtime instance id.
 */
export function projectFabGameplayMeta(
  analytics: FabGameAnalyticsV2,
): FabGameplayMetaProjection | null {
  if (analytics.quality !== "authoritative") return null;

  const players = Object.entries(analytics.players).flatMap(([playerId, player]) => {
    if (!player.heroCanonicalId) return [];
    let excludedLines = 0;
    let unresolvedActions = 0;
    const normalizeActions = (
      actions: FabGameAnalyticsV2["turns"][number]["players"][string]["actions"],
    ): readonly FabGameplayMetaAction[] | null => {
      const normalized: FabGameplayMetaAction[] = [];
      for (const action of actions) {
        if (!action.card.canonicalId) {
          unresolvedActions += 1;
          continue;
        }
        normalized.push({
          kind: action.kind,
          canonicalCardId: action.card.canonicalId,
          origin: action.origin,
          destination: action.destination,
        });
      }
      if (normalized.length !== actions.length) {
        excludedLines += 1;
        return null;
      }
      return normalized;
    };

    const handLines = player.handCycles.flatMap((hand) => {
      const groups = [hand.startingCards, hand.carriedCards, hand.endingCards];
      if (groups.some((cards) => cards.some((card) => !card.canonicalId))) {
        unresolvedActions += groups.flat().filter((card) => !card.canonicalId).length;
        excludedLines += 1;
        return [];
      }
      const canonicalIds = groups.map((cards) =>
        cards.flatMap((card) => (card.canonicalId ? [card.canonicalId] : [])),
      );
      const actions = normalizeActions(hand.actions);
      if (!actions) return [];
      return [
        {
          kind: "hand" as const,
          ordinal: hand.cycle,
          startingCanonicalCardIds: canonicalIds[0] ?? [],
          carriedCanonicalCardIds: canonicalIds[1] ?? [],
          endingCanonicalCardIds: canonicalIds[2] ?? [],
          actions,
        },
      ];
    });
    const turnLines = analytics.turns.flatMap((turn) => {
      const actions = normalizeActions(turn.players[playerId]?.actions ?? []);
      return actions ? [{ kind: "turn" as const, ordinal: turn.turn, actions }] : [];
    });
    return [
      {
        playerId,
        seat: player.seat,
        heroCanonicalId: player.heroCanonicalId,
        won: analytics.winnerId === playerId,
        lines: [...handLines, ...turnLines],
        excludedLines,
        unresolvedActions,
      },
    ];
  });

  return {
    projectionVersion: FAB_GAMEPLAY_META_PROJECTION_VERSION,
    gameId: analytics.gameId,
    players,
  };
}

/** Deterministic JSON key for database grouping; the payload contains canonical ids only. */
export function fabGameplayMetaLineKey(line: FabGameplayMetaLine): string {
  return line.kind === "hand"
    ? JSON.stringify({
        kind: line.kind,
        startingCanonicalCardIds: [...line.startingCanonicalCardIds].sort(),
        carriedCanonicalCardIds: [...line.carriedCanonicalCardIds].sort(),
        actions: line.actions,
        endingCanonicalCardIds: [...line.endingCanonicalCardIds].sort(),
      })
    : JSON.stringify({ kind: line.kind, actions: line.actions });
}

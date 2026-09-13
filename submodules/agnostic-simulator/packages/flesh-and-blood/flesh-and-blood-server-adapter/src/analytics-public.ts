import type {
  FabAnalyticsPlayerSummaryV2,
  FabAnalyticsTurnPlayerSummaryV2,
  FabPersistedGameAnalyticsV2,
} from "./analytics-v2.ts";

export const FAB_PUBLIC_POST_GAME_SCHEMA = "PublicPostGameStatsV1" as const;
export const FAB_PUBLIC_POST_GAME_SCHEMA_VERSION = 1 as const;

export type PublicPostGameSeatV1 = 1 | 2;

export interface PublicPostGameCardV1 {
  readonly canonicalId: string | null;
  readonly name: string;
  readonly played: number;
  readonly pitched: number;
  readonly defended: number;
  readonly hits: number;
}

export interface PublicPostGameTotalsV1 {
  readonly cardsPlayed: number;
  readonly cardsPitched: number;
  readonly cardsDefended: number;
  readonly resourcesGenerated: number;
  readonly resourcesSpent: number;
  readonly attackDamageDealt: number;
  readonly totalDamageDealt: number;
  readonly damagePrevented: number;
  readonly defenseCommitted: number;
  readonly effectiveDefense: number;
  readonly attacks: number;
  readonly hits: number;
}

export interface PublicPostGameParticipantV1 {
  readonly seat: PublicPostGameSeatV1;
  readonly displayName: string | null;
  readonly username: string | null;
  readonly heroName: string;
  readonly heroCanonicalId: string | null;
  readonly initialLife: number;
  readonly finalLife: number;
  readonly totals: PublicPostGameTotalsV1;
  readonly publicCards: readonly PublicPostGameCardV1[];
}

export interface PublicPostGameTurnPlayerV1 extends PublicPostGameTotalsV1 {
  readonly seat: PublicPostGameSeatV1;
}

export interface PublicPostGameTurnV1 {
  readonly turn: number;
  readonly activeSeat: PublicPostGameSeatV1 | null;
  readonly completed: boolean;
  readonly players: readonly [PublicPostGameTurnPlayerV1, PublicPostGameTurnPlayerV1];
  readonly lifeAfter: readonly [number, number];
}

export interface PublicPostGameStatsV1 {
  readonly schema: typeof FAB_PUBLIC_POST_GAME_SCHEMA;
  readonly schemaVersion: typeof FAB_PUBLIC_POST_GAME_SCHEMA_VERSION;
  readonly gameSlug: "flesh-and-blood";
  readonly gameId: string;
  readonly matchId: string;
  readonly dimensions: FabPersistedGameAnalyticsV2["dimensions"];
  readonly summary: {
    readonly winnerSeat: PublicPostGameSeatV1 | null;
    readonly endReason: string | null;
    readonly totalTurns: number;
    readonly durationMs: number;
    readonly onThePlaySeat: PublicPostGameSeatV1 | null;
  };
  readonly participants: readonly [PublicPostGameParticipantV1, PublicPostGameParticipantV1];
  readonly turns: readonly PublicPostGameTurnV1[];
}

function publicIdentity(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  if (!normalized || normalized.includes("@")) return null;
  return normalized;
}

export function isPublicPostGameStatsV1(value: unknown): value is PublicPostGameStatsV1 {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    (value as { schema?: unknown }).schema === FAB_PUBLIC_POST_GAME_SCHEMA &&
    (value as { schemaVersion?: unknown }).schemaVersion === FAB_PUBLIC_POST_GAME_SCHEMA_VERSION
  );
}

/**
 * Spectator-safe FAB post-game stats.
 *
 * Includes cards that became public by being played, pitched, or used to
 * defend. Does not copy opening/ending hands, drawn-card identities, private
 * zone transitions, runtime instance IDs, or internal player IDs.
 */
export function projectPublicPostGameStatsV1(
  analytics: FabPersistedGameAnalyticsV2,
  options: { readonly onThePlaySeat?: PublicPostGameSeatV1 | null } = {},
): PublicPostGameStatsV1 {
  const seatByPlayerId = new Map<string, PublicPostGameSeatV1>();
  for (const participant of analytics.participants) {
    seatByPlayerId.set(participant.playerId, participant.seat);
  }
  for (const player of Object.values(analytics.game.players)) {
    if (!seatByPlayerId.has(player.playerId) && (player.seat === 1 || player.seat === 2)) {
      seatByPlayerId.set(player.playerId, player.seat);
    }
  }

  const playerBySeat = {
    1: playerForSeat(analytics, 1),
    2: playerForSeat(analytics, 2),
  } as const;

  return {
    schema: FAB_PUBLIC_POST_GAME_SCHEMA,
    schemaVersion: FAB_PUBLIC_POST_GAME_SCHEMA_VERSION,
    gameSlug: "flesh-and-blood",
    gameId: analytics.gameId,
    matchId: analytics.matchId,
    dimensions: analytics.dimensions,
    summary: {
      winnerSeat: seatByPlayerId.get(analytics.summary.winnerId ?? "") ?? null,
      endReason: analytics.summary.endReason,
      totalTurns: analytics.summary.totalTurns,
      durationMs: analytics.summary.durationMs,
      onThePlaySeat: options.onThePlaySeat ?? null,
    },
    participants: [
      projectParticipant(analytics.participants[0], playerBySeat[1]),
      projectParticipant(analytics.participants[1], playerBySeat[2]),
    ],
    turns: analytics.game.turns.map((turn) => {
      const playerOne =
        turn.players[playerBySeat[1]?.playerId ?? ""] ?? emptyTurnPlayer("missing-1");
      const playerTwo =
        turn.players[playerBySeat[2]?.playerId ?? ""] ?? emptyTurnPlayer("missing-2");
      return {
        turn: turn.turn,
        activeSeat: seatByPlayerId.get(turn.activePlayerId) ?? null,
        completed: turn.completed,
        players: [projectTurnPlayer(1, playerOne), projectTurnPlayer(2, playerTwo)],
        lifeAfter: [
          lifeAfterForSeat(turn.lifeAfter, playerBySeat[1]?.playerId),
          lifeAfterForSeat(turn.lifeAfter, playerBySeat[2]?.playerId),
        ],
      };
    }),
  };
}

function playerForSeat(
  analytics: FabPersistedGameAnalyticsV2,
  seat: PublicPostGameSeatV1,
): FabAnalyticsPlayerSummaryV2 | undefined {
  const participant = analytics.participants[seat - 1];
  return (
    Object.values(analytics.game.players).find((player) => player.seat === seat) ??
    analytics.game.players[participant.playerId]
  );
}

function projectParticipant(
  identity: FabPersistedGameAnalyticsV2["participants"][number],
  player: FabAnalyticsPlayerSummaryV2 | undefined,
): PublicPostGameParticipantV1 {
  return {
    seat: identity.seat,
    displayName: publicIdentity(identity.displayName),
    username: publicIdentity(identity.username),
    heroName: player?.heroName ?? "Unknown hero",
    heroCanonicalId: player?.heroCanonicalId ?? null,
    initialLife: player?.initialLife ?? 0,
    finalLife: player?.finalLife ?? 0,
    totals: totalsFromPlayer(player),
    publicCards: (player?.cards ?? [])
      .filter((card) => card.played > 0 || card.pitched > 0 || card.defended > 0 || card.hits > 0)
      .map((card) => ({
        canonicalId: card.canonicalId,
        name: card.name,
        played: card.played,
        pitched: card.pitched,
        defended: card.defended,
        hits: card.hits,
      })),
  };
}

function projectTurnPlayer(
  seat: PublicPostGameSeatV1,
  player: FabAnalyticsTurnPlayerSummaryV2,
): PublicPostGameTurnPlayerV1 {
  return { seat, ...totalsFromPlayer(player) };
}

function totalsFromPlayer(
  player: FabAnalyticsTurnPlayerSummaryV2 | FabAnalyticsPlayerSummaryV2 | undefined,
): PublicPostGameTotalsV1 {
  return {
    cardsPlayed: player?.cardsPlayed ?? 0,
    cardsPitched: player?.cardsPitched ?? 0,
    cardsDefended: player?.cardsDefended ?? 0,
    resourcesGenerated: player?.resourcesGenerated ?? 0,
    resourcesSpent: player?.resourcesSpent ?? 0,
    attackDamageDealt: player?.attackDamageDealt ?? 0,
    totalDamageDealt: player?.totalDamageDealt ?? 0,
    damagePrevented: player?.damagePrevented ?? 0,
    defenseCommitted: player?.defenseCommitted ?? 0,
    effectiveDefense: player?.effectiveDefense ?? 0,
    attacks: player?.attacks ?? 0,
    hits: player?.hits ?? 0,
  };
}

function lifeAfterForSeat(
  lifeAfter: Readonly<Record<string, number>>,
  playerId: string | undefined,
): number {
  if (!playerId) return 0;
  return lifeAfter[playerId] ?? 0;
}

function emptyTurnPlayer(playerId: string): FabAnalyticsTurnPlayerSummaryV2 {
  return {
    playerId,
    cardsPlayed: 0,
    cardsPitched: 0,
    cardsDefended: 0,
    resourcesGenerated: 0,
    resourcesSpent: 0,
    attackPowerThreatened: 0,
    attackDamageDealt: 0,
    totalDamageDealt: 0,
    damagePrevented: 0,
    defenseCommitted: 0,
    effectiveDefense: 0,
    overblock: 0,
    attacks: 0,
    hits: 0,
    cardPlaysByOrigin: { hand: 0, arsenal: 0, banished: 0, deck: 0, graveyard: 0 },
    actions: [],
  };
}

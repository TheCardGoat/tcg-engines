import { P1, P2 } from "@tcg/cyberpunk-engine";
import { isVisibleSupporterTier } from "@tcg/shared/supporter-display";

/**
 * Local-side: from this player's perspective. The simulator currently shows
 * both halves of the board on one screen (hot-seat style); we treat P1 as the
 * "local" player and P2 as the opponent for prompt-routing purposes.
 */
export type Side = "player" | "opponent";

export const PLAYER_SIDE_TO_ID: Record<Side, typeof P1> = {
  player: P1,
  opponent: P2,
};

export interface PlayerIdentityInfo {
  id: string;
  displayName: string;
  subscriptionTier?: string;
  isMobile?: boolean;
  mmrAtMatch?: number;
  /** Catalog id snapshotted onto the match participant. */
  playmatId?: string;
  /** Non-Legend card back snapshotted onto the match participant. */
  cardBackId?: string;
}

export type PlayerIdentityBySide = Partial<Record<Side, PlayerIdentityInfo>>;

/** Seated players map by actor id. Spectators have no actor ids, so seats 1 and 2 paint both playmats. */
export function playerIdentitiesByActorOrSeat<T extends PlayerIdentityInfo & { seat?: number }>(
  participants: readonly T[],
  actorIds: { player: string; opponent: string } | undefined,
): PlayerIdentityBySide | undefined {
  if (participants.length === 0) return undefined;
  if (!actorIds) {
    const bySeat = new Map(participants.map((participant) => [participant.seat, participant]));
    const player = bySeat.get(1);
    const opponent = bySeat.get(2);
    if (!player && !opponent) return undefined;
    return { player, opponent };
  }
  const byId = new Map(participants.map((participant) => [participant.id, participant]));
  return {
    player: byId.get(actorIds.player),
    opponent: byId.get(actorIds.opponent),
  };
}

export type PlayerConnectionStatus = "connected" | "reconnecting" | "disconnected";

export interface PlayerConnectionInfo {
  status?: PlayerConnectionStatus;
  connected?: boolean;
  disconnectedAt?: string;
  lastPingAt?: number;
  latencyMs?: number;
  disconnectCount?: number;
}

export type PlayerConnectionBySide = Partial<Record<Side, PlayerConnectionInfo>>;

export function formatPlayerIdentityMeta(info: PlayerIdentityInfo | undefined): string {
  return typeof info?.mmrAtMatch === "number" ? `${Math.round(info.mmrAtMatch)} MMR` : "";
}

export function isVisibleSubscriptionTier(tier: string | undefined): tier is string {
  return isVisibleSupporterTier(tier);
}

const SIDE_FLIP: Record<Side, Side> = { player: "opponent", opponent: "player" };

/** Convenience: the side opposite the given side. */
export function otherSide(side: Side): Side {
  return SIDE_FLIP[side];
}

import { P1, P2 } from "@tcg/cyberpunk-engine";
import { getSupporterDisplayConfig, isVisibleSupporterTier } from "@tcg/shared/supporter-display";

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
}

export type PlayerIdentityBySide = Partial<Record<Side, PlayerIdentityInfo>>;

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
  if (!info) {
    return "";
  }
  const parts: string[] = [];
  const tier = info.subscriptionTier;
  if (isVisibleSubscriptionTier(tier)) {
    parts.push(formatSubscriptionTier(tier));
  }
  if (typeof info.isMobile === "boolean") {
    parts.push(info.isMobile ? "Mobile" : "Desktop");
  }
  if (typeof info.mmrAtMatch === "number") {
    parts.push(`${Math.round(info.mmrAtMatch)} MMR`);
  }
  return parts.join(" · ");
}

export function isVisibleSubscriptionTier(tier: string | undefined): tier is string {
  return isVisibleSupporterTier(tier);
}

function formatSubscriptionTier(tier: string): string {
  const supporter = getSupporterDisplayConfig(tier);
  if (supporter) return supporter.label;

  return tier
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const SIDE_FLIP: Record<Side, Side> = { player: "opponent", opponent: "player" };

/** Convenience: the side opposite the given side. */
export function otherSide(side: Side): Side {
  return SIDE_FLIP[side];
}

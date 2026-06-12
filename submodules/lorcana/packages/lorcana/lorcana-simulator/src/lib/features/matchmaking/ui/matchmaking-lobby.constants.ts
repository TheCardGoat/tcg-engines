import type {
  QueueStatsFormat,
  QueueStatsMode,
  QueueStatsPartition,
} from "../api/queue-stats-api.js";

export const EYEBROW_CLASS =
  "text-muted-foreground text-xs font-semibold uppercase tracking-[0.24em]";
export const SURFACE_CARD_CLASS =
  "border-white/10 bg-slate-950/72 shadow-[0_24px_48px_-32px_rgba(15,23,42,0.92)] backdrop-blur-sm gap-2";
export const LANE_CLASS =
  "overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))] shadow-[0_32px_80px_-52px_rgba(2,6,23,0.95)]";
export const LANE_SCROLL_CLASS =
  "space-y-4 px-4 py-5 sm:px-5 xl:h-full xl:overflow-y-auto [scrollbar-color:rgba(148,163,184,0.5)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25";
export const HERO_NAV_CAPSULE_CLASS =
  "inline-flex max-w-full items-center overflow-x-auto overflow-y-hidden rounded-full border border-white/10 bg-black/50 py-1 shadow-none backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-w-none";
export const HERO_NAV_SEGMENT_BTN =
  "h-11 min-h-11 shrink-0 rounded-none border-0 bg-transparent px-3 text-sm font-semibold text-slate-100 shadow-none hover:bg-white/10 hover:text-white sm:px-4";
export const HERO_NAV_DIVIDER_CLASS = "h-7 w-px shrink-0 self-center bg-white/20";
export const HERO_NAV_MOBILE_TAB_BTN =
  "h-11 min-h-11 shrink-0 rounded-full border border-transparent px-4 text-sm font-semibold text-slate-300 shadow-none transition-colors hover:bg-white/8 hover:text-white";
export const HERO_NAV_MOBILE_TAB_BTN_ACTIVE =
  "border-white/10 bg-white text-slate-950 hover:bg-white hover:text-slate-950";

export const ENGINE_REPO_URL = "https://github.com/theCardGoat/lorcana-engine";
export const LORCANA_ENGINE_DISCLAIMER_URL =
  "https://github.com/TheCardGoat/lorcana-engine/blob/main/DISCLAIMER.md";
export const COMMUNITY_DISCORD_URL = "https://discord.gg/FxxWaJW2rP";
export const DISNEY_LORCANA_OFFICIAL_URL = "https://www.disneylorcana.com";

export type LobbyView = "lobby" | "deck-vault" | "lobby-room";
export type LobbyLane = "live" | "queue" | "sidebar";
export type PlayTab = "find-match" | "lobby" | "practice";

export type QueueCardDefinition = {
  format: QueueStatsFormat;
  labelKey:
    | "sim.matchmaking.matchmaking.formats.infinity"
    | "sim.matchmaking.matchmaking.formats.ccROF";
  accentClass: string;
};

export const QUEUE_CARD_DEFINITIONS: QueueCardDefinition[] = [
  {
    format: "core-constructed",
    labelKey: "sim.matchmaking.matchmaking.formats.ccROF",
    accentClass: "from-amber-300/18 via-amber-300/7 to-transparent",
  },
  {
    format: "infinity",
    labelKey: "sim.matchmaking.matchmaking.formats.infinity",
    accentClass: "from-sky-400/20 via-sky-400/8 to-transparent",
  },
];

/** Number of ranked matches required before a player's MMR is considered established. */
export const PLACEMENT_THRESHOLD = 20;

export const MASTER_MMR_THRESHOLD = 1800;

export type RankBracket =
  | "placement"
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master";

export type RankJourneyView = {
  bracket: RankBracket;
  bracketLabel: string;
  gamesPlayed: number;
  gamesWon: number;
  losses: number;
  mmr: number | null;
  nextBracket: Exclude<RankBracket, "placement" | "iron"> | null;
  nextBracketLabel: string | null;
  nextWinsRequired: number | null;
  winsToNext: number | null;
  mmrToMaster: number | null;
  progressLabel: string;
  progressValue: number;
  progressMax: number;
  progressPercent: number;
  primaryGoal: string;
};

export type QueueCardView = {
  definition: QueueCardDefinition;
  stats: QueueStatsPartition | null;
  isSelected: boolean;
  isActive: boolean;
  isDeckValid: boolean;
  winStreak: number;
  mmr: number | null;
  /** Ranked games played in this format; null = never played ranked here */
  placementGamesPlayed: number | null;
  rankJourney: RankJourneyView | null;
};

export function createQueueJoinLabel(
  format: QueueStatsFormat,
  mode: QueueStatsMode,
  translate: (
    key:
      | QueueCardDefinition["labelKey"]
      | "sim.matchmaking.matchmaking.joinQueue"
      | "sim.matchmaking.matchmaking.tabs.bo1"
      | "sim.matchmaking.matchmaking.tabs.bo3",
  ) => string,
): string {
  const formatKey =
    format === "infinity"
      ? "sim.matchmaking.matchmaking.formats.infinity"
      : "sim.matchmaking.matchmaking.formats.ccROF";
  const modeKey =
    mode === "1" ? "sim.matchmaking.matchmaking.tabs.bo1" : "sim.matchmaking.matchmaking.tabs.bo3";

  return `${translate("sim.matchmaking.matchmaking.joinQueue")} ${translate(formatKey)} - ${translate(modeKey)}`;
}

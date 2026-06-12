import { isAdmin, type AuthUser } from "@tcg/shared/auth";
import { goto } from "$app/navigation";
import { getContext, setContext } from "svelte";
import { authSession } from "$lib/auth/session.svelte.js";
import { fetchPlayerStats } from "@/features/match-history/api/player-stats-api.js";
import type { PlayerStats, PlayerStatsByFormat } from "@/features/match-history/types.js";
import { getGatewayWsUrl } from "$lib/config/public-url-config.js";
import { getFeatureFlags } from "$lib/config/feature-flags.js";
import { analyticsErrorFields, trackEvent } from "$lib/analytics/analytics.js";
import { m } from "$lib/i18n/messages.js";
import { initSoundService, playSound } from "@/features/simulator/animations/sound-service.js";
import { PlayerSettingsStore } from "@/features/settings/player-settings-store.svelte.js";
import { GatewayClientStore } from "@/features/gateway/gateway-client.svelte.js";
import { fetchGatewayTicket, type GatewayTicketResult } from "@/features/gateway/fetch-ticket.js";
import {
  AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  getSafeAutomatedActionStrategyOption,
} from "@tcg/lorcana-engine/automation"; // DO NOT IMPORT FROM "@tcg/lorcana-engine" it brings all the cards
import { MatchmakingPlayerContextState } from "@/features/matchmaking/state/player-context.svelte.js";
import {
  fetchDeckListSnapshotByDeckListId,
  importDeckForProfile,
  importLegacyDecksForProfile,
  type MatchmakingContext,
  type ProfileDeckSummary,
  type ProfileMatchmakingContext,
} from "@/features/matchmaking/api/player-context-api.js";
import { LiveMatchesStore } from "@/features/matchmaking/state/live-matches.svelte.js";
import type { LiveMatchListResponse } from "@/features/matchmaking/api/live-matches-api.js";
import {
  fetchMatchmakingDashboard,
  type MatchmakingDashboardResponse,
} from "@/features/matchmaking/api/matchmaking-dashboard-api.js";
import { MatchmakingQueueStore } from "@/features/matchmaking/state/matchmaking-queue.svelte.js";
import { saveRankedMatchSession } from "@/features/practice-match/practice-match-storage.js";
import {
  LobbyRoomStore,
  type LobbyRoomStatus,
  type LobbyMode,
} from "@/features/matchmaking/state/lobby-room.svelte.js";
import {
  getLobbyRoomStatus,
  type LobbyRoomResponse,
} from "@/features/matchmaking/api/lobby-api.js";
import type { MatchmakingStatusResponse } from "@/features/matchmaking/api/matchmaking-api.js";
import { QueueStatsStore } from "@/features/matchmaking/state/queue-stats.svelte.js";
import type {
  QueueStatsFormat,
  QueueStatsMode,
  QueueStatsResponse,
} from "@/features/matchmaking/api/queue-stats-api.js";
import { colorMaskToInks } from "@/features/deck-vault/color-mask.js";
import type { LeaderboardResponse } from "@/features/matchmaking/api/leaderboard-api.js";
import { updateUserVisualSettings } from "@/features/settings/user-settings-api.js";

import { buildAiQuickPlayUrl } from "../ai-quick-play-url.js";
import { DECK_FIXTURES } from "@/features/simulator-devtools/deck-fixtures/index.js";
import type { HumanVsAiMatchConfig } from "@/features/simulator-devtools/vs-ai/types.js";
import type { MatchmakingStatus } from "../state/matchmaking-queue.svelte.js";
import {
  MASTER_MMR_THRESHOLD,
  PLACEMENT_THRESHOLD,
  QUEUE_CARD_DEFINITIONS,
  createQueueJoinLabel,
  type RankBracket,
  type RankJourneyView,
  type QueueCardView,
} from "./matchmaking-lobby.constants.js";

type MatchmakingGatewayMessage = {
  type: string;
  [key: string]: unknown;
};

type ImportDeckForProfileLike = typeof importDeckForProfile;
type ImportLegacyDecksForProfileLike = typeof importLegacyDecksForProfile;
type FetchDeckListSnapshotByDeckListIdLike = typeof fetchDeckListSnapshotByDeckListId;
type TrackEventLike = typeof trackEvent;
type OpenWindowLike = (url: string, target?: string, features?: string) => Window | null;
type FetchGatewayTicketLike = typeof fetchGatewayTicket;
type AuthSessionLike = typeof authSession;
type GatewayClientStoreCtor = typeof GatewayClientStore;
type PlayerContextCtor = typeof MatchmakingPlayerContextState;
type QueueStoreCtor = typeof MatchmakingQueueStore;
type LiveMatchesStoreCtor = typeof LiveMatchesStore;
type QueueStatsStoreCtor = typeof QueueStatsStore;
type PlayerSettingsStoreCtor = typeof PlayerSettingsStore;
type FetchMatchmakingDashboardLike = typeof fetchMatchmakingDashboard;

const RANK_BRACKET_LABELS: Record<RankBracket, string> = {
  placement: "Placement",
  iron: "Iron",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  diamond: "Diamond",
  master: "Master",
};

const WIN_BRACKET_THRESHOLDS: Array<{
  bracket: Exclude<RankBracket, "placement" | "iron">;
  winsRequired: number;
}> = [
  { bracket: "bronze", winsRequired: 10 },
  { bracket: "silver", winsRequired: 20 },
  { bracket: "gold", winsRequired: 30 },
  { bracket: "platinum", winsRequired: 45 },
  { bracket: "diamond", winsRequired: 60 },
  { bracket: "master", winsRequired: 80 },
];

function normalizeBracket(value: string | null | undefined): RankBracket | null {
  if (
    value === "placement" ||
    value === "iron" ||
    value === "bronze" ||
    value === "silver" ||
    value === "gold" ||
    value === "platinum" ||
    value === "diamond" ||
    value === "master"
  ) {
    return value;
  }
  return null;
}

function bracketFromStats(stats: PlayerStatsByFormat | undefined): RankBracket {
  if (!stats || stats.gamesPlayed < PLACEMENT_THRESHOLD) return "placement";
  const totalWins = stats.gamesWon;
  const mmr = stats.mmr;
  if (totalWins >= 80 && mmr >= MASTER_MMR_THRESHOLD) return "master";
  if (totalWins >= 60) return "diamond";
  if (totalWins >= 45) return "platinum";
  if (totalWins >= 30) return "gold";
  if (totalWins >= 20) return "silver";
  if (totalWins >= 10) return "bronze";
  return "iron";
}

function buildRankJourney(formatStats: PlayerStatsByFormat | undefined): RankJourneyView {
  const gamesPlayed = formatStats?.gamesPlayed ?? 0;
  const gamesWon = formatStats?.gamesWon ?? 0;
  const losses = formatStats?.losses ?? 0;
  const mmr =
    formatStats && gamesPlayed >= PLACEMENT_THRESHOLD ? Math.round(formatStats.mmr) : null;
  const bracket = normalizeBracket(formatStats?.bracket) ?? bracketFromStats(formatStats);

  if (gamesPlayed < PLACEMENT_THRESHOLD) {
    const remaining = Math.max(0, PLACEMENT_THRESHOLD - gamesPlayed);
    return {
      bracket: "placement",
      bracketLabel: RANK_BRACKET_LABELS.placement,
      gamesPlayed,
      gamesWon,
      losses,
      mmr: null,
      nextBracket: null,
      nextBracketLabel: null,
      nextWinsRequired: null,
      winsToNext: null,
      mmrToMaster: null,
      progressLabel: `${gamesPlayed}/${PLACEMENT_THRESHOLD} placement games`,
      progressValue: gamesPlayed,
      progressMax: PLACEMENT_THRESHOLD,
      progressPercent: Math.min(100, (gamesPlayed / PLACEMENT_THRESHOLD) * 100),
      primaryGoal: remaining === 1 ? "1 game to reveal MMR" : `${remaining} games to reveal MMR`,
    };
  }

  const nextWinThreshold = WIN_BRACKET_THRESHOLDS.find((step) => gamesWon < step.winsRequired);
  if (nextWinThreshold) {
    const winsToNext = nextWinThreshold.winsRequired - gamesWon;
    const nextBracketLabel = RANK_BRACKET_LABELS[nextWinThreshold.bracket];
    return {
      bracket,
      bracketLabel: RANK_BRACKET_LABELS[bracket],
      gamesPlayed,
      gamesWon,
      losses,
      mmr,
      nextBracket: nextWinThreshold.bracket,
      nextBracketLabel,
      nextWinsRequired: nextWinThreshold.winsRequired,
      winsToNext,
      mmrToMaster: null,
      progressLabel: `${gamesWon}/${nextWinThreshold.winsRequired} wins to ${nextBracketLabel}`,
      progressValue: gamesWon,
      progressMax: nextWinThreshold.winsRequired,
      progressPercent: Math.min(100, (gamesWon / nextWinThreshold.winsRequired) * 100),
      primaryGoal:
        winsToNext === 1
          ? `1 win to ${nextBracketLabel}`
          : `${winsToNext} wins to ${nextBracketLabel}`,
    };
  }

  const mmrToMaster =
    bracket !== "master" && mmr !== null ? Math.max(0, MASTER_MMR_THRESHOLD - mmr) : null;
  return {
    bracket,
    bracketLabel: RANK_BRACKET_LABELS[bracket],
    gamesPlayed,
    gamesWon,
    losses,
    mmr,
    nextBracket: bracket === "master" ? null : "master",
    nextBracketLabel: bracket === "master" ? null : RANK_BRACKET_LABELS.master,
    nextWinsRequired: bracket === "master" ? null : 80,
    winsToNext: bracket === "master" ? null : 0,
    mmrToMaster,
    progressLabel:
      bracket === "master"
        ? "Master bracket reached"
        : `${MASTER_MMR_THRESHOLD} MMR required for Master`,
    progressValue:
      bracket === "master" ? MASTER_MMR_THRESHOLD : Math.min(mmr ?? 0, MASTER_MMR_THRESHOLD),
    progressMax: MASTER_MMR_THRESHOLD,
    progressPercent:
      bracket === "master" ? 100 : Math.min(100, ((mmr ?? 0) / MASTER_MMR_THRESHOLD) * 100),
    primaryGoal:
      bracket === "master"
        ? "Master reached"
        : mmrToMaster === 1
          ? "1 MMR to Master"
          : `${mmrToMaster ?? MASTER_MMR_THRESHOLD} MMR to Master`,
  };
}

type ControllerDeps = {
  getGatewayWsUrl: typeof getGatewayWsUrl;
  getFeatureFlags: typeof getFeatureFlags;

  importDeckForProfile: ImportDeckForProfileLike;
  importLegacyDecksForProfile: ImportLegacyDecksForProfileLike;
  fetchDeckListSnapshotByDeckListId: FetchDeckListSnapshotByDeckListIdLike;
  trackEvent: TrackEventLike;
  openWindow: OpenWindowLike;
  fetchGatewayTicket: FetchGatewayTicketLike;
  authSession: AuthSessionLike;
  GatewayClientStore: GatewayClientStoreCtor;
  MatchmakingPlayerContextState: PlayerContextCtor;
  MatchmakingQueueStore: QueueStoreCtor;
  LiveMatchesStore: LiveMatchesStoreCtor;
  QueueStatsStore: QueueStatsStoreCtor;
  PlayerSettingsStore: PlayerSettingsStoreCtor;
  fetchMatchmakingDashboard: FetchMatchmakingDashboardLike;
  fetchPlayerStats: typeof fetchPlayerStats;
};

const DEFAULT_DEPS: ControllerDeps = {
  getGatewayWsUrl,
  getFeatureFlags,
  importDeckForProfile,
  importLegacyDecksForProfile,
  fetchDeckListSnapshotByDeckListId,
  trackEvent,
  openWindow: (url, target, features) => globalThis.open(url, target, features),
  fetchGatewayTicket,
  authSession,
  GatewayClientStore,
  MatchmakingPlayerContextState,
  MatchmakingQueueStore,
  LiveMatchesStore,
  QueueStatsStore,
  PlayerSettingsStore,
  fetchMatchmakingDashboard,
  fetchPlayerStats,
};

export interface MatchmakingLobbyControllerOptions {
  initialContext?: MatchmakingContext | null;
  initialLiveMatches?: LiveMatchListResponse | null;
  initialQueueStats?: QueueStatsResponse | null;
  initialRoomCode?: string | null;
  initialLobbyRoom?: LobbyRoomResponse | null;
  initialActiveMatchId?: string | null;
  gatewayTicket?: string | null;
  gatewayAuthToken?: string | null;
  initialMatchmakingStatus?: MatchmakingStatusResponse | null;
  initialLeaderboards?: LeaderboardResponse[] | null;
}

export interface MatchmakingLobbyController {
  readonly playerContext: MatchmakingPlayerContextState;
  readonly queueStore: MatchmakingQueueStore;
  readonly liveMatchesStore: LiveMatchesStore;
  readonly queueStatsStore: QueueStatsStore;
  readonly gateway: GatewayClientStore;
  readonly playerSettings: PlayerSettingsStore;
  readonly initialLeaderboards: LeaderboardResponse[] | null;
  signInDialogOpen: boolean;
  showOnboardingDialog: boolean;
  playerSettingsOpen: boolean;
  accountSettingsOpen: boolean;
  queuedAiOverlayOpen: boolean;
  queuedAiConfig: HumanVsAiMatchConfig | null;
  spectatorDialogOpen: boolean;
  spectatorMatchId: string | null;
  spectatorGameId: string | null;
  importDialogOpen: boolean;
  importDeckName: string;
  importDeckText: string;
  importDeckSubmitting: boolean;
  importDeckError: string | null;
  auth: {
    readonly isAuthenticated: boolean;
    readonly isLoading: boolean;
    readonly user: AuthUser | null;
  };

  deckSelection: {
    readonly error: string | null;
    readonly success: string | null;
    readonly selectionDisabled: boolean;
    readonly selectionDisabledReason: string | null;
    readonly activeProfile: ProfileMatchmakingContext | null;
    readonly selectedDeck: ProfileDeckSummary | null;
    readonly selectedDeckId: string;
    readonly selectedDeckInks: string[];
    readonly activeProfileDecks: ProfileDeckSummary[];
    readonly activeProfileDecksLoaded: boolean;
    readonly activeProfileDecksLoading: boolean;
    readonly activeProfileDeckError: string | null;
    readonly selectedDeckTriggerLabel: string;
    readonly selectableDeckItems: Array<{ value: string; label: string }>;
    readonly importLegacySubmitting: boolean;
    readonly importLegacyError: string | null;
    readonly importLegacySuccess: string | null;
  };
  botConfig: {
    readonly selectedBotFixtureId: string;
    readonly selectedBotStrategyId: string;
    readonly fixtureOptions: Array<{ value: string; label: string }>;
    readonly strategyOptions: Array<{ value: string; label: string }>;
    readonly strategyDescription: string;
  };
  queue: {
    readonly status: MatchmakingStatus;
    readonly selectedQueueMode: QueueStatsMode;
    readonly selectedMatchType: "ranked" | "casual" | "testing";
    readonly rankedEnabled: boolean;
    readonly testingQueueEnabled: boolean;
    readonly queueCards: QueueCardView[];
    readonly isDeckValidForSelectedFormat: boolean;
    readonly activeQueueFormat: QueueStatsFormat;
    readonly activeQueueMode: QueueStatsMode;
    readonly queuedDeck: ProfileDeckSummary | null;
    readonly queuedProfile: ProfileMatchmakingContext | null;
    readonly queueActionDisabled: boolean;
    readonly queueActionDisabledLabel: string;
    readonly joinLabel: string;
    readonly elapsedLabel: string;
    readonly remainingLabel: string;
    readonly progressPercent: number;
    readonly error: string | null;
    readonly queuedAiError: string | null;
    readonly modeStats: ReadonlyArray<{
      readonly mode: QueueStatsMode;
      readonly inQueue: number;
      readonly liveMatches: number;
    }>;
    readonly matchTypeStats: ReadonlyArray<{
      readonly matchType: "ranked" | "casual";
      readonly inQueue: number;
      readonly liveMatches: number;
    }>;
  };
  practice: {
    readonly loading: boolean;
    readonly error: string | null;
  };
  lobby: {
    readonly status: LobbyRoomStatus;
    readonly roomCode: string | null;
    readonly error: string | null;
    readonly existingRoomCode: string | null;
    readonly activeMatchId: string | null;
    readonly selectedMode: LobbyMode;
    readonly isCreator: boolean;
    readonly isInRoom: boolean;
    readonly opponentName: string | null;
    readonly opponentDeckName: string | null;
    readonly creatorName: string | null;
    readonly creatorDeckName: string | null;
    readonly navigatingToMatch: boolean;
  };
  dialogs: {
    readonly onboardingError: string | null;
    readonly onboardingLoading: boolean;
  };
  initialize(): Promise<void>;
  hydrateRoom(roomCode: string): Promise<void>;
  pollRoomStatus(): Promise<void>;
  destroy(): void;
  dismissImportSuccess(): void;
  handleDeckSelectOpenChange(open: boolean): void;
  handleDeckChange(deckId: string): void;
  handleBotFixtureChange(fixtureId: string): void;
  handleBotStrategyChange(strategyId: string): void;
  openSignInDialog(): void;
  openImportDeckDialog(): void;
  handleImportDeckSubmit(): Promise<void>;
  handleImportLegacy(): Promise<void>;
  handleJoinQueue(): Promise<void>;
  handleLeaveQueue(): Promise<void>;
  handleRejoinMatch(): Promise<void>;
  handleForfeitMatch(): Promise<void>;
  selectQueueMode(mode: QueueStatsMode): void;
  selectMatchType(matchType: "ranked" | "casual" | "testing"): void;
  selectQueueFormat(format: QueueStatsFormat): void;
  startPracticeMatch(): Promise<void>;
  startQueuedAiMatch(): Promise<void>;
  closeQueuedAiOverlay(): void;
  handleOnboardAccept(): Promise<void>;
  reconnectGatewayAnonymous(): void;
  handleCreateLobbyRoom(): Promise<void>;
  handleJoinLobbyRoom(roomCode: string): Promise<void>;
  handleCancelLobbyRoom(): Promise<void>;
  handleBackFromLobbyRoom(): Promise<void>;
  handleStartLobbyRoom(): Promise<void>;
  handleLeaveLobbyRoom(): Promise<void>;
  handleRejoinExistingRoom(): void;
  handleCancelExistingRoom(): Promise<void>;
  handleLobbyModeChange(mode: LobbyMode): void;
  skipMatchCountdown(): void;
  handleAcceptMatch(): void;
  handleDeclineMatch(): void;
  openSpectatorDialog(matchId: string, gameId: string): void;
  closeSpectatorDialog(): void;
  handleColorPreferenceUpdate(
    preferred: number,
    excluded: number,
    strength: "required" | "preferred",
  ): void;
}

class MatchmakingLobbyControllerImpl implements MatchmakingLobbyController {
  signInDialogOpen = $state(false);
  showOnboardingDialog = $state(false);
  playerSettingsOpen = $state(false);
  accountSettingsOpen = $state(false);
  queuedAiLoading = $state(false);
  queuedAiError = $state<string | null>(null);
  queuedAiOverlayOpen = $state(false);
  queuedAiConfig = $state<HumanVsAiMatchConfig | null>(null);
  spectatorDialogOpen = $state(false);
  spectatorMatchId = $state<string | null>(null);
  spectatorGameId = $state<string | null>(null);
  importDialogOpen = $state(false);
  importDeckName = $state("");
  importDeckText = $state("");
  importDeckSubmitting = $state(false);
  importDeckError = $state<string | null>(null);
  importDeckSuccess = $state<string | null>(null);
  importLegacySubmitting = $state(false);
  importLegacyError = $state<string | null>(null);
  importLegacySuccess = $state<string | null>(null);
  practiceLoading = $state(false);
  practiceError = $state<string | null>(null);
  playerStats = $state<PlayerStats | null>(null);
  selectedQueueFormat = $state<QueueStatsFormat>(
    restoreSupportedQueueFormat(loadMatchmakingPrefs().format),
  );
  selectedQueueMode = $state<QueueStatsMode>(loadMatchmakingPrefs().mode ?? "1");
  selectedMatchType = $state<"ranked" | "casual" | "testing">("casual");
  selectedBotFixtureId = $state("");
  selectedBotStrategyId = $state("");

  readonly initialLeaderboards: LeaderboardResponse[] | null;
  readonly playerContext: MatchmakingPlayerContextState;
  readonly queueStore: MatchmakingQueueStore;
  readonly lobbyStore: LobbyRoomStore;
  readonly liveMatchesStore: LiveMatchesStore;
  readonly queueStatsStore: QueueStatsStore;
  readonly playerSettings: PlayerSettingsStore;
  #gateway: GatewayClientStore;
  #deps: ControllerDeps;
  #gatewayWsUrl: string;
  readonly rankedEnabled: boolean;
  #initialRoomCode: string | null = null;
  #initialLobbyRoom: LobbyRoomResponse | null = null;
  #initialGatewayTicket: string | null = null;
  #initialGatewayAuthToken: string | null = null;
  #initialMatchmakingStatus: MatchmakingStatusResponse | null = null;

  constructor(options: MatchmakingLobbyControllerOptions, deps: ControllerDeps) {
    this.initialLeaderboards = options.initialLeaderboards ?? null;
    this.lobbyStore = new LobbyRoomStore();
    this.#deps = deps;
    this.#gatewayWsUrl = deps.getGatewayWsUrl();
    this.rankedEnabled = deps.getFeatureFlags().rankedEnabled;
    const persistedMatchType = loadMatchmakingPrefs().matchType;
    if (persistedMatchType && (persistedMatchType !== "ranked" || this.rankedEnabled)) {
      this.selectedMatchType = persistedMatchType;
    }
    if (this.selectedMatchType === "ranked" && this.selectedQueueMode === "1") {
      this.selectedQueueMode = "3";
    }
    this.#initialRoomCode = options.initialRoomCode ?? options.initialLobbyRoom?.roomCode ?? null;
    this.#initialLobbyRoom = options.initialLobbyRoom ?? null;
    this.#initialGatewayTicket = options.gatewayTicket ?? null;
    this.#initialGatewayAuthToken = options.gatewayAuthToken ?? null;
    this.#initialMatchmakingStatus = options.initialMatchmakingStatus ?? null;
    this.playerContext = new deps.MatchmakingPlayerContextState(options.initialContext ?? null);
    this.queueStore = new deps.MatchmakingQueueStore();
    // Hydrate queue/match state immediately from SSR data so the first render
    // reflects the correct state without waiting for onMount / initialize().
    if (options.initialMatchmakingStatus) {
      this.queueStore.hydrateFromStatus(options.initialMatchmakingStatus);
    }
    if (options.initialActiveMatchId && this.queueStore.status === "idle") {
      this.queueStore.status = "blocked";
      this.queueStore.blockReason = "You have an active match in progress.";
      this.queueStore.activeMatchId = options.initialActiveMatchId;
    }
    this.#syncQueuedSelectionFromStore();

    this.liveMatchesStore = new deps.LiveMatchesStore(options.initialLiveMatches ?? null);
    this.queueStatsStore = new deps.QueueStatsStore(options.initialQueueStats ?? null);
    this.playerSettings = new deps.PlayerSettingsStore();
    this.playerSettings.setSaveVisualSettingsToServer((update) => {
      updateUserVisualSettings(update).catch(() => {});
    });
    this.#gateway = this.#createGateway();

    if (this.queueStore.status === "queued" || this.queueStore.status === "match_ready") {
      this.#startQueuePolling();
    }

    $effect(() => {
      const format = this.selectedQueueFormat;
      const mode = this.selectedQueueMode;
      const matchType = this.selectedMatchType;
      saveMatchmakingPrefs({ format, mode, matchType });
    });
  }

  get gateway(): GatewayClientStore {
    return this.#gateway;
  }

  get auth() {
    return {
      isAuthenticated: this.#deps.authSession.isAuthenticated,
      isLoading: this.#deps.authSession.isLoading,
      user: this.#deps.authSession.user,
    };
  }

  get deckSelection() {
    const activeProfile = this.playerContext.activeProfile;
    const selectedDeck = this.playerContext.selectedDeck;
    const activeProfileDecks = activeProfile?.decks ?? [];
    const activeProfileDecksLoading = activeProfile
      ? this.playerContext.isLoadingDecks(activeProfile.gameProfileId)
      : false;

    return {
      error: this.playerContext.error,
      success: this.importDeckSuccess,
      selectionDisabled: this.selectionDisabled,
      selectionDisabledReason: this.selectionDisabledReason,
      activeProfile,
      selectedDeck,
      selectedDeckId: activeProfile?.selectedDeckId ?? "",
      selectedDeckInks: selectedDeck ? colorMaskToInks(selectedDeck.colorMask) : [],
      activeProfileDecks,
      activeProfileDecksLoaded: activeProfile
        ? this.playerContext.areDecksLoaded(activeProfile.gameProfileId)
        : false,
      activeProfileDecksLoading,
      activeProfileDeckError: activeProfile
        ? this.playerContext.deckLoadError(activeProfile.gameProfileId)
        : null,
      selectedDeckTriggerLabel:
        selectedDeck?.deckName ??
        (activeProfileDecksLoading
          ? this.#t("sim.matchmaking.deckSelect.loading")
          : this.#t("sim.matchmaking.deckSelect.placeholder")),
      selectableDeckItems: activeProfileDecks.map((deck) => ({
        value: deck.deckId,
        label: deck.deckName,
      })),
      importLegacySubmitting: this.importLegacySubmitting,
      importLegacyError: this.importLegacyError,
      importLegacySuccess: this.importLegacySuccess,
    };
  }

  get queue() {
    return {
      status: this.queueStore.status,
      selectedQueueMode: this.selectedQueueMode,
      selectedMatchType: this.selectedMatchType,
      rankedEnabled: this.rankedEnabled,
      testingQueueEnabled: this.#isTestingQueueEnabled(),
      queueCards: QUEUE_CARD_DEFINITIONS.map((definition) => {
        const selectedDeck = this.playerContext.selectedDeck;
        const isRanked = this.selectedMatchType === "ranked";
        const formatStats = isRanked
          ? this.playerStats?.byFormat?.find((f) => f.formatId === definition.format)
          : undefined;
        const rankJourney = isRanked ? buildRankJourney(formatStats) : null;
        return {
          definition,
          stats: this.queueStatsStore.statsByPartition(
            definition.format,
            this.selectedQueueMode,
            this.selectedMatchType,
          ),
          isSelected: definition.format === this.selectedQueueFormat,
          isActive: definition.format === this.activeQueueFormat,
          isDeckValid:
            !selectedDeck ||
            !selectedDeck.validFormats ||
            selectedDeck.validFormats.includes(definition.format),
          winStreak: formatStats?.currentWinStreak ?? 0,
          // MMR and placement are ranked-only concepts — suppress in casual/testing.
          // Also suppress MMR until placement is complete — the API always
          // returns a numeric mmr even during placement matches.
          mmr: rankJourney?.mmr ?? null,
          // In ranked, surface placement progress for every format — fresh
          // accounts with no byFormat entry yet should still see 0/N. In
          // casual/testing the field stays null so the bar is hidden.
          placementGamesPlayed: isRanked ? (formatStats?.gamesPlayed ?? 0) : null,
          rankJourney,
        };
      }),
      isDeckValidForSelectedFormat: this.isDeckValidForSelectedFormat,
      activeQueueFormat: this.activeQueueFormat,
      activeQueueMode: this.activeQueueMode,
      queuedDeck: this.queuedDeck,
      queuedProfile: this.queuedProfile,
      queueActionDisabled: this.queueActionDisabled,
      queueActionDisabledLabel: this.queueActionDisabledLabel,
      joinLabel: createQueueJoinLabel(this.selectedQueueFormat, this.selectedQueueMode, (key) =>
        this.#t(key),
      ),
      elapsedLabel: this.#formatQueueTimeElapsed(),
      remainingLabel: this.#formatQueueTimeRemaining(),
      progressPercent: Math.max(
        0,
        Math.min(100, Math.round((this.queueStore.timeRemainingMs / 300_000) * 100)),
      ),
      error: this.queueStore.error,
      queuedAiError: this.queuedAiError,
      modeStats: (["1", "3"] as const).map((mode) => ({
        mode,
        inQueue: this.queueStatsStore.totalInQueue(mode, this.selectedMatchType),
        liveMatches: this.queueStatsStore.totalLiveMatches(mode, this.selectedMatchType),
      })),
      matchTypeStats: (["ranked", "casual"] as const).map((matchType) => ({
        matchType,
        inQueue:
          this.queueStatsStore.totalInQueue("1", matchType) +
          this.queueStatsStore.totalInQueue("3", matchType),
        liveMatches:
          this.queueStatsStore.totalLiveMatches("1", matchType) +
          this.queueStatsStore.totalLiveMatches("3", matchType),
      })),
    };
  }

  get botConfig() {
    return {
      selectedBotFixtureId: this.selectedBotFixtureId,
      selectedBotStrategyId: this.selectedBotStrategyId,
      fixtureOptions: DECK_FIXTURES.map((fixture) => ({
        value: fixture.id,
        label: fixture.name,
      })),
      strategyOptions: AUTOMATED_ACTION_STRATEGIES.map((strategy) => ({
        value: strategy.id,
        label: strategy.label,
      })),
      strategyDescription: this.selectedBotStrategyId
        ? getSafeAutomatedActionStrategyOption(this.selectedBotStrategyId).description
        : getSafeAutomatedActionStrategyOption(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID).description,
    };
  }

  get practice() {
    return {
      loading: this.practiceLoading || this.queuedAiLoading,
      error: this.practiceError ?? this.queuedAiError,
    };
  }

  get lobby() {
    return {
      status: this.lobbyStore.status,
      roomCode: this.lobbyStore.roomCode,
      error: this.lobbyStore.error,
      existingRoomCode: this.lobbyStore.existingRoomCode,
      activeMatchId: this.lobbyStore.activeMatchId,
      selectedMode: this.lobbyStore.selectedMode,
      isCreator: this.lobbyStore.isCreator,
      isInRoom: this.lobbyStore.isInRoom,
      opponentName: this.lobbyStore.opponentName,
      opponentDeckName: this.lobbyStore.opponentDeckName,
      creatorName: this.lobbyStore.creatorName,
      creatorDeckName: this.lobbyStore.creatorDeckName,
      navigatingToMatch: this.lobbyStore.navigatingToMatch,
    };
  }

  get dialogs() {
    return {
      onboardingError: this.playerContext.onboardingError,
      onboardingLoading: this.playerContext.onboarding,
    };
  }

  get selectionDisabled(): boolean {
    return (
      this.queueStore.status === "queued" ||
      this.queueStore.status === "match_ready" ||
      this.queueStore.status === "match_found" ||
      this.lobbyStore.isActive ||
      this.playerContext.loading ||
      this.playerContext.savingDeck ||
      this.playerContext.savingProfile
    );
  }

  get selectionDisabledReason(): string | null {
    if (this.queueStore.status === "match_ready" || this.queueStore.status === "match_found") {
      return this.#t("sim.matchmaking.queue.blocked.deckLocked.matchFound");
    }
    if (this.queueStore.status === "queued") {
      return this.#t("sim.matchmaking.queue.blocked.deckLocked.queued");
    }
    if (this.lobbyStore.isActive) {
      return this.#t("sim.matchmaking.queue.blocked.privateRoom");
    }
    return null;
  }

  get activeQueueFormat(): QueueStatsFormat {
    return this.queueStore.status === "queued" && this.queueStore.queuedFormat
      ? this.queueStore.queuedFormat
      : this.selectedQueueFormat;
  }

  get activeQueueMode(): QueueStatsMode {
    return this.queueStore.status === "queued" && this.queueStore.queuedMode
      ? this.queueStore.queuedMode
      : this.selectedQueueMode;
  }

  get isDeckValidForSelectedFormat(): boolean {
    const deck = this.playerContext.selectedDeck;
    if (!deck || !deck.validFormats) return true; // no deck or no format data = separate handling
    return deck.validFormats.includes(this.selectedQueueFormat);
  }

  get queueActionDisabled(): boolean {
    return (
      !this.#deps.authSession.isAuthenticated ||
      !this.playerContext.selectedDeck ||
      !this.playerContext.activeProfile ||
      !this.isDeckValidForSelectedFormat ||
      this.selectionDisabled ||
      this.queueStore.status === "checking" ||
      this.queueStore.status === "joining" ||
      this.queueStore.status === "blocked"
    );
  }

  /** Shown on the join CTA when `queueActionDisabled` (after auth / saving / spinner states). */
  get queueActionDisabledLabel(): string {
    if (this.queueStore.status === "blocked") {
      return this.#t("sim.matchmaking.queue.blocked.activeMatch");
    }
    if (this.lobbyStore.isActive) {
      return this.#t("sim.matchmaking.queue.blocked.privateRoom");
    }
    if (!this.playerContext.selectedDeck) {
      return this.#t("sim.matchmaking.queue.selectDeckFirst");
    }
    if (!this.isDeckValidForSelectedFormat) {
      const formatLabel =
        this.selectedQueueFormat === "infinity"
          ? this.#t("sim.matchmaking.matchmaking.formats.infinity")
          : this.#t("sim.matchmaking.matchmaking.formats.ccROF");
      return this.#t("sim.matchmaking.queue.deckNotLegalForFormat", { format: formatLabel });
    }
    if (!this.playerContext.activeProfile) {
      return this.#t("sim.matchmaking.queue.noPlayableDeck");
    }
    if (this.playerContext.loading) {
      return this.#t("sim.matchmaking.profile.loading");
    }
    return this.#t("sim.matchmaking.queue.joinUnavailable");
  }

  get queuedProfile(): ProfileMatchmakingContext | null {
    return (
      this.playerContext.profiles.find(
        (profile) => profile.gameProfileId === this.queueStore.queuedGameProfileId,
      ) ?? null
    );
  }

  get queuedDeck(): ProfileDeckSummary | null {
    const queuedDeckListId = this.queueStore.queuedDeckListId;
    if (!queuedDeckListId) {
      return null;
    }

    for (const profile of this.playerContext.profiles) {
      const deck =
        profile.selectedDeckSummary?.activeDeckListId === queuedDeckListId
          ? profile.selectedDeckSummary
          : (profile.decks ?? []).find((item) => item.activeDeckListId === queuedDeckListId);
      if (deck) {
        return deck;
      }
    }

    return null;
  }

  async initialize(): Promise<void> {
    initSoundService();
    this.playerSettings.initialize();
    await this.playerContext.initialize();

    if (this.playerContext.needsOnboarding) {
      this.showOnboardingDialog = true;
    }

    if (this.#deps.authSession.isAuthenticated) {
      this.#deps.fetchPlayerStats().then(
        (stats) => {
          this.playerStats = stats;
        },
        () => {
          /* non-critical — badges just won't show */
          console.debug("[matchmaking-lobby] failed to fetch player stats, badges will not show");
        },
      );

      let ticket: string | undefined;
      let authToken: string | undefined;

      if (this.#initialGatewayTicket) {
        ticket = this.#initialGatewayTicket;
        authToken = this.#initialGatewayAuthToken ?? undefined;
      } else {
        const result = await this.#fetchGatewayTicket();
        if (result) {
          ticket = result.ticket;
          authToken = result.authToken;
        }
      }

      if (ticket) {
        this.#replaceGateway(ticket, authToken);
      }

      if (!this.#initialMatchmakingStatus) {
        // Fallback when server load did not return status (e.g. transient failure, stale deploy).
        // If we already hydrated from SSR data in the constructor, skip the extra fetch.
        await this.queueStore.checkStatus();
        this.#syncQueuedSelectionFromStore();
        if (this.queueStore.status === "queued" || this.queueStore.status === "match_ready") {
          this.#startQueuePolling();
        }
      }
    }

    this.gateway.connect();

    if (this.#initialRoomCode) {
      await this.hydrateRoom(this.#initialRoomCode, this.#initialLobbyRoom ?? undefined);
    }
  }

  async hydrateRoom(roomCode: string, prefetched?: LobbyRoomResponse): Promise<void> {
    if (!this.#deps.authSession.isAuthenticated) {
      this.openSignInDialog();
      return;
    }

    try {
      const roomStatus = prefetched ?? (await getLobbyRoomStatus(roomCode));
      if (!roomStatus) {
        // Room was deleted — game may have already started.
        // If the player has an active match, redirect to it.
        if (this.queueStore.activeMatchId) {
          console.log("[matchmaking-lobby] room not found, redirecting to active match", {
            matchId: this.queueStore.activeMatchId,
          });
          await this.lobbyStore.navigateToMatch(this.queueStore.activeMatchId);
          return;
        }
        this.lobbyStore.error = "Room not found or expired.";
        this.lobbyStore.status = "error";
        return;
      }

      if (roomStatus.isCreator) {
        this.lobbyStore.roomCode = roomStatus.roomCode;
        this.lobbyStore.isCreator = true;
        this.lobbyStore.creatorName = roomStatus.creatorDisplayName ?? "Host";
        this.lobbyStore.selectedMode = (roomStatus.bestOf === 3 ? "3" : "1") as LobbyMode;
        if (roomStatus.joinerDisplayName) {
          this.lobbyStore.opponentName = roomStatus.joinerDisplayName;
          this.lobbyStore.opponentDeckName = roomStatus.joinerDeckName ?? null;
          this.lobbyStore.status = "opponent_joined";
        } else {
          this.lobbyStore.status = "waiting";
        }
      } else if (roomStatus.isJoiner) {
        // Already seated — hydrate directly without re-joining
        this.lobbyStore.roomCode = roomStatus.roomCode;
        this.lobbyStore.isCreator = false;
        this.lobbyStore.creatorName = roomStatus.creatorDisplayName ?? "Host";
        this.lobbyStore.creatorDeckName = roomStatus.creatorDeckName ?? null;
        this.lobbyStore.opponentName = roomStatus.joinerDisplayName ?? null;
        this.lobbyStore.opponentDeckName = roomStatus.joinerDeckName ?? null;
        this.lobbyStore.selectedMode = (roomStatus.bestOf === 3 ? "3" : "1") as LobbyMode;
        this.lobbyStore.status = "joined_waiting";
      } else {
        await this.handleJoinLobbyRoom(roomCode);
      }
    } catch {
      this.lobbyStore.error = "Failed to load room.";
      this.lobbyStore.status = "error";
    }
  }

  /**
   * Poll room status and update lobby store (called periodically while in room).
   * This keeps room state in sync when WebSocket updates are delayed.
   * If a game has been started and WebSocket match_found didn't arrive,
   * this will log a warning so we can implement a recovery mechanism.
   */
  async pollRoomStatus(): Promise<void> {
    const roomCode = this.lobbyStore.roomCode;
    if (!roomCode) {
      return;
    }

    try {
      const roomStatus = await getLobbyRoomStatus(roomCode);
      if (!roomStatus) {
        // Room was deleted (404). This happens when the match was created and
        // the room was consumed. If we have a stored matchId, navigate to it.
        if (this.lobbyStore.matchId) {
          console.log("[matchmaking-lobby] room deleted, navigating to stored match", {
            matchId: this.lobbyStore.matchId,
            gameId: this.lobbyStore.gameId,
          });
          this.lobbyStore.status = "match_found";
          void this.lobbyStore.navigateToMatch(this.lobbyStore.matchId, this.lobbyStore.gameId);
        }
        return;
      }

      // Check if game started and we haven't navigated yet
      if (
        roomStatus.status === "matched" &&
        this.lobbyStore.status !== "starting" &&
        this.lobbyStore.status !== "match_found"
      ) {
        // If we have matchId/gameId stored, navigate immediately
        if (this.lobbyStore.matchId) {
          console.log("[matchmaking-lobby] poll detected matched room, navigating", {
            matchId: this.lobbyStore.matchId,
            gameId: this.lobbyStore.gameId,
          });
          this.lobbyStore.status = "match_found";
          void this.lobbyStore.navigateToMatch(this.lobbyStore.matchId, this.lobbyStore.gameId);
          return;
        }
        console.warn("[matchmaking-lobby] poll detected started game but no matchId available", {
          roomCode,
          lobbyStatus: this.lobbyStore.status,
        });
      }

      this.lobbyStore.updateFromServerResponse(roomStatus);
    } catch (err) {
      console.error("[matchmaking-lobby] failed to poll room status", err);
    }
  }

  destroy(): void {
    this.#stopQueuePolling();
    this.gateway.destroy();
    this.#stopMatchCountdown();
    this.queueStore.destroy();
  }

  dismissImportSuccess(): void {
    this.importDeckSuccess = null;
  }

  openSignInDialog(): void {
    this.signInDialogOpen = true;
  }

  handleDeckSelectOpenChange(open: boolean): void {
    if (open && this.playerContext.activeProfile) {
      void this.playerContext.loadProfileDecks(this.playerContext.activeProfile.gameProfileId);
    }
  }

  handleDeckChange(deckId: string): void {
    void this.playerContext.setSelectedDeck(deckId);
  }

  handleBotFixtureChange(fixtureId: string): void {
    this.selectedBotFixtureId = fixtureId.trim();
  }

  handleBotStrategyChange(strategyId: string): void {
    this.selectedBotStrategyId = strategyId.trim();
  }

  selectQueueMode(mode: QueueStatsMode): void {
    if (this.selectionDisabled) {
      return;
    }
    if (mode === "1" && this.selectedMatchType === "ranked") {
      return;
    }

    this.selectedQueueMode = mode;
    this.#deps.trackEvent("matchmaking_mode_select", { mode });
  }

  selectMatchType(matchType: "ranked" | "casual" | "testing"): void {
    if (this.selectionDisabled) {
      return;
    }
    if (matchType === "ranked" && !this.rankedEnabled) {
      return;
    }
    if (matchType === "testing" && !this.#isTestingQueueEnabled()) {
      return;
    }

    this.selectedMatchType = matchType;
    if (matchType === "ranked" && this.selectedQueueMode === "1") {
      this.selectedQueueMode = "3";
    }
    this.#deps.trackEvent("matchmaking_match_type_select", { matchType });
  }

  selectQueueFormat(format: QueueStatsFormat): void {
    if (this.selectionDisabled) {
      return;
    }

    this.selectedQueueFormat = format;
    this.#deps.trackEvent("matchmaking_format_select", { format });
  }

  async handleJoinQueue(): Promise<void> {
    if (!this.#deps.authSession.isAuthenticated) {
      this.openSignInDialog();
      return;
    }

    if (this.selectedMatchType === "ranked" && !this.rankedEnabled) {
      this.queueStore.error = m["sim.matchmaking.queue.error.rankedUnavailable"]();
      this.#deps.trackEvent("queue_join_blocked", { reason: "ranked_disabled" });
      return;
    }

    if (this.selectedMatchType === "testing" && !this.#isTestingQueueEnabled()) {
      this.queueStore.error = "Testing queue is not available.";
      this.#deps.trackEvent("queue_join_blocked", { reason: "testing_disabled" });
      return;
    }

    const selectedDeck = this.playerContext.selectedDeck;
    const activeProfile = this.playerContext.activeProfile;
    if (!selectedDeck || !activeProfile || this.queueStore.status === "joining") {
      return;
    }

    await this.queueStore.join({
      gameProfileId: activeProfile.gameProfileId,
      format: this.selectedQueueFormat,
      mode: this.selectedQueueMode,
      matchType: this.selectedMatchType,
    });

    if (this.queueStore.status === "queued") {
      this.queueStore.captureQueuedDeck(selectedDeck.activeDeckListId);
      this.#syncQueuedSelectionFromStore();
      this.#startQueuePolling();
    }
  }

  async handleLeaveQueue(): Promise<void> {
    this.#stopQueuePolling();
    await this.queueStore.leave();
    this.closeQueuedAiOverlay();
  }

  async handleRejoinMatch(): Promise<void> {
    const matchId = this.queueStore.activeMatchId ?? this.lobbyStore.activeMatchId;
    if (!matchId) return;

    try {
      const { fetchRejoinMatchDetails } = await import("../api/matchmaking-api.js");
      const data = await fetchRejoinMatchDetails(matchId);
      if (!data) {
        this.queueStore.error = "Could not load match details. Please try again.";
        return;
      }
      const gameId = data.currentGameId;
      if (!gameId) {
        this.queueStore.error = "Match has no active game.";
        this.queueStore.status = "idle";
        this.queueStore.blockReason = null;
        this.queueStore.activeMatchId = null;
        return;
      }

      // Save session so /match/[gameId] can identify the player.
      // Prefer matching participant by userId; fall back to the user's active
      // gameProfileId (the rejoin API may omit userId on participants, and
      // without a saved session the game page shows "No session found").
      const userId = this.#deps.authSession.user?.id;
      const participantByUser = userId
        ? data.participants?.find((p) => p.userId === userId)
        : undefined;
      const activeGameProfileId = this.playerContext.activeProfile?.gameProfileId;
      const gameProfileId =
        participantByUser?.id ??
        (activeGameProfileId && data.participants?.some((p) => p.id === activeGameProfileId)
          ? activeGameProfileId
          : undefined);
      if (gameProfileId) {
        saveRankedMatchSession({
          matchId,
          gameId,
          gameProfileId,
          userId: userId ?? undefined,
        });
      }

      await this.lobbyStore.navigateToMatch(matchId, gameId);
    } catch {
      this.queueStore.error = "Failed to rejoin match. Please try again.";
    }
  }

  async handleForfeitMatch(): Promise<void> {
    const matchId = this.queueStore.activeMatchId ?? this.lobbyStore.activeMatchId;
    if (!matchId) return;

    this.queueStore.forfeiting = true;
    this.queueStore.error = null;

    try {
      const { forfeitMatch } = await import("../api/matchmaking-api.js");
      await forfeitMatch(matchId);
      this.queueStore.forfeiting = false;
      this.queueStore.forfeitSuccess = true;
      trackEvent("match_forfeit", {
        source: "matchmaking_page",
        matchType: this.queueStore.queuedMatchType ?? this.selectedMatchType,
      });

      // Brief success feedback before refreshing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.queueStore.status = "idle";
      this.queueStore.blockReason = null;
      this.queueStore.activeMatchId = null;
      this.queueStore.forfeitSuccess = false;
      // Also clear lobby store's active match state
      this.lobbyStore.activeMatchId = null;
      this.lobbyStore.error = null;
      this.lobbyStore.status = "idle";
      void this.#refreshDashboard();
    } catch (err) {
      this.queueStore.forfeiting = false;
      const message = err instanceof Error ? err.message : "";
      // If the match is already completed, it's effectively gone — clear the banner
      if (message.toLowerCase().includes("completed")) {
        this.queueStore.status = "idle";
        this.queueStore.blockReason = null;
        this.queueStore.activeMatchId = null;
        this.lobbyStore.activeMatchId = null;
        this.lobbyStore.error = null;
        this.lobbyStore.status = "idle";
        void this.#refreshDashboard();
      } else {
        this.queueStore.error = message || "Failed to forfeit match. Please try again.";
      }
    }
  }

  async startPracticeMatch(): Promise<void> {
    if (!this.#deps.authSession.isAuthenticated) {
      this.openSignInDialog();
      return;
    }

    const selectedDeck = this.playerContext.selectedDeck;
    if (!selectedDeck) {
      this.practiceError = "Please select a deck first.";
      return;
    }

    this.practiceLoading = true;
    this.practiceError = null;

    try {
      const snapshot = await this.#deps.fetchDeckListSnapshotByDeckListId(
        selectedDeck.activeDeckListId,
      );
      const url = buildAiQuickPlayUrl({
        deckText: snapshot.deckText,
        opponentFixtureId: this.selectedBotFixtureId,
        strategyId: this.selectedBotStrategyId,
      });
      this.#deps.trackEvent("practice_start");
      this.#deps.openWindow(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      this.practiceError = error instanceof Error ? error.message : "Failed to start AI match.";
    } finally {
      this.practiceLoading = false;
    }
  }

  async startQueuedAiMatch(): Promise<void> {
    const selectedDeck = this.playerContext.selectedDeck;
    if (!selectedDeck) {
      this.queuedAiError = "Please select a deck first.";
      return;
    }

    this.queuedAiLoading = true;
    this.queuedAiError = null;

    try {
      const snapshot = await this.#deps.fetchDeckListSnapshotByDeckListId(
        selectedDeck.activeDeckListId,
      );
      const url = buildAiQuickPlayUrl({
        deckText: snapshot.deckText,
        opponentFixtureId: this.selectedBotFixtureId,
        strategyId: this.selectedBotStrategyId,
      });
      this.#deps.trackEvent("practice_start");
      this.#deps.openWindow(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      this.queuedAiError = error instanceof Error ? error.message : "Failed to start AI match.";
    } finally {
      this.queuedAiLoading = false;
    }
  }

  closeQueuedAiOverlay(): void {
    this.queuedAiOverlayOpen = false;
    this.queuedAiConfig = null;
    this.queuedAiError = null;
  }

  openImportDeckDialog(): void {
    if (!this.#deps.authSession.isAuthenticated) {
      this.openSignInDialog();
      return;
    }

    this.#deps.trackEvent("deck_import_start");
    this.importDeckError = null;
    this.importDialogOpen = true;
  }

  async handleImportDeckSubmit(): Promise<void> {
    if (!this.#deps.authSession.isAuthenticated) {
      this.openSignInDialog();
      return;
    }

    const activeProfile = this.playerContext.activeProfile;
    if (!activeProfile) {
      this.importDeckError = "Select a profile before importing a deck.";
      return;
    }

    this.importDeckSubmitting = true;
    this.importDeckError = null;

    try {
      const importedDeck = await this.#deps.importDeckForProfile(activeProfile.gameProfileId, {
        deckName: this.importDeckName.trim(),
        deckText: this.importDeckText.trim(),
      });

      await this.playerContext.loadProfileDecks(activeProfile.gameProfileId, {
        force: true,
      });
      await this.playerContext.setSelectedDeck(importedDeck.deckId);

      this.#deps.trackEvent("deck_import_complete", {
        card_count: this.importDeckText.trim().split("\n").filter(Boolean).length,
      });
      this.importDeckSuccess = this.#t("sim.matchmaking.importDeck.success", {
        deckName: importedDeck.deckName,
      });
      this.importDialogOpen = false;
      this.#resetImportDeckForm();
    } catch (error) {
      this.#deps.trackEvent("deck_import_error", {
        error: "import_failed",
        ...analyticsErrorFields(error),
      });
      this.importDeckError = error instanceof Error ? error.message : "Failed to import deck.";
    } finally {
      this.importDeckSubmitting = false;
    }
  }

  async handleImportLegacy(): Promise<void> {
    const activeProfile = this.playerContext.activeProfile;
    if (!activeProfile) return;

    this.importLegacySubmitting = true;
    this.importLegacyError = null;
    this.importLegacySuccess = null;

    try {
      this.#deps.trackEvent("legacy_import_start");
      await this.#deps.importLegacyDecksForProfile(activeProfile.gameProfileId);
      const decks = await this.playerContext.loadProfileDecks(activeProfile.gameProfileId, {
        force: true,
      });
      const deckCount = decks.length;

      if (deckCount > 0) {
        this.#deps.trackEvent("legacy_import_complete");
        this.importLegacySuccess = this.#t(
          "sim.matchmaking.selectedDeck.empty.importLegacySuccess",
        );
      } else {
        this.importLegacyError = this.#t("sim.matchmaking.selectedDeck.empty.importLegacyNoDecks");
      }
    } catch (error) {
      this.#deps.trackEvent("legacy_import_error", {
        error: "import_failed",
        ...analyticsErrorFields(error),
      });
      this.importLegacyError =
        error instanceof Error
          ? error.message
          : this.#t("sim.matchmaking.selectedDeck.empty.importLegacyError");
    } finally {
      this.importLegacySubmitting = false;
    }
  }

  async handleOnboardAccept(): Promise<void> {
    const success = await this.playerContext.onboard();
    if (success) {
      this.showOnboardingDialog = false;
    }
  }

  reconnectGatewayAnonymous(): void {
    this.#replaceGateway();
    this.gateway.connect();
    this.playerContext.reset();
  }

  async handleCreateLobbyRoom(): Promise<void> {
    if (!this.#deps.authSession.isAuthenticated) {
      this.openSignInDialog();
      return;
    }

    const activeProfile = this.playerContext.activeProfile;
    if (!activeProfile || !this.playerContext.selectedDeck) return;

    if (this.queueStore.status === "queued" || this.queueStore.status === "match_found") {
      this.lobbyStore.error = "Leave the matchmaking queue before creating a private room.";
      this.lobbyStore.status = "error";
      return;
    }

    const creatorName = activeProfile.displayName ?? "Host";
    const deckName = this.playerContext.selectedDeck.deckName ?? null;
    await this.lobbyStore.createRoom(activeProfile.gameProfileId, creatorName, deckName);
    if (this.lobbyStore.roomCode) {
      void goto(`/matchmaking/room/${this.lobbyStore.roomCode}`);
    }
  }

  async handleJoinLobbyRoom(roomCode: string): Promise<void> {
    if (!this.#deps.authSession.isAuthenticated) {
      this.openSignInDialog();
      return;
    }

    const activeProfile = this.playerContext.activeProfile;
    if (!activeProfile || !this.playerContext.selectedDeck) return;

    if (this.queueStore.status === "queued" || this.queueStore.status === "match_found") {
      this.lobbyStore.error = "Leave the matchmaking queue before joining a private room.";
      this.lobbyStore.status = "error";
      return;
    }

    const deckName = this.playerContext.selectedDeck.deckName ?? null;
    await this.lobbyStore.joinRoom(roomCode, activeProfile.gameProfileId);
    if (this.lobbyStore.roomCode) {
      this.lobbyStore.opponentDeckName = deckName;
      void goto(`/matchmaking/room/${this.lobbyStore.roomCode}`);
    }
  }

  async handleCancelLobbyRoom(): Promise<void> {
    await this.lobbyStore.cancelRoom();
    if (this.lobbyStore.status !== "error") {
      void goto("/matchmaking");
    }
  }

  async handleBackFromLobbyRoom(): Promise<void> {
    if (this.lobbyStore.isCreator) {
      // Creator navigates back without destroying the room
      this.lobbyStore.reset();
      void goto("/matchmaking");
    } else {
      // Joiner leaves the room when navigating back
      await this.handleLeaveLobbyRoom();
    }
  }

  async handleStartLobbyRoom(): Promise<void> {
    await this.lobbyStore.startRoom();
  }

  async handleLeaveLobbyRoom(): Promise<void> {
    await this.lobbyStore.leaveRoom();
    if (this.lobbyStore.status !== "error") {
      void goto("/matchmaking");
    }
  }

  handleRejoinExistingRoom(): void {
    this.lobbyStore.rejoinExistingRoom();
    if (this.lobbyStore.roomCode) {
      void goto(`/matchmaking/room/${this.lobbyStore.roomCode}`);
    }
  }

  async handleCancelExistingRoom(): Promise<void> {
    await this.lobbyStore.cancelExistingRoom();
  }

  handleLobbyModeChange(mode: LobbyMode): void {
    this.lobbyStore.selectedMode = mode;
  }

  async #refreshDashboard(): Promise<void> {
    try {
      const dashboard = await this.#deps.fetchMatchmakingDashboard(
        this.liveMatchesStore.displayLimit,
      );
      this.#applyDashboardSnapshot(dashboard);
      this.liveMatchesStore.error = null;
      this.queueStatsStore.error = null;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load matchmaking dashboard";
      this.liveMatchesStore.error = message;
      this.queueStatsStore.error = message;
    }
  }

  #applyDashboardSnapshot(snapshot: MatchmakingDashboardResponse): void {
    this.liveMatchesStore.setSnapshot(snapshot.liveMatches);
    this.queueStatsStore.setSnapshot(snapshot.queueStats);

    if (snapshot.activeMatchId && this.queueStore.status === "idle") {
      this.queueStore.status = "blocked";
      this.queueStore.blockReason = "You have an active match in progress.";
      this.queueStore.activeMatchId = snapshot.activeMatchId;
    }
  }

  #createGateway(ticket?: string, token?: string): GatewayClientStore {
    console.debug("[matchmaking-lobby] createGateway()", {
      hasTicket: !!ticket,
      hasToken: !!token,
      caller: new Error().stack?.split("\n")[2]?.trim() ?? "unknown",
    });
    return new this.#deps.GatewayClientStore(
      this.#gatewayWsUrl,
      ticket,
      (msg) => this.#handleGatewayMessage(msg),
      () => this.#handleGatewayReconnect(),
      token,
    );
  }

  #replaceGateway(ticket?: string, token?: string): void {
    this.gateway.destroy();
    this.#gateway = this.#createGateway(ticket, token);
  }

  async #fetchGatewayTicket(): Promise<GatewayTicketResult | null> {
    try {
      return await this.#deps.fetchGatewayTicket();
    } catch {
      return null;
    }
  }

  #handleGatewayReconnect(): void {
    if (this.queueStore.status === "queued" || this.queueStore.status === "match_ready") {
      this.#startQueuePolling();
    }
    this.#requestMatchmakingPollIfQueued();
    this.#refreshLobbyRoomIfActive();
  }

  #requestMatchmakingPollIfQueued(): void {
    if (this.queueStore.status === "queued" || this.queueStore.status === "match_ready") {
      this.gateway.send({ type: "matchmaking_poll" });
    }
  }

  #startQueuePolling(): void {
    this.#stopQueuePolling();
    this.#requestMatchmakingPollIfQueued();
    this.#queuePollInterval = setInterval(() => {
      this.#requestMatchmakingPollIfQueued();
    }, 3_000);
  }

  #stopQueuePolling(): void {
    if (this.#queuePollInterval !== null) {
      clearInterval(this.#queuePollInterval);
      this.#queuePollInterval = null;
    }
  }

  async #refreshLobbyRoomIfActive(): Promise<void> {
    if (!this.lobbyStore.isInRoom || !this.lobbyStore.roomCode) return;
    try {
      const roomStatus = await getLobbyRoomStatus(this.lobbyStore.roomCode);
      if (!roomStatus) {
        this.lobbyStore.reset();
        return;
      }
      // Sync opponent state from server (handles missed WS events)
      if (
        this.lobbyStore.isCreator &&
        this.lobbyStore.status === "waiting" &&
        roomStatus.joinerDisplayName
      ) {
        this.lobbyStore.opponentName = roomStatus.joinerDisplayName;
        this.lobbyStore.status = "opponent_joined";
      }
    } catch {
      // Best-effort — don't disrupt the user
    }
  }

  #matchCountdownInterval: ReturnType<typeof setInterval> | null = null;
  #queuePollInterval: ReturnType<typeof setInterval> | null = null;

  #startMatchCountdown(): void {
    this.#stopMatchCountdown();
    const COUNTDOWN_SECONDS = 5;
    this.queueStore.matchCountdown = COUNTDOWN_SECONDS;
    playSound("match-found");

    this.#matchCountdownInterval = setInterval(() => {
      if (this.queueStore.matchCountdown === null) {
        this.#stopMatchCountdown();
        return;
      }
      this.queueStore.matchCountdown -= 1;
      if (this.queueStore.matchCountdown <= 0) {
        this.#stopMatchCountdown();
        this.closeSpectatorDialog();
        this.queueStore.navigateToMatch();
      }
    }, 1000);
  }

  #stopMatchCountdown(): void {
    if (this.#matchCountdownInterval !== null) {
      clearInterval(this.#matchCountdownInterval);
      this.#matchCountdownInterval = null;
    }
  }

  skipMatchCountdown(): void {
    this.#stopMatchCountdown();
    this.closeSpectatorDialog();
    this.queueStore.navigateToMatch();
  }

  handleAcceptMatch(): void {
    if (this.queueStore.pendingMatchId) {
      this.queueStore.markSelfAccepted();
      this.gateway.send({
        type: "matchmaking_accept",
        pendingMatchId: this.queueStore.pendingMatchId,
      });
    }
  }

  handleDeclineMatch(): void {
    if (this.queueStore.pendingMatchId) {
      this.gateway.send({
        type: "matchmaking_decline",
        pendingMatchId: this.queueStore.pendingMatchId,
      });
      this.queueStore.handleMatchReadyExpired({
        pendingMatchId: this.queueStore.pendingMatchId,
        reason: "declined",
      });
    }
  }

  openSpectatorDialog(matchId: string, gameId: string): void {
    this.spectatorMatchId = matchId;
    this.spectatorGameId = gameId;
    this.spectatorDialogOpen = true;
    this.#deps.trackEvent("spectate_while_queued_open");
  }

  closeSpectatorDialog(): void {
    this.spectatorDialogOpen = false;
    this.spectatorMatchId = null;
    this.spectatorGameId = null;
  }

  handleColorPreferenceUpdate(
    preferred: number,
    excluded: number,
    strength: "required" | "preferred",
  ): void {
    this.queueStore.preferredOpponentColors = preferred;
    this.queueStore.excludedOpponentColors = excluded;
    this.queueStore.colorPreferenceStrength = strength;
  }

  #handleGatewayMessage(msg: MatchmakingGatewayMessage): void {
    // Two-step matchmaking acceptance
    if (msg.type === "match_ready") {
      playSound("match-found");
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      this.queueStore.handleMatchReady(
        msg as unknown as {
          pendingMatchId: string;
          opponentDisplayName: string;
          acceptDeadline: number;
        },
      );
      return;
    }

    if (msg.type === "match_ready_update") {
      this.queueStore.handleMatchReadyUpdate(
        msg as unknown as { pendingMatchId: string; opponentAccepted: boolean },
      );
      return;
    }

    if (msg.type === "match_ready_expired") {
      this.#stopQueuePolling();
      this.queueStore.handleMatchReadyExpired(
        msg as unknown as { pendingMatchId: string; reason: "declined" | "timeout" },
      );
      // Poll for updated status — the accepting player may have been re-queued server-side
      this.gateway.send({ type: "matchmaking_poll" });
      return;
    }

    if (msg.type === "match_found") {
      this.#stopQueuePolling();
      // Route to lobby store if in any lobby room state
      if (this.lobbyStore.isInRoom || this.lobbyStore.status === "starting") {
        this.lobbyStore.handleMatchFound(
          msg as unknown as { matchId: string; gameId: string; playerId?: string },
        );
        return;
      }
      this.closeQueuedAiOverlay();
      this.queueStore.handleMatchFound(msg as never);
      this.#startMatchCountdown();
      return;
    }

    if (msg.type === "lobby_player_joined") {
      this.lobbyStore.handlePlayerJoined(
        msg as unknown as {
          roomCode: string;
          joinerDisplayName: string;
          joinerGameProfileId: string;
        },
      );
      return;
    }

    if (msg.type === "lobby_room_cancelled") {
      this.lobbyStore.handleRoomCancelled();
      return;
    }

    if (msg.type === "lobby_player_left") {
      this.lobbyStore.handlePlayerLeft();
      return;
    }

    if (msg.type === "matchmaking_status") {
      this.queueStore.handleStatusUpdate(msg as never);
      this.#syncQueuedSelectionFromStore();
      this.#syncQueuedAiState();
      return;
    }

    if (msg.type === "matchmaking_cancelled") {
      this.#stopQueuePolling();
      this.queueStore.handleCancelled(
        (msg.reason as "timeout" | "manual" | "match_creation_error") ?? "manual",
      );
      this.#syncQueuedAiState();
    }
  }

  #syncQueuedSelectionFromStore(): void {
    if (
      this.queueStore.status === "queued" &&
      this.queueStore.queuedFormat &&
      this.queueStore.queuedMode
    ) {
      this.selectedQueueFormat = this.queueStore.queuedFormat;
      this.selectedQueueMode = this.queueStore.queuedMode;
      this.selectedMatchType = this.queueStore.queuedMatchType ?? "casual";
    }
  }

  #syncQueuedAiState(): void {
    if (
      this.queueStore.status !== "queued" &&
      this.queueStore.status !== "match_ready" &&
      this.queueStore.status !== "match_found"
    ) {
      this.closeQueuedAiOverlay();
    }
  }

  #formatQueueTimeElapsed(): string {
    if (!this.queueStore.queuedAt) return "0:00";
    const elapsedMs = Date.now() - this.queueStore.queuedAt;
    const totalSecs = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  #formatQueueTimeRemaining(): string {
    const totalSecs = Math.floor(this.queueStore.timeRemainingMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  #resetImportDeckForm(): void {
    this.importDeckName = "";
    this.importDeckText = "";
    this.importDeckError = null;
  }

  #t(key: string, params?: Record<string, string>): string {
    return m[key as keyof typeof m](params ?? {});
  }

  #isTestingQueueEnabled(): boolean {
    const flags = this.#deps.getFeatureFlags();
    if (flags.testingQueueEnabled) return true;
    const user = this.#deps.authSession.user;
    if (!user) return false;
    if (isAdmin(user)) return true;
    return flags.testingQueueAccountIds.has(user.id);
  }
}

export function createMatchmakingLobbyController(
  options: MatchmakingLobbyControllerOptions = {},
  deps: Partial<ControllerDeps> = {},
): MatchmakingLobbyController {
  return new MatchmakingLobbyControllerImpl(options, {
    ...DEFAULT_DEPS,
    ...deps,
  });
}

const MATCHMAKING_PREFS_KEY = "tcg.matchmaking.prefs";

type MatchmakingPrefs = {
  format: QueueStatsFormat;
  mode: QueueStatsMode;
  matchType: "ranked" | "casual" | "testing";
};

function restoreSupportedQueueFormat(persisted: QueueStatsFormat | undefined): QueueStatsFormat {
  if (!persisted) return "infinity";
  const supported = QUEUE_CARD_DEFINITIONS.some((def) => def.format === persisted);
  return supported ? persisted : "infinity";
}

function loadMatchmakingPrefs(): Partial<MatchmakingPrefs> {
  try {
    const raw = localStorage.getItem(MATCHMAKING_PREFS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<MatchmakingPrefs>;
  } catch {
    return {};
  }
}

function saveMatchmakingPrefs(prefs: MatchmakingPrefs): void {
  try {
    localStorage.setItem(MATCHMAKING_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage unavailable (SSR, private browsing quota, etc.)
  }
}

const MATCHMAKING_LOBBY_CONTEXT_KEY = Symbol.for("lorcana.matchmaking-lobby");

export function setMatchmakingLobbyContext(
  controller: MatchmakingLobbyController,
): MatchmakingLobbyController {
  return setContext(MATCHMAKING_LOBBY_CONTEXT_KEY, controller);
}

export function getMatchmakingLobbyContext(): MatchmakingLobbyController {
  return getContext<MatchmakingLobbyController>(MATCHMAKING_LOBBY_CONTEXT_KEY);
}

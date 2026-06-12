import { goto } from "$app/navigation";
import { m } from "$lib/i18n/messages.js";
import {
  joinMatchmakingQueue,
  leaveMatchmakingQueue,
  getMatchmakingStatus,
  MatchmakingJoinError,
  type MatchmakingJoinParams,
  type MatchmakingStatusResponse,
} from "../api/matchmaking-api.js";
import { analyticsErrorFields, trackEvent } from "$lib/analytics/analytics.js";
import { saveRankedMatchSession } from "$lib/features/practice-match/practice-match-storage.js";
import { logError, logOperationalEvent } from "$lib/telemetry/logs.js";

const DEFAULT_ACCEPT_WINDOW_MS = 15_000;

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  const uad = (navigator as { userAgentData?: { mobile?: boolean } }).userAgentData;
  if (uad?.mobile !== undefined) return uad.mobile;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export type MatchmakingStatus =
  | "idle"
  | "checking"
  | "joining"
  | "queued"
  | "match_ready"
  | "match_found"
  | "blocked";
export type MatchmakingQueueFormat = "infinity" | "core-constructed";
export type MatchmakingQueueMode = "1" | "3";
export type MatchmakingQueueMatchType = "ranked" | "casual" | "testing";

const SUPPORTED_QUEUE_FORMATS: readonly MatchmakingQueueFormat[] = ["infinity", "core-constructed"];

function coerceQueuedFormat(value: string | undefined | null): MatchmakingQueueFormat | null {
  return SUPPORTED_QUEUE_FORMATS.includes(value as MatchmakingQueueFormat)
    ? (value as MatchmakingQueueFormat)
    : null;
}

export class MatchmakingQueueStore {
  status: MatchmakingStatus = $state("idle");
  queuedAt: number | null = $state(null);
  expiresAt: number | null = $state(null);
  /** Milliseconds until the queue entry expires. Updated each second. */
  timeRemainingMs: number = $state(0);
  /** Current position in queue (1-based). */
  position: number | null = $state(null);
  queuedGameProfileId: string | null = $state(null);
  queuedDeckListId: string | null = $state(null);
  queuedFormat: MatchmakingQueueFormat | null = $state(null);
  queuedMode: MatchmakingQueueMode | null = $state(null);
  queuedMatchType: MatchmakingQueueMatchType | null = $state(null);
  matchId: string | null = $state(null);
  gameId: string | null = $state(null);
  blockReason: string | null = $state(null);
  activeMatchId: string | null = $state(null);
  error: string | null = $state(null);
  forfeiting: boolean = $state(false);
  forfeitSuccess: boolean = $state(false);
  /** Countdown seconds remaining before navigating to the match (5→0). Null when not counting down. */
  matchCountdown: number | null = $state(null);
  matchFoundMatchId: string | null = $state(null);
  matchFoundGameId: string | null = $state(null);
  opponentDisplayName: string | null = $state(null);

  // --- Color preference state (casual / quick match only) ---
  /** Bitmask of opponent ink colors the player wants to face (≤2 bits). */
  preferredOpponentColors: number = $state(0);
  /** Bitmask of opponent ink colors the player wants to avoid (≤2 bits). */
  excludedOpponentColors: number = $state(0);
  colorPreferenceStrength: "required" | "preferred" = $state("preferred");

  // --- Two-step acceptance state ---
  pendingMatchId: string | null = $state(null);
  opponentAccepted: boolean = $state(false);
  /** Whether this client has clicked Accept. */
  selfAccepted: boolean = $state(false);
  acceptDeadline: number | null = $state(null);
  /** Milliseconds until the accept deadline. Updated frequently for smooth countdown. */
  acceptTimeRemainingMs: number = $state(0);

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private acceptTimerInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Check current queue status on mount (rejoin detection).
   * If the player is already in the queue, restores queued state with correct timer.
   */
  async checkStatus(): Promise<void> {
    try {
      const result = await getMatchmakingStatus();
      if (result.pendingMatchId && result.pendingMatchDeadline !== undefined) {
        this.applyPendingMatchFromStatus({
          pendingMatchId: result.pendingMatchId,
          acceptDeadline: result.pendingMatchDeadline,
          serverNow: result.pendingMatchServerNow,
          selfAccepted: result.pendingSelfAccepted ?? false,
          opponentAccepted: result.pendingOpponentAccepted ?? false,
        });
        return;
      }
      if (result.queued && result.entry) {
        this.queuedAt = result.entry.queuedAt;
        this.expiresAt = result.entry.expiresAt;
        this.position = result.position ?? null;
        this.queuedGameProfileId = result.entry.gameProfileId;
        this.queuedDeckListId = result.entry.deckListId;
        this.queuedFormat = coerceQueuedFormat(result.entry.format);
        this.queuedMode = result.entry.mode as MatchmakingQueueMode;
        this.queuedMatchType = (result.entry.matchType as MatchmakingQueueMatchType) ?? "ranked";
        this.status = "queued";
        this.startTimer();
      }
    } catch {
      // Non-fatal — user may not be authenticated or network unavailable
    }
  }

  /**
   * Hydrate queue state from a pre-fetched status response (SSR).
   * Same logic as checkStatus but without the fetch.
   */
  hydrateFromStatus(result: MatchmakingStatusResponse): void {
    if (result.pendingMatchId && result.pendingMatchDeadline !== undefined) {
      this.applyPendingMatchFromStatus({
        pendingMatchId: result.pendingMatchId,
        acceptDeadline: result.pendingMatchDeadline,
        serverNow: result.pendingMatchServerNow,
        selfAccepted: result.pendingSelfAccepted ?? false,
        opponentAccepted: result.pendingOpponentAccepted ?? false,
      });
      return;
    }
    if (result.queued && result.entry) {
      this.queuedAt = result.entry.queuedAt;
      this.expiresAt = result.entry.expiresAt;
      this.position = result.position ?? null;
      this.queuedGameProfileId = result.entry.gameProfileId;
      this.queuedDeckListId = result.entry.deckListId;
      this.queuedFormat = coerceQueuedFormat(result.entry.format);
      this.queuedMode = result.entry.mode as MatchmakingQueueMode;
      this.queuedMatchType = (result.entry.matchType as MatchmakingQueueMatchType) ?? "ranked";
      this.status = "queued";
      this.startTimer();
    }
  }

  /**
   * Join the matchmaking queue.
   */
  async join(params: MatchmakingJoinParams): Promise<void> {
    if (this.status === "joining" || this.status === "queued") {
      return;
    }

    this.error = null;
    this.blockReason = null;
    this.status = "joining";
    try {
      const isQuickMatch = params.matchType === "casual" || params.matchType === "testing";
      const enrichedParams: MatchmakingJoinParams = {
        ...params,
        isMobile: detectMobile(),
        ...(isQuickMatch && {
          preferredOpponentColors: this.preferredOpponentColors || undefined,
          excludedOpponentColors: this.excludedOpponentColors || undefined,
          colorPreferenceStrength: this.colorPreferenceStrength,
        }),
      };
      const entry = await joinMatchmakingQueue(enrichedParams);
      this.queuedAt = entry.queuedAt;
      this.expiresAt = entry.expiresAt;
      this.queuedGameProfileId = params.gameProfileId;
      this.queuedFormat = coerceQueuedFormat(params.format);
      this.queuedMode = params.mode as MatchmakingQueueMode;
      this.queuedMatchType = (params.matchType as MatchmakingQueueMatchType) ?? "ranked";
      this.status = "queued";
      this.startTimer();
      trackEvent("queue_join", {
        format: params.format,
        mode: params.mode,
        matchType: params.matchType ?? "ranked",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to join queue";
      if (message.toLowerCase().includes("active match")) {
        this.status = "blocked";
        this.blockReason = message;
        this.activeMatchId = err instanceof MatchmakingJoinError ? (err.matchId ?? null) : null;
        trackEvent("queue_join_blocked", { reason: "active_match" });
        logOperationalEvent(
          "matchmaking_queue_join_blocked",
          { reason: "active_match", format: params.format, mode: params.mode },
          "warn",
        );
      } else {
        this.status = "idle";
        this.error = message;
        trackEvent("queue_join_error", {
          error: "api_error",
          ...analyticsErrorFields(err),
        });
        logError(
          "matchmaking_queue_join_failed",
          { format: params.format, mode: params.mode, match_type: params.matchType ?? "ranked" },
          err instanceof Error ? err : undefined,
        );
      }
    }
  }

  /**
   * Leave the matchmaking queue.
   */
  async leave(): Promise<void> {
    trackEvent("queue_leave", { matchType: this.queuedMatchType ?? "casual" });
    try {
      await leaveMatchmakingQueue();
    } catch {
      // Ignore — may already be dequeued
    } finally {
      this.reset();
    }
  }

  /**
   * Handle an incoming match_found WebSocket message.
   * Sets state to match_found and redirects to the game.
   */
  handleMatchFound(msg: {
    matchId: string;
    gameId: string;
    playerId?: string;
    opponentDisplayName?: string;
    format: string;
    mode: string;
  }): void {
    console.log("[matchmaking-queue] match_found", {
      matchId: msg.matchId,
      gameId: msg.gameId,
      playerId: msg.playerId,
      opponent: msg.opponentDisplayName,
      format: msg.format,
      mode: msg.mode,
    });
    this.matchId = msg.matchId;
    this.gameId = msg.gameId;
    this.status = "match_found";
    this.matchFoundMatchId = msg.matchId;
    this.matchFoundGameId = msg.gameId;
    this.opponentDisplayName = msg.opponentDisplayName ?? null;
    // Clear pending-accept state so any stale match_ready_expired WS message
    // that arrives after match_found is ignored by handleMatchReadyExpired.
    this.pendingMatchId = null;
    this.stopTimer();
    this.stopAcceptTimer();
    const waitSeconds = this.queuedAt ? Math.round((Date.now() - this.queuedAt) / 1000) : 0;
    trackEvent("queue_match_found", {
      wait_seconds: waitSeconds,
      matchType: this.queuedMatchType ?? "casual",
    });

    // Save session so /match/[gameId] can identify and connect the player
    if (msg.playerId) {
      console.log("[matchmaking-queue] saving ranked match session", {
        matchId: msg.matchId,
        gameId: msg.gameId,
        playerId: msg.playerId,
      });
      saveRankedMatchSession({
        matchId: msg.matchId,
        gameId: msg.gameId,
        gameProfileId: msg.playerId,
      });
    } else {
      console.warn("[matchmaking-queue] match_found missing playerId, session not saved");
    }
  }

  /** Navigate to the match immediately (skip remaining countdown). */
  navigateToMatch(): void {
    console.log("[matchmaking-queue] navigateToMatch", {
      matchId: this.matchFoundMatchId,
      gameId: this.matchFoundGameId,
    });
    if (this.matchFoundMatchId && this.matchFoundGameId) {
      void goto(`/matches/${this.matchFoundMatchId}/games/${this.matchFoundGameId}`);
    }
  }

  /**
   * Handle an incoming matchmaking_status WebSocket message (response to poll).
   */
  handleStatusUpdate(msg: {
    queued: boolean;
    queuedAt?: number;
    expiresAt?: number;
    position?: number;
    pendingMatchId?: string;
    pendingMatchDeadline?: number;
    pendingMatchServerNow?: number;
    pendingSelfAccepted?: boolean;
    pendingOpponentAccepted?: boolean;
  }): void {
    if (msg.pendingMatchId && msg.pendingMatchDeadline !== undefined) {
      this.applyPendingMatchFromStatus({
        pendingMatchId: msg.pendingMatchId,
        acceptDeadline: msg.pendingMatchDeadline,
        serverNow: msg.pendingMatchServerNow,
        selfAccepted: msg.pendingSelfAccepted ?? false,
        opponentAccepted: msg.pendingOpponentAccepted ?? false,
      });
      return;
    }

    if (!msg.queued) {
      // Only reset when queued — match_ready exits exclusively via match_found /
      // match_ready_expired WS events or the local deadline timer, never via a
      // generic poll response (which can race against the server clearing the
      // pending match right before it sends match_found).
      if (this.status === "queued") {
        this.reset();
      }
      return;
    }

    if (msg.queuedAt !== undefined) this.queuedAt = msg.queuedAt;
    if (msg.expiresAt !== undefined) this.expiresAt = msg.expiresAt;
    if (msg.position !== undefined) this.position = msg.position;

    if (this.status !== "queued") {
      this.status = "queued";
      this.startTimer();
    }
  }

  /**
   * Handle an incoming matchmaking_cancelled WebSocket message.
   */
  handleCancelled(reason: "timeout" | "manual" | "match_creation_error"): void {
    console.log("[matchmaking-queue] cancelled", { reason, previousStatus: this.status });
    // Never cancel once a match is confirmed — match_found is the terminal success
    // state and the player is about to navigate to the game.
    if (this.status === "match_found") {
      console.log("[matchmaking-queue] ignoring cancellation, match already found");
      return;
    }
    if (reason === "timeout") {
      const waitSeconds = this.queuedAt ? Math.round((Date.now() - this.queuedAt) / 1000) : 0;
      trackEvent("queue_timeout", {
        wait_seconds: waitSeconds,
        matchType: this.queuedMatchType ?? "casual",
      });
      logOperationalEvent(
        "matchmaking_queue_timeout",
        { wait_seconds: waitSeconds, match_type: this.queuedMatchType ?? "casual" },
        "warn",
      );
    } else if (reason === "match_creation_error") {
      logOperationalEvent(
        "matchmaking_queue_match_creation_failed",
        { match_type: this.queuedMatchType ?? "casual" },
        "error",
      );
    }
    this.reset();
    if (reason === "timeout") {
      this.error = "Matchmaking timed out. Please try again.";
    } else if (reason === "match_creation_error") {
      this.error = m["sim.matchmaking.queue.error.creationFailed"]();
    }
  }

  // --- Two-step acceptance handlers ---

  /**
   * Handle an incoming match_ready WebSocket message.
   * Transitions to match_ready state and starts the accept countdown.
   */
  handleMatchReady(msg: {
    pendingMatchId: string;
    opponentDisplayName: string;
    acceptDeadline: number;
    serverNow?: number;
  }): void {
    console.log("[matchmaking-queue] match_ready", msg);
    this.applyPendingMatchFromStatus({
      pendingMatchId: msg.pendingMatchId,
      acceptDeadline: msg.acceptDeadline,
      serverNow: msg.serverNow,
      selfAccepted: false,
      opponentAccepted: false,
      opponentDisplayName: msg.opponentDisplayName,
    });
  }

  /**
   * Apply server snapshot for the pending-acceptance phase (HTTP status, WS poll, or fresh match_ready).
   */
  private applyPendingMatchFromStatus(params: {
    pendingMatchId: string;
    acceptDeadline: number;
    serverNow?: number;
    selfAccepted: boolean;
    opponentAccepted: boolean;
    opponentDisplayName?: string;
  }): void {
    this.status = "match_ready";
    this.pendingMatchId = params.pendingMatchId;
    this.acceptDeadline = this.normalizeAcceptDeadline(params.acceptDeadline, params.serverNow);
    this.opponentDisplayName = params.opponentDisplayName ?? this.opponentDisplayName ?? "";
    this.selfAccepted = params.selfAccepted;
    this.opponentAccepted = params.opponentAccepted;
    this.stopTimer();
    this.startAcceptTimer();
  }

  private normalizeAcceptDeadline(serverDeadline: number, serverNow?: number): number {
    const clientNow = Date.now();
    if (serverNow !== undefined) {
      const remainingMs = serverDeadline - serverNow;
      return clientNow + Math.max(0, remainingMs);
    }

    if (serverDeadline <= clientNow) {
      return clientNow + DEFAULT_ACCEPT_WINDOW_MS;
    }

    return serverDeadline;
  }

  /**
   * Handle an incoming match_ready_update WebSocket message.
   * Updates opponent acceptance status.
   */
  handleMatchReadyUpdate(msg: { pendingMatchId: string; opponentAccepted: boolean }): void {
    if (this.pendingMatchId === msg.pendingMatchId) {
      this.opponentAccepted = msg.opponentAccepted;
    }
  }

  /**
   * Handle an incoming match_ready_expired WebSocket message.
   * Resets to idle with an error message.
   */
  handleMatchReadyExpired(msg: { pendingMatchId: string; reason: "declined" | "timeout" }): void {
    if (this.pendingMatchId !== msg.pendingMatchId) return;
    console.log("[matchmaking-queue] match_ready_expired", msg);
    this.stopAcceptTimer();
    this.reset();
    if (msg.reason === "declined") {
      this.error = "Your opponent declined the match.";
    } else {
      this.error = "Match acceptance timed out. Please try again.";
    }
    trackEvent("queue_match_ready_expired", {
      reason: msg.reason,
      matchType: this.queuedMatchType ?? "casual",
    });
    logOperationalEvent(
      "matchmaking_queue_match_ready_expired",
      { reason: msg.reason, match_type: this.queuedMatchType ?? "casual" },
      "warn",
    );
  }

  /**
   * Mark this client as having accepted the pending match.
   */
  markSelfAccepted(): void {
    this.selfAccepted = true;
  }

  destroy(): void {
    this.stopTimer();
    this.stopAcceptTimer();
  }

  captureQueuedDeck(deckListId: string): void {
    this.queuedDeckListId = deckListId;
  }

  private startTimer(): void {
    this.stopTimer();
    this.updateTimeRemaining();
    this.timerInterval = setInterval(() => {
      this.updateTimeRemaining();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private updateTimeRemaining(): void {
    if (this.expiresAt === null) {
      this.timeRemainingMs = 0;
      return;
    }
    const remaining = this.expiresAt - Date.now();
    this.timeRemainingMs = Math.max(0, remaining);

    if (remaining <= 0 && this.status === "queued") {
      this.reset();
    }
  }

  private startAcceptTimer(): void {
    this.stopAcceptTimer();
    this.updateAcceptTimeRemaining();
    this.acceptTimerInterval = setInterval(() => {
      this.updateAcceptTimeRemaining();
    }, 100);
  }

  private stopAcceptTimer(): void {
    if (this.acceptTimerInterval !== null) {
      clearInterval(this.acceptTimerInterval);
      this.acceptTimerInterval = null;
    }
  }

  private updateAcceptTimeRemaining(): void {
    if (this.acceptDeadline === null) {
      this.acceptTimeRemainingMs = 0;
      return;
    }
    const remaining = this.acceptDeadline - Date.now();
    this.acceptTimeRemainingMs = Math.max(0, remaining);

    if (remaining <= 0 && this.status === "match_ready") {
      this.stopAcceptTimer();
      this.reset();
      this.error = "Match acceptance timed out. Please try again.";
    }
  }

  private reset(): void {
    this.status = "idle";
    this.queuedAt = null;
    this.expiresAt = null;
    this.timeRemainingMs = 0;
    this.position = null;
    this.queuedGameProfileId = null;
    this.queuedDeckListId = null;
    this.queuedFormat = null;
    this.queuedMode = null;
    this.queuedMatchType = null;
    this.matchId = null;
    this.gameId = null;
    this.blockReason = null;
    this.activeMatchId = null;
    this.error = null;
    this.forfeiting = false;
    this.forfeitSuccess = false;
    this.matchCountdown = null;
    this.matchFoundMatchId = null;
    this.matchFoundGameId = null;
    this.opponentDisplayName = null;
    this.pendingMatchId = null;
    this.opponentAccepted = false;
    this.selfAccepted = false;
    this.acceptDeadline = null;
    this.acceptTimeRemainingMs = 0;
    this.stopTimer();
    this.stopAcceptTimer();
  }
}

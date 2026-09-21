import {
  createAcceptedMoveRecord,
  createEngineLogRecord,
  getLorcanaServerAuthoritativeSnapshot,
  type CardsMaps,
  type EngineMoveHistoryEntry,
  type LorcanaServer,
  type LorcanaServerAuthoritativeSnapshot,
} from "@tcg/lorcana-engine";
import { HumanVsAiOrchestrator } from "../simulator-devtools/vs-ai/human-vs-ai-orchestrator.svelte.js";
import {
  AutomatedMatchPlaybackReadModel,
  createPersistedMoveLogEntries,
} from "../simulator-devtools/ai-match/playback-controller.js";
import type { GatewayTransportClient } from "../gateway/gateway-transport.js";
import type { HumanVsAiMatchConfig } from "../simulator-devtools/vs-ai/types.js";
import type { PracticeMatchRecentHistory } from "./types.js";

interface PracticeMatchOrchestratorOptions {
  gameId: string;
  playerId: string;
  botPlayerId: string;
  deckConfig: HumanVsAiMatchConfig;
  gateway: GatewayTransportClient;
  /** Which seat the human player occupies. Defaults to "playerOne" (practice games). */
  humanSeat?: "playerOne" | "playerTwo";
  /** Whether state is managed by the server or client. Defaults to "client". */
  authority?: "client" | "server";
  /** If provided, restore from this snapshot instead of starting fresh. */
  restoredSnapshot?: LorcanaServerAuthoritativeSnapshot;
  restoredVersion?: number;
  restoredRecentHistory?: PracticeMatchRecentHistory;
}

export class PracticeMatchOrchestrator {
  readonly orchestrator: HumanVsAiOrchestrator;
  readonly #gateway: GatewayTransportClient;
  readonly #gameId: string;
  readonly #playerId: string;
  readonly #botPlayerId: string;
  readonly #humanSeat: "playerOne" | "playerTwo";
  readonly #authority: "client" | "server";
  readonly #cardsMaps: CardsMaps;
  #version: number;
  #pushTimer: ReturnType<typeof setTimeout> | null = null;
  #pushRetryTimer: ReturnType<typeof setTimeout> | null = null;
  #pushFailures = 0;
  #watchdogTimer: ReturnType<typeof setInterval> | null = null;
  #unsubscribe: (() => void) | null = null;
  #persistedLogCount = 0;
  #persistedMoveCount = 0;
  #hasHydratedRecentHistory = false;
  // Client-authority games must establish this immutable version-zero baseline
  // before any move snapshot can be accepted by the runtime.
  #pendingInitialSnapshot: LorcanaServerAuthoritativeSnapshot | null = null;

  static async create(
    options: PracticeMatchOrchestratorOptions,
  ): Promise<PracticeMatchOrchestrator> {
    const humanVsAi = await HumanVsAiOrchestrator.create(options.deckConfig, {
      initialPerspective: options.humanSeat,
    });
    return new PracticeMatchOrchestrator(options, humanVsAi);
  }

  private constructor(options: PracticeMatchOrchestratorOptions, humanVsAi: HumanVsAiOrchestrator) {
    this.#gateway = options.gateway;
    this.#gameId = options.gameId;
    this.#botPlayerId = options.botPlayerId;
    this.#playerId = options.playerId;
    this.#humanSeat = options.humanSeat ?? "playerOne";
    this.#authority = options.authority ?? "client";
    this.orchestrator = humanVsAi;

    if (options.restoredSnapshot) {
      // Restore from snapshot (LorcanaServerAuthoritativeSnapshot)
      this.#cardsMaps = options.restoredSnapshot.cardsMaps;
      this.#version = options.restoredVersion ?? 0;
      this.orchestrator.restoreAuthoritativeSnapshot(options.restoredSnapshot);
      this.#hydrateRecentHistory(options.restoredRecentHistory);
      this.#persistedMoveCount = this.#getAcceptedMoveHistory().length;
      this.#persistedLogCount = this.#getMoveLogHistory().length;
      // A reconnect refresh push (same version, no new moves) is always
      // rejected as stale by the runtime — forward-only versioning — so only
      // push when unpersisted moves exist. Every versioned push re-carries
      // the full cardsMaps, which is what older sessions needed to heal.
      if (this.#persistedMoveCount > 0 || this.#persistedLogCount > 0) {
        this.#schedulePush("reconnect");
      }
    } else {
      // Fresh match — extract cardsMaps from the orchestrator's engine
      this.#cardsMaps = this.orchestrator.cardsMaps;
      this.#version = 0;
      this.#pendingInitialSnapshot = getLorcanaServerAuthoritativeSnapshot(
        this.orchestrator.server as unknown as LorcanaServer,
        this.#cardsMaps,
      );
      // Push initial state
      this.#schedulePush("init");
    }

    // Subscribe to state updates to push after each move
    this.#unsubscribe = this.orchestrator.subscribe(() => {
      this.#schedulePush("move");
    });

    // Re-base on a stale rejection: the server's stored chain is ahead of this
    // client, so pushing more local versions can never succeed. A reload
    // restores the stored server snapshot and the push loop re-arms at the
    // server's version.
    if (this.#authority === "client") {
      this.#gateway.addGameMessageListener((msg) => {
        if (
          msg.type === "move_rejected" &&
          (msg as { code?: string }).code === "rejected_stale" &&
          (msg as { gameId?: string }).gameId === this.#gameId
        ) {
          this.#rebaseReload("move_rejected:rejected_stale");
        }
      });
    }

    // Watchdog: if the engine has unpersisted moves but no push is scheduled or
    // retrying, the push loop has died silently (swallowed failure). A reload
    // re-syncs from the stored server snapshot, which is the only durable truth.
    if (this.#authority === "client") {
      this.#watchdogTimer = setInterval(() => {
        const hasUnpersistedMoves =
          this.#getAcceptedMoveHistory().length > this.#persistedMoveCount;
        const pushLoopIdle = this.#pushTimer === null && this.#pushRetryTimer === null;
        if (hasUnpersistedMoves && pushLoopIdle) {
          console.error(
            `[practice-match] push loop stalled with ${this.#getAcceptedMoveHistory().length - this.#persistedMoveCount} unpersisted moves; reloading to re-sync from the server`,
          );
          this.#rebaseReload("push-loop-stalled");
        }
      }, 20_000);
    }
  }

  /**
   * Reload the page so the match re-syncs from the stored server snapshot.
   * Guarded per game: at most one re-base every two minutes to avoid loops
   * when the server genuinely rejects the client state.
   */
  #rebaseReload(reason: string): void {
    try {
      const key = `pm-rebase:${this.#gameId}`;
      const last = Number(sessionStorage.getItem(key) ?? 0);
      if (Date.now() - last < 120_000) return;
      sessionStorage.setItem(key, String(Date.now()));
      console.error(`[practice-match] re-basing client from server snapshot (${reason})`);
      location.reload();
    } catch {
      // sessionStorage can throw in restricted contexts; fall back to a plain reload.
      location.reload();
    }
  }

  get currentEngine(): LorcanaServer {
    return this.orchestrator.currentEngine;
  }

  get readModel() {
    return this.orchestrator.readModel;
  }

  dispose(): void {
    this.#unsubscribe?.();
    this.#clearPushTimer();
    if (this.#pushRetryTimer !== null) {
      clearTimeout(this.#pushRetryTimer);
      this.#pushRetryTimer = null;
    }
    if (this.#watchdogTimer !== null) {
      clearInterval(this.#watchdogTimer);
      this.#watchdogTimer = null;
    }
    this.orchestrator.dispose();
  }

  hydrateRecentHistory(history: PracticeMatchRecentHistory): void {
    this.#hydrateRecentHistory(history);
  }

  /**
   * Immediately pushes the current state to the server, bypassing the debounce
   * timer. Called when the server sends a `request_state_sync` message (e.g. a
   * spectator joined but the stored snapshot lacks `cardsMaps`).
   */
  forcePush(): void {
    this.#clearPushTimer();
    void this.#pushState("sync").catch(() => {
      // Best-effort sync; a later scheduled push or reconnect can recover.
    });
  }

  /**
   * Flushes a debounced client-authority snapshot before navigation destroys
   * the websocket. This is especially important for the final post-game state:
   * without it, leaving the match can clear the timer before the server records
   * the practice match as completed.
   */
  async flushPendingState(moveType = "flush"): Promise<void> {
    if (this.#authority === "server") {
      return;
    }

    try {
      const shouldPush = this.#pushTimer !== null || this.#hasGameEnded();
      if (!shouldPush) {
        return;
      }

      this.#clearPushTimer();
      await this.#pushState(moveType, { awaitResponse: true });
    } catch {
      // Best-effort: still allow navigation if the response times out or the socket drops.
    }
  }

  #schedulePush(moveType: string): void {
    this.#clearPushTimer();
    this.#pushTimer = setTimeout(() => {
      this.#pushTimer = null;
      this.#attemptPush(moveType);
    }, 100);
  }

  /**
   * Run one push attempt and reschedule with backoff when it fails.
   *
   * A failed push used to be swallowed, which permanently stalled client
   * authority persistence: the local engine kept advancing while every later
   * snapshot was never sent, and the terminal post-game state never reached
   * the server. Retrying with capped backoff keeps the server in catch-up
   * range so the terminal state (and match completion) always lands.
   */
  #attemptPush(moveType: string): void {
    try {
      void this.#pushState(moveType)
        .then((sent) => {
          if (sent) {
            this.#pushFailures = 0;
            return;
          }
          this.#scheduleRetry(moveType, "socket not writable");
        })
        .catch((error) => {
          this.#scheduleRetry(moveType, error);
        });
    } catch (error) {
      this.#scheduleRetry(moveType, error);
    }
  }

  #scheduleRetry(moveType: string, reason: unknown): void {
    this.#pushFailures += 1;
    const attempt = this.#pushFailures;
    console.error(
      `[practice-match] push_state failed (attempt ${attempt}, moveType=${moveType}) — retrying with backoff`,
      reason instanceof Error ? reason.message : (reason ?? ""),
    );
    if (this.#pushFailures > 6) {
      // The next engine state change re-arms attempts; stop growing the timer
      // chain so a permanently broken connection cannot accumulate retries.
      console.error("[practice-match] push retries exhausted; waiting for the next state change");
      return;
    }
    if (this.#pushRetryTimer !== null) clearTimeout(this.#pushRetryTimer);
    this.#pushRetryTimer = setTimeout(
      () => {
        this.#pushRetryTimer = null;
        this.#attemptPush(moveType);
      },
      Math.min(500 * 2 ** (this.#pushFailures - 1), 8_000),
    );
  }

  #clearPushTimer(): void {
    if (this.#pushTimer !== null) {
      clearTimeout(this.#pushTimer);
      this.#pushTimer = null;
    }
    if (this.#pushRetryTimer !== null) {
      clearTimeout(this.#pushRetryTimer);
      this.#pushRetryTimer = null;
    }
  }

  /**
   * Push the current snapshot. Resolves `true` when the snapshot was handed
   * to the socket and the local counters advanced; resolves `false` when the
   * socket could not accept it (the caller retries with backoff). Throws only
   * when an awaited acknowledgement times out.
   */
  async #pushState(moveType: string, options?: { awaitResponse?: boolean }): Promise<boolean> {
    // Server authority never pushes local state; report it as handled so the
    // retry loop does not treat this as a socket failure.
    if (this.#authority === "server") return true;

    if (this.#pendingInitialSnapshot) {
      const initialSnapshot = this.#pendingInitialSnapshot;
      const initialMessage = {
        type: "push_state",
        gameId: this.#gameId,
        state: initialSnapshot.state,
        cardsMaps: initialSnapshot.cardsMaps,
        expectedVersion: null,
        version: 0,
        moveType: "init",
        actorId: this.#playerId,
      };
      try {
        // This acknowledgement proves the runtime wrote the version-zero
        // baseline; a successful websocket emit alone does not.
        await this.#gateway.sendWithAck(initialMessage, 3_000);
      } catch (error) {
        // A rejected baseline means the runtime already holds a newer state
        // chain for this game (e.g. an earlier session of the same match).
        // Retrying can never succeed — the server rejects version-zero
        // replays from behind — so re-sync from the stored snapshot instead.
        if (error === "move_rejected" || error === "rejected_stale") {
          this.#pendingInitialSnapshot = null;
          this.#rebaseReload("init_baseline_rejected");
          return false;
        }
        // The websocket can be connecting or drop before the runtime writes
        // the baseline. The old best-effort return lost it permanently.
        this.#schedulePush("init");
        return false;
      }
      this.#pendingInitialSnapshot = null;

      // The version-zero message above already persists a fresh engine. If
      // moves happened while the socket was unavailable, schedule their
      // versioned snapshot only after that baseline is durable.
      if (this.#getAcceptedMoveHistory().length === 0) return true;
    }

    const server = this.orchestrator.server as unknown as LorcanaServer;
    const engineSnapshot = getLorcanaServerAuthoritativeSnapshot(server, this.#cardsMaps);
    const nextMoveEntries = this.#getAcceptedMoveHistory().slice(this.#persistedMoveCount);
    const nextVersionStart = this.#version;
    const acceptedMoveRecords = nextMoveEntries.map((entry, index) =>
      createAcceptedMoveRecord({
        actorId: this.#resolveActorId(entry.playerId),
        gameId: this.#gameId,
        moveEntry: entry,
        sourceAuthority: "client",
        stateVersion: nextVersionStart + index + 1,
      }),
    );
    const latestStateVersion = acceptedMoveRecords.at(-1)?.stateVersion ?? this.#version;
    if (acceptedMoveRecords.length === 0) {
      // Nothing unpersisted to send. The runtime only accepts forward-only
      // versions (version == expectedVersion + 1), so re-pushing the current
      // version — e.g. the notify triggered by a snapshot restore — would be
      // rejected as stale. Log entries are only durable alongside their
      // move's version, so drop the window instead of sending them stranded.
      this.#persistedLogCount += this.#getMoveLogHistory().slice(this.#persistedLogCount).length;
      return true;
    }
    const newRawLogEntries = this.#getMoveLogHistory().slice(this.#persistedLogCount);
    // Filter out system logs (turnStart, gameEnd) which have no corresponding accepted move,
    // then pair each player-action log with its accepted move by index — same order, 1:1.
    // Index pairing is more robust than timestamp matching since two moves can share a ms.
    const playerActionLogs = newRawLogEntries.filter(
      (entry) => entry.moveType !== "turnStart" && entry.moveType !== "gameEnd",
    );
    const engineLogRecords = playerActionLogs.map((entry, i) =>
      createEngineLogRecord({
        gameId: this.#gameId,
        log: entry,
        sourceAuthority: "client",
        stateVersion: acceptedMoveRecords[i]?.stateVersion ?? latestStateVersion,
      }),
    );
    const actorId = acceptedMoveRecords.at(-1)?.actorId ?? this.#playerId;
    if (import.meta.env.DEV) {
      console.log(
        `[practice-match] push_state v${latestStateVersion} moveType=${moveType} actorId=${actorId}`,
      );
    }

    // Send raw engine state + cardsMaps as separate fields, matching the
    // flat EngineSnapshot format used by server-authority matches.
    const message = {
      type: "push_state",
      gameId: this.#gameId,
      state: engineSnapshot.state,
      cardsMaps: engineSnapshot.cardsMaps,
      expectedVersion: latestStateVersion === 0 ? null : latestStateVersion - 1,
      version: latestStateVersion,
      moveType,
      actorId,
      ...(acceptedMoveRecords.length === 1
        ? { acceptedMove: acceptedMoveRecords[0] }
        : acceptedMoveRecords.length > 1
          ? { acceptedMoves: acceptedMoveRecords }
          : {}),
      ...(engineLogRecords.length > 0 ? { engineLogs: engineLogRecords } : {}),
    };

    if (options?.awaitResponse) {
      await this.#gateway.sendWithAck<{
        type: "push_state:response";
        correlationId: string;
        status: "ok";
        data: {
          gameId: string;
          stateVersion: number;
          matchId: string;
          matchCompleted: boolean;
        };
      }>(message, 3_000);
    } else if (!this.#gateway.send(message)) {
      // The socket could not queue the snapshot (disconnected or saturated).
      // Counters stay untouched so a later attempt re-sends the same versions.
      return false;
    }

    this.#version = latestStateVersion;
    this.#persistedMoveCount += nextMoveEntries.length;
    // Track raw count (including filtered system logs) so the next slice window is correct.
    this.#persistedLogCount += newRawLogEntries.length;
    return true;
  }

  #hasGameEnded(): boolean {
    return Boolean(this.orchestrator.server.getState().ctx.status.gameEnded);
  }

  #getAcceptedMoveHistory(): EngineMoveHistoryEntry[] {
    return this.orchestrator.server.getMoveHistory();
  }

  #getMoveLogHistory(): import("@tcg/lorcana-engine").MoveLog[] {
    return this.orchestrator.server.getMoveLogHistory();
  }

  #resolveActorId(playerId?: string): string {
    const humanKey = this.#humanSeat === "playerOne" ? "player_one" : "player_two";
    const opponentKey = this.#humanSeat === "playerOne" ? "player_two" : "player_one";

    if (playerId === humanKey) {
      return this.#playerId;
    }

    if (playerId === opponentKey) {
      return this.#botPlayerId;
    }

    return playerId ?? this.#playerId;
  }

  #resolveActorSide(actorId: string) {
    if (actorId === this.#playerId) {
      return this.#humanSeat;
    }

    if (actorId === this.#botPlayerId) {
      return this.#humanSeat === "playerOne" ? ("playerTwo" as const) : ("playerOne" as const);
    }

    return undefined;
  }

  #hydrateRecentHistory(history?: PracticeMatchRecentHistory): void {
    if (!history || this.#hasHydratedRecentHistory) {
      return;
    }

    const readModel = this.orchestrator.readModel;
    if (!(readModel instanceof AutomatedMatchPlaybackReadModel)) {
      return;
    }

    const syntheticEntries = createPersistedMoveLogEntries({
      acceptedMoves: history.acceptedMoves,
      engineLogs: history.engineLogs,
      resolveActorSide: (actorId) => this.#resolveActorSide(actorId),
    });
    readModel.pushSyntheticMoveEntries(syntheticEntries);
    this.#hasHydratedRecentHistory = true;
  }
}

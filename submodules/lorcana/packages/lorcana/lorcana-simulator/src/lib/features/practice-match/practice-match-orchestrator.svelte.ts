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
import type { GatewayClientStore } from "../gateway/gateway-client.svelte.js";
import type { HumanVsAiMatchConfig } from "../simulator-devtools/vs-ai/types.js";
import type { PracticeMatchRecentHistory } from "./types.js";

interface PracticeMatchOrchestratorOptions {
  gameId: string;
  playerId: string;
  botPlayerId: string;
  deckConfig: HumanVsAiMatchConfig;
  gateway: GatewayClientStore;
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
  readonly #gateway: GatewayClientStore;
  readonly #gameId: string;
  readonly #playerId: string;
  readonly #botPlayerId: string;
  readonly #humanSeat: "playerOne" | "playerTwo";
  readonly #authority: "client" | "server";
  readonly #cardsMaps: CardsMaps;
  #version: number;
  #pushTimer: ReturnType<typeof setTimeout> | null = null;
  #unsubscribe: (() => void) | null = null;
  #persistedLogCount = 0;
  #persistedMoveCount = 0;
  #hasHydratedRecentHistory = false;

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
      // Push on reconnect so the server snapshot is refreshed with cardsMaps.
      // This covers games where an older client session never stored cardsMaps.
      this.#schedulePush("reconnect");
    } else {
      // Fresh match — extract cardsMaps from the orchestrator's engine
      this.#cardsMaps = this.orchestrator.cardsMaps;
      this.#version = 0;
      // Push initial state
      this.#schedulePush("init");
    }

    // Subscribe to state updates to push after each move
    this.#unsubscribe = this.orchestrator.subscribe(() => {
      this.#schedulePush("move");
    });
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
    this.#pushState("sync");
  }

  /**
   * Flushes a debounced client-authority snapshot before navigation destroys
   * the websocket. This is especially important for the final post-game state:
   * without it, leaving the match can clear the timer before the server records
   * the practice match as completed.
   */
  async flushPendingState(moveType = "flush"): Promise<void> {
    if (this.#authority === "server" || this.#pushTimer === null) {
      return;
    }

    this.#clearPushTimer();
    this.#pushState(moveType);

    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  #schedulePush(moveType: string): void {
    this.#clearPushTimer();
    this.#pushTimer = setTimeout(() => {
      this.#pushTimer = null;
      this.#pushState(moveType);
    }, 100);
  }

  #clearPushTimer(): void {
    if (this.#pushTimer !== null) {
      clearTimeout(this.#pushTimer);
      this.#pushTimer = null;
    }
  }

  #pushState(moveType: string): void {
    if (this.#authority === "server") return;

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
    this.#version = latestStateVersion;
    this.#persistedMoveCount += nextMoveEntries.length;
    // Track raw count (including filtered system logs) so the next slice window is correct.
    this.#persistedLogCount += newRawLogEntries.length;

    if (import.meta.env.DEV) {
      console.log(
        `[practice-match] push_state v${this.#version} moveType=${moveType} actorId=${actorId}`,
      );
    }

    // Send raw engine state + cardsMaps as separate fields, matching the
    // flat EngineSnapshot format used by server-authority matches.
    this.#gateway.send({
      type: "push_state",
      gameId: this.#gameId,
      state: engineSnapshot.state,
      cardsMaps: engineSnapshot.cardsMaps,
      version: this.#version,
      moveType,
      actorId,
      ...(acceptedMoveRecords.length === 1
        ? { acceptedMove: acceptedMoveRecords[0] }
        : acceptedMoveRecords.length > 1
          ? { acceptedMoves: acceptedMoveRecords }
          : {}),
      ...(engineLogRecords.length > 0 ? { engineLogs: engineLogRecords } : {}),
    });
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

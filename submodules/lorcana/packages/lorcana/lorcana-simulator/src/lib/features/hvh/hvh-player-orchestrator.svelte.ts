import { getLorcanaCardCatalogSync } from "@tcg/lorcana-cards/cards/sync";
import {
  createLorcanaClient,
  createPlayerId,
  type CardsMaps,
  type LorcanaClient,
  type LorcanaMatchState,
} from "@tcg/lorcana-engine";
import type { GatewayClientStore } from "../gateway/gateway-client.svelte.js";
import { GatewayTransport } from "../gateway/gateway-transport.js";
import type { IdleStore } from "../gateway/idle-store.svelte.js";
import type { LorcanaPlayerSide } from "../simulator/model/contracts.js";
import { isLorcanaSimulatorMoveId } from "../simulator/model/contracts.js";
import {
  SpectatorReadModel,
  createSpectatorHistoryEntries,
  createLiveEntries,
  type SpectatorRecentHistory,
} from "../spectator/spectator-match-orchestrator.svelte.js";

export interface HvHPlayerOrchestratorOptions {
  gateway: GatewayClientStore;
  /** Authoritative game ID from the URL / server — used as the Redis key. */
  gameId: string;
  state: LorcanaMatchState;
  cardsMaps: CardsMaps;
  /** This seat's `game_profiles.game_profile_id` (engine client id + gateway echo). */
  gameProfileId: string;
  /** Auth account id when signed in — echoed on gateway messages for correlation. */
  userId?: string;
  recentHistory?: SpectatorRecentHistory;
  /** If provided, the transport will send activity_update messages when the player goes AFK. */
  idleStore?: IdleStore;
}

/**
 * Lean orchestrator for Human-vs-Human matches.
 *
 * Uses a single LorcanaClient connected to the remote LorcanaServer via
 * GatewayTransport. Moves are executed on the server through the gateway WS.
 * No local server engine, no AI scheduling.
 */
export class HvHPlayerOrchestrator {
  readonly readModel = new SpectatorReadModel();

  readonly #client: LorcanaClient;
  readonly #gateway: GatewayClientStore;
  readonly #cardsMaps: CardsMaps;
  readonly #gameProfileId: string;
  readonly #userId: string | undefined;
  readonly #gameId: string;

  #stateUnsubscribe: (() => void) | null = null;

  constructor(options: HvHPlayerOrchestratorOptions) {
    this.#gateway = options.gateway;
    this.#cardsMaps = options.cardsMaps;
    this.#gameProfileId = options.gameProfileId;
    this.#userId = options.userId;
    this.#gameId = options.gameId;

    const cardCatalog = getLorcanaCardCatalogSync();
    const players = Object.keys(options.cardsMaps.owners).map((id) => ({ id }));
    const authoritativeGoingFirst = createPlayerId(
      String(options.state.ctx.status.otp ?? players[0]?.id ?? options.gameProfileId),
    );

    const transport = new GatewayTransport({
      gateway: options.gateway,
      gameId: this.#gameId,
      gameProfileId: options.gameProfileId,
      userId: options.userId,
      matchID: options.state.ctx.matchID,
      initialState: options.state,
      idleStore: options.idleStore,
    });

    this.#client = createLorcanaClient({
      seed: options.state.ctx.random.seed,
      cardsMaps: options.cardsMaps,
      cardCatalog,
      players,
      playerId: options.gameProfileId,
      role: "player",
      transport,
      goingFirst: authoritativeGoingFirst,
    });
    this.#client.connectSync();

    // Hydrate recent history
    if (options.recentHistory) {
      this.readModel.pushEntries(
        createSpectatorHistoryEntries({
          acceptedMoves: options.recentHistory.acceptedMoves,
          engineLogs: options.recentHistory.engineLogs,
          engine: this.#client,
          cardsMaps: this.#cardsMaps,
          resolveActorSide: (actorId) => this.#resolveActorSide(actorId),
          viewerId: this.#gameProfileId,
        }),
      );
    }

    this.#stateUnsubscribe = this.#subscribeToStateChanges();
  }

  get currentEngine(): LorcanaClient {
    return this.#client;
  }

  dispose(): void {
    this.#stateUnsubscribe?.();
    this.#gateway.send({
      type: "leave_game",
      gameId: this.#gameId,
      gameProfileId: this.#gameProfileId,
      ...(this.#userId ? { userId: this.#userId } : {}),
    });
  }

  /**
   * Apply a state_update for move log display.
   * The GatewayTransport handles state_update internally for engine state;
   * this method only updates the readModel move log.
   */
  applyStateUpdate(msg: {
    acceptedMove?: SpectatorRecentHistory["acceptedMoves"][number];
    engineLogs?: SpectatorRecentHistory["engineLogs"];
  }): void {
    if (msg.acceptedMove) {
      this.readModel.pushEntries(
        createLiveEntries({
          acceptedMove: msg.acceptedMove,
          engineLogs: msg.engineLogs ?? [],
          engine: this.#client,
          cardsMaps: this.#cardsMaps,
          resolveActorSide: (actorId) => this.#resolveActorSide(actorId),
          viewerId: this.#gameProfileId,
        }),
      );
    }
  }

  /** Hydrate move log from recent history (e.g. from game_recent_history WS message). */
  hydrateRecentHistory(history: SpectatorRecentHistory): void {
    this.readModel.pushEntries(
      createSpectatorHistoryEntries({
        acceptedMoves: history.acceptedMoves,
        engineLogs: history.engineLogs,
        engine: this.#client,
        cardsMaps: this.#cardsMaps,
        resolveActorSide: (actorId) => this.#resolveActorSide(actorId),
        viewerId: this.#gameProfileId,
      }),
    );
  }

  #subscribeToStateChanges(): () => void {
    type ClientEngineWithHook = {
      engine: { onStateUpdate(cb: (board: unknown) => void): () => void };
    };
    const internals = this.#client as unknown as ClientEngineWithHook;
    return internals.engine.onStateUpdate(() => {
      this.readModel.notifyStateUpdated();
    });
  }

  #resolveActorSide(actorId: string): LorcanaPlayerSide | undefined {
    const [p1, p2] = this.#client.getBoard().playerOrder.map(String);
    if (actorId === p1) return "playerOne";
    if (actorId === p2) return "playerTwo";
    return undefined;
  }
}

/**
 * Responsibility: generic multiplayer test harness.
 * Wires one authoritative `ServerEngine` with per-view `ClientEngine` instances via
 * `InMemoryTransport`, so tests exercise sync/serialization behavior end-to-end.
 * This class must stay game-agnostic and avoid game-specific fixture/projection logic.
 *
 * Docs:
 * - ../../docs/ENGINE_SIMPLIFICATION_PLAN.md
 */

import type {
  DeepReadonly,
  MatchRuntimeConfig,
  MatchState,
  FilteredMatchView,
  MatchStaticResources,
  MoveInput,
} from "../runtime";
import type { MoveRecord, RuntimeMoveInputMap } from "../runtime/match-runtime.types";

type InferMoveInputMap<TMoves extends MoveRecord> = RuntimeMoveInputMap<TMoves>;
import type { CardQueryAPI } from "../runtime/card-runtime";
import { createCardQueryAPI } from "../runtime/card-runtime";
import type { BaseCardDefinition, BaseCardMeta } from "../runtime/card-contracts";
import type { Player } from "../runtime/match-runtime.types";
import {
  createInMemoryTransportPair,
  type InMemoryTransport,
} from "../runtime/in-memory-transport";
import type {
  GameEngine,
  EngineActorContext,
  EngineMoveValidationResult,
  EngineMoveExecutionResult,
  EngineMoveHistoryEntry,
} from "../engine/contracts";
import { CoreTestEngine } from "./core-test-engine";
import type { GameTestView, PlayerActionInterface } from "./core-test-engine";
import { ServerEngine } from "../engine/server-engine";
import { ClientEngine } from "../engine/client-engine";

export const SPECTATOR_PLAYER_ID = "spectator";
export const CANONICAL_PLAYER_ONE = "player_one";
export const CANONICAL_PLAYER_TWO = "player_two";

export interface MultiplayerTestEngineConfig {
  runtimeConfig: MatchRuntimeConfig;
  players: Player[];
  seed?: string;
  staticResources: MatchStaticResources;
  includeSpectator?: boolean;
  debugServerCommunication?: boolean;
  engines?: {
    clientEngines?: Record<
      string,
      {
        engine: ClientEngine;
        player: Player;
      }
    >;
    spectatorEngine?: ClientEngine;
    serverEngine?: ServerEngine;
  };
}

export interface SyncOptions {
  timeoutMs?: number;
  pollIntervalMs?: number;
}

export class MultiplayerTestEngine extends CoreTestEngine<
  FilteredMatchView,
  Record<string, MoveInput>,
  MatchState
> {
  private serverEngine: ServerEngine;
  private playerEngines: Map<GameTestView, ClientEngine> = new Map();
  private transportPairs: Map<string, { client: InMemoryTransport; server: InMemoryTransport }> =
    new Map();
  private config: MultiplayerTestEngineConfig;
  private initialized: boolean = false;

  constructor(config: MultiplayerTestEngineConfig) {
    super();
    this.config = config;

    this.serverEngine =
      config.engines?.serverEngine ??
      new ServerEngine({
        runtimeConfig: config.runtimeConfig,
        players: config.players,
        seed: config.seed,
        staticResources: config.staticResources,
        debugMode: config.debugServerCommunication,
      });

    for (const player of config.players) {
      const transportPair = createInMemoryTransportPair();
      transportPair.identifier = `${player.id}:in-memory-transport`;
      this.transportPairs.set(player.id, transportPair);
      this.serverEngine.acceptConnection(player.id, transportPair.server);

      const clientEngine =
        config.engines?.clientEngines?.[player.id].engine ||
        new ClientEngine({
          playerId: player.id,
          transport: transportPair.client,
          role: "player",
          runtimeConfig: config.runtimeConfig,
          staticResources: config.staticResources,
          debugMode: config.debugServerCommunication,
          identifier: `${player.id}:client-engine`,
          players: config.players,
          seed: config.seed,
        });
      clientEngine.setTransport(transportPair.client);

      const view = player.id === config.players[0].id ? "playerOne" : "playerTwo";

      this.playerEngines.set(view, clientEngine);
    }

    if (config.includeSpectator) {
      const spectatorTransport = createInMemoryTransportPair();
      spectatorTransport.identifier = `${SPECTATOR_PLAYER_ID}:in-memory-transport`;
      this.transportPairs.set(SPECTATOR_PLAYER_ID, spectatorTransport);
      this.serverEngine.acceptConnection(SPECTATOR_PLAYER_ID, spectatorTransport.server);

      const spectatorEngine =
        config.engines?.spectatorEngine ||
        new ClientEngine({
          playerId: SPECTATOR_PLAYER_ID,
          transport: spectatorTransport.client,
          role: SPECTATOR_PLAYER_ID,
          runtimeConfig: config.runtimeConfig,
          staticResources: config.staticResources,
          players: config.players,
          seed: config.seed,
          debugMode: config.debugServerCommunication,
          identifier: `${SPECTATOR_PLAYER_ID}:client-engine`,
        });

      spectatorEngine.setTransport(spectatorTransport.client);
      this.playerEngines.set(SPECTATOR_PLAYER_ID, spectatorEngine);
    }
  }

  /**
   * Synchronously initialize all client engines.
   * In sync mode, all transports are fully synchronous - no async delays.
   */
  initializeSync(): void {
    if (this.initialized) {
      return;
    }
    for (const engine of this.playerEngines.values()) {
      engine.connectSync();
    }
    this.initialized = true;
  }

  async initialize(): Promise<void> {
    this.initializeSync();
  }

  static async create(config: MultiplayerTestEngineConfig): Promise<MultiplayerTestEngine> {
    const engine = new MultiplayerTestEngine(config);
    await engine.initialize();
    return engine;
  }

  getStateForView(view: GameTestView): FilteredMatchView {
    if (view === "authoritative") {
      return this.getAuthoritativeVisibleState();
    }

    const engine = this.playerEngines.get(view);
    if (!engine) {
      throw new Error(`View not found: ${view}`);
    }

    return engine.getBoard() as FilteredMatchView;
  }

  getAuthoritativeState(): DeepReadonly<MatchState> {
    return this.serverEngine.getState();
  }

  executeMoveForView(
    view: GameTestView,
    moveId: string,
    input: MoveInput,
  ): EngineMoveExecutionResult {
    if (view === "authoritative") {
      return this.serverEngine.executeMove(moveId, input);
    }
    const engine = this.playerEngines.get(view);
    if (!engine) {
      return { success: false, reason: "View not found", code: "VIEW_NOT_FOUND" };
    }
    return engine.executeMove(moveId, input);
  }

  validateMoveForView(
    view: GameTestView,
    moveId: string,
    input: MoveInput,
  ): EngineMoveValidationResult {
    if (view === "authoritative") {
      return this.serverEngine.validateMove(moveId, input);
    }
    const engine = this.playerEngines.get(view);
    if (!engine) {
      return { valid: false, reason: "View not found", code: "VIEW_NOT_FOUND" };
    }
    return engine.validateMove(moveId, input);
  }

  getEngineForView(view: GameTestView): GameEngine {
    if (view === "authoritative") {
      return new ServerEngineAdapter(this.serverEngine, () => this.getAuthoritativeVisibleState());
    }

    const engine = this.playerEngines.get(view);
    if (!engine) {
      throw new Error(`View not found: ${view}`);
    }

    return new ClientEngineAdapter(engine);
  }

  getStateID(): number {
    return this.serverEngine.getStateID();
  }

  getProjection(): FilteredMatchView {
    return this.serverEngine.getBoard() as FilteredMatchView;
  }

  getMoveHistory(limit?: number): EngineMoveHistoryEntry[] {
    return this.serverEngine.getMoveHistory(limit);
  }

  async dispose(): Promise<void> {
    await this.serverEngine.dispose(true);

    for (const engine of this.playerEngines.values()) {
      await engine.dispose(true);
    }

    this.playerEngines.clear();
    this.transportPairs.clear();
    this.initialized = false;
  }

  asPlayerOne(): PlayerActionInterface<FilteredMatchView> {
    return this.createPlayerActionInterface(
      "playerOne",
      this.config.players[0]?.id || CANONICAL_PLAYER_ONE,
    );
  }

  asPlayerTwo(): PlayerActionInterface<FilteredMatchView> {
    return this.createPlayerActionInterface(
      "playerTwo",
      this.config.players[1]?.id || CANONICAL_PLAYER_TWO,
    );
  }

  override asPlayer(playerId: string): PlayerActionInterface<FilteredMatchView> {
    const view = this.resolveViewForPlayerId(playerId);
    if (!view) {
      throw new Error(`Unknown player: ${playerId}`);
    }
    return this.createPlayerActionInterface(view, playerId);
  }

  private createPlayerActionInterface(
    view: GameTestView,
    playerId: string,
  ): PlayerActionInterface<FilteredMatchView> {
    return {
      playerId,
      getState: () => this.getStateForView(view) as DeepReadonly<FilteredMatchView>,
      getBoard: () => this.getStateForView(view),
      executeMove: (moveId, params) => this.executeMoveForView(view, String(moveId), params),
      canExecuteMove: (moveId, params) =>
        this.validateMoveForView(view, String(moveId), params).valid,
      getValidMoves: () => [],
    };
  }

  async syncToStateID(targetStateID: number, options: SyncOptions = {}): Promise<void> {
    const timeoutMs = options.timeoutMs ?? 1000;
    const pollIntervalMs = options.pollIntervalMs ?? 10;
    const deadline = Date.now() + timeoutMs;
    for (; Date.now() < deadline; ) {
      const allSynced = Array.from(this.playerEngines.values()).every(
        (e) => e.getStateID() >= targetStateID,
      );
      if (allSynced) {
        return;
      }
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }

    throw new Error(`Timeout waiting for sync to state ${targetStateID}`);
  }

  async sync(options: SyncOptions = {}): Promise<void> {
    await this.syncToStateID(this.serverEngine.getStateID(), options);
  }

  getServerEngine(): ServerEngine {
    return this.serverEngine;
  }

  /**
   * Get the CardQueryAPI for accessing card definitions and metadata.
   * This provides rich RuntimeCardWithDefinition access without requiring manual registry building.
   */
  getCardQuery(): CardQueryAPI {
    const state = this.serverEngine.getRuntime().getState();
    return createCardQueryAPI(state, this.config.staticResources, {
      deriveRuntimeCard: this.config.runtimeConfig.deriveRuntimeCard,
    });
  }

  getClientEngine(
    view: "playerOne" | "playerTwo" | "spectator",
  ): ClientEngine | GameEngine | undefined;
  override getClientEngine(playerId: string): GameEngine | undefined;
  getClientEngine(playerOrView: string): ClientEngine | GameEngine | undefined {
    const view =
      playerOrView === "playerOne" || playerOrView === "playerTwo" || playerOrView === "spectator"
        ? playerOrView
        : this.resolveViewForPlayerId(playerOrView);

    if (!view || view === "authoritative") {
      return undefined;
    }

    const engine = this.playerEngines.get(view);
    if (!engine) {
      return undefined;
    }

    if (
      playerOrView === "playerOne" ||
      playerOrView === "playerTwo" ||
      playerOrView === "spectator"
    ) {
      return engine;
    }

    return new ClientEngineAdapter(engine);
  }

  areAllClientsSynced(): boolean {
    const serverStateID = this.serverEngine.getStateID();
    return Array.from(this.playerEngines.values()).every((e) => e.getStateID() >= serverStateID);
  }

  getConnectedPlayerIds(): string[] {
    return this.serverEngine.getConnectedPlayerIds();
  }

  protected override resolveViewForPlayerId(playerId: string): GameTestView | undefined {
    const firstId = this.config.players[0]?.id;
    const secondId = this.config.players[1]?.id;
    if (playerId === firstId || playerId === CANONICAL_PLAYER_ONE || playerId === "p1") {
      return "playerOne";
    }
    if (playerId === secondId || playerId === CANONICAL_PLAYER_TWO || playerId === "p2") {
      return "playerTwo";
    }
    if (playerId === "spectator") {
      return this.config.includeSpectator ? "spectator" : undefined;
    }
    if (playerId === "authoritative") {
      return "authoritative";
    }
    return undefined;
  }

  private getAuthoritativeVisibleState(): FilteredMatchView {
    if (typeof this.config.runtimeConfig.projectBoard === "function") {
      return this.serverEngine
        .getRuntime()
        .getProjectedBoardView(
          { role: "judge" },
          { serverTimestamp: Date.now() },
        ) as FilteredMatchView;
    }

    return this.serverEngine.getState().G as unknown as FilteredMatchView;
  }

  getBoardForView(view: GameTestView): FilteredMatchView {
    return this.getStateForView(view);
  }
}

class ServerEngineAdapter implements GameEngine {
  constructor(
    private serverEngine: ServerEngine,
    private readonly getVisibleState: () => FilteredMatchView,
  ) {}

  getState(): DeepReadonly<MatchState> {
    return this.getVisibleState() as unknown as DeepReadonly<MatchState>;
  }

  getBoard(): DeepReadonly<FilteredMatchView> {
    return this.getVisibleState() as DeepReadonly<FilteredMatchView>;
  }

  getStateID(): number {
    return this.serverEngine.getStateID();
  }

  validateMove<K extends keyof InferMoveInputMap<MoveRecord> & string>(
    moveId: K,
    input: InferMoveInputMap<MoveRecord>[K],
  ): EngineMoveValidationResult {
    return this.serverEngine.validateMove(moveId, input);
  }

  executeMove<K extends keyof InferMoveInputMap<MoveRecord> & string>(
    moveId: K,
    input: InferMoveInputMap<MoveRecord>[K],
  ): EngineMoveExecutionResult {
    return this.serverEngine.executeMove(moveId, input);
  }

  enumerateMoves(): Array<keyof InferMoveInputMap<MoveRecord> & string> {
    return this.serverEngine.enumerateMoves();
  }

  getMoveHistory(limit?: number): EngineMoveHistoryEntry[] {
    return this.serverEngine.getMoveHistory(limit);
  }

  getActorContext(): EngineActorContext {
    return { role: "judge" };
  }

  canUndo(playerId: string): boolean {
    return this.serverEngine.canUndo(playerId);
  }

  undo(playerId: string, prevStateID?: number): boolean {
    return this.serverEngine.undo(playerId, prevStateID);
  }

  async dispose(): Promise<void> {
    await this.serverEngine.dispose();
  }
}

class ClientEngineAdapter implements GameEngine {
  constructor(private clientEngine: ClientEngine) {}

  getState(): DeepReadonly<MatchState> {
    return this.clientEngine.getState();
  }

  getBoard(): DeepReadonly<FilteredMatchView> {
    return this.clientEngine.getBoard() as DeepReadonly<FilteredMatchView>;
  }

  getStateID(): number {
    return this.clientEngine.getStateID();
  }

  validateMove<K extends keyof InferMoveInputMap<MoveRecord> & string>(
    moveId: K,
    input: InferMoveInputMap<MoveRecord>[K],
  ): EngineMoveValidationResult {
    return this.clientEngine.validateMove(moveId, input);
  }

  executeMove<K extends keyof InferMoveInputMap<MoveRecord> & string>(
    moveId: K,
    input: InferMoveInputMap<MoveRecord>[K],
  ): EngineMoveExecutionResult {
    return this.clientEngine.executeMove(moveId, input);
  }

  enumerateMoves(): Array<keyof InferMoveInputMap<MoveRecord> & string> {
    return this.clientEngine.enumerateMoves();
  }

  getMoveHistory(limit?: number): EngineMoveHistoryEntry[] {
    return this.clientEngine.getMoveHistory(limit);
  }

  getActorContext(): EngineActorContext {
    return this.clientEngine.getActorContext();
  }

  canUndo(playerId: string): boolean {
    return this.clientEngine.canUndo(playerId);
  }

  undo(playerId: string, prevStateID?: number): boolean {
    return this.clientEngine.undo(playerId, prevStateID);
  }

  async dispose(): Promise<void> {
    await this.clientEngine.dispose();
  }
}

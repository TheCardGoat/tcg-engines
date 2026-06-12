import { configureLogtape } from "../config/logtape/configure";

import { getLogger, type Logger, type LogLevel } from "@logtape/logtape";

const logger = getLogger(["lorcana-engine", "multiplayer-test-engine"]);

import {
  type BrowserTransportConfig,
  type CardsMaps,
  type EngineMoveExecutionResult,
  type EngineMoveHistoryEntry,
  type DeepReadonly,
  type InMemoryTransport,
  type MatchState,
  type MatchStaticResources,
  type MoveInput,
  type PlayerId,
  type CardInstanceId,
  type TimeControlConfig,
  createCardsMapsFromStaticResources,
  createInMemoryTransportPair,
  normalizeBrowserTransportConfig,
  type PublishedGameEvent,
} from "#core";
import {
  type GameTestView,
  SPECTATOR_PLAYER_ID,
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
} from "#core/testing";

import { LorcanaClient } from "../lorcana-client";
import type {
  CardInput,
  LorcanaCardDefinition,
  LorcanaG,
  LorcanaMatchState,
  LorcanaProjectedBoardView,
  LorcanaProjectedCard,
  LorcanaRuntimeMoveInputs,
  LorcanaRuntimeMoveParams,
} from "../types";
import { LorcanaServer, type TestInitialState } from "./index";
import { createEmptyLorcanaStaticResources } from "./serialization";
import { resolveCardInstanceIdFromInput } from "../card-input-resolver";
import {
  buildFixtureSeedBundle,
  createInitialCardMeta,
  detectWinnerByLore,
  isTestInitialState,
  normalizePlayerId,
  type FixtureSeedBundle,
} from "./lorcana-multiplayer-test-engine-helpers";

import {
  FALLBACK_LORCANA_CARD,
  FALLBACK_LORCANA_PROJECTED_CARD,
} from "../fallback-card-definition";
import { LorcanaEngineBase } from "../lorcana-engine-base";
import { recomputeLoreToWin } from "../runtime-moves/effects/win-condition-effects";
import { buildZoneRegistry } from "../core/runtime/zone-registry";
import { lorcanaRuntimeZones } from "../zones";
import { invalidateStaticEffects } from "../runtime-moves/rules/static-effects-invalidation";

type CardRef = CardInput;

export { SPECTATOR_PLAYER_ID, CANONICAL_PLAYER_ONE, CANONICAL_PLAYER_TWO } from "#core/testing";

const TEST_PLAYERS = [
  { id: CANONICAL_PLAYER_ONE, name: "Player 1" },
  { id: CANONICAL_PLAYER_TWO, name: "Player 2" },
] as const;
const DEFAULT_UNSPECIFIED_DECK_SIZE = 10;

type FixtureZoneName = "deck" | "hand" | "play" | "inkwell" | "discard" | "limbo";

/**
 * Lorcana move parameters (simplified for test engine)
 */
export interface LorcanaTestMoves extends Record<string, unknown> {
  chooseWhoGoesFirst: LorcanaRuntimeMoveParams["chooseWhoGoesFirst"];
  alterHand: LorcanaRuntimeMoveParams["alterHand"];
  playCard: LorcanaRuntimeMoveParams["playCard"];
  quest: LorcanaRuntimeMoveParams["quest"];
  questWithAll: LorcanaRuntimeMoveParams["questWithAll"];
  challenge: LorcanaRuntimeMoveParams["challenge"];
  moveCharacterToLocation: LorcanaRuntimeMoveParams["moveCharacterToLocation"];
  putCardIntoInkwell: LorcanaRuntimeMoveParams["putCardIntoInkwell"];
  passTurn: LorcanaRuntimeMoveParams["passTurn"];
  concede: LorcanaRuntimeMoveParams["concede"];
  manualMoveCard: LorcanaRuntimeMoveParams["manualMoveCard"];
  manualExertCard: LorcanaRuntimeMoveParams["manualExertCard"];
  manualReadyCard: LorcanaRuntimeMoveParams["manualReadyCard"];
  manualDryCard: LorcanaRuntimeMoveParams["manualDryCard"];
  manualSetDamage: LorcanaRuntimeMoveParams["manualSetDamage"];
  manualSetLore: LorcanaRuntimeMoveParams["manualSetLore"];
  manualShuffleDeck: LorcanaRuntimeMoveParams["manualShuffleDeck"];
  manualPassTurn: LorcanaRuntimeMoveParams["manualPassTurn"];
}

export interface LorcanaTestEngineConfig {
  browserTransport?: BrowserTransportConfig;
  seed?: string;
  includeSpectator?: boolean;
  optimizeInactiveClientProjection?: boolean;
  startingLore?: Record<string, number>;
  startingInk?: Record<string, number>;
  initialView?: GameTestView;
  /** Pre-built static resources (e.g. from fromInitialStates). When not set, an empty bundle is used. */
  staticResources?: MatchStaticResources;
  /** Time control configuration for the match. Defaults to no clock. */
  timeControl?: TimeControlConfig;
}

export interface LorcanaFixtureInitOptions extends LorcanaTestEngineConfig {
  skipPreGame?: boolean;
  validateSync?: boolean;
  debugServerCommunication?: boolean;
  // Enable verbose logging for debugging.
  showLogs?: boolean;
  logLevel?: LogLevel;
}

/**
 * Lorcana Multiplayer Test Engine
 *
 * Standalone Lorcana multiplayer harness backed by real ServerEngine + ClientEngine
 * with InMemoryTransport for comprehensive serialization testing.
 */
export class LorcanaMultiplayerTestEngine {
  private currentView: GameTestView;
  private serverEngine: LorcanaServer;
  private playerEngines = new Map<GameTestView, LorcanaClient>();
  private transportPairs: Map<string, { client: InMemoryTransport; server: InMemoryTransport }> =
    new Map();
  private initialized = false;
  private fixtureOptions: LorcanaFixtureInitOptions;
  /** Instance ID -> definition ID for simulator/tooling (card definitions live in staticResources) */
  private instanceIdToDefinitionId = new Map<string, string>();
  /** CardsMaps snapshot captured at construction time for serialization/restoration. */
  private _cardsMaps: CardsMaps;
  /** Definition ID -> card definition for client helper lookups */
  private definitionIdToCard = new Map<string, LorcanaCardDefinition>();
  logger: Logger;
  debug = false;

  constructor(config: LorcanaTestEngineConfig, fixtureOptions?: LorcanaFixtureInitOptions) {
    if (!fixtureOptions) {
      throw new Error("LorcanaMultiplayerTestEngine requires fixtureOptions");
    }
    this.currentView = config.initialView ?? "authoritative";

    const staticResources: MatchStaticResources =
      config.staticResources ?? createEmptyLorcanaStaticResources();
    const players = [...TEST_PLAYERS];
    const includeSpectator = config.includeSpectator ?? true;
    const debugMode = fixtureOptions.debugServerCommunication ?? false;
    const seed = config.seed ?? "lorcana-multiplayer-test-engine";
    const browserTransport = normalizeBrowserTransportConfig(config.browserTransport);
    const cardsMaps = createCardsMapsFromStaticResources(staticResources);
    this._cardsMaps = cardsMaps;

    const serverInitParams = {
      players,
      seed,
      staticResources,
      goingFirst: CANONICAL_PLAYER_ONE as PlayerId,
      cardCatalog: staticResources.cards,
      cardsMaps,
      debugServerCommunication: debugMode,
      timeControl: config.timeControl,
    };
    this.serverEngine = new LorcanaServer(serverInitParams);

    for (const player of players) {
      const transportPair = createInMemoryTransportPair({ browserTransport });
      transportPair.identifier = `${player.id}:in-memory-transport`;
      this.transportPairs.set(player.id, transportPair);
      this.serverEngine.acceptConnection(player.id, transportPair.server);

      const clientEngine = new LorcanaClient({
        players,
        seed,
        staticResources,
        transport: transportPair.client,
        role: "player",
        playerId: player.id,
        identifier: player.name,
        goingFirst: CANONICAL_PLAYER_ONE as PlayerId,
        cardCatalog: staticResources.cards,
        cardsMaps,
        debugMode,
        skipOptimisticState: browserTransport.mode === "sync",
      });
      const view = player.id === players[0].id ? "playerOne" : "playerTwo";
      this.playerEngines.set(view, clientEngine);
      this.debug = debugMode;
    }

    if (includeSpectator) {
      const spectatorTransport = createInMemoryTransportPair({ browserTransport });
      spectatorTransport.identifier = `${SPECTATOR_PLAYER_ID}:in-memory-transport`;
      this.transportPairs.set(SPECTATOR_PLAYER_ID, spectatorTransport);
      this.serverEngine.acceptConnection(SPECTATOR_PLAYER_ID, spectatorTransport.server);

      const spectatorEngine = new LorcanaClient({
        players,
        seed,
        staticResources,
        transport: spectatorTransport.client,
        role: "spectator",
        playerId: SPECTATOR_PLAYER_ID,
        identifier: SPECTATOR_PLAYER_ID,
        goingFirst: CANONICAL_PLAYER_ONE as PlayerId,
        cardCatalog: staticResources.cards,
        cardsMaps,
        debugMode,
        skipOptimisticState: browserTransport.mode === "sync",
      });
      this.playerEngines.set("spectator", spectatorEngine);
    }

    if (config.optimizeInactiveClientProjection) {
      this.setActiveClientView(this.currentView);
    }

    this.fixtureOptions = fixtureOptions;
    this.logger = logger;
  }

  /**
   * Create an empty engine for serialization/restoration purposes.
   *
   * This creates an uninitialized engine. You must call `initialize()` and
   * then set up the state manually. For normal test usage, prefer
   * `fromInitialStates()` instead.
   *
   * @internal Used by serialization helpers
   */
  static async createEmpty(config: LorcanaTestEngineConfig): Promise<LorcanaMultiplayerTestEngine> {
    if (!config) {
      throw new Error("LorcanaMultiplayerTestEngine requires config");
    }

    const engine = new LorcanaMultiplayerTestEngine(config, config);
    await engine.initialize();
    return engine;
  }

  /**
   * Create a test engine with fixture applied and clients synchronized.
   *
   * This method is fully synchronous - it creates the engine, applies the fixture state,
   * and initializes client sync. Use this when you need player views via asPlayerOne() etc.
   *
   * @param playerOneState - Per-player fixture spec for player one
   * @param playerTwoState - Per-player fixture spec for player two
   * @param options - Test engine configuration options
   */
  static createWithFixture(
    playerOneState: TestInitialState,
    options?: LorcanaFixtureInitOptions,
  ): LorcanaMultiplayerTestEngine;
  static createWithFixture(
    playerOneState: TestInitialState,
    playerTwoState: TestInitialState,
    options?: LorcanaFixtureInitOptions,
  ): LorcanaMultiplayerTestEngine;
  static createWithFixture(
    playerOneState: TestInitialState,
    playerTwoStateOrOptions: TestInitialState | LorcanaFixtureInitOptions = {},
    options: LorcanaFixtureInitOptions = {},
  ): LorcanaMultiplayerTestEngine {
    if (options?.showLogs) {
      configureLogtape(options?.logLevel);
    }

    const playerTwoState = isTestInitialState(playerTwoStateOrOptions)
      ? playerTwoStateOrOptions
      : {};
    const resolvedOptions = isTestInitialState(playerTwoStateOrOptions)
      ? options
      : playerTwoStateOrOptions;
    const normalizedPlayerOneState = withDefaultDeck(playerOneState);
    const normalizedPlayerTwoState = withDefaultDeck(playerTwoState);
    const bundle = buildFixtureSeedBundle(normalizedPlayerOneState, normalizedPlayerTwoState);

    const config: LorcanaTestEngineConfig = {
      browserTransport: resolvedOptions.browserTransport,
      seed: resolvedOptions.seed,
      includeSpectator: resolvedOptions.includeSpectator,
      startingLore: resolvedOptions.startingLore,
      startingInk: resolvedOptions.startingInk,
      initialView: resolvedOptions.initialView,
      staticResources: bundle.staticResources,
      timeControl: resolvedOptions.timeControl,
    };

    const engine = new LorcanaMultiplayerTestEngine(config, resolvedOptions);
    // I wonder why we're creating the Engine with the Default state and only then applying the fixture.
    engine.applyFixtureState(
      normalizedPlayerOneState,
      normalizedPlayerTwoState,
      resolvedOptions,
      bundle,
    );
    // And then syncing.
    engine.initializeSync();
    // IMO the best would be initialize the server engine with the fixture, and when instantiating client engines sync on connect

    if (options.debugServerCommunication) {
      logger.info("Engine created with fixture applied");
    }

    return engine;
  }

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

  getStateForView(view: GameTestView): LorcanaProjectedBoardView {
    return this.getBoard(view);
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
      return this.serverEngine.engine.executeMove(
        moveId as keyof LorcanaRuntimeMoveInputs & string,
        input as LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs & string],
      );
    }

    const engine = this.resolveOptionalClient(view);
    if (!engine) {
      return {
        success: false,
        reason: "View not found",
        code: "VIEW_NOT_FOUND",
      };
    }

    return engine.engine.executeMove(
      moveId as keyof LorcanaRuntimeMoveInputs & string,
      input as LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs & string],
    );
  }

  getEngineForView(view: GameTestView): LorcanaEngineBase {
    return this.resolveEngineForView(view);
  }

  getStateID(): number {
    return this.serverEngine.getStateID();
  }

  getMoveHistory(limit?: number): EngineMoveHistoryEntry[] {
    return this.serverEngine.getMoveHistory(limit);
  }

  getServerState(): DeepReadonly<MatchState> {
    return this.getAuthoritativeState();
  }

  getServerEngine(): LorcanaServer {
    return this.serverEngine;
  }

  getClientEngine(playerOrView: string): LorcanaClient | undefined {
    return this.resolveOptionalClient(playerOrView);
  }

  setActiveClientView(view: GameTestView): void {
    const eagerView = view === "authoritative" ? null : view;

    for (const candidate of ["playerOne", "playerTwo", "spectator"] as const) {
      this.playerEngines
        .get(candidate)
        ?.engine.setProjectionMode(candidate === eagerView ? "eager" : "lazy");
    }
  }

  executeMove<K extends keyof Record<string, MoveInput> & string>(
    moveId: K,
    params: Record<string, MoveInput>[K],
  ): EngineMoveExecutionResult {
    return this.executeMoveForView(this.currentView, moveId, params);
  }

  enumerateMoves(): Array<keyof LorcanaRuntimeMoveInputs & string> {
    return this.getEngineForView(this.currentView).enumerateMoves();
  }

  async syncToStateID(
    targetStateID: number,
    options: { timeoutMs?: number; pollIntervalMs?: number } = {},
  ): Promise<void> {}

  async sync(options: { timeoutMs?: number; pollIntervalMs?: number } = {}): Promise<void> {
    await this.syncToStateID(this.serverEngine.getStateID(), options);
  }

  asPlayerOne() {
    return this.asLorcanaPlayerOne();
  }

  asPlayerTwo() {
    return this.asLorcanaPlayerTwo();
  }

  async dispose(): Promise<void> {
    await this.serverEngine.dispose();

    for (const engine of this.playerEngines.values()) {
      await engine.dispose();
    }

    this.playerEngines.clear();
    this.transportPairs.clear();
    this.initialized = false;
  }

  // TODO: @Edu needs to look into this
  /**
   * Apply fixture state to the initialized runtime.
   *
   * **Test/Simulator Only** - Directly manipulates server-side state.
   * For production state restoration, use loadState(serializedState).
   *
   * This method sets up zones, cards, lore, and ink for testing by
   * converting per-player fixture specs into an authoritative game state.
   *
   * @param playerOneState - Per-player fixture spec for player one
   * @param playerTwoState - Per-player fixture spec for player two
   * @param options - Fixture initialization options
   */
  applyFixtureState(
    playerOneState: TestInitialState,
    playerTwoState: TestInitialState,
    options: LorcanaFixtureInitOptions,
    bundle: FixtureSeedBundle = buildFixtureSeedBundle(playerOneState, playerTwoState),
  ): void {
    const state = structuredClone(this.getAuthoritativeState()) as LorcanaMatchState;

    this.instanceIdToDefinitionId = new Map(
      Object.entries(bundle.cardDefinitionsByInstanceId).map(([id, def]) => [
        id,
        (def as { id?: string }).id ?? id,
      ]),
    );
    this.definitionIdToCard = new Map(
      Object.values(bundle.cardDefinitionsByInstanceId).map((definition) => [
        definition.id,
        definition,
      ]),
    );

    // Initialize owner-scoped zone keys
    this.initializeOwnerScopedZoneKeys(state);

    // Apply zone cards and card index
    for (const [zoneKey, cardIds] of Object.entries(bundle.zoneCardsByKey)) {
      state.ctx.zones.private.zoneCards[zoneKey] = [...cardIds];
      for (let index = 0; index < cardIds.length; index++) {
        const cardId = cardIds[index];
        const ownerID = bundle.ownerByInstanceId[cardId];
        state.ctx.zones.private.cardIndex[cardId] = {
          zoneKey,
          index,
          ownerID: ownerID as PlayerId,
          controllerID: ownerID as PlayerId,
        };

        const definition = bundle.cardDefinitionsByInstanceId[cardId];

        state.ctx.zones.private.cardMeta[cardId] = createInitialCardMeta(zoneKey, definition);
      }
    }

    // Set lore
    state.G.lore[CANONICAL_PLAYER_ONE as PlayerId] =
      options.startingLore?.[CANONICAL_PLAYER_ONE] ?? playerOneState.lore ?? 0;
    state.G.lore[CANONICAL_PLAYER_TWO as PlayerId] =
      options.startingLore?.[CANONICAL_PLAYER_TWO] ?? playerTwoState.lore ?? 0;

    // Ink is derived from zones + cardMeta (Option B); no G.ink to set.
    // Initialize baseline state
    this.initializeBaselineState(state, this.fixtureOptions);

    for (const [cardId, fixtureState] of Object.entries(bundle.fixtureStateByInstanceId)) {
      const currentMeta = state.ctx.zones.private.cardMeta[cardId] ?? {};
      const definition = bundle.cardDefinitionsByInstanceId[cardId];
      const ownerId = bundle.ownerByInstanceId[cardId];
      const nextMeta: Record<string, unknown> = { ...currentMeta };

      if (typeof fixtureState.isDrying === "boolean") {
        nextMeta.isDrying = fixtureState.isDrying;
      }
      if (typeof fixtureState.exerted === "boolean") {
        nextMeta.state = fixtureState.exerted ? "exerted" : "ready";
      }
      if (typeof fixtureState.damage === "number" && Number.isFinite(fixtureState.damage)) {
        nextMeta.damage = Math.max(0, Math.floor(fixtureState.damage));
      }
      if (
        fixtureState.publicFaceState === "faceUp" ||
        fixtureState.publicFaceState === "faceDown"
      ) {
        nextMeta.publicFaceState = fixtureState.publicFaceState;
      }
      if (Array.isArray(fixtureState.cardsUnder) && fixtureState.cardsUnder.length > 0) {
        nextMeta.cardsUnder = [...fixtureState.cardsUnder];
        for (const underCardId of fixtureState.cardsUnder) {
          const underFixtureState = bundle.fixtureStateByInstanceId[underCardId];
          state.ctx.zones.private.cardMeta[underCardId] = {
            stackParentId: cardId,
            cardsUnder: undefined,
            state: undefined,
            damage: undefined,
            isDrying: undefined,
            publicFaceState: underFixtureState?.publicFaceState,
            atLocationId: undefined,
            playedViaShift: undefined,
            playedCostType: undefined,
          };
        }
      }
      if (fixtureState.atLocation !== undefined && ownerId) {
        const targetLocationId =
          typeof fixtureState.atLocation === "string" &&
          state.ctx.zones.private.cardIndex[fixtureState.atLocation]
            ? fixtureState.atLocation
            : (state.ctx.zones.private.zoneCards[`play:${ownerId}`] ?? []).find((candidateId) => {
                const candidateDefinition = bundle.cardDefinitionsByInstanceId[candidateId];
                if (candidateDefinition?.cardType !== "location") {
                  return false;
                }

                return (
                  fixtureState.atLocation &&
                  typeof fixtureState.atLocation === "object" &&
                  "id" in fixtureState.atLocation &&
                  candidateDefinition.id ===
                    String((fixtureState.atLocation as { id?: unknown }).id ?? "")
                );
              });
        if (targetLocationId) {
          nextMeta.atLocationId = targetLocationId;
        }
      }

      state.ctx.zones.private.cardMeta[cardId] = nextMeta;

      if (
        definition &&
        (definition.cardType === "character" || definition.cardType === "location") &&
        typeof fixtureState.lore === "number" &&
        Number.isFinite(fixtureState.lore)
      ) {
        const baseLore = Number((definition as { lore?: unknown }).lore ?? 0);
        const modifier = Math.trunc(fixtureState.lore) - baseLore;
        if (modifier !== 0) {
          const nextSeq = state.G.continuousEffects.nextSeq++;
          const effectInstance = {
            id: `ce_${nextSeq}`,
            kind: "stat-modifier",
            sourceId: cardId as CardInstanceId,
            targetId: cardId as CardInstanceId,
            stat: "lore",
            modifier,
            duration: "until-start-of-next-turn",
            createdAtTurn: state.ctx.status.turn ?? 1,
            expiresAtTurn: Number.MAX_SAFE_INTEGER,
          } as const;
          state.G.continuousEffects.instances.push(effectInstance);
          state.G.continuousEffects.byTarget[cardId as CardInstanceId] ??= [];
          state.G.continuousEffects.byTarget[cardId as CardInstanceId].push(effectInstance);
          invalidateStaticEffects(state);
        }
      }
    }

    // Derive win-condition-modification overrides from cards currently in play
    // (e.g. Donald Duck - Flustered Sorcerer raises the lore threshold for opponents).
    // Must run before winner detection so the correct threshold is used.
    recomputeLoreToWin({
      G: state.G as Parameters<typeof recomputeLoreToWin>[0]["G"],
      framework: {
        state: {
          _zonesPrivate: state.ctx.zones.private as Parameters<
            typeof recomputeLoreToWin
          >[0]["framework"]["state"]["_zonesPrivate"],
        },
      },
      cards: {
        getDefinition: (cardId: string) => bundle.cardDefinitionsByInstanceId[cardId],
      },
    });

    // Check for winner by lore; game end lives on ctx only
    const winner = detectWinnerByLore(state.G.lore, state.G.loreToWin);
    state.ctx.status.gameEnded = Boolean(winner);
    state.ctx.status.winner = winner;
    state.ctx.status.reason = winner
      ? `Reached ${String((state.G.loreToWin as Record<string, number> | undefined)?.[winner] ?? 20)} lore`
      : undefined;

    // Refresh zone summaries
    this.refreshZoneSummaries(state);

    this.loadState(state);
  }

  /**
   * Load a serialized state into the engine.
   *
   * **Production Path** - This is the state restoration mechanism used by:
   * - Redis persistence (via state-serializer.ts deserializeToEngine)
   * - Replay functionality
   * - Tooling that needs to restore from snapshots
   *
   * This replaces the current game state with the provided state.
   *
   * @internal Used by serialization helpers; prefer restoreEngineFromState() for external use
   */
  loadState(state: MatchState): void {
    invalidateStaticEffects(state);
    // Access the server engine's runtime and load the state
    const serverEngine = this.getServerEngine();
    const runtime = serverEngine.getRuntime();
    runtime.loadState(state);
    this.syncLoadedStateToViews(state);
  }

  private syncLoadedStateToViews(state: MatchState): void {
    for (const view of ["playerOne", "playerTwo", "spectator"] as const) {
      this.resolveOptionalClient(view)?.loadState(state);
    }
  }

  /**
   * Initialize owner-scoped zone keys in the state.
   */
  private initializeOwnerScopedZoneKeys(state: LorcanaMatchState): void {
    const baseZoneIds: FixtureZoneName[] = ["deck", "hand", "play", "inkwell", "discard", "limbo"];
    for (const player of TEST_PLAYERS) {
      for (const baseZoneId of baseZoneIds) {
        const zoneKey = `${baseZoneId}:${player.id}`;
        state.ctx.zones.public.zoneSummaries[zoneKey] = {
          revision: 0,
          count: 0,
        };
        state.ctx.zones.private.zoneCards[zoneKey] = [];
      }
    }
  }

  /**
   * Initialize baseline game state (turn, phase, priority, etc.)
   * When skipPreGame is false, sets up the startingAGame segment for pre-game flow.
   * When skipPreGame is true (default), sets gameSegment to mainGame.
   */
  private initializeBaselineState(
    state: LorcanaMatchState,
    config: LorcanaFixtureInitOptions,
  ): void {
    // Apply starting lore if provided in config
    if (config.startingLore?.[CANONICAL_PLAYER_ONE] !== undefined) {
      state.G.lore[CANONICAL_PLAYER_ONE as PlayerId] = config.startingLore[CANONICAL_PLAYER_ONE];
    }
    if (config.startingLore?.[CANONICAL_PLAYER_TWO] !== undefined) {
      state.G.lore[CANONICAL_PLAYER_TWO as PlayerId] = config.startingLore[CANONICAL_PLAYER_TWO];
    }

    // Option B: ink is derived from zones + cardMeta; no G.ink to set

    // If skipPreGame is explicitly false, set up pre-game state
    if (config.skipPreGame === false) {
      state.ctx.status.turn = 0;
      state.ctx.status.gameSegment = "startingAGame";
      state.ctx.status.phase = "chooseFirstPlayer";
      state.ctx.status.step = "";
      state.ctx.status.choosingFirstPlayer = CANONICAL_PLAYER_ONE;
      state.ctx.status.pendingMulligan = undefined;
      state.ctx.status.otp = undefined;
      state.ctx.priority.holder = CANONICAL_PLAYER_ONE;
      state.ctx.priority.windowOpen = true;
      return;
    }

    // Default: skip to main game
    state.ctx.status.turn = 1;
    state.ctx.status.phase = "main";
    state.ctx.status.step = "";
    // Skip-to-main: mainGame is the segment for main phase.
    state.ctx.status.gameSegment = "mainGame";
    state.ctx.priority.holder = CANONICAL_PLAYER_ONE;
    state.ctx.priority.windowOpen = true;
    // Player one goes first by default; set otp so first-turn-non-otp conditions evaluate correctly.
    state.ctx.status.otp = CANONICAL_PLAYER_ONE as PlayerId;
  }

  /**
   * Refresh zone summaries after state changes.
   */
  private refreshZoneSummaries(state: LorcanaMatchState): void {
    const zoneRegistry = buildZoneRegistry(lorcanaRuntimeZones, state.ctx.playerIds);
    for (const [zoneKey, cards] of Object.entries(state.ctx.zones.private.zoneCards)) {
      const zoneDef = zoneRegistry[zoneKey];
      if (!state.ctx.zones.public.zoneSummaries[zoneKey]) {
        state.ctx.zones.public.zoneSummaries[zoneKey] = {
          revision: 0,
          count: 0,
        };
      }
      const summary = state.ctx.zones.public.zoneSummaries[zoneKey];
      summary.count = cards.length;
      summary.revision += 1;
      if (zoneDef?.visibility === "public" && !zoneDef.faceDown && cards.length > 0) {
        summary.topPublicCardID = cards[cards.length - 1];
      } else {
        summary.topPublicCardID = undefined;
      }
    }
  }

  // ========================================================================
  // Player Actions (Lorcana-specific)
  // ========================================================================

  /**
   * Get a LorcanaClientWrapper view for player one.
   * Returns a wrapper around the player's ClientEngine.
   */
  asLorcanaPlayerOne(): LorcanaClient {
    return this.asLorcanaPlayer(CANONICAL_PLAYER_ONE);
  }

  /**
   * Get a LorcanaClientWrapper view for player two.
   * Returns a wrapper around the player's ClientEngine.
   */
  asLorcanaPlayerTwo(): LorcanaClient {
    return this.asLorcanaPlayer(CANONICAL_PLAYER_TWO);
  }

  asServer(): LorcanaServer {
    return this.getServerEngine();
  }

  /** Get the CardsMaps snapshot captured at engine construction time. */
  getCardsMaps(): CardsMaps {
    return this._cardsMaps;
  }

  /**
   * Get a LorcanaClientWrapper view for the specified player.
   * Returns a wrapper around the player's ClientEngine.
   *
   * This provides the same interface as production clients, allowing tests
   * to use the same API that real clients will use.
   */
  asLorcanaPlayer(playerId: string | PlayerId): LorcanaClient {
    const normalized = normalizePlayerId(String(playerId));
    if (!normalized) {
      throw new Error(`Unknown player '${String(playerId)}'`);
    }

    const view = normalized === CANONICAL_PLAYER_ONE ? "playerOne" : "playerTwo";
    const clientEngine = this.getClientEngine(view);

    if (!clientEngine) {
      throw new Error(`No client engine for view: ${view}`);
    }

    return clientEngine;
  }

  /**
   * Get published game events from the server runtime (same shape as LorcanaServer.getPublishedGameEvents).
   */
  getPublishedGameEvents(): PublishedGameEvent[] {
    return this.getServerEngine().getRuntime().getPublishedGameEvents();
  }

  /**
   * Resolve instance ID to definition ID (for simulator/tooling; definitions from staticResources).
   */
  getCardDefinitionId(instanceId: string): string | undefined {
    return this.instanceIdToDefinitionId.get(instanceId);
  }

  getCardDefinition(instanceId: string): LorcanaCardDefinition {
    const definitionId = this.getCardDefinitionId(instanceId);
    if (!definitionId) {
      return FALLBACK_LORCANA_CARD;
    }

    return this.definitionIdToCard.get(definitionId) || FALLBACK_LORCANA_CARD;
  }

  getBoard(): LorcanaProjectedBoardView;
  getBoard(view: GameTestView): LorcanaProjectedBoardView;
  getBoard(view?: GameTestView): LorcanaProjectedBoardView {
    return this.resolveEngineForView(view ?? this.currentView).getBoard();
  }

  manualExertCard(card: CardRef) {
    const resolvedCardId = this.resolveCardId(card);
    if (!resolvedCardId) {
      return {
        success: false,
      };
    }
    return this.resolveEngineForView(this.currentView).manualExertCard(resolvedCardId);
  }

  /**
   * Get lore count for a player.
   * Convenience method that delegates to the authoritative state.
   */
  getLore(playerId: string | PlayerId): number {
    return this.asServer().getLore(playerId) || 0;
  }

  getCardsUnder(card: CardRef): CardInstanceId[] {
    const resolvedCardId = this.resolveCardId(card);
    if (!resolvedCardId) {
      return [];
    }

    const projected = this.getCardByInstance(resolvedCardId);
    return Array.isArray(projected.cardsUnder) ? [...projected.cardsUnder] : [];
  }

  putCardUnder(parent: CardRef, child: CardRef): void {
    const parentId = this.resolveCardId(parent);
    const childId = this.resolveCardId(child);
    if (!parentId || !childId || parentId === childId) {
      return;
    }

    const state = this.asServer().getState() as LorcanaMatchState;
    const cardIndex = state.ctx.zones.private.cardIndex;
    const cardMeta = state.ctx.zones.private.cardMeta;
    const childIndexEntry = cardIndex[childId];
    const ownerId = childIndexEntry?.ownerID;
    if (!ownerId) {
      return;
    }

    const reindexZone = (zoneKey: string) => {
      const zoneCards = state.ctx.zones.private.zoneCards[zoneKey] ?? [];
      zoneCards.forEach((cardId, index) => {
        const currentEntry = cardIndex[cardId];
        if (!currentEntry) {
          return;
        }
        cardIndex[cardId] = {
          ...currentEntry,
          index,
          zoneKey,
        };
      });
    };

    const previousParentId = cardMeta[childId]?.stackParentId as CardInstanceId | undefined;
    if (previousParentId) {
      const previousParentMeta = cardMeta[previousParentId] ?? {};
      const previousCardsUnder = Array.isArray(previousParentMeta.cardsUnder)
        ? previousParentMeta.cardsUnder.filter((cardId) => cardId !== childId)
        : [];
      cardMeta[previousParentId] = {
        ...previousParentMeta,
        cardsUnder: previousCardsUnder.length > 0 ? previousCardsUnder : undefined,
      };
    }

    const previousZoneKey = childIndexEntry.zoneKey;
    if (previousZoneKey) {
      state.ctx.zones.private.zoneCards[previousZoneKey] = (
        state.ctx.zones.private.zoneCards[previousZoneKey] ?? []
      ).filter((cardId) => cardId !== childId);
      reindexZone(previousZoneKey);
    }

    const limboKey = `limbo:${ownerId}`;
    const limboCards = state.ctx.zones.private.zoneCards[limboKey] ?? [];
    if (!limboCards.includes(childId)) {
      limboCards.push(childId);
    }
    state.ctx.zones.private.zoneCards[limboKey] = limboCards;
    reindexZone(limboKey);

    const parentMeta = cardMeta[parentId] ?? {};
    const cardsUnder = Array.isArray(parentMeta.cardsUnder) ? [...parentMeta.cardsUnder] : [];
    if (!cardsUnder.includes(childId)) {
      cardsUnder.push(childId);
    }
    cardMeta[parentId] = {
      ...parentMeta,
      cardsUnder,
    };
    cardMeta[childId] = {
      ...cardMeta[childId],
      stackParentId: parentId,
      cardsUnder: undefined,
      state: undefined,
      damage: undefined,
      isDrying: undefined,
      publicFaceState: undefined,
      atLocationId: undefined,
      playedViaShift: undefined,
      playedCostType: undefined,
    };

    this.refreshZoneSummaries(state);
    this.loadState(state);
  }

  private resolveCardId(card: CardRef, actorPlayerId?: PlayerId): CardInstanceId | undefined {
    try {
      return resolveCardInstanceIdFromInput({
        input: card,
        state: this.resolveEngineForView("authoritative").getState() as LorcanaMatchState,
        cards: this.getBoard("authoritative").cards,
        actorPlayerId,
        getDefinitionByInstanceId: (cardId) => this.getCardDefinition(cardId),
      });
    } catch {
      return undefined;
    }
  }

  /**
   * Check if a card is exerted.
   */
  isExertedByInstance(cardId: CardInstanceId): boolean {
    return !!this.serverEngine.getCard(cardId)?.exerted;
  }

  isExerted(cardId: CardRef): boolean {
    const resolvedCardId = this.resolveCardId(cardId);
    if (!resolvedCardId) {
      return false;
    }
    return this.isExertedByInstance(resolvedCardId);
  }

  /**
   * Get the current phase.
   */
  getCurrentPhase(): string | undefined {
    return this.getBoard("authoritative").phase;
  }

  /**
   * Get the current step.
   */
  getCurrentStep(): string | null | undefined {
    const challengeStage = this.getAuthoritativeState().G.challengeState?.stage;
    if (challengeStage === "declaration") {
      return "challengeDeclaration";
    }
    if (challengeStage === "damage" || challengeStage === "post-damage") {
      return "challengeDamage";
    }

    return this.getBoard("authoritative").step;
  }

  /**
   * Get the current turn number.
   */
  getTurnNumber(): number {
    return this.getBoard("authoritative").turnNumber ?? 1;
  }

  /**
   * Get the active player (priority holder).
   */
  getActivePlayer(): PlayerId | undefined {
    return this.getBoard("authoritative").priorityPlayer ?? undefined;
  }

  getCardInstanceIdsInZone(zone: string, playerId: string | PlayerId): CardInstanceId[] {
    const normalized = normalizePlayerId(String(playerId));
    if (!normalized) {
      return [];
    }
    const authoritativeState = this.resolveEngineForView("authoritative").getState();
    const hiddenZoneCards = authoritativeState.ctx.zones.private.zoneCards[`${zone}:${normalized}`];
    if (Array.isArray(hiddenZoneCards) && zone === "deck") {
      return hiddenZoneCards as CardInstanceId[];
    }

    const playerBoard = this.getBoard("authoritative").players[normalized];
    if (!playerBoard) {
      return [];
    }

    switch (zone) {
      case "hand":
        return playerBoard.hand as CardInstanceId[];
      case "play":
        return playerBoard.play as CardInstanceId[];
      case "inkwell":
        return playerBoard.inkwell as CardInstanceId[];
      case "discard":
        return playerBoard.discard as CardInstanceId[];
      case "limbo": {
        const limboCards = authoritativeState.ctx.zones.private.zoneCards[`limbo:${normalized}`];
        return Array.isArray(limboCards) ? (limboCards as CardInstanceId[]) : [];
      }
      default:
        return [];
    }
  }

  getCardDefinitionIdsInZone(zone: string, playerId: string | PlayerId): string[] {
    return this.getCardInstanceIdsInZone(zone, String(playerId))
      .map((cardId) => this.getCardDefinitionId(cardId))
      .filter((cardId): cardId is string => typeof cardId === "string");
  }

  getCardPublicFaceState(
    card: CardRef,
    zone: string,
    playerId: string | PlayerId = CANONICAL_PLAYER_ONE,
  ): "faceUp" | "faceDown" | undefined {
    const cardId = this.findCardInstanceId(card, zone, playerId);
    const publicFaceState =
      this.getAuthoritativeState().ctx.zones.private.cardMeta[cardId]?.publicFaceState;
    return publicFaceState === "faceUp" || publicFaceState === "faceDown"
      ? publicFaceState
      : undefined;
  }

  isCardFaceDown(
    card: CardRef,
    zone: string,
    playerId: string | PlayerId = CANONICAL_PLAYER_ONE,
  ): boolean {
    return this.getCardPublicFaceState(card, zone, playerId) === "faceDown";
  }

  findCardInstanceId(
    card: CardRef,
    zone: string,
    playerId: string | PlayerId = CANONICAL_PLAYER_ONE,
  ): CardInstanceId {
    const normalizedPlayerId = normalizePlayerId(String(playerId));
    if (!normalizedPlayerId) {
      throw new Error(`Unknown player id: ${String(playerId)}`);
    }

    const cardIds = this.getCardInstanceIdsInZone(zone, normalizedPlayerId);

    const resolvedFromInput = this.resolveCardId(card, normalizedPlayerId as PlayerId);
    if (resolvedFromInput && cardIds.includes(resolvedFromInput)) {
      return resolvedFromInput;
    }

    const definitionId =
      typeof card === "object" && card !== null && "id" in card && typeof card.id === "string"
        ? card.id
        : typeof card === "string"
          ? card
          : undefined;
    if (definitionId) {
      const matching = cardIds.find(
        (instanceId) => this.getCardDefinitionId(instanceId) === definitionId,
      );
      if (matching) {
        return matching;
      }
    }

    throw new Error(
      `Could not find card '${definitionId ?? String(card)}' in zone '${zone}' for player '${String(playerId)}'.`,
    );
  }

  hasRestriction(card: CardRef, restriction: string): boolean {
    const resolvedCardId = this.resolveCardId(card);
    if (!resolvedCardId) {
      return false;
    }

    return this.asServer().hasTemporaryRestriction(resolvedCardId, restriction);
  }

  hasGrantedAbility(card: CardRef, ability: string): boolean {
    const resolvedCardId = this.resolveCardId(card);
    if (!resolvedCardId) {
      return false;
    }

    return this.asServer().hasTemporaryAbility(resolvedCardId, ability);
  }

  hasKeyword(card: CardRef, keyword: string): boolean {
    return this.asServer().hasKeyword(card, keyword);
  }

  getKeywordValue(card: CardRef, keyword: string): number | null {
    if (keyword !== "Challenger" && keyword !== "Resist") {
      return null;
    }
    return this.asServer().getKeywordValue(card, keyword);
  }

  getCardByInstance(cardInstanceId: CardInstanceId): LorcanaProjectedCard {
    return this.asServer().getCard(cardInstanceId);
  }

  getCard(card: CardRef): LorcanaProjectedCard {
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      throw new Error("Unable to resolve card instance ID from provided card definition");
    }

    return this.getCardByInstance(cardInstanceId);
  }

  isCardVisible(card: CardRef, viewOrPlayerId: GameTestView | string = this.currentView): boolean {
    const cardInstanceId = this.resolveCardId(card);
    if (!cardInstanceId) {
      return false;
    }

    const view =
      typeof viewOrPlayerId === "string"
        ? this.resolveViewForPlayerId(viewOrPlayerId)
        : viewOrPlayerId;
    if (!view) {
      return false;
    }

    if (view === "authoritative") {
      return true;
    }

    return this.getBoard(view).cards[cardInstanceId]?.hidden !== true;
  }

  protected resolveViewForPlayerId(playerId: string): GameTestView | undefined {
    if (
      playerId === "playerOne" ||
      playerId === "playerTwo" ||
      playerId === "spectator" ||
      playerId === "authoritative"
    ) {
      return playerId;
    }

    const normalized = normalizePlayerId(playerId);
    if (normalized === CANONICAL_PLAYER_ONE) {
      return "playerOne";
    }

    if (normalized === CANONICAL_PLAYER_TWO) {
      return "playerTwo";
    }

    if (playerId === SPECTATOR_PLAYER_ID) {
      return "spectator";
    }

    if (playerId === "authoritative") {
      return "authoritative";
    }

    return undefined;
  }

  private resolveOptionalClient(
    viewOrPlayerId: GameTestView | string | undefined,
  ): LorcanaClient | undefined {
    const view =
      typeof viewOrPlayerId === "string"
        ? this.resolveViewForPlayerId(viewOrPlayerId)
        : viewOrPlayerId;

    if (!view || view === "authoritative") {
      return undefined;
    }

    return this.playerEngines.get(view);
  }

  private resolveEngineForView(view: GameTestView): LorcanaEngineBase {
    if (view === "authoritative") {
      return this.serverEngine;
    }

    const engine = this.resolveOptionalClient(view);
    if (!engine) {
      throw new Error(`View not found: ${view}`);
    }

    return engine;
  }
}

function withDefaultDeck(state: TestInitialState): TestInitialState {
  if (state.deck !== undefined) {
    return state;
  }

  return {
    ...state,
    deck: DEFAULT_UNSPECIFIED_DECK_SIZE,
  };
}

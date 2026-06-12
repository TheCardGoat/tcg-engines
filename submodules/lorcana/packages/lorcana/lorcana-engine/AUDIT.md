TCG Engine v2 — Technical Specification
Table of Contents

1. Package Topology (#1-package-topology)
2. Core Framework (@tcg/tcg-engine) (#2-core-framework)
3. Game Types Layer (@tcg/<game>-types) (#3-game-types-layer)
4. Game Engine Layer (@tcg/<game>-engine) (#4-game-engine-layer)
5. Cards Package (@tcg/<game>-cards) (#5-cards-package)
6. Testing Infrastructure (#6-testing-infrastructure)
7. Platform Features (#7-platform-features)
8. Migration from Lorcana Architecture (#8-migration)

---

1. Package Topology
   @tcg/tcg-engine ← Game-agnostic TCG framework
   ↑
   @tcg/<game>-types ← Game-specific type definitions (effects, targets, conditions)
   ↑
   @tcg/<game>-engine ← Game engine implementation (depends on tcg-engine + game-types)
   ↑ (test utilities only)
   @tcg/<game>-cards ← Card definitions + per-card tests
   ↑
   @tcg/<game>-simulator ← Integration: real cards + engine + UI + platform features
   Boundary rules:

- @tcg/tcg-engine imports nothing from game packages
- @tcg/<game>-types imports only @tcg/tcg-engine (for base types)
- @tcg/<game>-engine imports @tcg/tcg-engine and @tcg/<game>-types
- @tcg/<game>-cards imports @tcg/<game>-types for definitions; imports @tcg/<game>-engine/testing for tests only
- @tcg/<game>-simulator imports everything

---

2. Core Framework
   2.1 Directory Structure
   @tcg/tcg-engine/src/
   index.ts
   types/
   branded.ts ← CardInstanceId, PlayerId, GameId, ZoneId
   base-card.ts ← BaseCardDefinition, BaseCardMeta, CardCatalog, CardsMaps
   zone-types.ts ← ZoneConfig, ZoneVisibility, ZoneRef
   match-state.ts ← MatchState<G, Ctx>, TCGCtx
   command.ts ← CommandEnvelope, CommandResult, CommandSuccess, CommandFailure
   move-types.ts ← MoveInput, MoveDefinition, MoveRecord, MoveContexts
   game-events.ts ← GameEvent, PublishedGameEvent, EventEmitFn
   flow-types.ts ← FlowDefinition, GameSegment, TurnDef, PhaseDef, StepDef
   projection.ts ← EngineBoardProjection, EngineCardProjection, FilteredView
   transport.ts ← Transport, TransportMessage
   persistence.ts ← PersistenceAdapter, MatchSnapshot, MatchReplayData
   animation.ts ← PacketAnimation
   index.ts
   runtime/
   match-runtime.ts ← MatchRuntime class
   match-runtime.commands.ts ← executeCommand (pure function)
   match-runtime.flow.ts ← resolveFlowTransitions, phase lifecycle
   match-runtime.init.ts ← initializeMatchState
   match-runtime.validation.ts ← validateCommand
   match-runtime.queries.ts ← getFilteredView, enumerateMoves
   match-runtime.apis.ts ← API factory functions
   match-runtime.priority.ts ← Priority pass logic
   match-runtime.zone-apis.ts ← Zone API construction
   match-runtime.time-apis.ts ← Clock API construction
   match-runtime.random-apis.ts ← RNG API construction
   match-runtime.logs.ts ← Game log projection
   match-runtime.serialization.ts ← State serialization helpers
   zone-operations.ts ← ZoneOperationsAPI (moveCard, drawCards, shuffle, etc.)
   zone-registry.ts ← Zone registry builder
   view-filter.ts ← filterMatchView (role-based privacy)
   card-runtime.ts ← Card query/meta API
   static-resources.ts ← MatchStaticResources
   mutative.ts ← createRuntimeState, createRuntimeStateWithPatches
   in-memory-transport.ts ← InMemoryTransport for testing
   replay.ts ← ReplayEngine, ReplayBuilder, ReplayExporter
   persistence.ts ← PersistenceManager, InMemoryPersistence
   auth.ts ← Auth provider
   security.ts ← Input validation, rate limiting
   engine/
   contracts.ts ← GameEngine, TransportAwareEngine interfaces
   server-engine.ts ← ServerEngine (authoritative host)
   client-engine.ts ← ClientEngine (synchronized view)
   projection.ts ← Board projection from raw state
   testing/
   index.ts
   core-test-engine.ts ← CoreTestEngine interface
   multiplayer-test-engine.ts ← MultiplayerTestEngine<TConfig>
   base-matchers.ts ← Framework-level test matchers
   automation/
   types.ts ← Strategy types, candidate types
   strategy-registry.ts ← Named strategy registry
   planner.ts ← enumerateAutomatedActions, takeAutomatedAction
   deadlock.ts ← Deadlock detection
   decision-trace.ts ← State fingerprinting
   index.ts ← Public barrel
   2.2 Branded Types
   // types/branded.ts
   declare const **brand: unique symbol;
   type Brand<T, TBrand> = T & { readonly [**brand]: TBrand };
   type CardInstanceId = Brand<string, "CardInstanceId">;
   type CardPublicId = Brand<string, "CardPublicId">;
   type PlayerId = Brand<string, "PlayerId">;
   type GameId = Brand<string, "GameId">;
   type ZoneId = Brand<string, "ZoneId">;
   // Factory functions with runtime validation
   function createCardInstanceId(id: string): CardInstanceId;
   function createPlayerId(id: string): PlayerId;
   function createGameId(id: string): GameId;
   function createZoneId(id: string): ZoneId;
   // Safe casting (no runtime cost)
   function asCardInstanceId(id: string): CardInstanceId;
   function asPlayerIdOptional(id: string | undefined): PlayerId | undefined;
   2.3 Base Card Types
   // types/base-card.ts
   /\*\*

- Base card definition that every game extends.
- The framework only cares about identity and type discrimination.
  \*/
  interface BaseCardDefinition {
  id: string;
  cardType: string; // Game-specific: "character", "action", "spell", etc.
  cost: number;
  abilities?: BaseAbility[]; // Game-specific abilities
  i18n?: Record<string, unknown>;
  }
  /\*\*
- Runtime metadata the framework attaches to card instances.
- Games extend this with their own state (damage, exerted, counters, etc.)
  \*/
  interface BaseCardMeta {
  [key: string]: unknown; // Game-specific meta fields
  }
  /\*\*
- A card instance at runtime, combining definition + meta + zone info.
  \*/
  interface RuntimeCard {
  instanceId: CardInstanceId;
  definitionId: string;
  ownerId: PlayerId;
  controllerId: PlayerId;
  zoneId: string;
  meta: BaseCardMeta;
  definition: BaseCardDefinition;
  }
  /\*\*
- Maps card instance IDs to their definition IDs.
- Used to reconstruct definitions from serialized state.
  \*/
  interface CardsMaps {
  instances: {
  entries(): IterableIterator<{ instanceId: string; definitionId: string; ownerID: string }>;
  get(instanceId: string): { definitionId: string; ownerID: string } | undefined;
  size: number;
  };
  definitions: Map<string, BaseCardDefinition>;
  }
  /\*\*
- A card catalog for lookup by ID.
  \*/
  interface CardCatalog {
  get(definitionId: string): BaseCardDefinition | undefined;
  entries(): IterableIterator<[string, BaseCardDefinition]>;
  size: number;
  }
  2.4 Zone Types
  // types/zone-types.ts
  type ZoneVisibility = "public" | "private" | "secret";
  interface ZoneConfig {
  id: string;
  name: string;
  visibility: ZoneVisibility;
  ordered: boolean;
  ownerScoped: boolean;
  faceDown?: boolean;
  maxSize?: number;
  }
  interface ZoneRef {
  zone: string;
  playerId?: string;
  }
  /\*\*
- Runtime zone state: dual-layer with public summaries and private card data.
  \*/
  interface ZoneRuntimeState {
  public: {
  zoneSummaries: Record<string, {
  revision: number;
  count: number;
  topPublicCardID?: string;
  }>;
  };
  private: {
  zoneCards: Record<string, string[]>; // zoneKey -> card instance IDs
  cardIndex: Record<string, { // cardId -> location info
  zoneKey: string;
  index: number;
  ownerID: PlayerId;
  controllerID: PlayerId;
  }>;
  cardMeta: Record<string, BaseCardMeta>; // cardId -> game-specific meta
  };
  reveals: {
  active: Record<string, {
  cardIds: string[];
  visibleTo: "all" | string[];
  expiresAtStateID: number;
  }>;
  nextId: number;
  };
  }
  2.5 Match State
  // types/match-state.ts
  import type { Draft } from "mutative";
  /\*\*
- The authoritative game state.
- G = game-specific state (lore, life, score, counters, etc.)
- ctx = framework-owned state (zones, turns, phases, priority, etc.)
  \*/
  interface MatchState<G extends object = object> {
  G: G;
  ctx: TCGCtx;
  }
  interface TCGCtx {
  protocolVersion: string;
  matchID: string;
  gameID: string;
  rulesetHash: string;
  \_stateID: number;
  playerIds: PlayerId[];
  zones: ZoneRuntimeState;
  status: CtxStatus;
  priority: CtxPriority;
  time: TimeContext;
  random: CtxRandom;
  }
  interface CtxStatus {
  gameSegment?: string;
  phase?: string;
  step?: string;
  turn: number;
  gameEnded: boolean;
  winner?: PlayerId;
  winReason?: string;
  choosingFirstPlayer?: PlayerId;
  pendingMulligan: PlayerId[];
  }
  interface CtxPriority {
  holder?: PlayerId;
  windowOpen: boolean;
  passSequence: PlayerId[];
  stackDepth: number;
  pendingChoice?: {
  type: string;
  chooser: PlayerId;
  effectId: string;
  payload: unknown;
  };
  }
  interface TimeContext {
  mode: "chess" | "priority" | "dynamic" | "none";
  players: Record<string, TimePlayerState>;
  config: TimeControlConfig;
  }
  interface TimePlayerState {
  reserveMsRemaining: number;
  totalConsumedMs: number;
  movesMade: number;
  lastUpdatedAtMs: number;
  // Mode-specific fields stored as unknown; game decides shape
  [key: string]: unknown;
  }
  interface TimeControlConfig {
  mode: "chess" | "priority" | "dynamic" | "none";
  initialReserveMs: number;
  // Mode-specific config
  [key: string]: unknown;
  }
  interface CtxRandom {
  seed: string;
  state: unknown;
  drawCount: number;
  }
  2.6 Command Types
  // types/command.ts
  interface CommandEnvelope {
  commandID: string;
  move: string;
  input?: MoveInput;
  optimisticHint?: unknown;
  redactInput?: boolean;
  }
  interface MoveInput<TArgs = unknown> {
  args: TArgs;
  }
  interface CommandSuccess {
  success: true;
  stateID: number;
  state: MatchState;
  patches: import("mutative").Patch[];
  gameEvents: PublishedGameEvent[];
  logEntries: GameLogEntry[];
  processedCommand: CommandEnvelope;
  animations: PacketAnimation[];
  undoable: boolean;
  moveLogs?: unknown[];
  }
  interface CommandFailure {
  success: false;
  error: string;
  errorCode: string;
  currentStateID: number;
  }
  type CommandResult = CommandSuccess | CommandFailure;
  2.7 Move Definition
  // types/move-types.ts
  /\*\*
- The three-phase move lifecycle.
- Games implement this interface for each move type.
  _/
  interface MoveDefinition<TInput extends MoveInput = MoveInput> {
  /\*\* Can this move potentially be taken? Used for UI move discovery. _/
  available?: (context: MoveEnumerationContext) => boolean;
  /** Is this specific input legal? Runs before execution. \*/
  validate?: (context: MoveValidationContext<TInput>) => MoveValidationResult;
  /** Execute the move. Mutates state via draft. This is the only required field. _/
  execute: (context: MoveExecutionContext<TInput>) => void;
  /\*\* Behavioral flags _/
  undoable?: boolean;
  redactInput?: boolean;
  optimistic?: boolean | "auto";
  ignoreStaleStateID?: boolean;
  serverOnly?: boolean;
  ignorePriority?: boolean;
  }
  type MoveRecord = Record<string, MoveDefinition<any>>;
  type MoveValidationResult =
  | { valid: true }
  | { valid: false; error: string; errorCode: string };
  // ---- Context Interfaces ----
  interface MoveEnumerationContext {
  readonly G: DeepReadonly<object>;
  readonly playerId: PlayerId;
  readonly cards: CardReadAPI;
  readonly framework: FrameworkReadAPI;
  }
  interface MoveValidationContext<TInput extends MoveInput = MoveInput> {
  readonly G: DeepReadonly<object>;
  readonly playerId: PlayerId;
  readonly input: DeepReadonly<TInput>;
  readonly validationMode: "preflight" | "final";
  readonly cards: CardReadAPI;
  readonly framework: FrameworkReadAPI;
  }
  interface MoveExecutionContext<TInput extends MoveInput = MoveInput> {
  readonly G: Draft<object>;
  readonly playerId: PlayerId;
  readonly input: DeepReadonly<TInput>;
  readonly cards: CardRuntimeAPI;
  readonly framework: FrameworkWriteAPI;
  }
  // ---- Framework APIs ----
  interface FrameworkReadAPI {
  readonly state: FrameworkStateSnapshot;
  readonly zones: ZoneQueryAPI;
  readonly time: TimeQueryAPI;
  readonly cards: CardReadAPI;
  }
  interface FrameworkWriteAPI extends FrameworkReadAPI {
  readonly zones: ZoneOperationsAPI;
  readonly time: TimeOperationsAPI;
  readonly random: RandomAPI;
  readonly events: EventAPI;
  readonly undo: UndoAPI;
  readonly cards: CardRuntimeAPI;
  readonly log: (entry: LogEntry | readonly LogEntry[]) => void;
  readonly status: StatusAPI;
  readonly priority: PriorityAPI;
  }
  interface StatusAPI {
  readonly snapshot: DeepReadonly<CtxStatus>;
  patch: (patch: Partial<CtxStatus>) => void;
  setPhase: (phase?: string) => void;
  setStep: (step?: string) => void;
  setGameSegment: (segment?: string) => void;
  incrementTurn: (by?: number) => number;
  }
  interface PriorityAPI {
  readonly snapshot: DeepReadonly<CtxPriority>;
  patch: (patch: Partial<CtxPriority>) => void;
  setHolder: (playerId?: PlayerId) => void;
  openWindow: (holder?: PlayerId) => void;
  closeWindow: () => void;
  resetPasses: () => void;
  }
  interface EventAPI {
  emit: (event: GameEvent) => void;
  endGame: (result: GameEndResult) => void;
  }
  interface UndoAPI {
  markBarrier: (reason: string) => void;
  hasBarrier: () => boolean;
  getReasons: () => readonly string[];
  }
  interface RandomAPI {
  random: () => number;
  shuffle: <T>(array: T[]) => T[];
  }
  interface CardReadAPI {
  get: (cardId: string) => RuntimeCard | undefined;
  getByIdentifier: (id: string) => RuntimeCard | undefined;
  getDefinition: (cardId: string) => BaseCardDefinition | undefined;
  getMeta: (cardId: string) => BaseCardMeta | undefined;
  getZone: (cardId: string) => string | undefined;
  getOwner: (cardId: string) => PlayerId | undefined;
  getController: (cardId: string) => PlayerId | undefined;
  }
  interface CardRuntimeAPI extends CardReadAPI {
  setMeta: (cardId: string, meta: BaseCardMeta) => void;
  patchMeta: (cardId: string, patch: Partial<BaseCardMeta>) => BaseCardMeta;
  clearMeta: (cardId: string) => void;
  }
  // ---- Zone API ----
  interface ZoneQueryAPI {
  getCards: (zone: ZoneRef) => string[];
  getCardCount: (zone: ZoneRef) => number;
  getTopCard: (zone: ZoneRef) => string | undefined;
  getBottomCard: (zone: ZoneRef) => string | undefined;
  getCardZone: (cardId: string) => string | undefined;
  getCardOwner: (cardId: string) => PlayerId | undefined;
  getCardController: (cardId: string) => PlayerId | undefined;
  search: (zone: ZoneRef, predicate: (card: RuntimeCard) => boolean) => string[];
  isOrdered: (zone: ZoneRef) => boolean;
  getVisibility: (zone: ZoneRef) => ZoneVisibility;
  }
  interface ZoneMutationAPI {
  moveCard: (cardId: string, toZone: ZoneRef, options?: { index?: number; faceDown?: boolean }) => void;
  moveCards: (cardIds: string[], toZone: ZoneRef) => void;
  drawCards: (params: { from: ZoneRef; to: ZoneRef; count: number }) => string[];
  drawSpecificCard: (cardId: string, from: ZoneRef, to: ZoneRef) => boolean;
  mill: (from: ZoneRef, to: ZoneRef, count: number) => string[];
  shuffle: (zone: ZoneRef) => void;
  reveal: (cardIds: string[], visibleTo: "all" | string[], options?: { stateID?: number }) => string;
  revealTop: (zone: ZoneRef, count: number, visibleTo: "all" | string[]) => string[];
  clearReveal: (revealId: string) => void;
  }
  type ZoneOperationsAPI = ZoneQueryAPI & ZoneMutationAPI;
  2.8 Flow Definition
  // types/flow-types.ts
  interface FlowDefinition {
  gameSegments: Record<string, GameSegmentDefinition>;
  initialGameSegment?: string;
  }
  interface GameSegmentDefinition {
  id: string;
  name: string;
  order: number;
  onEnter?: LifecycleHook;
  onExit?: LifecycleHook;
  endIf?: (state: MatchState) => GameEndResult | undefined;
  validMoves?: string[];
  next?: string;
  turn: TurnDefinition;
  }
  interface TurnDefinition {
  initialPhase?: string;
  onBegin?: LifecycleHook;
  onEnd?: LifecycleHook;
  endIf?: (state: MatchState) => boolean;
  phases: Record<string, PhaseDefinition>;
  validMoves?: string[];
  }
  interface PhaseDefinition {
  id: string;
  name: string;
  order: number;
  onEnter?: LifecycleHook;
  onExit?: LifecycleHook;
  validMoves?: string[];
  endIf?: (state: MatchState) => boolean | string;
  nextPhase?: string | ((state: MatchState) => string);
  steps?: Record<string, StepDefinition>;
  next?: string;
  }
  interface StepDefinition {
  id: string;
  name: string;
  order: number;
  onEnter?: LifecycleHook;
  onExit?: LifecycleHook;
  endIf?: (state: MatchState) => boolean;
  validMoves?: string[];
  }
  /\*\*
- Lifecycle hooks receive full context and mutate state via draft.
- Can also be a raw state mutator for framework-level hooks.
  \*/
  type LifecycleHook =
  | ((context: LifecycleContext) => unknown)
  | ((state: MatchState) => MatchState | void);
  interface LifecycleContext {
  readonly G: Draft<object>;
  readonly playerId?: PlayerId;
  readonly cards: CardRuntimeAPI;
  readonly framework: FrameworkWriteAPI;
  }
  interface GameEndResult {
  winner?: string;
  reason: string;
  metadata?: Record<string, unknown>;
  }
  2.9 MatchRuntimeConfig — The Plug-In Contract
  This is the key abstraction: the framework defines this interface, and each game provides an implementation.
  // runtime/match-runtime.ts (simplified)
  interface MatchRuntimeConfig<
  TG extends object = object,
  TCard extends BaseCardDefinition = BaseCardDefinition,
  TMeta extends BaseCardMeta = BaseCardMeta,
  > {
  > /** Human-readable game name \*/
  > name: string;
  > /** Create the initial game-specific state (G) _/
  > setup: (args: SetupArgs) => TG;
  > /\*\* Populate zones after setup (shuffle decks, deal hands, etc.) _/
  > boardSetup?: (draft: Draft<MatchState<TG>>, ctx: BoardSetupContext) => void;
  > /** All move definitions \*/
  > moves: MoveRecord;
  > /** Flow/phase structure _/
  > flow: FlowDefinition;
  > /\*\* Zone definitions _/
  > zones: Record<string, ZoneConfig>;
  > /** Derive a card's runtime representation from definition + meta \*/
  > deriveRuntimeCard: (
  > instanceId: CardInstanceId,
  > definitionId: string,
  > meta: TMeta,
  > definition: TCard,
  > ownerId: PlayerId,
  > controllerId: PlayerId,
  > zoneId: string,
  > ) => RuntimeCard;
  > /** Filter state for a specific role (remove private data) _/
  > playerView: (state: MatchState<TG>, roleCtx: ViewRoleContext) => FilteredMatchView;
  > /\*\* Project full board for UI consumption _/
  > projectBoard: (
  > state: MatchState<TG>,
  > roleCtx: ViewRoleContext,
  > staticResources: MatchStaticResources<TCard>,
  > projectionCtx?: BoardProjectionContext,
  > ) => FilteredMatchView;
  > /** Derive animations from state transition (optional) \*/
  > derivePacketAnimations?: (context: PacketAnimationContext<TG>) => readonly PacketAnimation[];
  > }
  > interface SetupArgs {
  > players: Player[];
  > seed?: string;
  > staticResources: MatchStaticResources;
  > }
  > interface BoardSetupContext {
  > players: Player[];
  > staticResources: MatchStaticResources;
  > random: RandomAPI;
  > }
  > interface ViewRoleContext {
  > role: "player" | "spectator" | "judge";
  > playerId?: PlayerId;
  > }
  > interface BoardProjectionContext {
  > serverTimestamp: number;
  > }
  > interface PacketAnimationContext<TG = object> {
  > command: CommandEnvelope;
  > playerId: string;
  > previousState: MatchState<TG>;
  > nextState: MatchState<TG>;
  > staticResources: MatchStaticResources;
  > }
  > interface Player {
  > id: string;
  > name?: string;
  > }
  > interface MatchStaticResources<TCard extends BaseCardDefinition = BaseCardDefinition> {
  > cardCatalog: CardCatalog;
  > cardsMaps: CardsMaps;
  > instances: {
  > entries(): IterableIterator<{ instanceId: string; definitionId: string; ownerID: string }>;
  > get(instanceId: string): { definitionId: string; ownerID: string } | undefined;
  > size: number;
  > };
  > }
  > 2.10 MatchRuntime — The State Machine
  > // runtime/match-runtime.ts
  > class MatchRuntime<
  > TG extends object = object,
  > TCard extends BaseCardDefinition = BaseCardDefinition,
  > {
  > constructor(config: MatchRuntimeConfig<TG, TCard>, init: MatchRuntimeInit);
  > // --- Command Processing ---
  > processCommand(
  > command: CommandEnvelope,
  > playerId: string,
  > prevStateID: number,
  > timestamp: number,
  > actorRole?: "player" | "judge",
  > ): CommandResult;
  > // --- State Queries ---
  > getState(): MatchState<TG>;
  > getBoard(): FilteredMatchView;
  > getCurrentStateID(): number;
  > hasGameEnded(): boolean;
  > getGameEndResult(): GameEndResult | undefined;
  > // --- Move Enumeration ---
  > enumerateMovesForPlayer(playerId: string, actorRole?: string): string[];
  > enumerateMoves(actorRole?: string): string[];
  > // --- Validation ---
  > validateCommand(
  > command: CommandEnvelope,
  > playerId: string,
  > prevStateID?: number,
  > actorRole?: string,
  > ): { valid: boolean; reason?: string; code?: string };
  > // --- View Filtering ---
  > getFilteredView(roleCtx: ViewRoleContext): FilteredMatchView;
  > getProjectedBoardView(roleCtx: ViewRoleContext, projectionCtx?: BoardProjectionContext): FilteredMatchView | undefined;
  > // --- History ---
  > getPublishedGameEvents(): PublishedGameEvent[];
  > getGameLog(): GameLogEntry[];
  > getMoveLogHistory(): unknown[];
  > // --- Snapshot/Restore (for undo) ---
  > createRuntimeSnapshot(): RuntimeSnapshot;
  > restoreState(state: MatchState<TG>, snapshot: RuntimeSnapshot, options?: RestoreOptions): void;
  > // --- State Loading (for reconnection) ---
  > loadState(state: MatchState<TG>): void;
  > }
  > interface MatchRuntimeInit {
  > players: Player[];
  > cardsMaps: CardsMaps;
  > cardCatalog: CardCatalog;
  > seed?: string;
  > matchID?: string;
  > gameID?: string;
  > capturePatches?: boolean;
  > }
  > interface RuntimeSnapshot {
  > publishedGameEventsLength: number;
  > gameLogLength: number;
  > gameEnded: boolean;
  > gameEndResult?: GameEndResult;
  > }
  > interface RestoreOptions {
  > preserveHistory?: boolean;
  > newStateID?: number;
  > }
  > 2.11 Server/Client Engine
  > // engine/server-engine.ts
  > class ServerEngine<TG extends object = object> {
  > constructor(runtime: MatchRuntime<TG>, transports?: TransportManager);
  > /** Execute a move on behalf of a player _/
  > executeMoveForPlayer(playerId: string, moveId: string, input: MoveInput): CommandResult;
  > /\*\* Connect a player/spectator _/
  > acceptConnection(playerId: string, transport: Transport): void;
  > /** Disconnect \*/
  > removeConnection(playerId: string): void;
  > /** Broadcast current state to all connections _/
  > broadcastState(): void;
  > /\*\* Full authoritative state snapshot _/
  > getAuthoritativeState(): MatchState<TG>;
  > /** Undo support \*/
  > canUndo(playerId: string): boolean;
  > undo(playerId: string, prevStateID?: number): boolean;
  > /** Dispose resources _/
  > dispose(): void;
  > }
  > // engine/client-engine.ts
  > class ClientEngine {
  > constructor(transport: Transport, options?: ClientEngineOptions);
  > /\*\* Send a move to the server _/
  > executeMove(moveId: string, input: MoveInput): void;
  > /** Optimistic validation (runs move in sandbox) \*/
  > validateMove(moveId: string, input: MoveInput): EngineMoveValidationResult;
  > /** Get the current projected board _/
  > getBoard(): DeepReadonly<FilteredMatchView>;
  > /\*\* Subscribe to state updates _/
  > onStateUpdate(
  > handler: (state: DeepReadonly<FilteredMatchView>, stateID: number, packet: EnginePacketUpdate | null) => void,
  > ): () => void; // returns unsubscribe
  > /\*_ Reconnect _/
  > loadState(state: MatchState): void;
  > dispose(): void;
  > }
  > 2.12 Engine Contracts
  > // engine/contracts.ts
  > interface GameEngine {
  > getState(): DeepReadonly<MatchState>;
  > getBoard(): DeepReadonly<FilteredMatchView>;
  > getStateID(): number;
  > validateMove(moveId: string, input: MoveInput): EngineMoveValidationResult;
  > executeMove(moveId: string, input: MoveInput): EngineMoveExecutionResult;
  > enumerateMoves(): string[];
  > getMoveHistory(limit?: number): EngineMoveHistoryEntry[];
  > getActorContext(): EngineActorContext;
  > canUndo?(playerId: string): boolean;
  > undo?(playerId: string, prevStateID?: number): boolean;
  > dispose(): void | Promise<void>;
  > }
  > interface TransportAwareEngine extends GameEngine {
  > connect(): Promise<void>;
  > disconnect(): Promise<void>;
  > onStateUpdate(
  > handler: (state: DeepReadonly<FilteredMatchView>, stateID: number, packet: EnginePacketUpdate | null) => void,
  > ): () => void;
  > }
  > interface EngineActorContext {
  > role: "player" | "spectator" | "judge";
  > playerId?: string;
  > }
  > interface EngineMoveValidationResult {
  > valid: boolean;
  > reason?: string;
  > code?: string;
  > }
  > interface EngineMoveExecutionResult {
  > success: boolean;
  > reason?: string;
  > code?: string;
  > }
  > interface EnginePacketUpdate {
  > processedCommand: CommandEnvelope;
  > animations: PacketAnimation[];
  > canUndo?: boolean;
  > }
  > interface EngineMoveHistoryEntry {
  > moveId: string;
  > input?: MoveInput;
  > playerId?: string;
  > timestamp: number;
  > stateID?: number;
  > turnNumber?: number;
  > transitionType?: "move" | "undo";
  > }
  > 2.13 Zone Operations API
  > Full zone mutation API (preserved from current Lorcana architecture — this is game-agnostic):
  > // runtime/zone-operations.ts
  > interface ZoneOperationsAPI extends ZoneQueryAPI, ZoneMutationAPI {}
  > // All operations auto-emit domain events (CARD_MOVED, CARDS_DRAWN, ZONE_SHUFFLED, etc.)
  > // All operations auto-update zone summaries (count, revision)
  > // All operations auto-update card index (zoneKey, index, ownerID, controllerID)
  > // Moving cards to/from play zones auto-increments staticEffectsVersion
  > // See section 2.7 for full API signatures
  > 2.14 Persistence & Replay
  > // runtime/persistence.ts
  > interface PersistenceAdapter {
  > saveSnapshot(snapshot: MatchSnapshot): Promise<void>;
  > getLatestSnapshot(matchID: string): Promise<MatchSnapshot | null>;
  > getSnapshotAtStateID(matchID: string, stateID: number): Promise<MatchSnapshot | null>;
  > saveMetadata(metadata: MatchMetadata): Promise<void>;
  > getMetadata(matchID: string): Promise<MatchMetadata | null>;
  > listMatches(filters?: MatchListFilters): Promise<MatchMetadata[]>;
  > appendCommand(matchID: string, entry: CommandLogEntry): Promise<void>;
  > getCommandLog(matchID: string): Promise<CommandLogEntry[]>;
  > appendGameEvent(matchID: string, event: PublishedGameEvent): Promise<void>;
  > getGameEvents(matchID: string): Promise<PublishedGameEvent[]>;
  > saveReplayData(data: MatchReplayData): Promise<void>;
  > getReplayData(matchID: string): Promise<MatchReplayData | null>;
  > deleteMatch(matchID: string): Promise<void>;
  > }
  > class InMemoryPersistence implements PersistenceAdapter { ... }
  > class PersistenceManager {
  > constructor(adapter: PersistenceAdapter);
  > saveSnapshot(matchID: string, state: MatchState): Promise<void>;
  > loadLatestSnapshot(matchID: string): Promise<MatchState | null>;
  > completeMatch(matchID: string, winner?: string, endReason?: string): Promise<void>;
  > exportReplay(matchID: string, options: ReplayExportOptions): Promise<MatchReplayData | null>;
  > }
  > // runtime/replay.ts
  > class ReplayBuilder {
  > constructor(config: ReplayBuilderConfig);
  > setInitialState(state: MatchState): this;
  > addCommand(entry: CommandLogEntry): this;
  > addGameEvent(event: PublishedGameEvent): this;
  > setFinalState(state: MatchState): this;
  > build(): MatchReplayData;
  > }
  > class ReplayEngine {
  > constructor(replayData: MatchReplayData, options?: ReplayEngineOptions);
  > getTotalSteps(): number;
  > getCurrentStep(): number;
  > jumpToStep(step: number): ReplayStep | undefined;
  > nextStep(): ReplayStep | undefined;
  > previousStep(): ReplayStep | undefined;
  > getAllSteps(): ReplayStep[];
  > exportToJSON(): string;
  > }
  > class ReplayExporter {
  > static toJSON(replayData: MatchReplayData): ReplayExport;
  > static toCompressed(replayData: MatchReplayData): ReplayExport;
  > static filterForRole(replayData: MatchReplayData, role: "player" | "judge", playerID?: string): MatchReplayData;
  > }
  > 2.15 Automation Framework
  > // automation/types.ts
  > interface AutomationStrategy<TCandidate = unknown> {
  > name: string;
  > enumerateCandidates(context: AutomationContext): TCandidate[];
  > selectAction(candidates: TCandidate[], context: AutomationContext): TCandidate | null;
  > }
  > interface AutomationContext {
  > state: MatchState;
  > playerId: PlayerId;
  > board: FilteredMatchView;
  > staticResources: MatchStaticResources;
  > }
  > interface AutomationResult {
  > actionTaken: boolean;
  > moveId?: string;
  > input?: MoveInput;
  > deadlockDetected?: boolean;
  > }
  > // automation/planner.ts
  > function enumerateAutomatedActions(
  > runtime: MatchRuntime,
  > playerId: string,
  > strategy: AutomationStrategy,
  > ): unknown[];
  > function takeAutomatedAction(
  > runtime: MatchRuntime,
  > playerId: string,
  > strategy: AutomationStrategy,
  > ): AutomationResult;

---

3. Game Types Layer
   3.1 Directory Structure
   @tcg/<game>-types/src/
   index.ts
   cards/
   card-types.ts ← CharacterCard, ActionCard, etc. (game-specific)
   resource-types.ts ← Ink/mana/energy types
   classifications.ts ← Character classifications
   deck-validation.ts ← Deck building rules
   index.ts
   abilities/
   ability-types.ts ← KeywordAbility, TriggeredAbility, etc.
   trigger-types.ts ← Trigger events and subjects
   target-types.ts ← Targeting DSL and enums
   cost-types.ts ← Ability costs
   condition-types.ts ← Condition system
   effect-types/
   basic-effects.ts ← Draw, damage, heal, destroy, etc.
   amount-types.ts ← Fixed, variable, derived amounts
   movement-effects.ts ← Zone movements
   modifier-effects.ts ← Stat modify, keyword grant/lose
   control-flow.ts ← Sequence, choice, conditional, for-each
   game-specific.ts ← Effects unique to this game
   combined-types.ts ← Master Effect union
   index.ts
   helpers/ ← Fluent builders
   Abilities.ts
   Effects.ts
   Triggers.ts
   Targets.ts
   Conditions.ts
   Costs.ts
   index.ts
   index.ts
   targeting/
   target-dsl.ts ← Game-specific target DSL
   enum-expansions.ts ← Enum -> DSL expansion tables
   normalize.ts ← Target normalization
   index.ts
   expressions/
   index.ts ← Filter expressions, amounts, durations
   game/
   state-types.ts ← Game state (G) type
   runtime-state.ts ← Card meta, turn metadata, etc.
   index.ts
   decks/
   validate-deck.ts ← Format-aware deck validation
   index.ts
   i18n/
   index.ts ← I18n types for cards
   3.2 Example Game Types (Abstract TCG)
   These illustrate the pattern — a real game replaces these with concrete types.
   // cards/card-types.ts
   /\*\*

- Every game defines its card type discriminated union.
- Example for a hypothetical Cyberpunk TCG:
  \*/
  interface BaseCardProperties {
  id: string;
  canonicalId: string;
  name: string;
  version?: string;
  cardType: string; // Discriminant
  resourceType: string[]; // e.g., ["net"], ["chrome"], ["street"]
  cost: number;
  playable: boolean; // Can be played for cost (like inkable)
  rarity?: string;
  franchise?: string;
  set: string;
  cardNumber: number;
  text?: string;
  abilities?: AbilityDefinition[];
  i18n?: Record<string, I18nProperties>;
  }
  // Game defines its own card types extending base:
  interface RunnerCard extends BaseCardProperties {
  cardType: "runner";
  strength: number;
  resilience: number;
  agenda: number; // Lore equivalent
  classifications?: string[];
  }
  interface ProgramCard extends BaseCardProperties {
  cardType: "program";
  memory: number;
  damage: number;
  }
  interface HardwareCard extends BaseCardProperties {
  cardType: "hardware";
  // No extra fields — like Lorcana items
  }
  interface NodeCard extends BaseCardProperties {
  cardType: "node";
  // Like Lorcana locations
  accessCost: number;
  agenda: number;
  resilience: number;
  }
  type GameCard = RunnerCard | ProgramCard | HardwareCard | NodeCard;
  3.3 Ability Type System
  // abilities/ability-types.ts
  /\*\*
- Six ability variants (same structure as Lorcana, but with game-specific types):
  \*/
  type AbilityDefinition =
  | KeywordAbility
  | TriggeredAbility
  | ActivatedAbility
  | StaticAbility
  | ActionAbility
  | ReplacementAbility;
  interface KeywordAbility {
  type: "keyword";
  keyword: string; // Game-specific: "Ambush", "Stealth", etc.
  value?: number; // For parameterized keywords
  cost?: AbilityCost; // For special keywords (like Shift)
  condition?: Condition;
  text?: string;
  }
  interface TriggeredAbility {
  type: "triggered";
  trigger: Trigger;
  effect: Effect;
  sourceZones?: string[];
  condition?: Condition;
  name?: string;
  text?: string;
  }
  interface ActivatedAbility {
  type: "activated";
  cost: AbilityCost;
  effect: Effect;
  condition?: Condition;
  restrictions?: Restriction[];
  usesPerTurn?: number;
  name?: string;
  text?: string;
  }
  interface StaticAbility {
  type: "static";
  effect: StaticEffect;
  condition?: Condition;
  sourceZones?: string[];
  name?: string;
  text?: string;
  }
  interface ActionAbility {
  type: "action";
  effect: Effect;
  condition?: Condition;
  alternativeCost?: AbilityCost;
  name?: string;
  text?: string;
  }
  interface ReplacementAbility {
  type: "replacement";
  replaces: string; // Event kind to replace
  replacement: Effect;
  condition?: Condition;
  name?: string;
  text?: string;
  }
  type Restriction =
  | "once-per-turn"
  | "during-your-turn"
  | { type: "during-turn"; whose: "your" | "opponent" }
  | { type: "while-exerted" }
  | { type: "in-combat" }
  | { type: "custom"; restriction: string };
  3.4 Trigger System
  // abilities/trigger-types.ts
  type TriggerTiming = "when" | "whenever" | "at";
  /\*\*
- Games define their own TriggerEvent literals.
- Example: "play", "banish", "quest", "damage", "draw", "start-turn", etc.
  _/
  type TriggerEvent = string;
  interface BaseTrigger {
  event?: TriggerEvent;
  events?: TriggerEvent[];
  timing?: TriggerTiming;
  on?: TriggerSubject;
  restrictions?: TriggerRestriction[];
  condition?: Condition;
  }
  type Trigger = BaseTrigger | /_ game-specific variants \*/ BaseTrigger;
  type TriggerSubject = string | TriggerSubjectQuery;
  interface TriggerSubjectQuery {
  controller?: "you" | "opponent" | "any";
  cardType?: string;
  classification?: string;
  name?: string;
  hasKeyword?: string;
  filters?: Record<string, unknown>;
  }
  interface TriggerRestriction {
  type: "once-per-turn" | "once-per-game" | string;
  [key: string]: unknown;
  }
  /\*\*
- Pre-built trigger patterns for convenience.
- Games populate this with their common triggers.
  \*/
  interface CommonTriggers {
  WHEN_PLAY_SELF: BaseTrigger;
  WHENEVER_DAMAGE_SELF: BaseTrigger;
  AT_START_OF_TURN: BaseTrigger;
  AT_END_OF_TURN: BaseTrigger;
  // ... game populates
  }
  3.5 Targeting DSL
  // abilities/target-types.ts
  /\*\*
- Targeting is a multi-layer DSL:
- 1. String enums for common targets (game-specific)
- 2. Query objects for complex targeting
- 3. Card references for contextual targets
-
- The framework provides the query structure; games fill in enums.
  _/
  // ---- Card References (contextual) ----
  interface CardReference {
  ref: "self" | "trigger-source" | "attacker" | "defender" | "previous-target" | string;
  }
  // ---- Target Enums (game-specific string literals) ----
  // Games define these as const arrays + union types, e.g.:
  // type CharacterTarget = "SELF" | "CHOSEN_CHARACTER" | "ALL_CHARACTERS" | ...
  // type PlayerTarget = "CONTROLLER" | "OPPONENT" | "EACH_PLAYER" | ...
  // ---- Query Objects ----
  interface TargetQuery {
  selector: "self" | "chosen" | "all" | "each" | "any" | "random";
  count?: number | { exactly: number } | { upTo: number } | { atLeast: number } | "all";
  owner?: "you" | "opponent" | "any";
  zones?: string[];
  cardType?: string | string[];
  filters?: TargetFilter[];
  excludeSelf?: boolean;
  }
  // ---- Filter System ----
  type TargetFilter =
  | StatusFilter
  | KeywordFilter
  | ClassificationFilter
  | StatComparisonFilter
  | NameFilter
  | ZoneFilter
  | OwnerFilter
  | AndFilter
  | OrFilter
  | NotFilter
  | /_ game-specific \*/ never;
  interface StatusFilter { type: "status"; status: "damaged" | "undamaged" | "exerted" | "ready"; }
  interface KeywordFilter { type: "has-keyword"; keyword: string; value?: number; }
  interface ClassificationFilter { type: "has-classification"; classification: string; }
  interface StatComparisonFilter { type: "stat"; stat: string; operator: ComparisonOperator; value: number; }
  interface NameFilter { type: "has-name"; name: string; }
  interface ZoneFilter { type: "in-zone"; zone: string; }
  interface OwnerFilter { type: "owner"; owner: "you" | "opponent"; }
  interface AndFilter { type: "and"; filters: TargetFilter[]; }
  interface OrFilter { type: "or"; filters: TargetFilter[]; }
  interface NotFilter { type: "not"; filter: TargetFilter; }
  type ComparisonOperator = "eq" | "ne" | "gt" | "gte" | "lt" | "lte";
  3.6 Cost Types
  // abilities/cost-types.ts
  /\*\*
- Games compose costs from these primitives.
- Each game adds its own specific cost types.
  \*/
  type CostComponent =
  | ExertCost
  | ResourceCost
  | BanishCost
  | DiscardCost
  | DamageSelfCost
  | ReturnToHandCost
  | ExertOtherCost
  | CustomCost;
  interface ExertCost { type: "exert"; target?: string; }
  interface ResourceCost { type: "resource"; amount: number; }
  interface BanishCost { type: "banish"; target: string; cardType?: string; }
  interface DiscardCost { type: "discard"; amount: number; cardType?: string; }
  interface DamageSelfCost { type: "damage-self"; amount: number; }
  interface ReturnToHandCost { type: "return-to-hand"; target: string; }
  interface ExertOtherCost { type: "exert-other"; target: string; amount?: number; }
  interface CustomCost { type: string; [key: string]: unknown; }
  /\*\*
- Flat interface for combining multiple costs.
- Games extend with their specific cost fields.
  \*/
  interface AbilityCost {
  exert?: boolean;
  resource?: number;
  banishSelf?: boolean;
  banishItem?: boolean;
  discardCards?: number;
  damageSelf?: number;
  components?: CostComponent[];
  [key: string]: unknown; // Game-specific costs
  }
  3.7 Condition System
  // abilities/condition-types.ts
  /\*\*
- Conditions gate abilities and effects.
- The framework provides structural conditions; games add domain-specific ones.
  \*/
  type Condition =
  | LogicalCondition
  | ComparisonCondition
  | CardExistenceCondition
  | ZoneCondition
  | TurnCondition
  | DamageCondition
  | StateCondition
  | GameSpecificCondition;
  // --- Structural (framework provides) ---
  interface LogicalCondition {
  type: "and" | "or" | "not";
  conditions: Condition[];
  }
  interface ComparisonCondition {
  type: "comparison";
  left: ComparisonValue;
  operator: ComparisonOperator;
  right: ComparisonValue;
  }
  type ComparisonValue = number | string | { type: "count"; query: TargetQuery } | { type: "resource"; player: string };
  interface ZoneCondition {
  type: "in-zone" | "not-in-zone";
  zone: string;
  card?: CardReference;
  }
  interface TurnCondition {
  type: "during-turn" | "not-during-turn";
  whose: "your" | "opponent";
  }
  interface DamageCondition {
  type: "has-damage" | "no-damage" | "damage-comparison";
  operator?: ComparisonOperator;
  value?: number;
  }
  // --- Game-specific (placeholder) ---
  interface GameSpecificCondition {
  type: string;
  [key: string]: unknown;
  }
  // --- Convenience constructors ---
  function and(...conditions: Condition[]): Condition;
  function or(...conditions: Condition[]): Condition;
  function not(condition: Condition): Condition;
  3.8 Effect Types
  // abilities/effect-types/
  // ---- Basic Effects (framework-provided) ----
  // basic-effects.ts
  interface DrawEffect { type: "draw"; amount: number | AmountExpr; target: string; }
  interface DiscardEffect { type: "discard"; amount: number | AmountExpr; target: string; chosen?: boolean; }
  interface DealDamageEffect { type: "deal-damage"; amount: number | AmountExpr; target: string; preventable?: boolean; }
  interface RemoveDamageEffect { type: "remove-damage"; amount: number | AmountExpr; target: string; }
  interface BanishEffect { type: "banish"; target: string; }
  interface ExertEffect { type: "exert"; target: string; }
  interface ReadyEffect { type: "ready"; target: string; }
  interface GainResourceEffect { type: "gain-resource"; amount: number | AmountExpr; target: string; resource?: string; }
  interface LoseResourceEffect { type: "lose-resource"; amount: number | AmountExpr; target: string; resource?: string; }
  // ---- Amounts ----
  // amount-types.ts
  type Amount = number | AmountExpr;
  type AmountExpr =
  | { type: "fixed"; value: number }
  | { type: "variable"; source: string; [key: string]: unknown }
  | { type: "for-each"; counter: ForEachCounter }
  | { type: "count"; query: TargetQuery }
  | { type: "stat"; target: string; stat: string }
  | { type: "difference"; minuend: Amount; subtrahend: Amount }
  | { type: "clamp"; value: Amount; min: number; max: number };
  interface ForEachCounter {
  type: string;
  [key: string]: unknown;
  }
  type EffectDuration =
  | "this-turn"
  | "next-turn"
  | "until-start-of-next-turn"
  | "permanent"
  | { turns: number }
  | { until: Condition };
  // ---- Movement Effects ----
  // movement-effects.ts
  interface ReturnToHandEffect { type: "return-to-hand"; target: string; }
  interface ShuffleIntoDeckEffect { type: "shuffle-into-deck"; target: string; }
  interface PutOnBottomEffect { type: "put-on-bottom"; target: string; }
  interface PlayCardEffect { type: "play-card"; target: string; cost?: "free" | "reduced"; reduction?: number; }
  interface MoveToZoneEffect { type: "move-to-zone"; target: string; destination: string; }
  // ---- Modifier Effects ----
  // modifier-effects.ts
  interface ModifyStatEffect { type: "modify-stat"; stat: string; target: string; modifier: AmountExpr | number; duration?: EffectDuration; }
  interface GainKeywordEffect { type: "gain-keyword"; keyword: string; value?: number; target: string; duration?: EffectDuration; }
  interface LoseKeywordEffect { type: "lose-keyword"; keyword: string; target: string; }
  interface RestrictionEffect { type: "restriction"; restriction: string; target: string; duration?: EffectDuration; }
  interface CostReductionEffect { type: "cost-reduction"; amount: number | AmountExpr; target: string; cardType?: string; duration?: EffectDuration; }
  // ---- Control Flow ----
  // control-flow.ts
  interface SequenceEffect { type: "sequence"; steps: Effect[]; }
  interface ChoiceEffect { type: "choice"; options: Effect[]; chooser?: string; }
  interface OptionalEffect { type: "optional"; effect: Effect; chooser?: string; }
  interface ConditionalEffect { type: "conditional"; condition: Condition; then: Effect; else?: Effect; }
  interface ForEachEffect { type: "for-each"; counter: ForEachCounter; effect: Effect; }
  interface RepeatEffect { type: "repeat"; times: number | AmountExpr; effect: Effect; }
  // ---- Master Union ----
  // combined-types.ts
  type Effect =
  | DrawEffect | DiscardEffect | DealDamageEffect | RemoveDamageEffect
  | BanishEffect | ExertEffect | ReadyEffect
  | GainResourceEffect | LoseResourceEffect
  | ReturnToHandEffect | ShuffleIntoDeckEffect | PutOnBottomEffect | PlayCardEffect | MoveToZoneEffect
  | ModifyStatEffect | GainKeywordEffect | LoseKeywordEffect | RestrictionEffect | CostReductionEffect
  | SequenceEffect | ChoiceEffect | OptionalEffect | ConditionalEffect | ForEachEffect | RepeatEffect
  | GameSpecificEffect; // <-- escape hatch for game-specific effects
  interface GameSpecificEffect {
  type: string; // Must be prefixed, e.g., "cyber-hack"
  [key: string]: unknown;
  }
  type StaticEffect = ModifyStatEffect | GainKeywordEffect | LoseKeywordEffect | RestrictionEffect | CostReductionEffect;

---

4. Game Engine Layer
   4.1 Directory Structure
   @tcg/<game>-engine/src/
   index.ts ← Public API barrel
   definition.ts ← MatchRuntimeConfig implementation
   zones.ts ← Zone configuration
   flow.ts ← Flow/phase definition
   moves/
   index.ts ← Move map aggregation
   core/
   play-card.ts
   quest-or-equivalent.ts
   challenge-or-equivalent.ts
   pass-turn.ts
   concede.ts
   put-into-resource.ts
   setup/
   choose-first-player.ts
   mulligan.ts
   abilities/
   activate-ability.ts
   resolution/
   resolve-bag.ts
   resolve-effect.ts
   effects/
   handlers/
   draw.ts ← handleDrawEffect
   deal-damage.ts ← handleDealDamageEffect
   banish.ts ← handleBanishEffect
   movement.ts ← handleReturnToHand, handleShuffleIntoDeck, etc.
   modifiers.ts ← handleModifyStat, handleGainKeyword, etc.
   control-flow.ts ← handleSequence, handleChoice, handleConditional, etc.
   index.ts ← EffectHandlerRegistry
   resolver.ts ← resolveEffect pipeline
   continuous-effects.ts ← Continuous effect management
   triggered-abilities/
   matching.ts ← Event → trigger matching
   bag.ts ← Bag queue management
   events.ts ← Game event generation
   delay-buffer.ts ← Delayed trigger management
   index.ts
   replacement-effects.ts ← Replacement effect application
   rules/
   condition-evaluator/
   index.ts ← evaluateCondition dispatcher
   comparisons.ts ← Numeric comparisons
   card-conditions.ts ← Card existence, keyword, classification checks
   turn-conditions.ts ← Turn-phase, this-turn tracking
   zone-conditions.ts ← Zone membership conditions
   state-conditions.ts ← Game-specific state conditions
   derived-state/
   index.ts ← getEffectiveStat, getEffectiveKeywords, etc.
   stat-derivation.ts ← Base + modifiers + temporary
   keyword-derivation.ts ← Base + granted - lost + temporary
   cost-derivation.ts ← Base + reductions + increases
   static-effects/
   registry.ts ← StaticEffectRegistry (O(N) materialization)
   materialization.ts ← Single-pass effect materialization
   targeting/
   target-resolver.ts ← Resolve target DSL → card IDs
   target-filter.ts ← Apply filters to candidate sets
   index.ts
   operations/ ← NEW: Centralized state mutation layer
   zone-ops.ts ← Move card, draw, mill, shuffle wrappers
   card-ops.ts ← Deal damage, exert, ready, set counters
   game-ops.ts ← Gain resource, change phase, set winner
   index.ts ← createGameOperations factory
   projection/
   project-board.ts ← Full board projection for UI
   card-derived.ts ← Per-card derived properties
   index.ts
   testing/
   index.ts ← Public testing API
   test-engine.ts ← GameTestEngine (wraps MultiplayerTestEngine)
   card-mocks.ts ← createMockCharacter, createMockAction, etc.
   matchers.ts ← Custom game-specific matchers
   matchers.d.ts ← Matcher type declarations
   fixture-builder.ts ← TestInitialState + buildFixture
   server.ts ← GameServer (thin wrapper)
   client.ts ← GameClient (thin wrapper)
   4.2 Game Definition
   // definition.ts
   import { type MatchRuntimeConfig } from "@tcg/tcg-engine";
   import { type GameCard, type GameG } from "@tcg/<game>-types";
   import { gameRuntimeMoves } from "./moves";
   import { gameRuntimeFlow } from "./flow";
   import { gameRuntimeZones } from "./zones";
   import { projectGameBoardView } from "./projection/project-board";
   export const gameRuntimeConfig: MatchRuntimeConfig<GameG, GameCard> = {
   name: "Cyberpunk TCG",
   setup: ({ players }) => createInitialGameG(players),
   boardSetup: (draft, ctx) => { /_ shuffle decks, deal hands _/ },
   moves: gameRuntimeMoves,
   flow: gameRuntimeFlow,
   zones: gameRuntimeZones,
   deriveRuntimeCard: deriveGameRuntimeCard,
   playerView: (state, roleCtx) => filterMatchView(state, roleCtx, zoneRegistry),
   projectBoard: (state, roleCtx, resources, projectionCtx) =>
   projectGameBoardView(state, roleCtx, resources, projectionCtx),
   };
   4.3 Operations Layer (NEW)
   This is the key improvement over the Lorcana architecture. Every state mutation goes through the operations layer:
   // operations/index.ts
   interface GameOperations {
   readonly zone: ZoneOperations;
   readonly card: CardOperations;
   readonly game: GameOperations;
   }
   // operations/zone-ops.ts
   interface ZoneOperations {
   moveCard(cardId: string, toZone: string, playerId?: string, opts?: { index?: number }): void;
   drawCards(playerId: string, count: number): string[];
   millCards(playerId: string, count: number): string[];
   shuffleDeck(playerId: string): void;
   discardCard(cardId: string): void;
   // Wraps framework zones with game-specific event emission
   }
   // operations/card-ops.ts
   interface CardOperations {
   dealDamage(cardId: string, amount: number, opts?: { preventable?: boolean }): number;
   healDamage(cardId: string, amount: number): number;
   exert(cardId: string): void;
   ready(cardId: string): void;
   addCounter(cardId: string, counterType: string, amount: number): void;
   removeCounter(cardId: string, counterType: string, amount: number): void;
   setMeta(cardId: string, key: string, value: unknown): void;
   // Wraps framework card meta with game-specific derived state invalidation
   }
   // operations/game-ops.ts
   interface GameOperations {
   gainResource(playerId: string, amount: number): void;
   spendResource(playerId: string, amount: number): boolean;
   checkWinCondition(): { winner: string; reason: string } | undefined;
   setTurnMetadata(key: string, value: unknown): void;
   // Wraps G mutations with event emission
   }
   function createGameOperations(
   G: Draft<GameG>,
   ctx: MoveExecutionContext,
   ): GameOperations;
   Why this matters: Moves compose operations instead of directly mutating state:
   // BEFORE (Lorcana): Move directly mutates G and framework
   execute: (ctx) => {
   ctx.cards.patchMeta(cardId, { exerted: true });
   const lore = getEffectiveLore(ctx.G, cardId, ctx.cards);
   ctx.G.lore[playerId] += lore;
   ctx.framework.events.emit({ type: "quested", ... });
   }
   // AFTER (New): Move composes operations
   execute: (ctx) => {
   const ops = createGameOperations(ctx.G, ctx);
   ops.card.exert(cardId);
   const lore = rules.getEffectiveLore(ctx.G, cardId, ctx.cards);
   ops.game.gainResource(playerId, lore, { type: "agenda" });
   // Events auto-emitted by operations
   }
   4.4 Effect Handler Registry (NEW)
   // effects/handlers/index.ts
   type EffectHandler<E extends Effect = Effect> = (
   effect: E,
   context: EffectResolutionContext,
   ) => EffectResolutionResult;
   interface EffectResolutionContext {
   G: Draft<GameG>;
   playerId: PlayerId;
   ops: GameOperations;
   cards: CardRuntimeAPI;
   framework: FrameworkWriteAPI;
   sourceCard?: string;
   resolutionInput?: ResolutionInput;
   }
   type EffectResolutionResult =
   | { status: "resolved" }
   | { status: "suspended"; pendingEffect: PendingEffect }
   | { status: "partial"; remaining: Effect[] };
   // Build the registry
   const effectHandlers: Record<string, EffectHandler> = {
   "draw": handleDrawEffect,
   "deal-damage": handleDealDamageEffect,
   "banish": handleBanishEffect,
   "exert": handleExertEffect,
   "ready": handleReadyEffect,
   "return-to-hand": handleReturnToHandEffect,
   "modify-stat": handleModifyStatEffect,
   "gain-keyword": handleGainKeywordEffect,
   "restriction": handleRestrictionEffect,
   "sequence": handleSequenceEffect,
   "choice": handleChoiceEffect,
   "conditional": handleConditionalEffect,
   "optional": handleOptionalEffect,
   "for-each": handleForEachEffect,
   // Game-specific handlers registered here
   };
   function resolveEffect(
   effect: Effect,
   context: EffectResolutionContext,
   ): EffectResolutionResult {
   const handler = effectHandlers[effect.type];
   if (!handler) throw new Error(`Unknown effect type: ${effect.type}`);
   return handler(effect, context);
   }
   4.5 Server/Client Decomposition (NEW)
   Instead of a 4300-line base class, use composition:
   // server.ts
   class GameServer {
   private readonly engine: ServerEngine<GameG>;
   private readonly \_state: StateQuerier;
   private readonly \_moves: MoveExecutor;
   private readonly \_validation: MoveValidator;
   private readonly \_resolution: EffectResolver;
   private readonly \_available: AvailableMovesQuerier;
   private readonly \_debug: DebugOperations;
   constructor(runtime: MatchRuntime<GameG>, init: MatchRuntimeInit) {
   this.engine = new ServerEngine(runtime, init);
   this.\_state = new StateQuerier(this.engine);
   this.\_moves = new MoveExecutor(this.engine);
   this.\_validation = new MoveValidator(this.engine);
   this.\_resolution = new EffectResolver(this.engine);
   this.\_available = new AvailableMovesQuerier(this.engine);
   this.\_debug = new DebugOperations(this.engine);
   }
   get state(): StateQuerier { return this.\_state; }
   get moves(): MoveExecutor { return this.\_moves; }
   get validation(): MoveValidator { return this.\_validation; }
   get resolution(): EffectResolver { return this.\_resolution; }
   get available(): AvailableMovesQuerier { return this.\_available; }
   get debug(): DebugOperations { return this.\_debug; }
   }
   // client.ts
   class GameClient {
   private readonly engine: ClientEngine;
   private readonly \_state: StateQuerier;
   private readonly \_moves: MoveExecutor;
   constructor(transport: Transport) {
   this.engine = new ClientEngine(transport);
   this.\_state = new StateQuerier(this.engine);
   this.\_moves = new MoveExecutor(this.engine);
   }
   get state(): StateQuerier { return this.\_state; }
   get moves(): MoveExecutor { return this.\_moves; }
   }
   // State querier — shared between server and client
   class StateQuerier {
   constructor(private engine: GameEngine) {}
   getLore(playerId: PlayerId): number;
   getDamage(cardId: string): number;
   isExerted(cardId: string): boolean;
   getCard(cardId: string): RuntimeCard | undefined;
   getCardsInZone(zone: string, playerId?: PlayerId): string[];
   getZoneCounts(playerId: PlayerId): Record<string, number>;
   getBoard(): FilteredMatchView;
   getPhase(): string | undefined;
   getActivePlayer(): PlayerId | undefined;
   hasKeyword(cardId: string, keyword: string): boolean;
   hasRestriction(cardId: string, restriction: string): boolean;
   }
   // Move executor — shared between server and client
   class MoveExecutor {
   constructor(private engine: GameEngine) {}
   playCard(cardId: string, options?: PlayCardOptions): CommandResult;
   quest(cardId: string): CommandResult;
   challenge(attackerId: string, defenderId: string): CommandResult;
   passTurn(): CommandResult;
   concede(playerId: PlayerId): CommandResult;
   putIntoResource(cardId: string): CommandResult;
   activateAbility(cardId: string, options?: AbilityOptions): CommandResult;
   resolveBag(bagId: string, params?: ResolutionInput): CommandResult;
   resolveEffect(effectId: string, params: ResolutionInput): CommandResult;
   }

---

5. Cards Package
   5.1 Directory Structure
   @tcg/<game>-cards/src/
   index.ts
   cards/
   index.ts ← getAllCards(), getCardCatalog()
   catalog-data.ts ← Eager imports of all sets
   types.ts ← CanonicalCard union type
   001/ ← Set 1
   index.ts
   runners/
   001-character-slug.ts ← Card definition
   001-character-slug.test.ts
   001-character-slug.i18n.ts
   programs/
   hardware/
   002/ ... ← Subsequent sets
   data/ ← Generated JSON data
   index.ts
   canonical-cards.json
   printings.json
   sets.json
   localization-\*.json
   helpers/
   abilities/ ← Keyword helpers (rush(), ward(), etc.)
   index.ts
   ambush.ts
   stealth.ts
   ...
   scripts/ ← Card generation scripts
   generate-cards.ts
   fetch-inputs.ts
   generators/
   parsers/
   5.2 Card Definition Pattern
   Same as Lorcana — cards are pure data:
   // cards/001/runners/001-ace-hacker.ts
   import type { RunnerCard } from "@tcg/<game>-types";
   import { ambush } from "../../helpers/abilities";
   export const aceHacker: RunnerCard = {
   id: "AH1",
   canonicalId: "ci_AH1",
   cardType: "runner",
   name: "Ace",
   version: "Hacker",
   resourceType: ["net"],
   cost: 3,
   strength: 3,
   resilience: 4,
   agenda: 2,
   playable: true,
   classifications: ["Street", "Netrunner"],
   abilities: [
   ambush,
   {
   type: "triggered",
   trigger: { event: "play", timing: "when", on: "SELF" },
   effect: { type: "draw", amount: 1, target: "CONTROLLER" },
   },
   ],
   i18n: aceHackerI18n,
   };

---

6. Testing Infrastructure
   6.1 Three-Layer Architecture
   @tcg/tcg-engine/testing ← Framework-level (game-agnostic)
   MultiplayerTestEngine<Config>
   CoreTestEngine interface
   base matchers: toBeSuccessfulCommand, toBeInZone
   @tcg/<game>-engine/testing ← Game-specific (engine tests)
   GameTestEngine ← Wraps MultiplayerTestEngine
   createMock\*() factories
   game matchers: toBeExerted, toHaveDamage, toHaveKeyword
   TestInitialState + fixture builder
   @tcg/<game>-simulator/testing ← Integration (real cards + engine)
   Uses GameTestEngine with real card imports
   Rules tests (organized by rulebook section)
   Effect tests (organized by effect type)
   Regression tests
   Timing tests
   6.2 GameTestEngine
   // testing/test-engine.ts
   import { MultiplayerTestEngine } from "@tcg/tcg-engine/testing";
   interface TestFixtureCardState {
   card: TestCardInput;
   exerted?: boolean;
   damage?: number;
   counters?: Record<string, number>;
   isDrying?: boolean;
   atLocation?: string;
   }
   type TestFixtureCardEntry = TestCardInput | TestFixtureCardState;
   interface TestInitialState {
   hand?: number | TestFixtureCardEntry[];
   deck?: number | TestFixtureCardEntry[];
   play?: number | TestFixtureCardEntry[];
   resource?: number | TestFixtureCardEntry[]; // Game-specific zone
   discard?: number | TestFixtureCardEntry[];
   agenda?: number; // Game-specific: starting score
   }
   interface GameTestEngineConfig {
   skipPreGame?: boolean;
   seed?: string;
   showLogs?: boolean;
   startingAgenda?: Record<string, number>; // Per-player starting score
   }
   class GameTestEngine {
   private readonly multiplayerEngine: MultiplayerTestEngine;
   private readonly serverOps: ServerOperations;
   static createWithFixture(
   playerOneState: TestInitialState,
   playerTwoState?: TestInitialState,
   config?: GameTestEngineConfig,
   ): GameTestEngine;
   asPlayerOne(): PlayerActions;
   asPlayerTwo(): PlayerActions;
   asServer(): ServerActions;
   getBoard(): GameBoardView;
   getPublishedEvents(): PublishedGameEvent[];
   }
   // Player-facing API
   interface PlayerActions {
   // Moves
   playCard(card: CardInput, options?: PlayOptions): CommandResult;
   quest(card: CardInput): CommandResult;
   challenge(attacker: CardInput, defender: CardInput): CommandResult;
   passTurn(): CommandResult;
   activateAbility(card: CardInput, options?: AbilityOptions): CommandResult;
   resolveBag(bagId: string, options?: ResolutionOptions): CommandResult;
   resolveEffect(effectId: string, params: ResolutionInput): CommandResult;
   // Queries
   getDamage(card: CardInput): number;
   isExerted(card: CardInput): boolean;
   getCard(card: CardInput): RuntimeCard | undefined;
   getCardZone(card: CardInput): string | undefined;
   getCardsInZone(zone: string, playerId?: PlayerId): { count: number; cards: RuntimeCard[] };
   getZoneCounts(): Record<string, number>;
   hasKeyword(card: CardInput, keyword: string): boolean;
   hasRestriction(card: CardInput, restriction: string): boolean;
   getLore(playerId: PlayerId): number;
   // Effect inspection
   getBagEffects(): BagEffect[];
   getBagCount(): number;
   getPendingEffects(): PendingEffect[];
   }
   // Server-only API
   interface ServerActions extends PlayerActions {
   // Debug moves
   manualMoveCard(card: CardInput, fromZone: string, toZone: string, playerId?: PlayerId): CommandResult;
   manualExertCard(card: CardInput): CommandResult;
   manualReadyCard(card: CardInput): CommandResult;
   manualSetDamage(card: CardInput, damage: number): CommandResult;
   manualSetLore(playerId: PlayerId, lore: number): CommandResult;
   manualPassTurn(): CommandResult;
   }
   6.3 Custom Matchers
   // testing/matchers.ts
   // Auto-loaded via bunfig.toml preload
   // Command result matchers
   expect(result).toBeSuccessfulCommand();
   expect(result).not.toBeSuccessfulCommand();
   // Card state matchers (called on PlayerActions)
   expect(engine.asPlayerOne()).toBeExerted(card);
   expect(engine.asPlayerOne()).toBeReady(card);
   expect(engine.asPlayerOne()).toHaveDamage({ card, value: 2 });
   expect(engine.asPlayerOne()).toHaveKeyword({ card, keyword: "Ambush" });
   expect(engine.asPlayerOne()).toHaveRestriction({ card, restriction: "cant-attack" });
   // Game state matchers
   expect(engine.asPlayerOne()).toBeInPhase("main");
   expect(engine.asPlayerOne()).toHaveCardCountInZone({ zone: "play", player: PLAYER_ONE, count: 3 });
   expect(engine.asPlayerOne()).toHaveZoneCounts({ hand: 5, play: 2 });
   expect(engine.asPlayerOne()).toHavePendingEffectCount(1);
   expect(engine.asPlayerOne()).toHavePriorityPlayer(PLAYER_ONE);
   // Card zone matchers (called on card objects)
   expect(card).toBeInZone("discard");
   6.4 Test Example
   // From cards or engine tests
   import { GameTestEngine, PLAYER_ONE, PLAYER_TWO, createMockCharacter } from "@tcg/<game>-engine/testing";
   import { aceHacker, corporateGuard } from "@tcg/<game>-cards/cards/001";
   describe("Ace - Hacker", () => {
   it("draws 1 card when played", () => {
   const engine = GameTestEngine.createWithFixture(
   { hand: [aceHacker], resource: aceHacker.cost, deck: 5 },
   { deck: 5 },
   );
   expect(engine.asPlayerOne().playCard(aceHacker)).toBeSuccessfulCommand();
   expect(engine.asPlayerOne().getZoneCounts().hand).toBe(1); // drew 1
   expect(engine.asPlayerOne().getZoneCounts().deck).toBe(4);
   });
   });

---

7. Platform Features
   7.1 AI/Bot Play
   // @tcg/<game>-engine/src/automation/ or separate @tcg/<game>-bot package
   import { type AutomationStrategy } from "@tcg/tcg-engine/automation";
   class GameStrategy implements AutomationStrategy<GameActionCandidate> {
   name = "default-aggressive";
   enumerateCandidates(ctx: AutomationContext): GameActionCandidate[] {
   // Game-specific: enumerate all possible actions
   const candidates: GameActionCandidate[] = [];
   // Check hand cards, characters that can act, etc.
   return candidates;
   }
   selectAction(candidates: GameActionCandidate[], ctx: AutomationContext): GameActionCandidate | null {
   // Game-specific heuristics
   return candidates[0] ?? null;
   }
   }
   7.2 Tournament Infrastructure
   // In @tcg/<game>-simulator or separate @tcg/platform package
   interface TournamentConfig {
   id: string;
   format: string;
   players: TournamentPlayer[];
   structure: "swiss" | "single-elim" | "double-elim" | "round-robin";
   rounds?: number;
   matchConfig: {
   timeControl: TimeControlConfig;
   allowSpectators: boolean;
   allowUndo: boolean;
   };
   }
   interface TournamentMatch {
   id: string;
   round: number;
   table: number;
   playerOne: TournamentPlayer;
   playerTwo: TournamentPlayer;
   result?: MatchResult;
   }
   interface MatchResult {
   winner: string;
   reason: "score" | "concede" | "timeout" | "deck-out";
   scores: Record<string, number>;
   replayId: string;
   duration: number;
   }
   7.3 Spectating & Replays
   Already covered in the framework's ReplayEngine, ReplayBuilder, ReplayExporter with role-based filtering. Games add:

- Custom replay metadata (game-specific stats)
- Custom replay timeline markers (significant events)
- Custom spectator view projection

---

8. Migration from Lorcana Architecture
   Key Changes Summary
   Area Current (Lorcana) New Architecture
   Framework coupling Core has Lorcana types baked in @tcg/tcg-engine is fully generic
   Types All in one @tcg/lorcana-types Split: base in framework, game-specific in @tcg/<game>-types
   God class LorcanaEngineBase (4300 lines) Composition: StateQuerier + MoveExecutor + MoveValidator + EffectResolver + DebugOps
   State mutations Moves directly mutate G + framework Operations layer wraps all mutations
   Effect handling Scattered in large files Effect handler registry (one function per type)
   Monolithic files 6 files >1000 lines each Decomposed into focused 200-400 line modules
   Test engine Two parallel engines Single GameTestEngine wrapping generic MultiplayerTestEngine
   Triggered abilities Single 2462-line file 4-5 focused files
   Condition evaluator Single 1280-line file 5-6 files by category
   Derived state Single 1300-line file 3-4 files by stat type
   Implementation Priority
1. Phase 1: @tcg/tcg-engine — Extract core framework, parameterize with generics
1. Phase 2: @tcg/<game>-types — Define game type system
1. Phase 3: @tcg/<game>-engine — Implement definition, moves, effect handlers, operations layer
1. Phase 4: @tcg/<game>-engine/testing — Test infrastructure
1. Phase 5: @tcg/<game>-cards — Card definitions + generation pipeline
1. Phase 6: Integration + platform features
   Compatibility Shims
   When migrating the Lorcana implementation itself:

- LorcanaEngineBase becomes a thin facade delegating to the composed modules
- All existing tests continue to pass during migration
- One module at a time: start with StateQuerier extraction, then MoveExecutor, etc.

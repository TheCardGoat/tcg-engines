import type { Operation } from "rfc6902";

import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { SegmentMap } from "./game/structure/segment";
import type {
  BaseCoreCardFilter,
  DefaultPlayerState,
} from "./types/game-specific-types";
export type { SegmentMap };

import type { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { PlayerID } from "~/game-engine/core-engine/types/core-types";
import type { CoreCardInstance } from "./card/core-card-instance";
import type {
  DefaultCardDefinition,
  DefaultGameState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "./types/game-specific-types";
export type StageName = string;

export type FlowPhaseType = string;
export type FlowStepType = string;

// Forward declaration to avoid circular dependency
interface CoreEngineInterface {
  readonly playerID: PlayerID | null;
  processMove(playerID: string, moveType: string, args: unknown[]): unknown;
  getState(): unknown;
  subscribe(callback: (state: unknown) => void): () => void;
}

export interface FlowStep<G> {
  id: FlowStepType;
  name: string;
  description?: string;
  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
}

export interface FlowPhase<G> {
  id: FlowPhaseType;
  name: string;
  description?: string;
  steps?: FlowStep<G>[];
  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
}

export interface FlowTurn<G> {
  phases: FlowPhase<G>[];
  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
}

export interface FlowConfiguration<G> {
  turns: FlowTurn<G>;
}

// Interface for flow objects to avoid circular dependencies
export interface FlowInterface<G = unknown> {
  ctx?: CoreCtx;
  moveMap?: Record<string, Move<G>>;
  moveNames: string[];
  getMove: (ctx: CoreCtx, name: string, playerID: string) => Move<G> | null;
}

export type GameRuntime<G = unknown> = GameDefinition<G> & {
  moveNames: string[];
  flow?: FlowInterface<G>;
};

// Game Definition to configure core-engine
export interface GameDefinition<G = unknown> {
  name?: string;
  numPlayers?: number;
  deltaState?: boolean;
  disableUndo?: boolean;
  seed?: string | number;

  moves?: MoveMap<G>;
  segments?: SegmentMap<G>;

  // Flow configuration for the game
  flow?: FlowConfiguration<G>;

  endIf?: (context: FnContext<G>) => boolean;
  onEnd?: (context: FnContext<G>) => undefined | G;

  initialState?: { g: G; ctx: CoreCtx };

  playerView?: (context: {
    G: G;
    ctx: CoreCtx;
    playerID: PlayerID | null;
  }) => G;
}

export interface MoveMap<G = unknown> {
  [moveName: string]: Move<G>;
}

// "Public" state to be communicated to clients.
export interface CoreEngineState<G = unknown> {
  G: G;
  ctx: CoreCtx;
  deltalog?: Array<LogEntry>;
  _undo: Array<Undo<G>>;
  _redo: Array<Undo<G>>;
  _stateID: number;
}

export type Undo<G = unknown> = {
  G: G;
  ctx: CoreCtx;
  moveType?: string;
  playerID?: PlayerID;
};

export interface LogEntry {
  action: any; // ActionShape types were removed - using any for backward compatibility
  _stateID: number;
  numTurn: number;
  segment: string;
  redact?: boolean;
  automatic?: boolean;
  metadata?: unknown;
  patch?: Operation[];
}

export type FnContext<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> = {
  coreOps: CoreOperation<
    G,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardInstance
  >;
  gameOps: CoreEngineInterface; // Properly typed engine interface
  playerID?: PlayerID | null;
  readonly _getUpdatedState: () => CoreEngineState<G>;

  // Convenient getters (computed properties) - always reflect current state
  readonly G: G;
  readonly ctx: CoreCtx;
};

export interface InternalUpdateGame<G> {
  type: "UPDATE_GAME";
  payload: unknown;
}

export interface SyncInfo {
  state: CoreEngineState;
  filteredMetadata: FilteredMetadata;
  initialState: CoreEngineState;
  log: LogEntry[];
}

export type FilteredMetadata = {
  id: number;
  name?: string;
  isConnected?: boolean;
}[];

export interface ChatMessage {
  id: string;
  sender: PlayerID;
  payload: unknown;
}

export type PartialGameState<G> = Pick<CoreEngineState<G>, "G" | "ctx">;

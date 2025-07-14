import type { Operation } from "rfc6902";
import type {
  ActionPayload,
  ActionShape,
} from "~/game-engine/core-engine/engine/types";
import type { Flow } from "~/game-engine/core-engine/game/flow";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { FlowConfiguration } from "./flow/flow-manager";
import type { SegmentMap } from "./game/structure/segment-types";
import type {
  BaseCoreCardFilter,
  DefaultPlayerState,
} from "./types/game-specific-types";
export type { SegmentMap };

import type { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type {
  InvalidMoveResult,
  Move,
} from "~/game-engine/core-engine/move/move-types";

import type { CoreCardInstance } from "./card/core-card-instance";
import type {
  DefaultCardDefinition,
  DefaultGameState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "./types/game-specific-types";

export type PlayerID = string;
export type StageName = string;

export type GameRuntime<G = unknown> = GameDefinition<G> & {
  moveNames: string[];
  flow?: ReturnType<typeof Flow>;
  processMove: (
    state: CoreEngineState,
    action: ActionPayload.MakeMove,
  ) => CoreEngineState | InvalidMoveResult;
};

// Game Definition to configure core-engine
export interface GameDefinition<G = unknown, SetupData = G> {
  name?: string;
  numPlayers?: number;
  deltaState?: boolean;
  disableUndo?: boolean;
  seed?: string | number;

  moves?: MoveMap<G>;
  segments?: SegmentMap<G>;

  // Flow configuration for the game
  flow?: FlowConfiguration;

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
  action:
    | ActionShape.MakeMove
    | ActionShape.GameEvent
    | ActionShape.Undo
    | ActionShape.Redo;
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
  G: G;
  ctx: CoreCtx;
  gameOps?: any; // TODO: Type this properly
  coreOps: CoreOperation<
    G,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardInstance
  >;
  playerID?: PlayerID | null;
};

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

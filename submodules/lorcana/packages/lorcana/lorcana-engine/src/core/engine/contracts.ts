import type {
  CommandEnvelope,
  FilteredMatchView,
  MatchState,
  MoveInput,
  PacketAnimation,
} from "../runtime/types";
import type { CommandSuccess, DeepReadonly, ZoneConfig } from "../runtime/match-runtime.types";

export type EngineActorContext = {
  role: "player" | "spectator" | "judge";
  playerId?: string;
};

export type EngineMoveValidationResult = {
  valid: boolean;
  reason?: string;
  code?: string;
};

export type EngineMoveExecutionResult = {
  success: boolean;
  reason?: string;
  code?: string;
  result?: CommandSuccess<unknown>;
};

export interface EnginePacketUpdate {
  processedCommand: CommandEnvelope;
  animations: PacketAnimation[];
  canUndo?: boolean;
}

export type EngineViewUpdateSourceAuthority = "client" | "server";

export type EngineViewUpdatePhase = "optimistic" | "confirmed" | "rejected";

export interface EngineViewUpdateMetadata {
  sourceAuthority: EngineViewUpdateSourceAuthority;
  commandID?: string;
  phase: EngineViewUpdatePhase;
}

export interface ProtocolError {
  code: string;
  message: string;
  resyncRequired: boolean;
}

export type EngineMoveHistoryEntry = {
  moveId: string;
  input?: MoveInput;
  playerId?: string;
  role?: "player" | "spectator" | "judge";
  timestamp: number;
  stateID?: number;
  turnNumber?: number;
  transitionType?: "move" | "undo";
  newStateID?: number;
  undoneStateID?: number;
  restoredCheckpointStateID?: number;
  undoneMoveId?: string;
};

export type EngineMoveId<TMoveMap extends Record<string, MoveInput> = Record<string, MoveInput>> =
  keyof TMoveMap & string;

export type EngineCardProjection = {
  instanceId: string;
  zoneId: string;
  definitionId: string;
  ownerId?: string;
  controllerId?: string;
  zoneIndex?: number;
  meta?: Record<string, unknown>;
};

export type EngineZoneProjection = {
  zoneId: string;
  config: ZoneConfig;
  cards: string[];
  count: number;
};

export type EngineBoardProjection = {
  cards: Record<string, EngineCardProjection>;
  zones: Record<string, EngineZoneProjection>;
};

export type EngineActiveEffectProjection = {
  id: string;
  type: string;
  sourceId?: string;
  targetCardId?: string;
  targetPlayerId?: string;
  startsAtTurn?: number;
  expiresAtTurn?: number;
  payload: unknown;
};

export type EnginePendingEffectProjection = {
  id: string;
  type: string;
  source?: "stack" | "priority" | "game";
  sourceId?: string;
  payload: unknown;
};

export type EngineProjectionSnapshot = {
  stateID: number;
  actor: EngineActorContext;
  board: EngineBoardProjection;
  activeEffects: EngineActiveEffectProjection[];
  pendingEffects: EnginePendingEffectProjection[];
};

export interface GameEngine {
  getState(): DeepReadonly<MatchState>;
  getBoard(): DeepReadonly<FilteredMatchView>;
  getStateID(): number;
  validateMove(moveId: string, input: MoveInput): EngineMoveValidationResult;
  executeMove(moveId: string, input: MoveInput): EngineMoveExecutionResult;
  enumerateMoves(): string[];
  getMoveHistory(limit?: number): EngineMoveHistoryEntry[];
  getActorContext(): EngineActorContext;
  canUndo?(playerId: string): boolean;
  undo?(playerId: string, prevStateID?: number): boolean;
  dispose(): void | Promise<void>;
  /** True while a move has been sent to the server but the authoritative confirmation has not yet arrived. */
  readonly isOptimisticMovePending?: boolean;
}

/**
 * Transport-aware engine interface for networked game engines.
 * Extends GameEngine with connection management and state update notifications.
 */
export interface TransportAwareEngine extends GameEngine {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  onStateUpdate(
    handler: (
      state: DeepReadonly<FilteredMatchView>,
      stateID: number,
      packet: EnginePacketUpdate | null,
    ) => void,
  ): () => void;

  onProtocolError?(handler: (error: ProtocolError) => void): () => void;
}

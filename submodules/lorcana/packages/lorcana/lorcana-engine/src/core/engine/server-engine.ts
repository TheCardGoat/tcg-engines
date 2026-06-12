/**
 * Responsibility: authoritative runtime host and state distributor.
 * Owns command validation/execution against `MatchRuntime` and broadcasts
 * authoritative state updates to connected clients.
 *
 * Docs:
 * - ../../docs/ENGINE_SIMPLIFICATION_PLAN.md
 */

import {
  MatchRuntime,
  createCardsMapsFromStaticResources,
  type DeepReadonly,
  type MatchRuntimeConfig,
  type MatchState,
  type FilteredMatchView,
  type CommandEnvelope,
  type CommandResult,
  type MoveInput,
  type MatchStaticResources,
  type RuntimeActorRole,
  type RuntimeSnapshot,
} from "../runtime";
import type { Player } from "../runtime/match-runtime.types";
import type {
  InMemoryTransport,
  ClientMessage,
  UpdateFullMessage,
  SyncFullMessage,
  ErrorMessage,
} from "../runtime/protocol-types";
import {
  PROTOCOL_VERSION,
  isUpdateActionMessage,
  isSyncRequestMessage,
  isUndoRequestMessage,
} from "../runtime/protocol-types";
import type {
  EngineProjectionSnapshot,
  GameEngine,
  EngineActorContext,
  EngineMoveValidationResult,
  EngineMoveExecutionResult,
  EngineMoveHistoryEntry,
} from "./contracts";
import { getLogger } from "@logtape/logtape";

const logger = getLogger(["core-engine", "server-engine"]);

import type { MoveRecord, RuntimeMoveInputMap } from "../runtime/match-runtime.types";

type InferMoveInputMap<TMoves extends MoveRecord> = RuntimeMoveInputMap<TMoves>;

export interface ServerEngineConfig {
  runtimeConfig: MatchRuntimeConfig;
  players: Player[];
  seed?: string;
  /** Server-side game ID (e.g. the API's gameId). Stored in ctx.gameID so the
   *  projected board view carries the correct identifier for replay lookup. */
  gameID?: string;
  /** Server-side match ID. Stored in ctx.matchID. */
  matchID?: string;
  staticResources: MatchStaticResources;
  debugMode?: boolean;
  choosingFirstPlayer?: string;
  /**
   * When true, skip game initialization in MatchRuntime.
   * Used for the deserialization fast path (restoreAuthoritativeSnapshot follows immediately).
   */
  _skipInitialization?: boolean;
}

export interface StateSnapshot {
  stateID: number;
  state: MatchState;
  timestamp: number;
  transitionType?: "move" | "undo";
  undoneStateID?: number;
  restoredCheckpointStateID?: number;
  undoneMoveId?: string;
}

export interface UndoStackEntry {
  stateID: number;
  playerId: string;
  state: MatchState;
  runtimeSnapshot: RuntimeSnapshot;
  undoneStateID: number;
  undoneMoveId?: string;
}

export class ServerEngine implements GameEngine {
  private runtime: MatchRuntime;
  private transports: Map<string, InMemoryTransport> = new Map();
  private stateHistory: StateSnapshot[] = [];
  private moveHistory: EngineMoveHistoryEntry[] = [];
  private stateUpdateHandlers: Array<(stateID: number) => void> = [];
  private debug: boolean = false;
  private staticResources: MatchStaticResources;
  private undoStack: UndoStackEntry[] = [];
  private static readonly UNDO_STACK_MAX_ENTRIES = 25;

  constructor(config: ServerEngineConfig) {
    this.debug = config.debugMode ?? false;
    this.staticResources = config.staticResources;

    if (config._skipInitialization) {
      // Fast path: skip game initialization and static resource round-trip.
      // restoreAuthoritativeSnapshot() will immediately load the real state.
      const emptyCardsMaps = { cardInstances: {}, owners: {} };
      this.runtime = new MatchRuntime(config.runtimeConfig, {
        players: config.players,
        seed: config.seed,
        gameID: config.gameID,
        matchID: config.matchID,
        capturePatches: true,
        cardsMaps: emptyCardsMaps,
        cardCatalog: config.staticResources.cards,
        choosingFirstPlayer: config.choosingFirstPlayer,
        _skipInitialization: true,
        _prebuiltStaticResources: config.staticResources,
      });
      // stateHistory will be populated by restoreAuthoritativeSnapshot()
      return;
    }

    this.runtime = new MatchRuntime(config.runtimeConfig, {
      players: config.players,
      seed: config.seed,
      gameID: config.gameID,
      matchID: config.matchID,
      capturePatches: true,
      //TODO: We could pass both `cardsMaps` and `cardCatalog` from constructuror
      cardsMaps: createCardsMapsFromStaticResources(config.staticResources),
      cardCatalog: config.staticResources.cards,
      choosingFirstPlayer: config.choosingFirstPlayer,
    });

    this.stateHistory.push({
      stateID: 0,
      state: this.runtime.getState(),
      timestamp: Date.now(),
    });
  }

  private resolveAuthoritativeActorPlayerId(): string {
    const state = this.runtime.getState();
    return state.ctx.priority.holder ?? state.ctx.playerIds[0] ?? "";
  }

  acceptConnection(playerId: string, transport: InMemoryTransport): void {
    this.transports.set(playerId, transport);

    transport.onMessage((message) => {
      this.handleClientMessage(playerId, message as ClientMessage);
    });

    this.sendFullSync(playerId);
  }

  private handleClientMessage(playerId: string, message: ClientMessage): void {
    if (isUpdateActionMessage(message)) {
      const currentStateID = this.runtime.getCurrentStateID();
      if (message.prevStateID !== currentStateID) {
        this.sendError(playerId, "STALE_STATE", `Expected state ${currentStateID}`, true);
        return;
      }

      if (this.debug) {
        logger.debug(
          `Received command from player ${playerId}: ${message.command.move} with input:`,
          { input: message.command.input },
        );
      }

      const previousState = this.runtime.getState();
      const previousStateID = this.runtime.getCurrentStateID();
      const runtimeSnapshotBeforeMove = this.runtime.createRuntimeSnapshot();
      const commandTimestamp = Date.now();
      const result = this.runtime.processCommand(
        message.command,
        playerId,
        message.prevStateID,
        commandTimestamp,
        "player",
      );

      if (result.success) {
        const processedResult = this.withPacketAnimations(
          result,
          previousState,
          message.command,
          playerId,
          "player",
        );
        const newStateID = this.runtime.getCurrentStateID();
        const newState = this.runtime.getState();
        this.recordMoveTransition({
          input: message.command.input,
          moveId: message.command.move,
          newState,
          newStateID,
          playerId,
          previousState,
          previousStateID,
          runtimeSnapshotBeforeMove,
          timestamp: commandTimestamp,
          transitionType: "move",
          undoable: result.undoable,
          actorRole: "player",
        });

        this.broadcastStateUpdate(processedResult, newStateID);
      } else {
        this.sendError(playerId, "INVALID_MOVE", result.error || "Command failed", false);
      }
    } else if (isUndoRequestMessage(message)) {
      this.undo(playerId, message.prevStateID, message.commandID);
    } else if (isSyncRequestMessage(message)) {
      this.sendFullSync(playerId);
    }
  }

  private broadcastStateUpdate(
    result: Extract<CommandResult, { success: true }>,
    stateID: number,
  ): void {
    const fullState = this.runtime.getState();
    const command = result.processedCommand;
    const animations = result.animations;

    for (const [playerId, transport] of this.transports) {
      const message: UpdateFullMessage = {
        type: "UPDATE_FULL",
        reason: "PATCH_DISABLED",
        stateID,
        canUndo: this.canUndoForRecipient(playerId),
        protocolVersion: PROTOCOL_VERSION,
        matchID: fullState.ctx.matchID,
        processedCommand: command,
        animations,
        state: fullState,
      };
      if (this.debug) {
        logger.debug(
          `Broadcasting full state update to player ${playerId} (stateID: ${stateID}):`,
          {
            message,
            command,
          },
        );
      }

      transport.simulateReceive(message);
    }

    this.notifyStateUpdate(stateID);
  }

  private sendFullSync(playerId: string): void {
    const transport = this.transports.get(playerId);
    if (!transport) return;
    const fullState = this.runtime.getState();

    const message: SyncFullMessage = {
      type: "SYNC_FULL",
      stateID: fullState.ctx._stateID,
      canUndo: this.canUndoForRecipient(playerId),
      state: fullState,
      protocolVersion: PROTOCOL_VERSION,
      matchID: fullState.ctx.matchID,
      matchData: {
        gameID: fullState.ctx.gameID,
        rulesetHash: fullState.ctx.rulesetHash,
        playerIds: [...fullState.ctx.playerIds],
      },
    };

    transport.simulateReceive(message);
  }

  private canUndoForRecipient(playerId: string): boolean {
    return playerId === "spectator" ? false : this.canUndo(playerId);
  }

  private sendError(
    playerId: string,
    code: ErrorMessage["code"],
    message: string,
    resyncRequired: boolean,
  ): void {
    const transport = this.transports.get(playerId);
    if (!transport) return;
    transport.simulateReceive({
      type: "ERROR",
      code,
      message,
      resyncRequired,
      currentStateID: this.runtime.getCurrentStateID(),
      protocolVersion: PROTOCOL_VERSION,
      matchID: this.runtime.getState().ctx.matchID,
    } as ErrorMessage);
  }

  canUndo(playerId: string): boolean {
    const topEntry = this.undoStack.at(-1);
    return topEntry !== undefined && topEntry.playerId === playerId;
  }

  undo(playerId: string, prevStateID?: number, commandID?: string): boolean {
    if (typeof prevStateID === "number" && prevStateID !== this.runtime.getCurrentStateID()) {
      this.sendError(
        playerId,
        "STALE_STATE",
        `Expected state ${this.runtime.getCurrentStateID()}`,
        true,
      );
      return false;
    }

    if (!this.canUndo(playerId)) {
      this.sendError(playerId, "INVALID_MOVE", "Cannot undo: no undoable history available", false);
      return false;
    }

    const checkpoint = this.undoStack.at(-1)!;
    const previousState = this.runtime.getState();
    const previousStateID = this.runtime.getCurrentStateID();
    const timestamp = Date.now();
    const nextStateID = previousStateID + 1;
    const undoCommand: CommandEnvelope = {
      commandID: commandID ?? `undo-${playerId}-${timestamp}`,
      move: "undo",
    };

    this.runtime.restoreState(checkpoint.state, checkpoint.runtimeSnapshot, {
      preserveHistory: true,
      newStateID: nextStateID,
    });
    const { gameEvents, moveLogs } = this.runtime.appendSyntheticCommand(
      undoCommand,
      playerId,
      timestamp,
    );
    const restoredState = this.runtime.getState();

    this.undoStack = this.undoStack.slice(0, -1);
    this.stateHistory.push({
      stateID: nextStateID,
      state: restoredState,
      timestamp,
      transitionType: "undo",
      undoneStateID: checkpoint.undoneStateID,
      restoredCheckpointStateID: checkpoint.stateID,
      undoneMoveId: checkpoint.undoneMoveId,
    });
    this.moveHistory.push({
      moveId: "undo",
      playerId,
      role: "player",
      timestamp,
      stateID: nextStateID,
      turnNumber: restoredState.ctx.status.turn,
      transitionType: "undo",
      newStateID: nextStateID,
      undoneStateID: checkpoint.undoneStateID,
      restoredCheckpointStateID: checkpoint.stateID,
      undoneMoveId: checkpoint.undoneMoveId,
    });

    const result = this.withPacketAnimations(
      {
        success: true,
        stateID: nextStateID,
        state: restoredState,
        patches: [],
        gameEvents,
        processedCommand: undoCommand,
        animations: [],
        undoable: false,
        moveLogs,
      },
      previousState,
      undoCommand,
      playerId,
      "player",
    );

    this.broadcastStateUpdate(result, nextStateID);

    return true;
  }

  getState(): DeepReadonly<MatchState> {
    return this.runtime.getState() as DeepReadonly<MatchState>;
  }

  getStateID(): number {
    return this.runtime.getCurrentStateID();
  }

  getBoard(): DeepReadonly<FilteredMatchView> {
    return this.runtime.getProjectedBoardView(
      { role: "judge" },
      { serverTimestamp: Date.now() },
    ) as DeepReadonly<FilteredMatchView>;
  }

  validateMove<K extends keyof InferMoveInputMap<MoveRecord> & string>(
    moveId: K,
    input: InferMoveInputMap<MoveRecord>[K],
  ): EngineMoveValidationResult;
  validateMove(moveId: string, input: MoveInput): EngineMoveValidationResult;
  validateMove(moveId: string, input: MoveInput): EngineMoveValidationResult {
    return this.validateMoveForPlayer(
      this.resolveAuthoritativeActorPlayerId(),
      moveId,
      input,
      "judge",
    );
  }

  validateMoveForPlayer<K extends keyof InferMoveInputMap<MoveRecord> & string>(
    playerId: string,
    moveId: K,
    input: InferMoveInputMap<MoveRecord>[K],
    actorRole?: RuntimeActorRole,
  ): EngineMoveValidationResult;
  validateMoveForPlayer(
    playerId: string,
    moveId: string,
    input: MoveInput,
    actorRole?: RuntimeActorRole,
  ): EngineMoveValidationResult;
  validateMoveForPlayer(
    playerId: string,
    moveId: string,
    input: MoveInput,
    actorRole: RuntimeActorRole = "player",
  ): EngineMoveValidationResult {
    const command: CommandEnvelope = {
      commandID: `validate-${Date.now()}`,
      move: moveId as keyof InferMoveInputMap<MoveRecord> & string,
      input,
    };
    return this.runtime.validateCommand(
      command,
      playerId,
      this.runtime.getCurrentStateID(),
      actorRole,
      { logInvalid: false },
    );
  }

  executeMove<K extends keyof InferMoveInputMap<MoveRecord> & string>(
    moveId: K,
    input: InferMoveInputMap<MoveRecord>[K],
  ): EngineMoveExecutionResult;
  executeMove(moveId: string, input: MoveInput): EngineMoveExecutionResult;
  executeMove(moveId: string, input: MoveInput): EngineMoveExecutionResult {
    return this.executeMoveForPlayer(
      this.resolveAuthoritativeActorPlayerId(),
      moveId,
      input,
      "judge",
    );
  }

  executeMoveForPlayer<K extends keyof InferMoveInputMap<MoveRecord> & string>(
    playerId: string,
    moveId: K,
    input: InferMoveInputMap<MoveRecord>[K],
    actorRole?: RuntimeActorRole,
  ): EngineMoveExecutionResult;
  executeMoveForPlayer(
    playerId: string,
    moveId: string,
    input: MoveInput,
    actorRole?: RuntimeActorRole,
  ): EngineMoveExecutionResult;
  executeMoveForPlayer(
    playerId: string,
    moveId: string,
    input: MoveInput,
    actorRole: RuntimeActorRole = "player",
  ): EngineMoveExecutionResult {
    const command: CommandEnvelope = {
      commandID: `server-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      move: moveId as keyof InferMoveInputMap<MoveRecord> & string,
      input,
    };
    const previousState = this.runtime.getState();
    const previousStateID = this.runtime.getCurrentStateID();
    const runtimeSnapshotBeforeMove = this.runtime.createRuntimeSnapshot();
    const commandTimestamp = Date.now();
    const result = this.runtime.processCommand(
      command,
      playerId,
      previousStateID,
      commandTimestamp,
      actorRole,
    );

    if (result.success) {
      const newStateID = this.runtime.getCurrentStateID();
      const newState = this.runtime.getState();
      const processedResult = this.withPacketAnimations(
        result,
        previousState,
        command,
        playerId,
        actorRole,
      );
      this.recordMoveTransition({
        input,
        moveId,
        newState,
        newStateID,
        playerId,
        previousState,
        previousStateID,
        runtimeSnapshotBeforeMove,
        timestamp: commandTimestamp,
        transitionType: "move",
        undoable: result.undoable,
        actorRole,
      });
      this.broadcastStateUpdate(processedResult, newStateID);

      return { success: true, result: processedResult };
    }

    // TODO: Reply to sender with the error.
    return { success: false, reason: result.error, code: result.errorCode };
  }

  enumerateMoves(): Array<keyof InferMoveInputMap<MoveRecord> & string> {
    const playerId = this.resolveAuthoritativeActorPlayerId();
    if (!playerId) {
      return [];
    }

    return this.runtime.enumerateMovesForPlayer(playerId, "judge") as Array<
      keyof InferMoveInputMap<MoveRecord> & string
    >;
  }

  enumerateMovesForPlayer(playerId: string): Array<keyof InferMoveInputMap<MoveRecord> & string> {
    return this.runtime.enumerateMovesForPlayer(playerId, "player") as Array<
      keyof InferMoveInputMap<MoveRecord> & string
    >;
  }

  getMoveHistory(limit?: number): EngineMoveHistoryEntry[] {
    return limit && limit > 0 ? this.moveHistory.slice(-limit) : [...this.moveHistory];
  }

  getActorContext(): EngineActorContext {
    return { role: "judge" };
  }

  onStateUpdate(handler: (stateID: number) => void): () => void {
    this.stateUpdateHandlers.push(handler);
    return () => {
      const index = this.stateUpdateHandlers.indexOf(handler);
      if (index !== -1) {
        this.stateUpdateHandlers.splice(index, 1);
      }
    };
  }

  async dispose(skipLogs?: boolean): Promise<void> {
    for (const transport of this.transports.values()) {
      await transport.disconnect(skipLogs);
    }
    this.transports.clear();
  }

  getRuntime(): MatchRuntime {
    return this.runtime;
  }

  getConnectedPlayerIds(): string[] {
    return Array.from(this.transports.keys());
  }

  getUndoStackSnapshot(): UndoStackEntry[] {
    return [...this.undoStack];
  }

  restoreUndoStackSnapshot(stack: UndoStackEntry[] | null | undefined): void {
    this.undoStack = stack ? [...stack] : [];
  }

  restoreAuthoritativeSnapshot(snapshot: {
    state: MatchState;
    undoStack?: UndoStackEntry[];
  }): void {
    this.runtime.loadState(snapshot.state);
    this.stateHistory = [
      {
        stateID: snapshot.state.ctx._stateID,
        state: this.runtime.getState(),
        timestamp: Date.now(),
      },
    ];
    this.moveHistory = [];
    this.undoStack = snapshot.undoStack ? [...snapshot.undoStack] : [];

    for (const connectedPlayerId of this.transports.keys()) {
      this.sendFullSync(connectedPlayerId);
    }

    this.notifyStateUpdate(this.runtime.getCurrentStateID());
  }

  private withPacketAnimations(
    result: Extract<CommandResult, { success: true }>,
    previousState: MatchState,
    command: CommandEnvelope,
    playerId: string,
    role: "player" | "judge",
  ): Extract<CommandResult, { success: true }> {
    return {
      ...result,
      processedCommand: command,
      animations: this.derivePacketAnimations(
        previousState,
        this.runtime.getState(),
        command,
        playerId,
        role,
      ),
    };
  }

  private derivePacketAnimations(
    previousState: MatchState,
    nextState: MatchState,
    command: CommandEnvelope,
    playerId: string,
    role: "player" | "judge",
  ) {
    const derivePacketAnimations = this.runtime.getRuntimeConfig().derivePacketAnimations;

    if (typeof derivePacketAnimations !== "function") {
      logger.warn("derivePacketAnimations is not a function; not deriving animations.");
      return [];
    }

    return [
      ...derivePacketAnimations({
        command,
        playerId,
        role,
        previousState,
        nextState,
        staticResources: this.staticResources,
      }),
    ];
  }

  private recordMoveTransition(args: {
    moveId: string;
    input?: MoveInput;
    playerId: string;
    previousState: MatchState;
    previousStateID: number;
    newState: MatchState;
    newStateID: number;
    runtimeSnapshotBeforeMove: RuntimeSnapshot;
    timestamp: number;
    transitionType: "move";
    undoable: boolean;
    actorRole: RuntimeActorRole;
  }): void {
    const {
      actorRole,
      input,
      moveId,
      newState,
      newStateID,
      playerId,
      previousState,
      previousStateID,
      runtimeSnapshotBeforeMove,
      timestamp,
      transitionType,
      undoable,
    } = args;

    this.stateHistory.push({
      stateID: newStateID,
      state: newState,
      timestamp,
      transitionType,
    });

    if (actorRole === "player") {
      this.moveHistory.push({
        moveId,
        input,
        playerId,
        role: "player",
        timestamp,
        stateID: newStateID,
        turnNumber: previousState.ctx.status.turn,
        transitionType,
        newStateID,
      });
    }

    this.updateUndoStackAfterMove({
      actorRole,
      moveId,
      newStateID,
      playerId,
      previousState,
      previousStateID,
      runtimeSnapshotBeforeMove,
      undoable,
    });
  }

  private updateUndoStackAfterMove(args: {
    actorRole: RuntimeActorRole;
    moveId: string;
    newStateID: number;
    playerId: string;
    previousState: MatchState;
    previousStateID: number;
    runtimeSnapshotBeforeMove: RuntimeSnapshot;
    undoable: boolean;
  }): void {
    const {
      actorRole,
      moveId,
      newStateID,
      playerId,
      previousState,
      previousStateID,
      runtimeSnapshotBeforeMove,
      undoable,
    } = args;

    if (actorRole !== "player" || !undoable) {
      this.undoStack = [];
      return;
    }

    const nextEntry: UndoStackEntry = {
      stateID: previousStateID,
      playerId,
      state: previousState,
      runtimeSnapshot: runtimeSnapshotBeforeMove,
      undoneStateID: newStateID,
      undoneMoveId: moveId,
    };
    const topEntry = this.undoStack.at(-1);

    this.undoStack =
      topEntry && topEntry.playerId !== playerId ? [nextEntry] : [...this.undoStack, nextEntry];

    if (this.undoStack.length > ServerEngine.UNDO_STACK_MAX_ENTRIES) {
      this.undoStack = this.undoStack.slice(-ServerEngine.UNDO_STACK_MAX_ENTRIES);
    }
  }

  private notifyStateUpdate(stateID: number): void {
    for (const handler of this.stateUpdateHandlers) {
      handler(stateID);
    }
  }
}

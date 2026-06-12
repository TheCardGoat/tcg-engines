import {
  type AcceptedMoveRecord,
  computeAutomatedActionStateFingerprint,
  createPlayerId,
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
  type AutomatedActionExecutionResult,
  type AutomatedActionStrategyOption,
  type AutomatedActionTraceSink,
  type DeepReadonly,
  type EngineMoveHistoryEntry,
  type EngineLogRecord,
  type LorcanaMatchState,
  type LorcanaServer,
  type PlayerId,
} from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { LorcanaMultiplayerSimulatorAdapter } from "../harness/index.js";
import {
  createRepeatedStateDeadlockTracker,
  resolveRepeatedStateDeadlockByConceding,
} from "../automation-deadlock.js";
import { createAutomatedMatchFixture } from "./fixture.js";
import type {
  LorcanaPlayerSide,
  LorcanaSimulatorView,
  MoveLogEntrySnapshot,
  SimulatorSerializedObject,
} from "@/features/simulator/model/contracts.js";
import {
  assertLorcanaSimulatorMoveId,
  isLorcanaSimulatorMoveId,
} from "@/features/simulator/model/contracts.js";
import { formatEventLogBody } from "@/features/simulator/model/event-log-formatting.js";
import type {
  AutomatedMatchConfig,
  AutomatedMatchPlaybackState,
  AutomatedMatchStatusSnapshot,
} from "./types.js";

const DEFAULT_AUTOMATED_MATCH_SPEED_MS = 800;
const PLAYER_ONE_ID = createPlayerId("player_one");
const PLAYER_TWO_ID = createPlayerId("player_two");

export interface AutomatedMatchPlaybackServer {
  concede(playerId: PlayerId): { error?: string; success: boolean };
  enumerateAutomatedActionsForCurrentActor(args?: {
    strategy?: AutomatedActionStrategyOption["strategy"];
  }): { actorId?: PlayerId };
  getActivePlayer(): PlayerId | undefined;
  getCurrentPhase(): string | undefined;
  getCurrentStep(): string | null | undefined;
  getGameSegment(): string | undefined;
  getMoveHistory(limit?: number): EngineMoveHistoryEntry[];
  getMoveLogHistory(): import("@tcg/lorcana-engine").MoveLog[];
  getState(): DeepReadonly<LorcanaMatchState>;
  getStateID(): number;
  getTurnNumber(): number;
  getWinner(): PlayerId | undefined;
  resolveAutomatedActionStrategyForPlayer(
    strategyId: string,
    playerId: PlayerId,
  ): AutomatedActionStrategyOption | undefined;
  takeAutomatedActionForCurrentActor(args: {
    strategy: AutomatedActionStrategyOption["strategy"];
    traceSink?: AutomatedActionTraceSink;
  }): AutomatedActionExecutionResult;
}

export interface AutomatedMatchPlaybackSession<
  TEngine = LorcanaServer,
  TReadModel = AutomatedMatchPlaybackReadModel,
> {
  dispose(): void;
  engine: TEngine;
  readModel: TReadModel;
  server: AutomatedMatchPlaybackServer;
}

export async function createAutomatedMatchPlaybackSession(
  config: AutomatedMatchConfig,
): Promise<AutomatedMatchPlaybackSession> {
  const fixture = await createAutomatedMatchFixture(config);
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
    fixture.playerOne,
    fixture.playerTwo,
    {
      seed: fixture.seed,
      skipPreGame: false,
      validateSync: false,
    },
  );
  const readModel = new AutomatedMatchPlaybackReadModel(testEngine);
  const server = testEngine.asServer();

  return {
    dispose() {
      readModel.dispose();
    },
    engine: server,
    readModel,
    server: server as AutomatedMatchPlaybackServer,
  };
}

interface ProcessedCommandSnapshot {
  input?: {
    args?: Record<string, unknown>;
  };
  move?: MoveLogEntrySnapshot["moveId"] | string;
}

function toPlayerSide(playerId?: PlayerId): LorcanaPlayerSide | undefined {
  if (playerId === "player_one") {
    return "playerOne";
  }

  if (playerId === "player_two") {
    return "playerTwo";
  }

  return undefined;
}

export function createAutomatedMoveLogEntry(
  result: AutomatedActionExecutionResult,
  playbackState: AutomatedMatchPlaybackState,
  turnNumber: number,
  actionCount: number,
): MoveLogEntrySnapshot | null {
  if (!result.finalResult.success) {
    return null;
  }

  const processedCommand = result.finalResult.processedCommand as
    | ProcessedCommandSnapshot
    | undefined;
  const tracedMoveId = playbackState.lastTrace?.selectedCandidate?.family;
  const fallbackMoveId =
    processedCommand?.move && isLorcanaSimulatorMoveId(processedCommand.move)
      ? processedCommand.move
      : undefined;
  const moveId = tracedMoveId ?? fallbackMoveId;
  if (!moveId) {
    return null;
  }

  const timestamp = Date.now();
  const normalizedMoveId = assertLorcanaSimulatorMoveId(moveId);
  const entry: MoveLogEntrySnapshot = {
    actorSide: toPlayerSide(result.actorId),
    id: `automated-${actionCount}-${timestamp}-${moveId}`,
    moveId: normalizedMoveId,
    playerId: result.actorId ?? "unknown",
    timestamp,
    title: "",
    turnNumber,
  };

  const presentation = formatEventLogBody(entry);
  return {
    ...entry,
    title: presentation.text,
  };
}

function normalizePersistedMoveParams(
  input?: AcceptedMoveRecord["input"],
): SimulatorSerializedObject | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return undefined;
  }

  const args = "args" in input ? input.args : undefined;
  if (!args || typeof args !== "object" || Array.isArray(args)) {
    return undefined;
  }

  return args as SimulatorSerializedObject;
}

// Legacy helpers removed — EngineLogRecord now uses .log: MoveLog directly

export function createPersistedMoveLogEntries(args: {
  acceptedMoves: AcceptedMoveRecord[];
  engineLogs: EngineLogRecord[];
  resolveActorSide?: (actorId: string) => LorcanaPlayerSide | undefined;
}): MoveLogEntrySnapshot[] {
  const { acceptedMoves, engineLogs, resolveActorSide } = args;

  return acceptedMoves.flatMap((acceptedMove, index) => {
    if (!isLorcanaSimulatorMoveId(acceptedMove.moveId)) {
      return [];
    }

    // Each EngineLogRecord now contains a single MoveLog.
    // Correlate by stateVersion.
    const matchingLog = engineLogs.find(
      (record) => record.stateVersion === acceptedMove.stateVersion,
    );

    const entry: MoveLogEntrySnapshot = {
      actorSide: resolveActorSide?.(acceptedMove.actorId),
      id: `persisted-${acceptedMove.stateVersion}-${index}-${acceptedMove.moveId}`,
      moveId: acceptedMove.moveId,
      playerId: acceptedMove.actorId,
      params: normalizePersistedMoveParams(acceptedMove.input),
      timestamp: acceptedMove.timestamp,
      title: "",
      turnNumber: acceptedMove.turnNumber,
      typedLogEntry: matchingLog?.log as MoveLogEntrySnapshot["typedLogEntry"],
    };

    const presentation = formatEventLogBody(entry);
    return [
      {
        ...entry,
        title: presentation.text,
      },
    ];
  });
}

export class AutomatedMatchPlaybackReadModel extends LorcanaMultiplayerSimulatorAdapter {
  #listeners = new Set<(stateID: number) => void>();
  #manualRevision = 0;
  #syntheticEntries: MoveLogEntrySnapshot[] = [];

  override getMoveLog(
    limit = 50,
    view: LorcanaSimulatorView = "authoritative",
  ): MoveLogEntrySnapshot[] {
    const entries = [...super.getMoveLog(limit, view), ...this.#syntheticEntries].sort(
      (left, right) => {
        if (left.turnNumber !== right.turnNumber) {
          return left.turnNumber - right.turnNumber;
        }

        if (left.timestamp !== right.timestamp) {
          return left.timestamp - right.timestamp;
        }

        return left.id.localeCompare(right.id);
      },
    );
    return limit > 0 ? entries.slice(-limit) : entries;
  }

  override getStateID(): number {
    return super.getStateID() * 1_000 + this.#manualRevision;
  }

  pushSyntheticMoveEntry(entry: MoveLogEntrySnapshot): void {
    this.#syntheticEntries = [...this.#syntheticEntries, entry];
    this.#notifySyntheticListeners();
  }

  pushSyntheticMoveEntries(entries: MoveLogEntrySnapshot[]): void {
    if (entries.length === 0) {
      return;
    }

    this.#syntheticEntries = [...this.#syntheticEntries, ...entries];
    this.#notifySyntheticListeners();
  }

  override subscribeStateUpdates(handler: (stateID: number) => void): () => void {
    this.#listeners.add(handler);
    const unsubscribe = super.subscribeStateUpdates(handler);

    return () => {
      this.#listeners.delete(handler);
      unsubscribe();
    };
  }

  #notifySyntheticListeners(): void {
    this.#manualRevision = (this.#manualRevision + 1) % 1_000;
    const stateID = this.getStateID();
    for (const listener of this.#listeners) {
      listener(stateID);
    }
  }
}

interface AutomatedMatchPlaybackControllerDependencies<
  TEngine = LorcanaServer,
  TReadModel = AutomatedMatchPlaybackReadModel,
> {
  createSession?: (
    config: AutomatedMatchConfig,
  ) => Promise<AutomatedMatchPlaybackSession<TEngine, TReadModel>>;
}

export class AutomatedMatchPlaybackController<
  TEngine = LorcanaServer,
  TReadModel = AutomatedMatchPlaybackReadModel,
> {
  #actionCount = 0;
  #config: AutomatedMatchConfig;
  #createSession: (
    config: AutomatedMatchConfig,
  ) => Promise<AutomatedMatchPlaybackSession<TEngine, TReadModel>>;
  #listeners = new Set<() => void>();
  #playbackState: AutomatedMatchPlaybackState;
  #playerOneRequestedStrategyId: string;
  #playerOneStrategyOption: AutomatedActionStrategyOption;
  #playerTwoRequestedStrategyId: string;
  #playerTwoStrategyOption: AutomatedActionStrategyOption;
  #repeatTracker = createRepeatedStateDeadlockTracker();
  #session: AutomatedMatchPlaybackSession<TEngine, TReadModel>;
  #sessionRevision = 0;
  #timer: ReturnType<typeof setTimeout> | null = null;
  #timerRevision = 0;

  static async create<TEngine = LorcanaServer, TReadModel = AutomatedMatchPlaybackReadModel>(
    config: AutomatedMatchConfig,
    dependencies: AutomatedMatchPlaybackControllerDependencies<TEngine, TReadModel> = {},
  ): Promise<AutomatedMatchPlaybackController<TEngine, TReadModel>> {
    const playerOneStrategyOption = getSafeAutomatedActionStrategyOption(
      config.playerOneStrategyId,
    );
    const playerTwoStrategyOption = getSafeAutomatedActionStrategyOption(
      config.playerTwoStrategyId,
    );

    const createSession =
      dependencies.createSession ??
      ((nextConfig: AutomatedMatchConfig) =>
        createAutomatedMatchPlaybackSession(nextConfig) as Promise<
          AutomatedMatchPlaybackSession<TEngine, TReadModel>
        >);

    const session = await createSession(config);
    const controller = new AutomatedMatchPlaybackController(config, {
      ...dependencies,
      createSession,
      session,
      playerOneStrategyOption,
      playerTwoStrategyOption,
    });
    return controller;
  }

  private constructor(
    config: AutomatedMatchConfig,
    init: {
      createSession: (
        config: AutomatedMatchConfig,
      ) => Promise<AutomatedMatchPlaybackSession<TEngine, TReadModel>>;
      session: AutomatedMatchPlaybackSession<TEngine, TReadModel>;
      playerOneStrategyOption: AutomatedActionStrategyOption;
      playerTwoStrategyOption: AutomatedActionStrategyOption;
    },
  ) {
    this.#config = config;
    this.#playerOneRequestedStrategyId = config.playerOneStrategyId;
    this.#playerOneStrategyOption = init.playerOneStrategyOption;
    this.#playerTwoRequestedStrategyId = config.playerTwoStrategyId;
    this.#playerTwoStrategyOption = init.playerTwoStrategyOption;
    this.#createSession = init.createSession;
    this.#playbackState = {
      mode: "idle",
      speedMs: DEFAULT_AUTOMATED_MATCH_SPEED_MS,
    };
    this.#session = init.session;
    this.#refreshResolvedStrategyOptions();
    this.#syncTerminalState();
  }

  dispose(): void {
    this.#clearTimer();
    this.#session.dispose();
    this.#listeners.clear();
  }

  getActionCount(): number {
    return this.#actionCount;
  }

  getConfig(): AutomatedMatchConfig {
    return this.#config;
  }

  getEngine(): TEngine {
    return this.#session.engine;
  }

  getPlaybackState(): AutomatedMatchPlaybackState {
    return this.#playbackState;
  }

  getReadModel(): TReadModel {
    return this.#session.readModel;
  }

  getSessionRevision(): number {
    return this.#sessionRevision;
  }

  getStatusSnapshot(): AutomatedMatchStatusSnapshot {
    return {
      actionsExecuted: this.#actionCount,
      gameSegment: this.#session.server.getGameSegment(),
      phase: this.#session.server.getCurrentPhase(),
      priorityPlayer: this.#session.server.getActivePlayer(),
      step: this.#session.server.getCurrentStep(),
      turnNumber: this.#session.server.getTurnNumber(),
      winner: this.#session.server.getWinner(),
    };
  }

  play(): void {
    if (this.#playbackState.mode === "complete" || this.#playbackState.mode === "error") {
      return;
    }

    this.#setPlaybackState({
      ...this.#playbackState,
      mode: "running",
    });
    this.#scheduleNextStep();
  }

  pause(): void {
    if (this.#playbackState.mode !== "running") {
      return;
    }

    this.#clearTimer();
    this.#setPlaybackState({
      ...this.#playbackState,
      mode: "paused",
    });
  }

  async restart(): Promise<void> {
    this.#clearTimer();
    this.#session.dispose();
    this.#session = await this.#createSession(this.#config);
    this.#refreshResolvedStrategyOptions();
    this.#sessionRevision += 1;
    this.#repeatTracker = createRepeatedStateDeadlockTracker();
    this.#actionCount = 0;
    this.#setPlaybackState({
      mode: "idle",
      speedMs: this.#playbackState.speedMs,
    });
    this.#syncTerminalState();
  }

  setSpeed(speedMs: number): void {
    this.#setPlaybackState({
      ...this.#playbackState,
      speedMs,
    });

    if (this.#playbackState.mode === "running") {
      this.#clearTimer();
      this.#scheduleNextStep();
    }
  }

  step(): AutomatedActionExecutionResult | undefined {
    if (this.#playbackState.mode === "running") {
      return undefined;
    }

    return this.#executeStep();
  }

  subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  getResolvedStrategyOption(playerId: PlayerId): AutomatedActionStrategyOption | undefined {
    return this.#resolveStrategyOptionForActor(playerId);
  }

  #resolveStrategyOptionForActor(
    actorId: PlayerId | undefined,
  ): AutomatedActionStrategyOption | undefined {
    if (actorId === "player_one") {
      return this.#playerOneStrategyOption;
    }

    if (actorId === "player_two") {
      return this.#playerTwoStrategyOption;
    }

    return undefined;
  }

  #refreshResolvedStrategyOptions(): void {
    this.#playerOneStrategyOption =
      this.#session.server.resolveAutomatedActionStrategyForPlayer(
        this.#playerOneRequestedStrategyId,
        PLAYER_ONE_ID,
      ) ?? this.#playerOneStrategyOption;
    this.#playerTwoStrategyOption =
      this.#session.server.resolveAutomatedActionStrategyForPlayer(
        this.#playerTwoRequestedStrategyId,
        PLAYER_TWO_ID,
      ) ?? this.#playerTwoStrategyOption;
  }

  #clearTimer(): void {
    this.#timerRevision += 1;

    if (this.#timer === null) {
      return;
    }

    clearTimeout(this.#timer);
    this.#timer = null;
  }

  #executeStep(): AutomatedActionExecutionResult | undefined {
    const winner = this.#session.server.getWinner();
    if (winner) {
      this.#setPlaybackState({
        ...this.#playbackState,
        mode: "complete",
      });
      return undefined;
    }

    let latestTrace = this.#playbackState.lastTrace;
    const traceSink: AutomatedActionTraceSink = {
      push(trace) {
        latestTrace = trace;
      },
    };
    const activePlayer = this.#session.server.getActivePlayer();
    const strategyOption = this.#resolveStrategyOptionForActor(activePlayer);
    if (!strategyOption) {
      this.#setPlaybackState({
        error: "Unable to resolve the acting player's automated strategy.",
        lastResult: undefined,
        lastTrace: latestTrace,
        mode: "error",
        speedMs: this.#playbackState.speedMs,
      });
      return undefined;
    }

    const stateFingerprint = computeAutomatedActionStateFingerprint(
      this.#session.server.getState(),
    );
    const result = this.#session.server.takeAutomatedActionForCurrentActor({
      strategy: strategyOption.strategy,
      traceSink,
    });

    this.#actionCount += 1;

    const observation = this.#repeatTracker.observe({
      actorId: result.actorId,
      stateFingerprint,
    });

    if (!result.finalResult.success) {
      this.#setPlaybackState({
        error: result.finalResult.error ?? "Automated action failed.",
        lastResult: result,
        lastTrace: latestTrace,
        mode: "error",
        speedMs: this.#playbackState.speedMs,
      });
      return result;
    }

    if (result.fallbackTaken === "concede" || this.#session.server.getWinner()) {
      const nextWinner = this.#session.server.getWinner();
      this.#setPlaybackState({
        error: undefined,
        lastResult: result,
        lastTrace: latestTrace,
        mode: nextWinner ? "complete" : this.#playbackState.mode,
        speedMs: this.#playbackState.speedMs,
      });
      this.#syncTerminalState();
      return result;
    }

    const deadlockResolution = resolveRepeatedStateDeadlockByConceding({
      actorId: result.actorId,
      concede: (actorId) => this.#session.server.concede(actorId),
      observation,
    });

    if (deadlockResolution.attempted && !deadlockResolution.conceded) {
      this.#setPlaybackState({
        error:
          deadlockResolution.error ?? "Repeated state detected while both AIs were taking actions.",
        lastResult: result,
        lastTrace: latestTrace,
        mode: "error",
        speedMs: this.#playbackState.speedMs,
      });
      return result;
    }

    const nextWinner = this.#session.server.getWinner();
    this.#setPlaybackState({
      error: undefined,
      lastResult: result,
      lastTrace: latestTrace,
      mode: nextWinner ? "complete" : this.#playbackState.mode,
      speedMs: this.#playbackState.speedMs,
    });
    this.#syncTerminalState();

    return result;
  }

  #notify(): void {
    for (const listener of this.#listeners) {
      listener();
    }
  }

  #scheduleNextStep(): void {
    if (this.#playbackState.mode !== "running") {
      return;
    }

    const timerRevision = this.#timerRevision + 1;
    this.#timerRevision = timerRevision;

    this.#timer = setTimeout(() => {
      if (timerRevision !== this.#timerRevision) {
        return;
      }

      this.#timer = null;
      const result = this.#executeStep();
      if (!result) {
        return;
      }

      if (this.#playbackState.mode === "running") {
        this.#scheduleNextStep();
      }
    }, this.#playbackState.speedMs);
  }

  #setPlaybackState(nextState: AutomatedMatchPlaybackState): void {
    this.#playbackState = nextState;
    this.#notify();
  }

  #syncTerminalState(): void {
    if (this.#playbackState.mode === "complete" || this.#playbackState.mode === "error") {
      this.#clearTimer();
      return;
    }

    if (this.#session.server.getWinner()) {
      this.#clearTimer();
      this.#setPlaybackState({
        ...this.#playbackState,
        mode: "complete",
      });
    }
  }
}

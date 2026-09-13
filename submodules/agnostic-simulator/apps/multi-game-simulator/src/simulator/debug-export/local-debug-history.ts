import {
  REPLAY_FILE_VERSION,
  buildSimulatorDebugExportFromReplay,
  type ReplayPlaybackV1,
  type SimulatorDebugExportEnvironment,
  type SimulatorDebugExportV1,
  type SimulatorDebugExportWarningV1,
  type SimulatorDebugReplayAuditStep,
} from "@tcg/game-page-contract";

import type {
  SimulatorDebugExportRangeRequest,
  SimulatorDebugExportSource,
} from "./SimulatorDebugExportContext";

export interface LocalSimulatorDebugHistoryMetadata {
  slug: SimulatorDebugExportV1["game"]["slug"];
  gameId: string;
  matchId: string;
  seed?: string;
  environment?: SimulatorDebugExportEnvironment;
  releaseSha?: string;
}

export interface LocalSimulatorDebugTransition {
  stateAfter: unknown;
  /** Omit when the local engine has no native version; the recorder assigns one. */
  stateVersion?: number;
  turnNumber: number;
  actorId: string;
  moveId: string;
  commandId?: string;
  input?: unknown;
  processedCommand?: unknown;
  timestamp?: number;
  domainEvents?: readonly unknown[];
}

type RecordedLocalSimulatorDebugTransition = Omit<LocalSimulatorDebugTransition, "stateVersion"> & {
  stateVersion: number;
};

export class LocalSimulatorDebugHistoryRecorder implements SimulatorDebugExportSource {
  readonly #metadata: LocalSimulatorDebugHistoryMetadata;
  readonly #initialState: unknown;
  readonly #transitions: RecordedLocalSimulatorDebugTransition[] = [];
  readonly #warnings: SimulatorDebugExportWarningV1[] = [];

  constructor(metadata: LocalSimulatorDebugHistoryMetadata, initialState: unknown) {
    this.#metadata = metadata;
    const normalized = jsonClone(initialState);
    if (!normalized.ok) {
      this.#warnings.push({
        code: "initial_state_unavailable",
        message: `The local initial state cannot be represented as JSON: ${normalized.message}`,
      });
    }
    this.#initialState = normalized.ok ? normalized.value : null;
  }

  record(transition: LocalSimulatorDebugTransition): void {
    const stateVersion = transition.stateVersion ?? this.#transitions.length + 1;
    const stateAfter = jsonClone(transition.stateAfter);
    if (!stateAfter.ok) {
      this.#warnings.push({
        code: "range_start_state_unavailable",
        message: `State version ${stateVersion} cannot be represented as JSON: ${stateAfter.message}`,
        stateVersion,
      });
    }
    const input = optionalJsonClone(transition.input);
    if (!input.ok) {
      this.#warnings.push({
        code: "moves_unavailable",
        message: `Move input at state version ${stateVersion} cannot be represented as JSON: ${input.message}`,
        stateVersion,
      });
    }
    const processedCommand = optionalJsonClone(transition.processedCommand);
    if (!processedCommand.ok) {
      this.#warnings.push({
        code: "moves_unavailable",
        message: `Processed command at state version ${stateVersion} cannot be represented as JSON: ${processedCommand.message}`,
        stateVersion,
      });
    }
    const domainEvents = (transition.domainEvents ?? []).flatMap((event) => {
      const normalized = jsonClone(event);
      if (normalized.ok) return [normalized.value];
      this.#warnings.push({
        code: "domain_events_unavailable",
        message: `A domain event at state version ${stateVersion} cannot be represented as JSON: ${normalized.message}`,
        stateVersion,
      });
      return [];
    });
    const recorded = {
      stateAfter: stateAfter.ok ? stateAfter.value : null,
      stateVersion,
      turnNumber: transition.turnNumber,
      actorId: transition.actorId,
      moveId: transition.moveId,
      ...(transition.commandId ? { commandId: transition.commandId } : {}),
      ...(input.ok && input.value !== undefined ? { input: input.value } : {}),
      ...(processedCommand.ok && processedCommand.value !== undefined
        ? { processedCommand: processedCommand.value }
        : {}),
      ...(transition.timestamp !== undefined ? { timestamp: transition.timestamp } : {}),
      domainEvents,
    };
    this.#transitions.push(recorded);
  }

  async load(request: SimulatorDebugExportRangeRequest): Promise<SimulatorDebugExportV1 | null> {
    const totalMoves = this.#transitions.length;
    if (totalMoves === 0) return null;
    const startMove = request.startMove ?? 1;
    const endMove = request.endMove ?? totalMoves;
    if (
      !Number.isSafeInteger(startMove) ||
      !Number.isSafeInteger(endMove) ||
      startMove < 1 ||
      endMove < startMove ||
      endMove > totalMoves
    ) {
      throw new Error(`Move range must be between 1 and ${totalMoves}.`);
    }
    const createdAt = new Date(0).toISOString();
    const playback: ReplayPlaybackV1 = {
      schemaVersion: 1,
      trust: "player_authored_unverified",
      publishedAt: new Date().toISOString(),
      replay: {
        version: REPLAY_FILE_VERSION,
        gameType: this.#metadata.slug,
        gameId: this.#metadata.gameId,
        matchId: this.#metadata.matchId,
        seed: this.#metadata.seed ?? "",
        participants: [],
        initialState: this.#initialState,
        checkpoints: [
          { cursor: 0, state: this.#initialState },
          ...this.#transitions.map((transition, index) => ({
            cursor: index + 1,
            state: transition.stateAfter,
          })),
        ],
        steps: this.#transitions.map((transition) => ({
          patches: [],
          acceptedMove: {
            stateVersion: transition.stateVersion,
            turnNumber: transition.turnNumber,
            actorId: transition.actorId,
            moveId: transition.moveId,
            ...(transition.input !== undefined ? { payload: transition.input } : {}),
            timestamp: transition.timestamp ?? 0,
          },
          logs: (transition.domainEvents ?? []).map((event) => ({
            tag: `${this.#metadata.slug}:domain_event`,
            data: event,
            ts: transition.timestamp ?? 0,
          })),
        })),
        metadata: {
          totalMoves,
          totalTurns: this.#transitions.at(-1)?.turnNumber ?? 0,
          createdAt,
        },
      },
    };
    const auditSteps: SimulatorDebugReplayAuditStep[] = this.#transitions.map((transition) => ({
      acceptedMove: {
        stateVersion: transition.stateVersion,
        turnNumber: transition.turnNumber,
        actorId: transition.actorId,
        moveId: transition.moveId,
        ...(transition.commandId ? { commandId: transition.commandId } : {}),
        ...(transition.input !== undefined ? { input: transition.input } : {}),
        ...(transition.processedCommand !== undefined
          ? { processedCommand: transition.processedCommand }
          : {}),
        timestamp: transition.timestamp ?? 0,
      },
      logs: transition.domainEvents ?? [],
    }));
    return buildSimulatorDebugExportFromReplay(
      playback,
      { startMove, endMove },
      {
        environment: this.#metadata.environment ?? "development",
        ...(this.#metadata.releaseSha ? { releaseSha: this.#metadata.releaseSha } : {}),
      },
      auditSteps,
      this.#warnings,
    );
  }
}

type JsonCloneResult =
  | { readonly ok: true; readonly value: unknown }
  | { readonly ok: false; readonly message: string };

function jsonClone(value: unknown): JsonCloneResult {
  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined
      ? { ok: false, message: "value is undefined" }
      : { ok: true, value: JSON.parse(serialized) as unknown };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

function optionalJsonClone(value: unknown): JsonCloneResult {
  return value === undefined ? { ok: true, value: undefined } : jsonClone(value);
}

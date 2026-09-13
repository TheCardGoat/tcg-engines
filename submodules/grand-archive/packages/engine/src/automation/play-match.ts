import type { GrandArchiveCommand } from "../commands/commands.ts";
import type { GrandArchiveCommittedEvent } from "../kernel/events.ts";
import type { GrandArchivePlayerId } from "../game/identity.ts";
import {
  listGrandArchiveLegalCommands,
  type GrandArchiveLegalCommand,
  type ListGrandArchiveLegalCommandsOptions,
} from "../commands/legal-commands.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../snapshot/snapshot.ts";
import { GrandArchiveSnapshotValidationError } from "../snapshot/snapshot-validation.ts";
import { readGrandArchiveWaitState } from "../projection/wait-state.ts";
import { firstLegalGrandArchiveStrategy, type GrandArchiveBotStrategy } from "./bot-strategies.ts";

export type GrandArchiveAutomatedMatchTermination =
  | "finished"
  | "max-actions"
  | "stall"
  | "illegal"
  | "snapshot-refusal"
  | "engine-throw";

export interface GrandArchiveAutomatedMatchFrame {
  readonly index: number;
  readonly actorId: GrandArchivePlayerId;
  readonly stateVersion: number;
  readonly turnNumber: number;
  readonly phase: GrandArchiveMatchState["turn"]["phase"];
  readonly legal: readonly string[];
  readonly chosen: GrandArchiveLegalCommand;
  readonly committedEventTypes: readonly GrandArchiveCommittedEvent["type"][];
}

export interface GrandArchiveAutomatedMatchTranscript {
  readonly termination: GrandArchiveAutomatedMatchTermination;
  readonly actionCount: number;
  readonly turnCount: number;
  readonly winnerIds: readonly GrandArchivePlayerId[];
  readonly finalState: GrandArchiveMatchState;
  readonly frames: readonly GrandArchiveAutomatedMatchFrame[];
  readonly error?: string;
  readonly diagnostic?: GrandArchiveAutomatedMatchDiagnostic;
}

export interface GrandArchiveAutomatedMatchDiagnostic {
  readonly name: string;
  readonly message: string;
  readonly issues?: readonly import("../snapshot/snapshot-validation.ts").GrandArchiveSnapshotValidationIssue[];
  readonly rejectedSnapshot?: unknown;
}

export interface GrandArchiveAutomatedActionSample {
  readonly index: number;
  readonly actorId: GrandArchivePlayerId;
  readonly move: GrandArchiveCommand["move"];
  /** Legal derivation, strategy, execution, and optional snapshot validation. */
  readonly durationMs: number;
}

export interface PlayGrandArchiveAutomatedMatchInput {
  readonly program: GrandArchiveMatchProgram;
  readonly initialState: GrandArchiveMatchState;
  readonly strategies?: Readonly<Partial<Record<GrandArchivePlayerId, GrandArchiveBotStrategy>>>;
  readonly defaultStrategy?: GrandArchiveBotStrategy;
  readonly maximumActions?: number;
  readonly legalCommandOptions?: ListGrandArchiveLegalCommandsOptions;
  /** Validate persistence after every accepted command. Defaults to true. */
  readonly validateSnapshots?: boolean;
  /** Optional local instrumentation; never affects authoritative match state. */
  readonly observeAction?: (sample: GrandArchiveAutomatedActionSample) => void;
}

function commandKey(command: GrandArchiveCommand): string {
  return JSON.stringify(command);
}

function matchIsFinished(state: GrandArchiveMatchState): boolean {
  return readGrandArchiveWaitState(state).kind === "game-over";
}

function nextActor(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  options: ListGrandArchiveLegalCommandsOptions,
): {
  readonly playerId: GrandArchivePlayerId;
  readonly legal: readonly GrandArchiveLegalCommand[];
} | null {
  const wait = readGrandArchiveWaitState(state);
  const requiredPlayer =
    wait.kind === "decision" ||
    wait.kind === "opportunity" ||
    wait.kind === "pregame-action" ||
    wait.kind === "materialization-choice"
      ? wait.playerId
      : undefined;
  const ordered = [requiredPlayer, state.turn.playerId, ...state.turnOrder];
  const seen = new Set<GrandArchivePlayerId>();
  for (const playerId of ordered) {
    if (!playerId || seen.has(playerId) || state.players[playerId]?.lost) continue;
    seen.add(playerId);
    const legal = listGrandArchiveLegalCommands(program, state, playerId, options).filter(
      (candidate) => candidate.command.move !== "concede",
    );
    if (legal.length > 0) return { playerId, legal };
  }
  return null;
}

function assertSnapshotRoundTrip(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): void {
  const serialized = serializeGrandArchiveMatchSnapshot(state);
  const restored = restoreGrandArchiveMatchSnapshot(program, serialized);
  const roundTripped = serializeGrandArchiveMatchSnapshot(restored);
  if (JSON.stringify(roundTripped) !== JSON.stringify(serialized)) {
    throw new Error("Grand Archive snapshot changed during serialization round-trip");
  }
}

function automatedMatchDiagnostic(error: unknown): GrandArchiveAutomatedMatchDiagnostic {
  if (error instanceof GrandArchiveSnapshotValidationError) {
    return {
      name: error.name,
      message: error.message,
      issues: error.issues,
      rejectedSnapshot: error.rejectedSnapshot,
    };
  }
  return {
    name: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message : String(error),
  };
}

/**
 * Runs a bounded, deterministic engine match using only authoritative legal commands.
 * The transcript is suitable for bot benches, fuzzing, and simulator regression evidence.
 */
export function playGrandArchiveAutomatedMatch(
  input: PlayGrandArchiveAutomatedMatchInput,
): GrandArchiveAutomatedMatchTranscript {
  const maximumActions = input.maximumActions ?? 400;
  if (!Number.isSafeInteger(maximumActions) || maximumActions < 1) {
    throw new Error("maximumActions must be a positive safe integer");
  }
  const runtime = new GrandArchiveMatchRuntime(input.program, input.initialState);
  const frames: GrandArchiveAutomatedMatchFrame[] = [];
  let termination: GrandArchiveAutomatedMatchTermination = "max-actions";
  let error: string | undefined;
  let diagnostic: GrandArchiveAutomatedMatchDiagnostic | undefined;

  try {
    for (let index = 0; index < maximumActions; index += 1) {
      const actionStartedAt = input.observeAction ? performance.now() : 0;
      if (matchIsFinished(runtime.state)) {
        termination = "finished";
        break;
      }
      const actor = nextActor(input.program, runtime.state, input.legalCommandOptions ?? {});
      if (!actor) {
        termination = "stall";
        error = "No active Grand Archive player has a legal non-concede command";
        break;
      }
      const strategy =
        input.strategies?.[actor.playerId] ??
        input.defaultStrategy ??
        firstLegalGrandArchiveStrategy;
      const chosen = strategy({
        program: input.program,
        state: runtime.state,
        playerId: actor.playerId,
        legalCommands: actor.legal,
      });
      if (!chosen) {
        termination = "stall";
        error = `Strategy returned no command for ${actor.playerId}`;
        break;
      }
      const legalKeys = new Set(actor.legal.map((candidate) => commandKey(candidate.command)));
      if (!legalKeys.has(commandKey(chosen.command))) {
        termination = "illegal";
        error = `Strategy returned a command outside the authoritative legal list for ${actor.playerId}`;
        break;
      }
      const before = runtime.state;
      const transition = runtime.execute(chosen.command, {
        playerId: chosen.playerId,
        expectedStateVersion: chosen.stateVersion,
      });
      if (!transition.ok) {
        termination = "illegal";
        error = `${transition.code}: ${transition.message}`;
        break;
      }
      frames.push({
        index,
        actorId: actor.playerId,
        stateVersion: before.stateVersion,
        turnNumber: before.turn.number,
        phase: before.turn.phase,
        legal: actor.legal.map((candidate) => candidate.label),
        chosen,
        committedEventTypes: transition.events.map((event) => event.type),
      });
      if (input.validateSnapshots !== false) {
        try {
          assertSnapshotRoundTrip(input.program, runtime.state);
        } catch (caught) {
          termination = "snapshot-refusal";
          error = caught instanceof Error ? caught.message : String(caught);
          diagnostic = automatedMatchDiagnostic(caught);
          break;
        }
      }
      input.observeAction?.({
        index,
        actorId: actor.playerId,
        move: chosen.command.move,
        durationMs: performance.now() - actionStartedAt,
      });
      if (matchIsFinished(runtime.state)) {
        termination = "finished";
        break;
      }
    }
  } catch (caught) {
    termination = "engine-throw";
    error = caught instanceof Error ? caught.message : String(caught);
    diagnostic = automatedMatchDiagnostic(caught);
  }

  return {
    termination,
    actionCount: frames.length,
    turnCount: runtime.state.turn.number,
    winnerIds: runtime.state.winnerIds,
    finalState: runtime.state,
    frames,
    ...(error ? { error } : {}),
    ...(diagnostic ? { diagnostic } : {}),
  };
}

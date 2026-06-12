import type { PlayerId } from "../types/branded.ts";
import type { CommandEnvelope, CommandResult } from "../types/command.ts";
import type { MatchRuntime } from "../runtime/match-runtime.ts";
import type {
  BotDecisionAttempt,
  BotDecisionRecord,
  BotDecisionSink,
  CandidateStrategy,
  CandidateStrategyContext,
  TakeAutomatedActionWithFallbackResult,
} from "./types.ts";
import { candidateToCommand, type GundamBotCandidate } from "./candidate-types.ts";
import {
  enumerateGundamBotCandidates,
  type EnumerateCandidatesOptions,
} from "./candidate-enumerator.ts";

/**
 * Submit a candidate via the runtime. Returns whether the submission
 * succeeded; the caller uses this to advance through the fallback chain.
 *
 * Uses `MatchRuntime` directly instead of the `GameEngine` interface
 * because Gundam has no `GameEngine` adapter and the runtime is the
 * only concrete implementation automation ever runs against.
 */
function submitCandidate(
  runtime: MatchRuntime,
  playerId: PlayerId,
  candidate: GundamBotCandidate,
): CommandResult {
  const { move, args } = candidateToCommand(candidate);
  const stateID = runtime.getState().ctx._stateID;
  const envelope: CommandEnvelope = {
    commandID: `bot-${playerId}-${stateID}-${move}`,
    move,
    prevStateID: stateID,
    actorRole: "player",
    args,
  };
  return runtime.executeCommand(envelope, playerId);
}

export interface TakeAutomatedActionWithFallbackOptions {
  readonly enumerateOptions?: EnumerateCandidatesOptions;
  /** Max candidates to try before falling through to passTurn. Default: 3. */
  readonly maxCandidateAttempts?: number;
  /**
   * Optional telemetry sink — invoked once per planner call with the
   * full {@link BotDecisionRecord}. Use for trace stores, replay
   * persistence, or dev-tools panels. Synchronous; the planner does
   * not await.
   */
  readonly decisionSink?: BotDecisionSink;
}

function recordAttempt(
  attempts: BotDecisionAttempt[],
  candidate: GundamBotCandidate,
  result: CommandResult,
): void {
  if (result.success) {
    attempts.push({ candidate, success: true });
  } else {
    attempts.push({
      candidate,
      success: false,
      errorCode: result.errorCode,
      error: result.error,
    });
  }
}

function emitDecision(
  options: TakeAutomatedActionWithFallbackOptions,
  base: {
    playerId: PlayerId;
    outcome: TakeAutomatedActionWithFallbackResult["outcome"];
    selectedCandidate?: GundamBotCandidate;
    attemptDetails: readonly BotDecisionAttempt[];
    turnNumber: number;
    stateIdBefore: number;
    stateIdAfter: number;
  },
): void {
  if (!options.decisionSink) return;
  const record: BotDecisionRecord = {
    playerId: base.playerId,
    outcome: base.outcome,
    ...(base.selectedCandidate ? { selectedCandidate: base.selectedCandidate } : {}),
    attemptDetails: base.attemptDetails,
    turnNumber: base.turnNumber,
    stateIdBefore: base.stateIdBefore,
    stateIdAfter: base.stateIdAfter,
    timestampMs: Date.now(),
  };
  try {
    options.decisionSink(record);
  } catch {
    // A buggy sink must never abort the planner — telemetry is
    // strictly observability.
  }
}

/**
 * Run the full bot pipeline for a single action:
 *   1. Enumerate legal candidates.
 *   2. Let the strategy order them.
 *   3. Try each (up to `maxCandidateAttempts`).
 *   4. If none succeed, fall back to `passTurn`.
 *   5. If that fails, `concede`.
 *
 * The caller gets one structured result with the outcome and the
 * ordered list of attempts — useful for trace analysis and deadlock
 * detection without the caller having to replicate the loop.
 *
 * Not re-entrant safe: expects the engine to be on a stable state when
 * called and will read `_stateID` at submit time.
 */
export function takeAutomatedActionWithFallback(
  runtime: MatchRuntime,
  playerId: PlayerId,
  strategy: CandidateStrategy,
  staticResources: Parameters<typeof enumerateGundamBotCandidates>[2],
  options: TakeAutomatedActionWithFallbackOptions = {},
): TakeAutomatedActionWithFallbackResult {
  const state = runtime.getState();
  const stateIdBefore = state.ctx._stateID;
  const turnNumber = state.ctx.status.turn;

  if (state.ctx.status.gameEnded) {
    const result: TakeAutomatedActionWithFallbackResult = {
      outcome: "game-ended",
      attemptedCandidates: [],
      attemptDetails: [],
    };
    emitDecision(options, {
      playerId,
      outcome: result.outcome,
      attemptDetails: result.attemptDetails,
      turnNumber,
      stateIdBefore,
      stateIdAfter: stateIdBefore,
    });
    return result;
  }

  const candidates = enumerateGundamBotCandidates(
    state,
    playerId,
    staticResources,
    options.enumerateOptions,
  );

  const view = runtime.getFilteredView({ role: "player", playerId });
  const pendingChoice = runtime.getPendingChoice({ role: "player", playerId }) ?? null;
  const cards = runtime.getCardReadAPI();
  const ctx: CandidateStrategyContext = {
    playerId,
    state,
    view,
    candidates,
    turnNumber,
    pendingChoice,
    cards,
  };

  const ordered = strategy.selectCandidates(ctx);
  const maxAttempts = Math.max(0, options.maxCandidateAttempts ?? 3);
  const toTry = ordered.slice(0, maxAttempts);
  const attempted: GundamBotCandidate[] = [];
  const attemptDetails: BotDecisionAttempt[] = [];

  const finishWith = (
    outcome: TakeAutomatedActionWithFallbackResult["outcome"],
    selectedCandidate: GundamBotCandidate | undefined,
  ): TakeAutomatedActionWithFallbackResult => {
    const result: TakeAutomatedActionWithFallbackResult = selectedCandidate
      ? { outcome, selectedCandidate, attemptedCandidates: attempted, attemptDetails }
      : { outcome, attemptedCandidates: attempted, attemptDetails };
    emitDecision(options, {
      playerId,
      outcome,
      ...(selectedCandidate ? { selectedCandidate } : {}),
      attemptDetails,
      turnNumber,
      stateIdBefore,
      stateIdAfter: runtime.getState().ctx._stateID,
    });
    return result;
  };

  for (const candidate of toTry) {
    attempted.push(candidate);
    const result = submitCandidate(runtime, playerId, candidate);
    recordAttempt(attemptDetails, candidate, result);
    if (result.success) {
      return finishWith("candidate-succeeded", candidate);
    }
  }

  // All strategy candidates failed (or there were none). Try each pass
  // family in order — only one is valid per phase, so the rest no-op fast.
  const PASS_FALLBACKS: readonly GundamBotCandidate[] = [
    { family: "passTurn" },
    { family: "passBattleAction" },
    { family: "passActionStep" },
    { family: "passBlock" },
  ];

  for (const passCandidate of PASS_FALLBACKS) {
    attempted.push(passCandidate);
    const passResult = submitCandidate(runtime, playerId, passCandidate);
    recordAttempt(attemptDetails, passCandidate, passResult);
    if (passResult.success) {
      return finishWith(
        toTry.length > 0 ? "candidate-failed-pass-succeeded" : "no-candidates-pass-succeeded",
        passCandidate,
      );
    }
  }

  // All passes failed — concede.
  const concedeCandidate: GundamBotCandidate = { family: "concede" };
  attempted.push(concedeCandidate);
  const concedeResult = submitCandidate(runtime, playerId, concedeCandidate);
  recordAttempt(attemptDetails, concedeCandidate, concedeResult);
  if (concedeResult.success) {
    return finishWith(
      toTry.length > 0
        ? "candidate-failed-pass-failed-conceded"
        : "no-candidates-pass-failed-conceded",
      concedeCandidate,
    );
  }

  return finishWith(
    toTry.length > 0
      ? "candidate-failed-pass-failed-concede-failed"
      : "no-candidates-pass-failed-concede-failed",
    undefined,
  );
}

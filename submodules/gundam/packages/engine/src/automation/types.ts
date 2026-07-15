import type { PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type { FilteredMatchView } from "../types/projection.ts";
import type { CommandFailure } from "../types/command.ts";
import type { CardReadAPI } from "../types/move-types.ts";
import type { PendingChoicePrompt } from "../gundam/types.ts";

import type { GundamBotCandidate } from "./candidate-types.ts";

/**
 * Planning context consumed by a {@link CandidateStrategy}. The strategy
 * receives the full list of legal candidates (already validated by the
 * enumerator) plus snapshot views of the state and the player's filtered
 * board.
 *
 * `pendingChoice` carries the typed `PendingChoicePrompt` for whichever
 * pending effect is currently waiting on this player (or `null` when the
 * queue is idle / waiting on the opponent). Strategies that delegate to
 * the shared `resolveEffect` policy receive this directly so they can
 * branch on `prompt.kind` exhaustively rather than inspecting the
 * pending-effects array.
 */
export interface CandidateStrategyContext {
  readonly playerId: PlayerId;
  readonly state: MatchState;
  readonly view: FilteredMatchView;
  readonly candidates: readonly GundamBotCandidate[];
  readonly turnNumber: number;
  readonly pendingChoice: PendingChoicePrompt | null;
  /**
   * Read-only card API for derived-state lookups (effective keywords,
   * granted Blocker / HighManeuver, paired-pilot stats, etc.). Strategies
   * that need the engine's authoritative answer — not just the printed
   * definition — should consult `cards` rather than reading
   * `view.zones.*.cards[i].definition` directly, which is the printed
   * surface only.
   */
  readonly cards: CardReadAPI;
}

/**
 * A strategy returns the candidates in the order it wants them tried.
 * The planner attempts them head-first; on failure it advances through
 * the list, then falls back to `passTurn` and finally `concede`.
 *
 * The strategy MUST only return candidates from the input list —
 * producing a candidate not in the input is a bug because the planner
 * does not re-validate strategy-chosen candidates (they're already
 * legal by enumerator contract).
 */
export interface CandidateStrategy {
  readonly name: string;
  readonly selectCandidates: (context: CandidateStrategyContext) => readonly GundamBotCandidate[];
}

/** Why {@link takeAutomatedActionWithFallback} finished the way it did. */
export type AutomatedActionOutcome =
  | "candidate-succeeded"
  | "candidate-failed-pass-succeeded"
  | "candidate-failed-pass-failed-conceded"
  | "candidate-failed-pass-failed-concede-failed"
  | "no-candidates-pass-succeeded"
  | "no-candidates-pass-failed-conceded"
  | "no-candidates-pass-failed-concede-failed"
  | "game-ended";

/**
 * One submission attempt — the candidate the planner tried plus the
 * runtime's structured rejection (if any). The list lets a sink
 * reconstruct *why* the planner had to fall through to a less-preferred
 * candidate without having to re-derive validation results.
 */
export interface BotDecisionAttempt {
  readonly candidate: GundamBotCandidate;
  /** `success` when the runtime accepted this submission. */
  readonly success: boolean;
  /** Engine `errorCode` for failed attempts. Absent on success. */
  readonly errorCode?: CommandFailure["errorCode"];
  /** Engine `error` string for failed attempts. Absent on success. */
  readonly error?: string;
}

export interface TakeAutomatedActionWithFallbackResult {
  readonly outcome: AutomatedActionOutcome;
  readonly selectedCandidate?: GundamBotCandidate;
  /**
   * Backwards-compatible attempted-candidates list. New telemetry
   * consumers should prefer {@link attemptDetails} which carries the
   * per-attempt `errorCode` and `success` flag.
   */
  readonly attemptedCandidates: readonly GundamBotCandidate[];
  /** Per-attempt details — same length and order as {@link attemptedCandidates}. */
  readonly attemptDetails: readonly BotDecisionAttempt[];
}

/**
 * Structured record of a bot decision, suitable for streaming to a
 * trace sink, persisting in a replay, or rendering in a debug UI.
 * Superset of {@link TakeAutomatedActionWithFallbackResult} with the
 * surrounding state/turn/timing context the planner already has on
 * hand. Designed to be JSON-serializable end-to-end.
 */
export interface BotDecisionRecord {
  readonly playerId: PlayerId;
  readonly outcome: AutomatedActionOutcome;
  readonly selectedCandidate?: GundamBotCandidate;
  readonly attemptDetails: readonly BotDecisionAttempt[];
  readonly turnNumber: number;
  readonly stateIdBefore: number;
  readonly stateIdAfter: number;
  /** Wall-clock millis at submission time. Useful for live diagnostics. */
  readonly timestampMs: number;
}

/**
 * Sink callback fired once per planner invocation, regardless of
 * outcome. Side-effecting and synchronous — the planner does not await.
 * Intended for trace stores, dev-tools panels, or training-data
 * collectors. Keep handlers cheap; they run on the main turn loop.
 */
export type BotDecisionSink = (record: BotDecisionRecord) => void;

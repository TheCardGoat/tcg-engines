/**
 * Self-play harness — drives a `MatchRuntime` to completion with one
 * `CandidateStrategy` per seat. Replaces the legacy `runAutomatedGame`
 * helper that was deleted in the candidate-API migration; the new shape
 * speaks the typed candidate / planner pipeline only.
 *
 * Use cases:
 *   - A/B-ing two strategies against each other to compare win-rate.
 *   - Smoke-testing a new strategy plays a full match without crashing.
 *   - Generating training traces / replays for analysis.
 *
 * The harness is deterministic for a fixed seed: candidate enumeration
 * is bounded and ordered, the planner picks head-first, the strategies
 * are pure functions of state. Two `playMatch` calls with the same
 * runtime initialisation produce identical outcomes.
 *
 * Termination:
 *   - `state.ctx.status.gameEnded === true` → returns `termination: "game-won"`
 *     with the engine's `winner` / `winReason`.
 *   - The planner returns `concede-failed` (every fallback exhausted) →
 *     returns `termination: "concede-failed"`. This indicates a runtime
 *     state from which no player can act, which should not happen in
 *     practice.
 *   - `maxActions` exceeded → returns `termination: "max-actions-exceeded"`.
 *     Default cap is 1000 actions, generous enough for any real Gundam
 *     match (typical games end in <100 actions per player).
 *
 * The harness submits exclusively through the planner, which itself
 * routes through `runtime.executeCommand` — same path as a human
 * player. No private dispatch.
 */

import type { PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type { MatchRuntime } from "../runtime/match-runtime.ts";
import type { MatchStaticResources } from "../runtime/static-resources.ts";

import type { GundamBotCandidate } from "./candidate-types.ts";
import type {
  AutomatedActionOutcome,
  CandidateStrategy,
  TakeAutomatedActionWithFallbackResult,
} from "./types.ts";
import {
  takeAutomatedActionWithFallback,
  type TakeAutomatedActionWithFallbackOptions,
} from "./planner.ts";

/** One step of a self-play match — useful for replay and trace UIs. */
export interface PlayMatchAction {
  readonly playerId: PlayerId;
  readonly outcome: AutomatedActionOutcome;
  readonly selectedCandidate?: GundamBotCandidate;
  readonly stateIdBefore: number;
  readonly stateIdAfter: number;
}

export type PlayMatchTermination = "game-won" | "max-actions-exceeded" | "concede-failed";

export interface PlayMatchOutcome {
  readonly termination: PlayMatchTermination;
  /** Winner from `state.ctx.status.winner`, or `null` if the match ended without one. */
  readonly winner: PlayerId | null;
  /** Reason from the engine's `winReason` (e.g. "DECK_OUT", "CONCEDE", "DAMAGE"). */
  readonly winReason: string | null;
  readonly actionCount: number;
  /** Final turn number. */
  readonly turnCount: number;
  /** Final state — caller can re-render or reuse for further analysis. */
  readonly finalState: MatchState;
  /** Action trace (empty when `options.trace` is false). */
  readonly actions: readonly PlayMatchAction[];
}

export interface PlayMatchOptions {
  /** Hard cap on planner invocations. Default 1000. */
  readonly maxActions?: number;
  /** Forwarded to `takeAutomatedActionWithFallback` for every step. */
  readonly plannerOptions?: TakeAutomatedActionWithFallbackOptions;
  /**
   * Fired after every planner call. Use for live progress reporting in
   * long simulations or for streaming the trace to a sink instead of
   * accumulating it in memory. Independent of `trace`.
   */
  readonly onAction?: (
    action: PlayMatchAction,
    plannerResult: TakeAutomatedActionWithFallbackResult,
  ) => void;
  /**
   * When true (default), the outcome's `actions` array contains every
   * step. Disable for long-running simulations where the trace would
   * dwarf the relevant signal — `onAction` still fires either way.
   */
  readonly trace?: boolean;
}

/**
 * Run a complete self-play match against the supplied strategies.
 *
 * The runtime must already be initialized (`runtime.initialize(...)`
 * called and any setup-phase fixtures applied). The harness assumes
 * the runtime is in a state where some player can act.
 *
 * @throws if `strategies` lacks an entry for the active player at any
 *   point. The harness does not silently fall through — a missing
 *   strategy is a programmer error and surfacing it loudly is more
 *   useful than emitting `concede` on the bot's behalf.
 */
export function playMatch(
  runtime: MatchRuntime,
  strategies: ReadonlyMap<PlayerId, CandidateStrategy>,
  staticResources: MatchStaticResources,
  options: PlayMatchOptions = {},
): PlayMatchOutcome {
  const maxActions = options.maxActions ?? 1000;
  const traceOn = options.trace ?? true;
  const trace: PlayMatchAction[] = [];

  let actionCount = 0;
  let termination: PlayMatchTermination = "max-actions-exceeded";

  while (actionCount < maxActions) {
    const stateBefore = runtime.getState();

    if (stateBefore.ctx.status.gameEnded) {
      termination = "game-won";
      break;
    }

    const activePlayer = stateBefore.ctx.status.activePlayer;
    const strategy = strategies.get(activePlayer);
    if (!strategy) {
      throw new Error(
        `No strategy registered for active player "${String(activePlayer)}". ` +
          `Registered: ${[...strategies.keys()].map(String).join(", ")}`,
      );
    }

    const stateIdBefore = stateBefore.ctx._stateID;
    const result = takeAutomatedActionWithFallback(
      runtime,
      activePlayer,
      strategy,
      staticResources,
      options.plannerOptions,
    );
    const stateIdAfter = runtime.getState().ctx._stateID;

    const action: PlayMatchAction = {
      playerId: activePlayer,
      outcome: result.outcome,
      ...(result.selectedCandidate ? { selectedCandidate: result.selectedCandidate } : {}),
      stateIdBefore,
      stateIdAfter,
    };
    if (traceOn) trace.push(action);
    options.onAction?.(action, result);

    actionCount++;

    // The planner returns `game-ended` when it detected `gameEnded`
    // before submitting; the loop's top-of-iteration check will catch
    // it on the next pass.
    if (result.outcome === "game-ended") {
      termination = "game-won";
      break;
    }

    // All fallbacks (candidates, pass, concede) failed — the runtime
    // state isn't progressing through this player. Bail rather than
    // spinning to maxActions.
    if (
      result.outcome === "candidate-failed-pass-failed-concede-failed" ||
      result.outcome === "no-candidates-pass-failed-concede-failed"
    ) {
      termination = "concede-failed";
      break;
    }

    // If the state ID didn't advance (no successful submission and no
    // concede), the runtime is stuck. Treat as concede-failed for
    // observability.
    if (stateIdAfter === stateIdBefore) {
      termination = "concede-failed";
      break;
    }
  }

  const finalState = runtime.getState();
  return {
    termination,
    winner: finalState.ctx.status.winner ?? null,
    winReason: finalState.ctx.status.winReason ?? null,
    actionCount,
    turnCount: finalState.ctx.status.turn,
    finalState,
    actions: trace,
  };
}

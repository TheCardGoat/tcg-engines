import type { PlayerId } from "./branded.ts";
import type { MatchState } from "./match-state.ts";
import type { CardRuntimeAPI, FrameworkWriteAPI, GameEndResult } from "./move-types.ts";

export type LifecycleHook =
  | ((context: LifecycleContext) => unknown)
  | ((state: MatchState) => MatchState | void);

export interface LifecycleContext {
  readonly G: object; // Draft at runtime
  readonly playerId?: PlayerId;
  readonly cards: CardRuntimeAPI;
  readonly framework: FrameworkWriteAPI;
}

/**
 * Outcome of a FlowDefinition.onTransitionCheck call.
 *
 *   "restart":  the hook mutated state; the flow should restart its
 *               transition loop so endIfs re-evaluate against the new
 *               state (but no stale transitions advance first).
 *   "halt":     state is in a pending condition (e.g. a queue entry
 *               needs player input) — the flow must not advance any
 *               phase/step until a move drains the condition.
 *   "continue": the hook has nothing to do; proceed with the usual
 *               segment/phase/step endIf checks.
 */
export type TransitionCheckResult = "restart" | "halt" | "continue";

export interface FlowDefinition {
  gameSegments: Record<string, GameSegmentDefinition>;
  initialGameSegment?: string;
  /**
   * Engine-level interrupt that runs at the top of every flow transition
   * iteration, before segment/phase/step endIf checks.
   *
   * Used by gundam to auto-drain pendingEffects before phase/step advances
   * so rule 10-1-6-7 (new trigger preempts the queue) is honored and
   * unresolved effects do not leak past a phase boundary.
   */
  onTransitionCheck?: (ctx: LifecycleContext) => TransitionCheckResult;
}

export interface GameSegmentDefinition {
  id: string;
  name: string;
  order: number;
  onEnter?: LifecycleHook;
  onExit?: LifecycleHook;
  endIf?: (state: MatchState) => GameEndResult | undefined;
  validMoves?: string[];
  next?: string;
  turn: TurnDefinition;
}

export interface TurnDefinition {
  initialPhase?: string;
  onBegin?: LifecycleHook;
  onEnd?: LifecycleHook;
  endIf?: (state: MatchState) => boolean;
  phases: Record<string, PhaseDefinition>;
  validMoves?: string[];
}

export interface PhaseDefinition {
  id: string;
  name: string;
  order: number;
  onEnter?: LifecycleHook;
  onExit?: LifecycleHook;
  validMoves?: string[];
  endIf?: (state: MatchState) => boolean | string;
  nextPhase?: string | ((state: MatchState) => string);
  steps?: Record<string, StepDefinition>;
  next?: string;
}

export interface StepDefinition {
  id: string;
  name: string;
  order: number;
  onEnter?: LifecycleHook;
  onExit?: LifecycleHook;
  endIf?: (state: MatchState) => boolean;
  validMoves?: string[];
}

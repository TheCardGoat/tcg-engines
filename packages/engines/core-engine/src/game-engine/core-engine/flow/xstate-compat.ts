/**
 * XState Flow Manager Compatibility Layer
 *
 * Provides XState-compatible types and interfaces for the existing FlowManager.
 * This allows games to use XState-style state machine definitions while
 * leveraging the existing FlowManager implementation.
 */

import type { PlayerId } from "../types/branded-types";

/**
 * Flow context containing game state and engine context
 */
export type FlowContext<G = unknown> = {
  /** Game-specific state */
  G: G;

  /** Engine context with flow state */
  ctx: {
    currentSegment: string | null;
    currentPhase: string | null;
    currentStep: string | null;
    playerOrder: PlayerId[];
    turnPlayerPos: number | null;
    [key: string]: unknown;
  };
};

/**
 * Guard condition function for transitions
 */
export type FlowGuard<G = unknown> = (context: FlowContext<G>) => boolean;

/**
 * Lifecycle hook function
 */
export type FlowHook<G = unknown> = (context: FlowContext<G>) => G;

/**
 * Flow transition with optional guard
 */
export type FlowTransition<G = unknown> =
  | string
  | {
      target: string;
      guard?: FlowGuard<G>;
    };

/**
 * Flow state configuration
 */
export type FlowStateConfig<G = unknown> = {
  /** Nested states for hierarchical state machines */
  initial?: string;
  states?: Record<string, FlowStateConfig<G>>;

  /** Event transitions */
  on?: Record<string, FlowTransition<G>>;

  /** Lifecycle hooks */
  onBegin?: FlowHook<G>;
  onEnd?: FlowHook<G>;

  /** End condition (endIf in FlowManager) */
  endIf?: FlowGuard<G>;

  /** State type (normal or final) */
  type?: "normal" | "final";
};

/**
 * XState-compatible flow definition
 */
export type FlowDefinition<G = unknown> = {
  /** Machine identifier */
  id: string;

  /** Initial state */
  initial: string;

  /** State configurations */
  states: Record<string, FlowStateConfig<G>>;

  /** Global context (optional) */
  context?: Partial<G>;
};

/**
 * Standard flow event types
 */
export type FlowEvent =
  | { type: "NEXT_PHASE" }
  | { type: "PASS_PRIORITY" }
  | { type: "EXECUTE_MOVE"; moveName: string; [key: string]: unknown }
  | { type: "END_TURN" }
  | { type: string; [key: string]: unknown };

/**
 * Flow state with current value and context
 */
export type FlowState<G = unknown> = {
  /** Current state value (can be nested) */
  value: string | Record<string, string>;

  /** Current context */
  context: FlowContext<G>;
};

/**
 * Creates a flow machine from an XState-compatible definition.
 *
 * This function converts an XState-style definition into a format compatible
 * with the existing FlowManager. It preserves lifecycle hooks, guard conditions,
 * and hierarchical states.
 *
 * @param definition - XState-compatible flow definition
 * @returns Flow machine (same as input, validated)
 *
 * @example
 * const flowDef: FlowDefinition<GameState> = {
 *   id: "game-flow",
 *   initial: "setup",
 *   states: {
 *     setup: {
 *       on: { START: "mainPhase" },
 *       onBegin: (ctx) => {
 *         ctx.G.turn = 1;
 *         return ctx.G;
 *       }
 *     },
 *     mainPhase: {
 *       on: { END_TURN: "endPhase" }
 *     }
 *   }
 * };
 *
 * const machine = createFlowMachine(flowDef);
 */
export function createFlowMachine<G = unknown>(
  definition: FlowDefinition<G>,
): FlowDefinition<G> {
  // In a full XState integration, this would create an actual XState machine
  // For now, we just validate and return the definition
  // The existing FlowManager can consume this format directly

  if (!definition.id) {
    throw new Error("Flow definition must have an id");
  }

  if (!definition.initial) {
    throw new Error("Flow definition must have an initial state");
  }

  if (!definition.states || Object.keys(definition.states).length === 0) {
    throw new Error("Flow definition must have at least one state");
  }

  // Validate initial state exists
  if (!definition.states[definition.initial]) {
    throw new Error(
      `Initial state "${definition.initial}" not found in states`,
    );
  }

  return definition;
}

/**
 * Extracts flow context from game state.
 *
 * @param state - Game state with G and ctx
 * @returns Flow context
 *
 * @example
 * const flowContext = getFlowContext(gameState);
 * // Use context in guard conditions or hooks
 */
export function getFlowContext<G = unknown, S = { G: G; ctx: unknown }>(
  state: S,
): FlowContext<G> {
  const anyState = state as any;

  return {
    G: anyState.G,
    ctx: {
      currentSegment: anyState.ctx?.currentSegment ?? null,
      currentPhase: anyState.ctx?.currentPhase ?? null,
      currentStep: anyState.ctx?.currentStep ?? null,
      playerOrder: anyState.ctx?.playerOrder ?? [],
      turnPlayerPos: anyState.ctx?.turnPlayerPos ?? null,
      ...anyState.ctx,
    },
  };
}

/**
 * Applies flow context changes back to game state.
 *
 * @param state - Original game state
 * @param context - Updated flow context
 * @returns New game state with applied changes
 *
 * @example
 * const newState = applyFlowContext(state, {
 *   G: updatedG,
 *   ctx: { ...state.ctx, currentPhase: "endPhase" }
 * });
 */
export function applyFlowContext<G = unknown, S = { G: G; ctx: unknown }>(
  state: S,
  context: FlowContext<G>,
): S {
  return {
    ...state,
    G: context.G,
    ctx: context.ctx,
  } as S;
}

/**
 * Type guard to check if transition has a guard condition
 */
export function hasGuard<G = unknown>(
  transition: FlowTransition<G>,
): transition is { target: string; guard: FlowGuard<G> } {
  return (
    typeof transition === "object" &&
    "guard" in transition &&
    !!transition.guard
  );
}

/**
 * Gets the target state from a transition
 */
export function getTransitionTarget<G = unknown>(
  transition: FlowTransition<G>,
): string {
  if (typeof transition === "string") {
    return transition;
  }
  return transition.target;
}

/**
 * Evaluates a guard condition
 */
export function evaluateGuard<G = unknown>(
  transition: FlowTransition<G>,
  context: FlowContext<G>,
): boolean {
  if (!hasGuard(transition)) {
    return true; // No guard means always pass
  }
  return transition.guard(context);
}

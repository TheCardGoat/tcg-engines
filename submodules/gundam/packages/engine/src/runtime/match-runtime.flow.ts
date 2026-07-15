/**
 * Flow resolution — handles phase/turn/step transitions.
 * Processes endIf conditions and lifecycle hooks for game flow.
 *
 * Lifecycle hooks receive a LifecycleContext (with framework) when one is
 * provided by the caller, mirroring the Lorcana pattern where onEnter/onExit
 * hooks are responsible for automatic game actions (drawing cards, placing
 * tokens, etc.) rather than burdening moves with those concerns.
 */

import type { Draft } from "mutative";
import type { MatchState } from "../types/match-state.ts";
import type {
  FlowDefinition,
  GameSegmentDefinition,
  LifecycleContext,
  LifecycleHook,
  PhaseDefinition,
  StepDefinition,
} from "../types/flow-types.ts";

// ── Context builder type ───────────────────────────────────────────────────

/**
 * A factory that produces a LifecycleContext on demand.
 * Passed through the flow so lifecycle hooks can access zone operations,
 * cards API, etc. without the flow module depending on the full runtime.
 */
export type LifecycleContextBuilder = () => LifecycleContext;

// ── Helpers ────────────────────────────────────────────────────────────────

function getSortedPhases(segment: GameSegmentDefinition): PhaseDefinition[] {
  return Object.values(segment.turn.phases).sort((a, b) => a.order - b.order);
}

function getSortedSteps(phase: PhaseDefinition): StepDefinition[] {
  if (!phase.steps) return [];
  return Object.values(phase.steps).sort((a, b) => a.order - b.order);
}

function findNextPhase(
  segment: GameSegmentDefinition,
  currentPhaseId: string,
): PhaseDefinition | undefined {
  const currentPhase = segment.turn.phases[currentPhaseId];
  if (!currentPhase) return undefined;

  if (currentPhase.next) {
    return segment.turn.phases[currentPhase.next];
  }

  const sorted = getSortedPhases(segment);
  const idx = sorted.findIndex((p) => p.id === currentPhaseId);
  if (idx < 0 || idx >= sorted.length - 1) return undefined;
  return sorted[idx + 1];
}

function findNextStep(phase: PhaseDefinition, currentStepId: string): StepDefinition | undefined {
  const sorted = getSortedSteps(phase);
  const idx = sorted.findIndex((s) => s.id === currentStepId);
  if (idx < 0 || idx >= sorted.length - 1) return undefined;
  return sorted[idx + 1];
}

function getCurrentSegment(
  state: Draft<MatchState>,
  flow: FlowDefinition,
): GameSegmentDefinition | undefined {
  const segId = state.ctx.status.gameSegment;
  if (!segId) return undefined;
  return flow.gameSegments[segId];
}

/**
 * Structural assertion: a non-empty pending-effect queue blocks every
 * flow transition. `flow.onTransitionCheck` (the drain hook) already
 * returns `"halt"` in this case, so the existing happy path is correct;
 * this guard is the belt-and-braces backstop for any code path that
 * reaches an endIf evaluation while the queue is non-empty (e.g. a new
 * lifecycle hook that enqueues between drain and endIf, a synthetic
 * `advanceTurn` call from outside `resolveOneTransition`, etc.).
 *
 * The lookup uses a structural cast so the framework layer stays
 * decoupled from any specific game's G shape — same pattern as
 * `candidate-enumerator.ts`.
 */
function flowBlockedByPendingQueue(state: Draft<MatchState>): boolean {
  const g = state.G as { pendingEffects?: readonly unknown[] };
  return (g.pendingEffects?.length ?? 0) > 0;
}

// ── Lifecycle Hook Execution ───────────────────────────────────────────────

/**
 * Execute a lifecycle hook.
 *
 * When a LifecycleContextBuilder is provided the hook is called with the full
 * LifecycleContext (framework, cards, G, …) — the preferred form that allows
 * hooks to perform zone operations, draw cards, place tokens, etc.
 *
 * When no builder is available the hook falls back to the legacy
 * `(state: MatchState) => void` signature.
 */
function executeHook(
  hook: LifecycleHook | undefined,
  state: Draft<MatchState>,
  buildContext?: LifecycleContextBuilder,
): void {
  if (!hook) return;
  if (buildContext) {
    (hook as (context: LifecycleContext) => unknown)(buildContext());
  } else {
    (hook as (state: MatchState) => void)(state as MatchState);
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Resolve flow transitions after a command has been executed.
 * Checks endIf conditions at each level (segment, phase, step) and
 * performs transitions as needed. Loops until no more automatic
 * transitions apply, enabling chains like start-phase → draw-phase →
 * resource-phase → main-phase to resolve in a single pass.
 */
export function resolveFlowTransitions(
  state: Draft<MatchState>,
  flow: FlowDefinition,
  buildContext?: LifecycleContextBuilder,
): void {
  const MAX_ITERATIONS = 50;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    if (!resolveOneTransition(state, flow, buildContext)) {
      return;
    }
  }
  throw new Error(
    `resolveFlowTransitions: exceeded ${MAX_ITERATIONS} iterations — possible infinite flow loop (segment=${state.ctx.status.gameSegment} phase=${state.ctx.status.phase} step=${state.ctx.status.step})`,
  );
}

function resolveOneTransition(
  state: Draft<MatchState>,
  flow: FlowDefinition,
  buildContext?: LifecycleContextBuilder,
): boolean {
  // 0. Engine-level interrupt (e.g. pending effect queue drain). Runs
  // before segment/phase/step endIf so enqueued effects resolve ahead of
  // flow advances and new triggers get priority per rule 10-1-6-7.
  // "halt" blocks further transitions until a move clears the condition;
  // "restart" loops to re-evaluate endIfs with the post-drain state.
  if (flow.onTransitionCheck && buildContext) {
    const result = flow.onTransitionCheck(buildContext());
    if (result === "restart") return true;
    if (result === "halt") return false;
  }

  const segment = getCurrentSegment(state, flow);
  if (!segment) return false;

  // Structural assertion: a non-empty pending-effect queue must block
  // every endIf path. In normal operation `flow.onTransitionCheck`
  // above already short-circuited via `"halt"`; this guard is the
  // belt-and-braces backstop for any future code path that would
  // otherwise advance the flow with effects still queued.
  const queueBlocked = flowBlockedByPendingQueue(state);

  // 1. Check game segment endIf
  if (!queueBlocked && segment.endIf) {
    const result = segment.endIf(state as MatchState);
    if (result) {
      state.ctx.status.gameEnded = true;
      state.ctx.status.winner = result.winner as MatchState["ctx"]["status"]["winner"];
      state.ctx.status.winReason = result.reason;
      executeHook(segment.onExit, state, buildContext);
      return false;
    }
  }

  // 2. Check current step endIf
  const phaseId = state.ctx.status.phase;
  if (!queueBlocked && phaseId) {
    const phase = segment.turn.phases[phaseId];
    if (phase) {
      const stepId = state.ctx.status.step;
      if (stepId && phase.steps) {
        const step = phase.steps[stepId];
        if (step?.endIf) {
          const shouldEnd = step.endIf(state as MatchState);
          if (shouldEnd) {
            executeHook(step.onExit, state, buildContext);
            const nextStep = findNextStep(phase, stepId);
            if (nextStep) {
              state.ctx.status.step = nextStep.id;
              executeHook(nextStep.onEnter, state, buildContext);
              return true;
            } else {
              state.ctx.status.step = undefined;
              return true;
            }
          }
        }
      }

      // 3. Check phase endIf (only when no active step, or step didn't transition)
      if (phase.endIf) {
        const phaseEndResult = phase.endIf(state as MatchState);
        if (phaseEndResult) {
          let nextPhase: PhaseDefinition | undefined;
          if (typeof phaseEndResult === "string") {
            nextPhase = segment.turn.phases[phaseEndResult];
          } else if (phase.nextPhase) {
            const nextId =
              typeof phase.nextPhase === "function"
                ? phase.nextPhase(state as MatchState)
                : phase.nextPhase;
            nextPhase = segment.turn.phases[nextId];
          } else {
            nextPhase = findNextPhase(segment, phaseId);
          }

          if (nextPhase) {
            executeHook(phase.onExit, state, buildContext);
            state.ctx.status.phase = nextPhase.id;
            const steps = getSortedSteps(nextPhase);
            state.ctx.status.step = steps.length > 0 ? steps[0]!.id : undefined;
            executeHook(nextPhase.onEnter, state, buildContext);
            if (steps.length > 0) {
              executeHook(steps[0]!.onEnter, state, buildContext);
            }
            return true;
          } else {
            const shouldCycleTurn = segment.turn.endIf
              ? segment.turn.endIf(state as MatchState)
              : false;
            if (shouldCycleTurn) {
              advanceTurn(state, flow, buildContext);
              return true;
            } else {
              executeHook(phase.onExit, state, buildContext);
              advanceSegment(state, flow, buildContext);
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

/**
 * Transition to the next game segment (e.g. setup → main-game).
 */
function advanceSegment(
  state: Draft<MatchState>,
  flow: FlowDefinition,
  buildContext?: LifecycleContextBuilder,
): void {
  const segment = getCurrentSegment(state as MatchState, flow);
  if (!segment) return;

  executeHook(segment.onExit, state, buildContext);

  // Find the next segment by `next` pointer or lowest order above current
  let nextSegment: GameSegmentDefinition | undefined;
  if (segment.next) {
    nextSegment = flow.gameSegments[segment.next];
  } else {
    const sorted = Object.values(flow.gameSegments).sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === segment.id);
    if (idx >= 0 && idx < sorted.length - 1) {
      nextSegment = sorted[idx + 1];
    }
  }

  if (!nextSegment) return;

  state.ctx.status.gameSegment = nextSegment.id;

  const initialPhaseId = nextSegment.turn.initialPhase;
  const phases = getSortedPhases(nextSegment);
  const firstPhase = initialPhaseId ? nextSegment.turn.phases[initialPhaseId] : phases[0];

  if (firstPhase) {
    state.ctx.status.phase = firstPhase.id;
    const steps = getSortedSteps(firstPhase);
    state.ctx.status.step = steps.length > 0 ? steps[0]!.id : undefined;
  } else {
    state.ctx.status.phase = undefined;
    state.ctx.status.step = undefined;
  }

  executeHook(nextSegment.onEnter, state, buildContext);
  // Segment transition starts a fresh turn in the new segment, so fire
  // its turn.onBegin hook. Without this, activePlayer/turnPlayer reset
  // logic never runs after setup → turnCycle, leaving activePlayer at
  // the last setup actor (e.g. the player who mulliganed last).
  executeHook(nextSegment.turn.onBegin, state, buildContext);
  if (firstPhase) {
    executeHook(firstPhase.onEnter, state, buildContext);
    const steps = getSortedSteps(firstPhase);
    if (steps.length > 0) {
      executeHook(steps[0]!.onEnter, state, buildContext);
    }
  }
}

/**
 * Move to the next phase within the current segment.
 */
export function advancePhase(
  state: Draft<MatchState>,
  flow: FlowDefinition,
  buildContext?: LifecycleContextBuilder,
): void {
  const segment = getCurrentSegment(state as MatchState, flow);
  if (!segment) return;

  const currentPhaseId = state.ctx.status.phase;
  if (!currentPhaseId) return;

  const currentPhase = segment.turn.phases[currentPhaseId];
  if (currentPhase) {
    executeHook(currentPhase.onExit, state, buildContext);
  }

  let nextPhase: PhaseDefinition | undefined;
  if (currentPhase?.nextPhase) {
    const nextId =
      typeof currentPhase.nextPhase === "function"
        ? currentPhase.nextPhase(state as MatchState)
        : currentPhase.nextPhase;
    nextPhase = segment.turn.phases[nextId];
  } else if (currentPhaseId) {
    nextPhase = findNextPhase(segment, currentPhaseId);
  }

  if (nextPhase) {
    state.ctx.status.phase = nextPhase.id;
    const steps = getSortedSteps(nextPhase);
    state.ctx.status.step = steps.length > 0 ? steps[0]!.id : undefined;
    executeHook(nextPhase.onEnter, state, buildContext);
    if (steps.length > 0) {
      executeHook(steps[0]!.onEnter, state, buildContext);
    }
  } else {
    advanceTurn(state, flow, buildContext);
  }
}

/**
 * End the current turn and begin the next one.
 */
export function advanceTurn(
  state: Draft<MatchState>,
  flow: FlowDefinition,
  buildContext?: LifecycleContextBuilder,
): void {
  const segment = getCurrentSegment(state as MatchState, flow);
  if (!segment) return;

  const currentPhaseId = state.ctx.status.phase;
  if (currentPhaseId) {
    const currentPhase = segment.turn.phases[currentPhaseId];
    if (currentPhase) {
      const stepId = state.ctx.status.step;
      if (stepId && currentPhase.steps) {
        const step = currentPhase.steps[stepId];
        if (step) {
          executeHook(step.onExit, state, buildContext);
        }
      }
      executeHook(currentPhase.onExit, state, buildContext);
    }
  }

  executeHook(segment.turn.onEnd, state, buildContext);

  state.ctx.status.turn++;

  const initialPhaseId = segment.turn.initialPhase;
  const phases = getSortedPhases(segment);

  let firstPhase: PhaseDefinition | undefined;
  if (initialPhaseId) {
    firstPhase = segment.turn.phases[initialPhaseId];
  } else if (phases.length > 0) {
    firstPhase = phases[0];
  }

  if (firstPhase) {
    state.ctx.status.phase = firstPhase.id;
    const steps = getSortedSteps(firstPhase);
    state.ctx.status.step = steps.length > 0 ? steps[0]!.id : undefined;
  } else {
    state.ctx.status.phase = undefined;
    state.ctx.status.step = undefined;
  }

  executeHook(segment.turn.onBegin, state, buildContext);

  if (firstPhase) {
    executeHook(firstPhase.onEnter, state, buildContext);
    const steps = getSortedSteps(firstPhase);
    if (steps.length > 0) {
      executeHook(steps[0]!.onEnter, state, buildContext);
    }
  }
}

/**
 * Get the names of moves valid in the current flow position.
 * Returns null if no restrictions are defined (all moves allowed).
 */
export function getValidMovesForPhase(
  flow: FlowDefinition,
  gameSegment?: string,
  phase?: string,
  step?: string,
): string[] | null {
  if (!gameSegment) return null;

  const segment = flow.gameSegments[gameSegment];
  if (!segment) return null;

  const validMoves = new Set<string>();
  let hasRestrictions = false;

  if (segment.validMoves) {
    hasRestrictions = true;
    for (const m of segment.validMoves) validMoves.add(m);
  }

  if (segment.turn.validMoves) {
    hasRestrictions = true;
    for (const m of segment.turn.validMoves) validMoves.add(m);
  }

  if (phase) {
    const phaseDef = segment.turn.phases[phase];
    if (phaseDef?.validMoves) {
      hasRestrictions = true;
      for (const m of phaseDef.validMoves) validMoves.add(m);
    }

    if (step && phaseDef?.steps) {
      const stepDef = phaseDef.steps[step];
      if (stepDef?.validMoves) {
        hasRestrictions = true;
        for (const m of stepDef.validMoves) validMoves.add(m);
      }
    }
  }

  if (!hasRestrictions) return null;
  return [...validMoves];
}

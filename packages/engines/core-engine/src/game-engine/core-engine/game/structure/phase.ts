import { gameEvent } from "~/game-engine/core-engine/engine/action-creators";
import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import {
  getPhase,
  getSegment,
} from "~/game-engine/core-engine/game/structure/utils";
import type {
  CoreEngineState,
  FnContext,
  GameDefinition,
  LogEntry,
  MoveMap,
} from "~/game-engine/core-engine/game-configuration";
import { LogCollector } from "../../../utils/log-collector";
import { startStep } from "./step";

/**
 * PhaseMap defines a mapping of phase names to phase configurations.
 */
export interface PhaseMap<G = unknown> {
  [phaseName: string]: PhaseConfig<G>;
}

/**
 * PhaseConfig defines configuration for a game phase.
 */
export interface PhaseConfig<G = unknown> {
  start?: boolean;
  next?: ((context: FnContext<G>) => string | undefined) | string;

  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined | { next: string };

  moves?: MoveMap<G>;
  steps?: Record<string, StepConfig<G>>;
  allowAnyPlayerToAct?: boolean;
}

/**
 * StepConfig defines configuration for a step within a phase.
 */
export interface StepConfig<G = unknown> {
  start?: boolean;
  next?: ((context: FnContext<G>) => string | undefined) | string;

  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined | { next: string };

  moves?: MoveMap<G>;
}

/**
 * Process all phases in a phase map.
 */
export function processPhases<G = unknown>(phaseMap: PhaseMap<G>) {
  let startingPhase = null;
  const phaseMoveMap = {};
  const phaseMoveNames = new Set<string>();

  for (const phase in phaseMap) {
    const phaseConfig = phaseMap[phase];

    if (phaseConfig.start === true) {
      startingPhase = phase;
    }

    if (phaseConfig.endIf === undefined) {
      phaseConfig.endIf = () => undefined;
    }
    if (phaseConfig.onBegin === undefined) {
      phaseConfig.onBegin = ({ G }) => G;
    }
    if (phaseConfig.onEnd === undefined) {
      phaseConfig.onEnd = ({ G }) => G;
    }

    if (typeof phaseConfig.next !== "function") {
      const { next } = phaseConfig;
      phaseConfig.next = () => next || null;
    }

    if (phaseConfig.moves !== undefined) {
      for (const move of Object.keys(phaseConfig.moves)) {
        phaseMoveMap[`${phase}.${move}`] = phaseConfig.moves[move];
        phaseMoveNames.add(move);
      }
    }

    // Process steps if they exist
    if (phaseConfig.steps !== undefined) {
      for (const step in phaseConfig.steps) {
        const stepConfig = phaseConfig.steps[step];

        if (stepConfig.endIf === undefined) {
          stepConfig.endIf = () => undefined;
        }
        if (stepConfig.onBegin === undefined) {
          stepConfig.onBegin = ({ G }) => G;
        }
        if (stepConfig.onEnd === undefined) {
          stepConfig.onEnd = ({ G }) => G;
        }

        if (typeof stepConfig.next !== "function") {
          const { next } = stepConfig;
          stepConfig.next = () => next || null;
        }

        if (stepConfig.moves !== undefined) {
          for (const move of Object.keys(stepConfig.moves)) {
            phaseMoveMap[`${phase}.${step}.${move}`] = stepConfig.moves[move];
            phaseMoveNames.add(move);
          }
        }
      }
    }
  }

  return { startingPhase, phaseMoveMap, phaseMoveNames };
}

/**
 * Start a phase.
 */
export function startPhase(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  { next = [] } = {},
): CoreEngineState {
  let { G, ctx } = state;
  const segmentConfig = getSegment(ctx, gameDefinition);

  if (!(segmentConfig && ctx.currentPhase)) {
    return state;
  }

  const phaseConfig = getPhase(ctx, gameDefinition);

  if (!phaseConfig) {
    return state;
  }

  const context = {
    G: state.G,
    ctx: state.ctx,
    coreOps: new CoreOperation({
      state,
      engine: undefined,
      logCollector: state.ctx.logCollector,
    }),
    logCollector: state.ctx.logCollector,
  };

  const newG = phaseConfig.onBegin(context);
  G = newG !== undefined ? newG : G;

  // Find starting step if any
  let startingStep = null;
  if (phaseConfig.steps) {
    for (const stepName in phaseConfig.steps) {
      if (phaseConfig.steps[stepName].start) {
        startingStep = stepName;
        break;
      }
    }
  }

  // Update context with starting step
  ctx = { ...ctx, currentStep: startingStep };

  // Schedule start step if there's a starting step
  if (startingStep) {
    next.push({ fn: startStep });
  }

  return { ...state, G, ctx };
}

/**
 * Update the phase.
 */
export function updatePhase(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  {
    arg,
    next = [],
    currentPhase,
  }: { arg?: any; next?: any[]; currentPhase: string } = {} as any,
): CoreEngineState {
  let { ctx } = state;
  const segmentConfig = getSegment(ctx, gameDefinition);

  if (!segmentConfig?.turn.phases) {
    return state;
  }

  const phaseConfig = segmentConfig.turn.phases[currentPhase];

  if (!phaseConfig) {
    return state;
  }

  let nextPhase;

  // Determine next phase
  if (arg && typeof arg === "object" && "next" in arg) {
    nextPhase = arg.next;
  } else {
    const context = {
      G: state.G,
      ctx: state.ctx,
      coreOps: new CoreOperation({ state, engine: undefined }),
      logCollector: state.ctx.logCollector || new LogCollector(),
    };
    // Call the next function
    const nextFn = phaseConfig.next as (context: FnContext) => string;
    nextPhase = nextFn(context);
  }

  // Update context with new phase
  ctx = { ...ctx, currentPhase: nextPhase || null, currentStep: null };
  state = { ...state, ctx };

  // Start the new phase if it exists
  if (nextPhase) {
    next.push({ fn: startPhase });
  }

  return state;
}

/**
 * Check if the phase should end.
 */
export function shouldEndPhase(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
): boolean | undefined | { next: string } {
  const phaseConfig = getPhase(state.ctx, gameDefinition);
  if (phaseConfig) {
    const context = {
      G: state.G,
      ctx: state.ctx,
      coreOps: new CoreOperation({
        state,
        engine: undefined,
        logCollector: state.ctx.logCollector,
      }),
      logCollector: state.ctx.logCollector,
    };
    return phaseConfig.endIf(context);
  }
  return undefined;
}

/**
 * End the current phase.
 */
export function endPhase(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  { arg, next = [], currentPhase, automatic, force = false }: any = {},
): CoreEngineState {
  // If there's no current phase, do nothing
  if (!(state.ctx.currentPhase || force)) {
    return state;
  }

  const { currentSegment, numTurns } = state.ctx;
  const phaseToEnd = currentPhase || state.ctx.currentPhase;

  // Apply phase end hook
  const phaseConfig = getPhase(state.ctx, gameDefinition);
  if (!(phaseConfig || force)) {
    return state;
  }

  // Apply end hook
  let G = state.G;
  if (phaseConfig?.onEnd) {
    const context = {
      G: state.G,
      ctx: state.ctx,
      coreOps: new CoreOperation({
        state,
        engine: undefined,
        logCollector: state.ctx.logCollector,
      }),
      logCollector: state.ctx.logCollector,
    };
    const newG = phaseConfig.onEnd(context);
    G = newG !== undefined ? newG : G;
  }

  // Schedule the phase update if we have a phase to end
  if (phaseToEnd) {
    next.push({
      fn: updatePhase,
      arg,
      currentPhase: phaseToEnd,
    });
  }

  // Create log entry
  const action = gameEvent("endPhase", arg);
  const { _stateID = 0 } = state;
  const logEntry: LogEntry = {
    action,
    _stateID,
    numTurn: numTurns,
    segment: currentSegment,
  };

  if (automatic) {
    logEntry.automatic = true;
  }

  const deltalog = [...(state.deltalog || []), logEntry];

  return { ...state, G, deltalog };
}

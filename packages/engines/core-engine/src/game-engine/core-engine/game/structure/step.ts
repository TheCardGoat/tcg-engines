import { gameEvent } from "~/game-engine/core-engine/engine/action-creators";
import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type {
  CoreEngineState,
  FnContext,
  GameDefinition,
  LogEntry,
} from "~/game-engine/core-engine/game-configuration";
import { LogCollector } from "../../../utils/log-collector";
import { getPhase, getSegment, getStep } from "./utils";

/**
 * Start a step.
 */
export function startStep(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  { next = [] } = {},
): CoreEngineState {
  let { G, ctx } = state;

  const segmentConfig = getSegment(ctx, gameDefinition);
  const phaseConfig = getPhase(ctx, gameDefinition);

  if (!(segmentConfig && phaseConfig && ctx.currentStep)) {
    return state;
  }

  const stepConfig = getStep(ctx, gameDefinition);

  if (!stepConfig) {
    return state;
  }

  // Apply step begin hook
  const context = {
    G: state.G,
    ctx: state.ctx,
    coreOps: new CoreOperation({ state, engine: undefined }),
    logCollector: state.ctx.logCollector || new LogCollector(),
  };
  const newG = stepConfig.onBegin(context);
  G = newG !== undefined ? newG : G;

  return { ...state, G, ctx };
}

/**
 * Update the step.
 */
export function updateStep(
  state: CoreEngineState,
  {
    arg,
    next = [],
    currentStep,
  }: { arg?: any; next?: any[]; currentStep: string },
  gameDefinition: GameDefinition,
): CoreEngineState {
  let { ctx } = state;
  const phaseConfig = getPhase(ctx, gameDefinition);

  if (!phaseConfig?.steps) {
    return state;
  }

  const stepConfig = phaseConfig.steps[currentStep];

  if (!stepConfig) {
    return state;
  }

  let nextStep;

  // Determine next step
  if (arg && typeof arg === "object" && "next" in arg) {
    nextStep = arg.next;
  } else {
    // Call the next function
    const nextFn = stepConfig.next as (context: FnContext) => string;
    const context = {
      G: state.G,
      ctx: state.ctx,
      coreOps: new CoreOperation({ state, engine: undefined }),
      logCollector: state.ctx.logCollector || new LogCollector(),
    };
    nextStep = nextFn(context);
  }

  // Update context with new step
  ctx = { ...ctx, currentStep: nextStep || null };
  state = { ...state, ctx };

  // Start the new step if it exists
  if (nextStep) {
    next.push({ fn: startStep });
  }

  return state;
}

/**
 * Check if the step should end.
 */
export function shouldEndStep(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
): boolean | undefined | { next: string } {
  const stepConfig = getStep(state.ctx, gameDefinition);
  if (stepConfig) {
    const context = {
      G: state.G,
      ctx: state.ctx,
      coreOps: new CoreOperation({ state, engine: undefined }),
      logCollector: state.ctx.logCollector || new LogCollector(),
    };
    return stepConfig.endIf(context);
  }
  return undefined;
}

/**
 * End the current step.
 */
export function endStep(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  { arg, next = [], currentStep, automatic }: any = {},
): CoreEngineState {
  // If there's no current step, do nothing
  if (!state.ctx.currentStep) {
    return state;
  }

  const { currentSegment, currentPhase, numTurns } = state.ctx;
  const stepToEnd = currentStep || state.ctx.currentStep;

  // Get step configuration
  const stepConfig = getStep(state.ctx, gameDefinition);
  if (!stepConfig) {
    return state;
  }

  // Apply step end hook
  let G = state.G;
  const context = {
    G: state.G,
    ctx: state.ctx,
    coreOps: new CoreOperation({ state, engine: undefined }),
    logCollector: state.ctx.logCollector || new LogCollector(),
  };
  const newG = stepConfig.onEnd(context);
  G = newG !== undefined ? newG : G;

  // Schedule the step update
  next.push({
    fn: updateStep,
    arg,
    currentStep: stepToEnd,
  });

  // Create log entry
  const action = gameEvent("endStep", arg);
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

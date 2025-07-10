import { gameEvent } from "~/game-engine/core-engine/engine/action-creators";
import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import {
  endTurn,
  processTurns,
  startTurn,
  type TurnConfig,
} from "~/game-engine/core-engine/game/structure/turn";
import { getSegment } from "~/game-engine/core-engine/game/structure/utils";
import type {
  CoreEngineState,
  FnContext,
  GameDefinition,
  LogEntry,
} from "~/game-engine/core-engine/game-configuration";
import { logger } from "~/game-engine/core-engine/utils/logger";
// Remove problematic import - SegmentConfig is defined in this file
import { endPhase, startPhase } from "./phase";

export interface SegmentMap<G = unknown> {
  [segmentName: string]: SegmentConfig<G>;
}

export interface SegmentConfig<G = unknown> {
  start?: boolean;
  end?: boolean;
  next?: ((context: FnContext<G>) => string | undefined) | string;

  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined | { next: string };

  turn: TurnConfig<G>;
}

export function processSegments<G = unknown>(segmentMap: SegmentMap<G>) {
  let startingSegment = null;
  const segmentMoveMap = {};
  const segmentMoveNames = new Set<string>();

  for (const segment in segmentMap) {
    const segmentConfig = segmentMap[segment];

    if (segmentConfig.start === true) {
      if (startingSegment !== null) {
        logger.warn(
          `Multiple starting segments: ${startingSegment} and ${segment}`,
        );
      }

      startingSegment = segment;
    }

    if (segmentConfig.endIf === undefined) {
      segmentConfig.endIf = () => undefined;
    }
    if (segmentConfig.onBegin === undefined) {
      segmentConfig.onBegin = ({ G }) => G;
    }
    if (segmentConfig.onEnd === undefined) {
      segmentConfig.onEnd = ({ G }) => G;
    }

    if (typeof segmentConfig.next !== "function") {
      const { next } = segmentConfig;
      segmentConfig.next = () => next || null;
    }

    if (segmentConfig.turn !== undefined) {
      const { turnMoveMap, turnMoveNames } = processTurns({
        turn: segmentConfig.turn,
      });

      for (const moveName of Object.keys(turnMoveMap)) {
        segmentMoveMap[`${segment}.${moveName}`] = turnMoveMap[moveName];
      }

      for (const moveName of turnMoveNames) {
        segmentMoveNames.add(moveName);
      }
    }
  }

  return { startingSegment, segmentMoveMap, segmentMoveNames };
}

/**
 * Start a segment
 */
export function startSegment(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  {
    next = [],
    engine,
  }: { next?: any[]; engine?: CoreEngine<any, any, any, any, any> } = {},
): CoreEngineState {
  let { G, ctx } = state;
  const segmentConfig = getSegment(ctx, gameDefinition);

  if (!segmentConfig) {
    throw new Error(`No segment found for ${ctx.currentSegment}`);
  }

  const context = {
    G: state.G,
    ctx: state.ctx,
    coreOps: new CoreOperation({ state, engine }),
  };
  // Apply segment begin hook
  const newG = segmentConfig.onBegin(context);
  G = newG !== undefined ? newG : G;

  // Schedule the start of the turn
  next.push({ fn: startTurn });

  return { ...state, G, ctx };
}

/**
 * Get the next segment
 */
export function getNextSegment(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  engine?: CoreEngine<any, any, any, any, any>,
): string | null {
  const currentSegment = state.ctx.currentSegment;
  if (!currentSegment) return null;

  const segmentConfig = gameDefinition.segments[currentSegment];
  if (!segmentConfig?.next) return null;

  // Handle function-based next segment
  if (typeof segmentConfig.next === "function") {
    const context = {
      G: state.G,
      ctx: state.ctx,
      coreOps: new CoreOperation({ state, engine }),
    };
    const nextSegment = segmentConfig.next(context);
    return nextSegment || null;
  }

  return segmentConfig.next;
}

/**
 * Check if a segment should end based on its endIf condition
 */
export function shouldEndSegment(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  engine?: CoreEngine<any, any, any, any, any>,
): boolean | undefined | { next: string } {
  const segmentConfig = getSegment(state.ctx, gameDefinition);
  if (segmentConfig) {
    const context = {
      G: state.G,
      ctx: state.ctx,
      coreOps: new CoreOperation({ state, engine }),
    };
    return segmentConfig.endIf(context);
  }
  return undefined;
}

/**
 * End a segment
 */
export function endSegment(
  state: CoreEngineState,
  gameDefinition: GameDefinition,
  { arg, next = [], turn: initialTurn, automatic, engine }: any = {},
): CoreEngineState {
  // End the current turn first
  state = endTurn(state, gameDefinition, {
    turn: initialTurn,
    force: true,
    automatic: true,
    next: [],
    engine,
  });

  const { currentSegment, numTurns } = state.ctx;

  // If we aren't in a segment, there is nothing else to do
  if (!currentSegment) {
    return state;
  }

  // Schedule the segment update
  // TODO: Define updateSegment function or remove this if not needed
  // if (next) {
  //   next.push({ fn: updateSegment, arg, segment: currentSegment });
  // }

  // Run any cleanup code for the segment that is about to end
  const segmentConfig = getSegment(state.ctx, gameDefinition);
  if (!segmentConfig) {
    throw new Error(`No segment found for ${currentSegment}`);
  }

  // Apply segment end hook
  const context = {
    G: state.G,
    ctx: state.ctx,
    coreOps: new CoreOperation({ state, engine }),
  };
  const newG = segmentConfig.onEnd(context);
  const G = newG !== undefined ? newG : state.G;

  // Reset the segment
  const ctx = { ...state.ctx, currentSegment: null };

  // Add log entry
  const action = gameEvent("endSegment", arg);
  const { _stateID } = state;
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

  return { ...state, G, ctx, deltalog };
}

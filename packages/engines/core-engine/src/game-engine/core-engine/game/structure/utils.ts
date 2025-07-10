import type { GameDefinition } from "~/game-engine/core-engine/game-configuration";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";

/**
 * Standard turn orders
 */
export const TurnOrder = {
  DEFAULT: {
    first: () => 0,
    next: (ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
  },
  RESET: {
    first: () => 0,
    next: () => 0,
  },
  ONCE: {
    first: () => 0,
    next: (ctx) => {
      if (ctx.playOrderPos < ctx.numPlayers - 1) {
        return ctx.playOrderPos + 1;
      }
      return undefined;
    },
  },
  CUSTOM: (playOrderPos) => ({
    first: () => playOrderPos,
    next: (ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
  }),
  CUSTOM_FROM: (key) => ({
    first: (ctx) => ctx[key] || 0,
    next: (ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
  }),
};

/**
 * Stage constants
 */
export const Stage = {
  NULL: null,
};

/**
 * Get segment configuration by name
 */
export function getSegment(
  ctx: Pick<CoreCtx, "currentSegment">,
  gameDefinition: GameDefinition,
) {
  const segments = gameDefinition.segments || {};
  if (ctx.currentSegment === undefined || ctx.currentSegment === null) {
    return null;
  }
  return segments[ctx.currentSegment];
}

/**
 * Get phase configuration from segment and phase name
 */
export function getPhase(
  ctx: Pick<CoreCtx, "currentSegment" | "currentPhase">,
  gameDefinition: GameDefinition,
) {
  const segmentConfig = getSegment(ctx, gameDefinition);
  if (!segmentConfig) {
    return null;
  }

  if (!ctx.currentPhase) {
    return null;
  }

  const phases = segmentConfig.turn.phases || {};
  return phases[ctx.currentPhase];
}

/**
 * Get step configuration from segment, phase, and step name
 */
export function getStep(
  ctx: Pick<CoreCtx, "currentSegment" | "currentPhase" | "currentStep">,
  gameDefinition: GameDefinition,
) {
  const phaseConfig = getPhase(ctx, gameDefinition);
  if (!phaseConfig) {
    return null;
  }

  if (!ctx.currentStep) {
    return null;
  }

  const steps = phaseConfig.steps || {};
  return steps[ctx.currentStep];
}

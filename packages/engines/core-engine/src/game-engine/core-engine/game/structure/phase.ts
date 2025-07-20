import type {
  FnContext,
  MoveMap,
} from "~/game-engine/core-engine/game-configuration";

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
  end?: boolean;
  next?: ((context: FnContext<G>) => string | undefined) | string;

  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined;

  moves?: MoveMap<G>;
  steps?: Record<string, StepConfig<G>>;
}

/**
 * StepConfig defines configuration for a step within a phase.
 */
export interface StepConfig<G = unknown> {
  start?: boolean;
  end?: boolean;
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

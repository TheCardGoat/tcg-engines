// Lorcana-specific segment config that properly types coreOps

import type { MoveMap } from "~/game-engine/core-engine";
import type { LorcanaGameState } from "~/game-engine/engines/lorcana/src/lorcana-engine-types";
import type { LorcanaFnContext } from "~/game-engine/engines/lorcana/src/moves/types";

export interface LorcanaSegmentConfig {
  start?: boolean;
  end?: boolean;
  next?: ((context: LorcanaFnContext) => string | undefined) | string;

  onBegin?: (context: LorcanaFnContext) => undefined | LorcanaGameState;
  onEnd?: (context: LorcanaFnContext) => undefined | LorcanaGameState;
  endIf?: (context: LorcanaFnContext) => boolean | undefined;

  turn: LorcanaTurnConfig;
}

// Lorcana-specific turn config
interface LorcanaTurnConfig {
  onBegin?: (context: LorcanaFnContext) => undefined | LorcanaGameState;
  onEnd?: (context: LorcanaFnContext) => undefined | LorcanaGameState;
  endIf?: (context: LorcanaFnContext) => boolean | undefined;

  moves?: MoveMap<LorcanaGameState>;
  phases?: Record<string, LorcanaPhaseConfig>;
}

// Lorcana-specific phase config
interface LorcanaPhaseConfig {
  start?: boolean;
  end?: boolean;
  next?: ((context: LorcanaFnContext) => string | undefined) | string;

  onBegin?: (context: LorcanaFnContext) => undefined | LorcanaGameState;
  onEnd?: (context: LorcanaFnContext) => undefined | LorcanaGameState;
  endIf?: (context: LorcanaFnContext) => boolean | undefined;

  moves?: MoveMap<LorcanaGameState>;
  steps?: Record<string, LorcanaStepConfig>;
}

// Lorcana-specific step config
interface LorcanaStepConfig {
  start?: boolean;
  end?: boolean;
  next?: ((context: LorcanaFnContext) => string | undefined) | string;

  onBegin?: (context: LorcanaFnContext) => undefined | LorcanaGameState;
  onEnd?: (context: LorcanaFnContext) => undefined | LorcanaGameState;
  endIf?: (context: LorcanaFnContext) => boolean | undefined | { next: string };

  moves?: MoveMap<LorcanaGameState>;
}

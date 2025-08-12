import type { MoveMap } from "~/game-engine/core-engine";
import type { GundamGameState } from "~/game-engine/engines/gundam/src/gundam-engine-types";
import type { GundamFnContext } from "~/game-engine/engines/gundam/src/moves/types";

export interface GundamSegmentConfig {
  start?: boolean;
  end?: boolean;
  next?: ((context: GundamFnContext) => string | undefined) | string;

  onBegin?: (context: GundamFnContext) => undefined | GundamGameState;
  onEnd?: (context: GundamFnContext) => undefined | GundamGameState;
  endIf?: (context: GundamFnContext) => boolean | undefined;

  turn: GundamTurnConfig;
}

interface GundamTurnConfig {
  onBegin?: (context: GundamFnContext) => undefined | GundamGameState;
  onEnd?: (context: GundamFnContext) => undefined | GundamGameState;
  endIf?: (context: GundamFnContext) => boolean | undefined;

  moves?: MoveMap<GundamGameState>;
  phases?: Record<string, GundamPhaseConfig>;
}

interface GundamPhaseConfig {
  start?: boolean;
  end?: boolean;
  next?: ((context: GundamFnContext) => string | undefined) | string;

  onBegin?: (context: GundamFnContext) => undefined | GundamGameState;
  onEnd?: (context: GundamFnContext) => undefined | GundamGameState;
  endIf?: (context: GundamFnContext) => boolean | undefined;

  moves?: MoveMap<GundamGameState>;
  steps?: Record<string, GundamStepConfig>;
}

interface GundamStepConfig {
  start?: boolean;
  end?: boolean;
  next?: ((context: GundamFnContext) => string | undefined) | string;

  onBegin?: (context: GundamFnContext) => undefined | GundamGameState;
  onEnd?: (context: GundamFnContext) => undefined | GundamGameState;
  endIf?: (context: GundamFnContext) => boolean | undefined | { next: string };

  moves?: MoveMap<GundamGameState>;
}

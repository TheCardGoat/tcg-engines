import type { PlayerId } from "./branded.ts";
import type { MatchState } from "./match-state.ts";
import type { CardRuntimeAPI, FrameworkWriteAPI, GameEndResult } from "./move-types.ts";

export type LifecycleHook =
  | ((context: LifecycleContext) => unknown)
  | ((state: MatchState) => MatchState | void);

export interface LifecycleContext {
  readonly G: object;
  readonly playerId?: PlayerId;
  readonly cards: CardRuntimeAPI;
  readonly framework: FrameworkWriteAPI;
}

export type TransitionCheckResult = "restart" | "halt" | "continue";

export interface FlowDefinition {
  gameSegments: Record<string, GameSegmentDefinition>;
  initialGameSegment?: string;
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

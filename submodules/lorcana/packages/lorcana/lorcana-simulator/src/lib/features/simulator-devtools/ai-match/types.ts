import type {
  AutomatedActionDecisionTrace,
  AutomatedActionExecutionResult,
  PlayerId,
} from "@tcg/lorcana-engine";

export type AutomatedMatchPlayerSide = "playerOne" | "playerTwo";

export interface AutomatedMatchConfig {
  playerOneDeckText: string;
  playerTwoDeckText: string;
  playerOneFixtureId?: string;
  playerTwoFixtureId?: string;
  playerOneStrategyId: string;
  playerTwoStrategyId: string;
  seed: string;
}

export type AutomatedMatchPlaybackMode = "idle" | "running" | "paused" | "complete" | "error";

export interface AutomatedMatchPlaybackState {
  mode: AutomatedMatchPlaybackMode;
  speedMs: number;
  lastTrace?: AutomatedActionDecisionTrace;
  lastResult?: AutomatedActionExecutionResult;
  error?: string;
}

export interface AutomatedMatchValidationErrors {
  playerOneDeckText?: string;
  playerTwoDeckText?: string;
}

export interface AutomatedMatchStatusSnapshot {
  actionsExecuted: number;
  gameSegment?: string;
  phase?: string;
  priorityPlayer?: PlayerId;
  step?: string | null;
  turnNumber: number;
  winner?: PlayerId;
}

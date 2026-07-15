import type { PlayerId } from "@tcg/lorcana-engine";

export type AiPlayMode = "step" | "auto";
export type AiSpeed = "fast" | "balanced" | "slow";

export const AI_SPEED_MS: Record<AiSpeed, number> = {
  fast: 250,
  balanced: 800,
  slow: 1400,
};

export type HumanVsAiMode =
  | "waiting-for-human"
  | "ai-thinking"
  | "ai-paused"
  | "takeover"
  | "complete"
  | "error";

export interface HumanVsAiMatchConfig {
  playerOneDeckText: string;
  playerTwoDeckText: string;
  playerOneFixtureId?: string;
  playerTwoFixtureId?: string;
  strategyId: string;
  seed: string;
  /** Initial AI play mode. Defaults to `"auto"`. */
  initialAiPlayMode?: AiPlayMode;
}

export interface HumanVsAiOrchestratorState {
  mode: HumanVsAiMode;
  aiPlayMode: AiPlayMode;
  aiSpeed: AiSpeed;
  strategyId: string;
  strategyLabel: string;
  currentPerspective: "playerOne" | "playerTwo";
  error?: string;
  turnNumber: number;
  winner?: PlayerId;
}

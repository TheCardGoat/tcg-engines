import type { PlayerId } from "@tcg/lorcana-engine";

import type { HumanVsAiMode, HumanVsAiOrchestratorState } from "./types.js";

interface ResolveHumanVsAiModeInput {
  state: HumanVsAiOrchestratorState;
  winner?: PlayerId;
  turnNumber: number;
  actorId?: PlayerId | string | null;
}

interface ResolveHumanVsAiModeResult {
  nextState: HumanVsAiOrchestratorState;
  shouldScheduleAi: boolean;
  shouldClearTimer: boolean;
}

const TERMINAL_MODES: ReadonlySet<HumanVsAiMode> = new Set(["takeover", "complete", "error"]);

export function isHumanVsAiAiTurn(actorId?: PlayerId | string | null): boolean {
  return actorId === "player_two";
}

export function resolveHumanVsAiMode({
  state,
  winner,
  turnNumber,
  actorId,
}: ResolveHumanVsAiModeInput): ResolveHumanVsAiModeResult {
  if (winner) {
    return {
      nextState: {
        ...state,
        mode: "complete",
        winner,
        turnNumber,
      },
      shouldScheduleAi: false,
      shouldClearTimer: true,
    };
  }

  const syncedState: HumanVsAiOrchestratorState = {
    ...state,
    turnNumber,
  };

  if (TERMINAL_MODES.has(syncedState.mode)) {
    return {
      nextState: syncedState,
      shouldScheduleAi: false,
      shouldClearTimer: false,
    };
  }

  const isAiTurn = isHumanVsAiAiTurn(actorId);

  if (isAiTurn && syncedState.currentPerspective === "playerOne") {
    const mode: HumanVsAiMode = syncedState.aiPlayMode === "auto" ? "ai-thinking" : "ai-paused";

    return {
      nextState: {
        ...syncedState,
        mode,
      },
      shouldScheduleAi: syncedState.aiPlayMode === "auto",
      shouldClearTimer: false,
    };
  }

  return {
    nextState: {
      ...syncedState,
      mode: "waiting-for-human",
    },
    shouldScheduleAi: false,
    shouldClearTimer: true,
  };
}

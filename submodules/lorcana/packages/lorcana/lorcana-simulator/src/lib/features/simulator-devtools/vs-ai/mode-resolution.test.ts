import { describe, expect, it } from "bun:test";

import type { PlayerId } from "@tcg/lorcana-engine";
import { isHumanVsAiAiTurn, resolveHumanVsAiMode } from "./mode-resolution.js";
import type { HumanVsAiOrchestratorState } from "./types.js";

function createState(
  overrides: Partial<HumanVsAiOrchestratorState> = {},
): HumanVsAiOrchestratorState {
  return {
    mode: "waiting-for-human",
    aiPlayMode: "auto",
    aiSpeed: "balanced",
    strategyId: "default",
    strategyLabel: "Default",
    currentPerspective: "playerOne",
    turnNumber: 1,
    ...overrides,
  };
}

describe("human vs ai mode resolution", () => {
  it("treats player_two as the AI actor", () => {
    expect(isHumanVsAiAiTurn("player_two")).toBe(true);
    expect(isHumanVsAiAiTurn("player_one")).toBe(false);
    expect(isHumanVsAiAiTurn(undefined)).toBe(false);
  });

  it("enters ai-thinking when the automation actor is the AI in auto mode", () => {
    const result = resolveHumanVsAiMode({
      state: createState(),
      actorId: "player_two" as PlayerId,
      turnNumber: 3,
    });

    expect(result.nextState.mode).toBe("ai-thinking");
    expect(result.nextState.turnNumber).toBe(3);
    expect(result.shouldScheduleAi).toBe(true);
    expect(result.shouldClearTimer).toBe(false);
  });

  it("enters ai-paused when the automation actor is the AI in step mode", () => {
    const result = resolveHumanVsAiMode({
      state: createState({ aiPlayMode: "step" }),
      actorId: "player_two" as PlayerId,
      turnNumber: 3,
    });

    expect(result.nextState.mode).toBe("ai-paused");
    expect(result.shouldScheduleAi).toBe(false);
    expect(result.shouldClearTimer).toBe(false);
  });

  it("waits for the human when the current perspective is takeover", () => {
    const result = resolveHumanVsAiMode({
      state: createState({
        mode: "takeover",
        currentPerspective: "playerTwo",
      }),
      actorId: "player_two" as PlayerId,
      turnNumber: 4,
    });

    expect(result.nextState.mode).toBe("takeover");
    expect(result.nextState.turnNumber).toBe(4);
    expect(result.shouldScheduleAi).toBe(false);
    expect(result.shouldClearTimer).toBe(false);
  });

  it("returns to waiting-for-human when the automation actor is not the AI", () => {
    const result = resolveHumanVsAiMode({
      state: createState({ mode: "ai-thinking" }),
      actorId: "player_one" as PlayerId,
      turnNumber: 5,
    });

    expect(result.nextState.mode).toBe("waiting-for-human");
    expect(result.nextState.turnNumber).toBe(5);
    expect(result.shouldScheduleAi).toBe(false);
    expect(result.shouldClearTimer).toBe(true);
  });

  it("completes immediately when there is a winner", () => {
    const result = resolveHumanVsAiMode({
      state: createState({ mode: "ai-thinking" }),
      actorId: "player_two" as PlayerId,
      winner: "player_one" as PlayerId,
      turnNumber: 8,
    });

    expect(result.nextState.mode).toBe("complete");
    expect(result.nextState.winner).toBe("player_one" as PlayerId);
    expect(result.nextState.turnNumber).toBe(8);
    expect(result.shouldScheduleAi).toBe(false);
    expect(result.shouldClearTimer).toBe(true);
  });
});

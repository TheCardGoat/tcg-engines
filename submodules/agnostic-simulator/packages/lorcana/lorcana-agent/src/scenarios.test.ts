import { describe, expect, it, beforeEach } from "bun:test";
import {
  __resetAgentRegistryForTests,
  registerProvider,
  takeTurn,
  type AgentChatRequest,
  type AgentChatResponse,
  type AgentProvider,
} from "@tcg/agent-core";
import type { BotActionResult, ServerGameEngine } from "@tcg/shared/game-engine";
import { registerLorcanaAgent } from "./register";

/**
 * End-to-end scripted scenarios: register the real Lorcana agent into the
 * runner, drive it with a mocked OpenAI-compatible provider, and assert the
 * runner reaches the expected outcome. Verifies that the schema + tool
 * wiring is consistent with how the runner invokes them.
 */

function makeMockLorcanaEngine(options: {
  dispatchOk?: boolean;
  heuristicActor?: () => BotActionResult;
}): ServerGameEngine & { dispatchCalls: Array<{ moveType: string; payload: unknown }> } {
  const calls: Array<{ moveType: string; payload: unknown }> = [];
  return {
    dispatchCalls: calls,
    dispatch: (moveType, _actorId, payload) => {
      calls.push({ moveType, payload });
      if (options.dispatchOk === false) {
        return { success: false, error: "engine rejected (mock)" };
      }
      return { success: true, stateID: 1, state: {}, patches: [], animations: [] };
    },
    getStateID: () => 0,
    getState: () => ({}),
    getActivePlayerId: () => "p1",
    hasGameEnded: () => false,
    getGameEndResult: () => undefined,
    takeAutomatedAction:
      options.heuristicActor ??
      ((): BotActionResult => ({
        finalResult: { success: true, stateID: 99, state: {}, patches: [], animations: [] },
        fallbackTaken: "heuristic-default",
      })),
    // Lorcana state-view casts to access `.engine.getBoard()`; provide a minimal one.
    ...({
      engine: {
        getBoard: () => ({
          gameID: "g1",
          matchID: "m1",
          stateID: 0,
          turnNumber: 1,
          phase: "main",
          turnPlayer: "p1",
          priorityPlayer: "p1",
          status: "playing" as const,
          players: {
            p1: {
              lore: 0,
              canAddCardToInkwell: true,
              handCount: 7,
              deckCount: 33,
              hand: ["c1"],
              play: [],
              inkwell: [],
              discard: [],
            },
            p2: {
              lore: 0,
              canAddCardToInkwell: false,
              handCount: 7,
              deckCount: 33,
              hand: ["x1"],
              play: [],
              inkwell: [],
              discard: [],
            },
          },
          cards: {
            c1: { id: "c1", definitionId: "INK_BOLT", cardType: "action" },
            x1: { id: "x1" },
          },
        }),
      },
    } as Record<string, unknown>),
  } as ServerGameEngine & { dispatchCalls: typeof calls };
}

function makeScriptedProvider(
  responses: Array<{ name: string; args: Record<string, unknown> }>,
): AgentProvider & {
  calls: AgentChatRequest[];
} {
  const calls: AgentChatRequest[] = [];
  return {
    id: "zhipu" as const,
    defaultModel: "test-model",
    calls,
    chat: async (request: AgentChatRequest): Promise<AgentChatResponse> => {
      calls.push(request);
      const next = responses.shift();
      if (!next) throw new Error("scripted responses exhausted");
      return {
        message: {
          role: "assistant",
          content: null,
          toolCalls: [
            {
              id: `call-${calls.length}`,
              name: next.name,
              arguments: JSON.stringify(next.args),
            },
          ],
        },
        tokensIn: 1,
        tokensOut: 1,
      };
    },
  };
}

describe("lorcana-agent scenarios (mocked provider)", () => {
  beforeEach(() => {
    __resetAgentRegistryForTests();
    registerLorcanaAgent();
  });

  it("executes a passTurn move chosen by the LLM", async () => {
    const provider = makeScriptedProvider([
      { name: "analyze_lines", args: {} },
      { name: "execute_move", args: { moveId: "passTurn", payload: {} } },
    ]);
    registerProvider(provider);
    const engine = makeMockLorcanaEngine({});

    const outcome = await takeTurn({
      engine,
      actorId: "p1",
      dispatchContext: { gameId: "g1", sourceAuthority: "server" },
      resolved: {
        gameSlug: "lorcana",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(false);
    expect(outcome.telemetry.outcome).toBe("executed");
    expect(outcome.dispatch.selectedCandidate?.family).toBe("passTurn");
    expect(engine.dispatchCalls).toEqual([{ moveType: "passTurn", payload: {} }]);
  });

  it("falls back when the LLM emits an unknown moveId", async () => {
    const provider = makeScriptedProvider([
      { name: "analyze_lines", args: {} },
      { name: "execute_move", args: { moveId: "teleport", payload: {} } },
    ]);
    registerProvider(provider);
    const engine = makeMockLorcanaEngine({});

    const outcome = await takeTurn({
      engine,
      actorId: "p1",
      dispatchContext: { gameId: "g1", sourceAuthority: "server" },
      resolved: {
        gameSlug: "lorcana",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.telemetry.outcome).toBe("fallback_invalid_move");
    expect(engine.dispatchCalls).toEqual([]);
  });

  it("falls back when the engine rejects the chosen move", async () => {
    const provider = makeScriptedProvider([
      { name: "analyze_lines", args: {} },
      {
        name: "execute_move",
        args: { moveId: "quest", payload: { cardId: "c-doesnt-exist" } },
      },
    ]);
    registerProvider(provider);
    const engine = makeMockLorcanaEngine({ dispatchOk: false });

    const outcome = await takeTurn({
      engine,
      actorId: "p1",
      dispatchContext: { gameId: "g1", sourceAuthority: "server" },
      resolved: {
        gameSlug: "lorcana",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.telemetry.outcome).toBe("fallback_invalid_move");
    // Engine.dispatch was called once (the rejected attempt) before falling back.
    expect(engine.dispatchCalls).toHaveLength(1);
  });

  it("invokes the heuristic when the LLM chooses fallback_to_heuristic", async () => {
    const provider = makeScriptedProvider([
      { name: "analyze_lines", args: {} },
      { name: "fallback_to_heuristic", args: { reason: "uncertain mulligan" } },
    ]);
    registerProvider(provider);
    const engine = makeMockLorcanaEngine({});

    const outcome = await takeTurn({
      engine,
      actorId: "p1",
      dispatchContext: { gameId: "g1", sourceAuthority: "server" },
      resolved: {
        gameSlug: "lorcana",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.telemetry.outcome).toBe("fallback_explicit");
    expect(outcome.dispatch.fallbackTaken).toBe("heuristic-default");
  });
});

import { describe, expect, it, beforeEach } from "vite-plus/test";
import type { BotActionResult, DispatchContext, ServerGameEngine } from "@tcg/shared/game-engine";
import {
  __resetAgentRegistryForTests,
  createSubmitInteractionTool,
  registerAgent,
  registerProvider,
  takeTurn,
} from "./index";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import type { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";
import type {
  AgentChatRequest,
  AgentChatResponse,
  AgentProvider,
  GameAgent,
  GameAgentToolContext,
} from "./types";

// ─── Test fixtures ──────────────────────────────────────────────────────────

function makeFakeEngine(): ServerGameEngine & {
  takeAutomatedActionInvocations: number;
} {
  let invocations = 0;
  return {
    takeAutomatedActionInvocations: 0,
    dispatch: () => ({ success: false, error: "noop in test" }),
    getStateID: () => 0,
    getState: () => ({}),
    getActivePlayerId: () => "actor",
    hasGameEnded: () => false,
    getGameEndResult: () => undefined,
    takeAutomatedAction: function (_options, _context): BotActionResult {
      invocations += 1;
      this.takeAutomatedActionInvocations = invocations;
      return {
        finalResult: { success: true, stateID: 1, state: {}, patches: [], animations: [] },
        fallbackTaken: "heuristic-default",
      };
    },
  };
}

function makeContext(): DispatchContext {
  return { gameId: "g1", sourceAuthority: "server" };
}

interface ScriptedResponse {
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  /** If true, throw to simulate provider error. */
  throwError?: Error;
  /** If true, delay so the runner's hard budget aborts the call. */
  abortDelayMs?: number;
}

function makeScriptedProvider(responses: ScriptedResponse[]): AgentProvider & {
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
      if (!next) throw new Error("Scripted provider exhausted");
      if (next.throwError) throw next.throwError;
      if (next.abortDelayMs !== undefined) {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(resolve, next.abortDelayMs);
          request.signal?.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new DOMException("aborted", "AbortError"));
          });
        });
      }
      return {
        message: {
          role: "assistant",
          content: null,
          toolCalls: next.toolName
            ? [
                {
                  id: `call-${calls.length}`,
                  name: next.toolName,
                  arguments: JSON.stringify(next.toolArgs ?? {}),
                },
              ]
            : undefined,
        },
        tokensIn: 10,
        tokensOut: 5,
      };
    },
  };
}

const ANALYZE = "analyze_lines";
const EXECUTE = "execute_move";
const SUBMIT = "submit_interaction";
const FALLBACK = "fallback_to_heuristic";

function makeAgent(slug: string, executeImpl?: () => BotActionResult): GameAgent {
  return {
    slug,
    systemPrompt: "system prompt",
    serializeState: () => ({ phase: "test" }),
    tools: {
      analyzeLines: {
        definition: {
          name: ANALYZE,
          description: "rank candidates",
          parameters: { type: "object", properties: {} },
        },
        run: async () => ({
          ok: true,
          value: {
            lines: [{ id: "m1", summary: "m1", rationale: "r", expectedValue: "high" }],
            confidence: "high",
          },
        }),
      },
      executeMove: {
        definition: {
          name: EXECUTE,
          description: "execute",
          parameters: { type: "object", properties: { moveId: { type: "string" } } },
        },
        run: async (payload, ctx: GameAgentToolContext) => {
          if (executeImpl) {
            return { ok: true as const, value: { ok: true as const, dispatch: executeImpl() } };
          }
          if (!("moveId" in payload) || !payload.moveId) {
            return { ok: false as const, error: "missing moveId", code: "validation" as const };
          }
          // Mock: directly synthesize a success
          void ctx;
          return {
            ok: true as const,
            value: {
              ok: true as const,
              dispatch: {
                finalResult: {
                  success: true as const,
                  stateID: 99,
                  state: {},
                  patches: [],
                  animations: [],
                },
                selectedCandidate: { family: payload.moveId },
              },
            },
          };
        },
      },
      fallbackToHeuristic: {
        definition: {
          name: FALLBACK,
          description: "fallback",
          parameters: { type: "object", properties: {} },
        },
        run: async (payload, ctx) => {
          if (!ctx.engine.takeAutomatedAction) {
            return { ok: false as const, error: "no heuristic", code: "engine" as const };
          }
          return {
            ok: true as const,
            value: {
              ok: true as const,
              dispatch: ctx.engine.takeAutomatedAction(
                { strategyId: payload.strategyId },
                ctx.dispatchContext,
              ),
            },
          };
        },
      },
    },
  };
}

function makeSubmitInteractionAgent(slug: string): GameAgent {
  return {
    slug,
    systemPrompt: "system prompt",
    serializeState: ({ engine, actorId }) => ({
      interactionView: engine.getInteractionView?.(actorId),
    }),
    tools: {
      analyzeLines: {
        definition: {
          name: ANALYZE,
          description: "rank protocol actions",
          parameters: { type: "object", properties: {} },
        },
        run: async (_payload, ctx) => {
          const view = ctx.engine.getInteractionView?.(ctx.actorId);
          return {
            ok: true as const,
            value: {
              lines:
                view?.actions.map((action) => ({
                  id: action.id,
                  summary: action.text.key,
                  rationale: "",
                  expectedValue: "med" as const,
                })) ?? [],
              confidence: "med" as const,
            },
          };
        },
      },
      executeMove: createSubmitInteractionTool({ gameName: "Test" }),
      fallbackToHeuristic: makeAgent(slug).tools.fallbackToHeuristic,
    },
  };
}

function makeInteractionView(
  action: EngineInteractionView["actions"][number],
): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "cyberpunk",
    actorId: "actor",
    stateVersion: 3,
    status: "ready",
    actions: [action],
  };
}

function makeInteractionEngine(view: EngineInteractionView): ServerGameEngine & {
  submissions: InteractionSubmission[];
  takeAutomatedActionInvocations: number;
} {
  const base = makeFakeEngine();
  const submissions: InteractionSubmission[] = [];
  return {
    ...base,
    submissions,
    getStateID: () => view.stateVersion,
    getInteractionView: () => view,
    submitInteraction: (_actorId, submission) => {
      submissions.push(submission);
      return { success: true, stateID: 4, state: {}, patches: [], animations: [] };
    },
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("agent-core takeTurn", () => {
  beforeEach(() => {
    __resetAgentRegistryForTests();
  });

  it("falls back to heuristic when no provider is configured", async () => {
    registerAgent(makeAgent("test-game"));
    const engine = makeFakeEngine();

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "test-game",
        strategy: "llm",
        provider: undefined,
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.fallbackReason).toBe("no_provider_configured");
    expect(outcome.telemetry.outcome).toBe("fallback_no_provider");
    expect(engine.takeAutomatedActionInvocations).toBe(1);
  });

  it("falls back to heuristic when no agent is registered for the slug", async () => {
    const provider = makeScriptedProvider([]);
    registerProvider(provider);
    const engine = makeFakeEngine();

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "unknown-game",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.fallbackReason).toBe("no_agent_registered");
    expect(outcome.telemetry.outcome).toBe("fallback_no_agent");
    expect(engine.takeAutomatedActionInvocations).toBe(1);
    expect(provider.calls).toHaveLength(0);
  });

  it("executes the move chosen by the LLM through the forced tool sequence", async () => {
    registerAgent(makeAgent("test-game"));
    const provider = makeScriptedProvider([
      { toolName: ANALYZE, toolArgs: {} },
      { toolName: EXECUTE, toolArgs: { moveId: "playCard" } },
    ]);
    registerProvider(provider);
    const engine = makeFakeEngine();

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "test-game",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(false);
    expect(outcome.fallbackReason).toBeUndefined();
    expect(outcome.telemetry.outcome).toBe("executed");
    expect(outcome.telemetry.toolsUsed).toEqual([ANALYZE, EXECUTE]);
    expect(outcome.dispatch.selectedCandidate?.family).toBe("playCard");
    expect(engine.takeAutomatedActionInvocations).toBe(0);
    expect(provider.calls).toHaveLength(2);
  });

  it("executes Cyberpunk/Gundam-style protocol actions through submit_interaction", async () => {
    const view = makeInteractionView({
      id: "action:pass",
      requestId: "action:pass",
      intent: "pass",
      text: { key: "test.pass" },
      enabled: true,
      inputs: [],
    });
    registerAgent(makeSubmitInteractionAgent("test-game"));
    const provider = makeScriptedProvider([
      { toolName: ANALYZE, toolArgs: {} },
      { toolName: SUBMIT, toolArgs: { actionId: "action:pass" } },
    ]);
    registerProvider(provider);
    const engine = makeInteractionEngine(view);

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "test-game",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(false);
    expect(outcome.telemetry.toolsUsed).toEqual([ANALYZE, SUBMIT]);
    expect(outcome.dispatch.selectedCandidate?.family).toBe("action:pass");
    expect(engine.submissions.map((submission) => submission.actionId)).toEqual(["action:pass"]);
    expect(engine.takeAutomatedActionInvocations).toBe(0);
  });

  it("falls back when submit_interaction values fail protocol validation", async () => {
    const view = makeInteractionView({
      id: "action:target",
      requestId: "action:target",
      intent: "choose-targets",
      text: { key: "test.target" },
      enabled: true,
      inputs: [
        {
          kind: "entity-selection",
          id: "target",
          role: "target",
          text: { key: "test.target.input" },
          entityKinds: ["card"],
          min: 1,
          max: 1,
          ordered: false,
          candidates: [{ entity: { kind: "card", instanceId: "card_1" }, enabled: true }],
        },
      ],
    });
    registerAgent(makeSubmitInteractionAgent("test-game"));
    const provider = makeScriptedProvider([
      { toolName: ANALYZE, toolArgs: {} },
      { toolName: SUBMIT, toolArgs: { actionId: "action:target", values: { target: "card_2" } } },
    ]);
    registerProvider(provider);
    const engine = makeInteractionEngine(view);

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "test-game",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.fallbackReason).toBe("illegal_tool_payload");
    expect(engine.submissions).toHaveLength(0);
    expect(engine.takeAutomatedActionInvocations).toBe(1);
  });

  it("falls back to heuristic when execute_move payload is invalid", async () => {
    registerAgent(makeAgent("test-game"));
    const provider = makeScriptedProvider([
      { toolName: ANALYZE, toolArgs: {} },
      { toolName: EXECUTE, toolArgs: {} }, // missing moveId → tool returns ok:false
    ]);
    registerProvider(provider);
    const engine = makeFakeEngine();

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "test-game",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.fallbackReason).toBe("illegal_tool_payload");
    expect(outcome.telemetry.outcome).toBe("fallback_invalid_move");
    expect(engine.takeAutomatedActionInvocations).toBe(1);
  });

  it("respects an explicit fallback_to_heuristic tool call", async () => {
    registerAgent(makeAgent("test-game"));
    const provider = makeScriptedProvider([
      { toolName: ANALYZE, toolArgs: {} },
      { toolName: FALLBACK, toolArgs: { reason: "uncertain" } },
    ]);
    registerProvider(provider);
    const engine = makeFakeEngine();

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "test-game",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.fallbackReason).toBe("explicit_tool_choice");
    expect(outcome.telemetry.outcome).toBe("fallback_explicit");
    expect(outcome.telemetry.toolsUsed).toEqual([ANALYZE, FALLBACK]);
    expect(engine.takeAutomatedActionInvocations).toBe(1);
  });

  it("falls back to heuristic when the provider throws", async () => {
    registerAgent(makeAgent("test-game"));
    const provider = makeScriptedProvider([{ throwError: new Error("HTTP 500 from provider") }]);
    registerProvider(provider);
    const engine = makeFakeEngine();

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "test-game",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.fallbackReason).toBe("provider_error");
    expect(outcome.telemetry.outcome).toBe("fallback_provider_error");
    expect(engine.takeAutomatedActionInvocations).toBe(1);
  });

  it("aborts via hard budget and falls back to heuristic on timeout", async () => {
    registerAgent(makeAgent("test-game"));
    // Provider holds its response longer than the runner's hard budget.
    const provider = makeScriptedProvider([{ abortDelayMs: 500, toolName: ANALYZE }]);
    registerProvider(provider);
    const engine = makeFakeEngine();

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "test-game",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 50,
        hardBudgetMs: 100,
      },
    });

    expect(outcome.usedFallback).toBe(true);
    expect(outcome.fallbackReason).toBe("hard_budget_exceeded");
    expect(outcome.telemetry.outcome).toBe("fallback_timeout");
    expect(engine.takeAutomatedActionInvocations).toBe(1);
  });

  it("populates structured telemetry attributes", async () => {
    registerAgent(makeAgent("test-game"));
    const provider = makeScriptedProvider([
      { toolName: ANALYZE, toolArgs: {} },
      { toolName: EXECUTE, toolArgs: { moveId: "quest" } },
    ]);
    registerProvider(provider);
    const engine = makeFakeEngine();

    const outcome = await takeTurn({
      engine,
      actorId: "actor",
      dispatchContext: makeContext(),
      resolved: {
        gameSlug: "test-game",
        strategy: "llm",
        provider: "zhipu",
        softBudgetMs: 5000,
        hardBudgetMs: 10000,
      },
    });

    expect(outcome.telemetry.provider).toBe("zhipu");
    expect(outcome.telemetry.model).toBe("test-model");
    expect(outcome.telemetry.gameSlug).toBe("test-game");
    expect(outcome.telemetry.tokensIn).toBe(20); // 10 per call * 2 calls
    expect(outcome.telemetry.tokensOut).toBe(10);
    expect(outcome.telemetry.toolsUsed).toEqual([ANALYZE, EXECUTE]);
    expect(outcome.telemetry.durationMs).toBeGreaterThanOrEqual(0);
  });
});

import type { BotActionResult } from "@tcg/shared/game-engine";
import { getAgent, getProvider } from "./registry";
import type {
  AgentMessage,
  AgentToolCall,
  AgentToolDefinition,
  DecisionToolPayload,
  ExecuteMoveResult,
  FallbackReason,
  GameAgent,
  GameAgentToolContext,
  TakeTurnInput,
  TakeTurnOutcome,
  ToolRunResult,
  TurnTelemetry,
} from "./types";

/**
 * One LLM-driven decision. The outer priority loop in
 * `MoveProcessor.processBotTurnUntilPriorityLeaves` invokes this repeatedly
 * until the LLM seat no longer holds priority. On *any* failure (no provider,
 * no agent registered, hard-budget exceeded, provider error, illegal payload,
 * engine rejection) the runner falls back to `engine.takeAutomatedAction` and
 * surfaces the structured reason in `outcome.fallbackReason`.
 *
 * Forced tool sequence:
 *   1. `analyze_lines` (ranks legal moves with rationale)
 *   2. one of `execute_move` | `fallback_to_heuristic`
 */
export async function takeTurn(input: TakeTurnInput): Promise<TakeTurnOutcome> {
  const { engine, actorId, dispatchContext, resolved } = input;
  const startedAt = performance.now();
  const toolsUsed: string[] = [];
  let tokensIn = 0;
  let tokensOut = 0;

  const agent = getAgent(resolved.gameSlug);
  if (!agent) {
    return runHeuristicFallback({
      engine,
      actorId,
      dispatchContext,
      gameSlug: resolved.gameSlug,
      providerId: "none",
      model: "none",
      reason: "no_agent_registered",
      outcome: "fallback_no_agent",
      strategyId: resolved.strategyId,
      startedAt,
      toolsUsed,
      tokensIn,
      tokensOut,
    });
  }

  const provider = resolved.provider ? getProvider(resolved.provider) : undefined;
  if (!provider) {
    return runHeuristicFallback({
      engine,
      actorId,
      dispatchContext,
      gameSlug: resolved.gameSlug,
      providerId: "none",
      model: "none",
      reason: "no_provider_configured",
      outcome: "fallback_no_provider",
      strategyId: resolved.strategyId,
      startedAt,
      toolsUsed,
      tokensIn,
      tokensOut,
    });
  }

  const toolCtx: GameAgentToolContext = { engine, actorId, dispatchContext };
  const stateView = agent.serializeState({ engine, actorId });
  const decisionToolName = agent.tools.executeMove.definition.name;
  const tools: AgentToolDefinition[] = [
    agent.tools.analyzeLines.definition,
    agent.tools.executeMove.definition,
    agent.tools.fallbackToHeuristic.definition,
  ];
  const messages: AgentMessage[] = [
    {
      role: "user",
      content: [
        "It is your turn. Use the `analyze_lines` tool first to consider candidate plays,",
        decisionToolName === "submit_interaction"
          ? "then call `submit_interaction` with the protocol actionId and values you have chosen, or `fallback_to_heuristic`"
          : "then call `execute_move` for the move you have chosen, or `fallback_to_heuristic`",
        "if the position is unclear and a deterministic policy is safer than a guess.",
        "",
        "State (player-scoped JSON):",
        JSON.stringify(stateView),
      ].join("\n"),
    },
  ];

  const abortController = new AbortController();
  const hardBudgetTimer = setTimeout(() => abortController.abort(), resolved.hardBudgetMs);

  try {
    // ── Step 1: forced analyze_lines ────────────────────────────────────────
    const analyzeResponse = await provider.chat({
      system: agent.systemPrompt,
      messages,
      tools,
      toolChoice: { tool: agent.tools.analyzeLines.definition.name },
      budgetMs: resolved.hardBudgetMs,
      signal: abortController.signal,
    });
    tokensIn += analyzeResponse.tokensIn ?? 0;
    tokensOut += analyzeResponse.tokensOut ?? 0;

    const analyzeCall = analyzeResponse.message.toolCalls?.[0];
    if (!analyzeCall || analyzeCall.name !== agent.tools.analyzeLines.definition.name) {
      return await runHeuristicFallback({
        engine,
        actorId,
        dispatchContext,
        gameSlug: resolved.gameSlug,
        providerId: provider.id,
        model: provider.defaultModel ?? "unknown",
        reason: "provider_error",
        outcome: "fallback_provider_error",
        strategyId: resolved.strategyId,
        startedAt,
        toolsUsed,
        tokensIn,
        tokensOut,
      });
    }

    const analyzePayload = safeParseJson(analyzeCall.arguments) ?? {};
    const analyzeResult = await agent.tools.analyzeLines.run(analyzePayload, toolCtx);
    toolsUsed.push(agent.tools.analyzeLines.definition.name);

    messages.push({
      role: "assistant",
      content: null,
      toolCalls: [analyzeCall],
    });
    messages.push({
      role: "tool",
      toolCallId: analyzeCall.id,
      content: JSON.stringify(
        analyzeResult.ok ? analyzeResult.value : { error: analyzeResult.error },
      ),
    });

    // ── Step 2: forced execute_move OR fallback_to_heuristic ───────────────
    const decisionResponse = await provider.chat({
      system: agent.systemPrompt,
      messages,
      tools,
      toolChoice: {
        oneOf: [
          agent.tools.executeMove.definition.name,
          agent.tools.fallbackToHeuristic.definition.name,
        ],
      },
      budgetMs: Math.max(0, resolved.hardBudgetMs - (performance.now() - startedAt)),
      signal: abortController.signal,
    });
    tokensIn += decisionResponse.tokensIn ?? 0;
    tokensOut += decisionResponse.tokensOut ?? 0;

    const decisionCall = decisionResponse.message.toolCalls?.[0];
    if (!decisionCall) {
      return await runHeuristicFallback({
        engine,
        actorId,
        dispatchContext,
        gameSlug: resolved.gameSlug,
        providerId: provider.id,
        model: provider.defaultModel ?? "unknown",
        reason: "provider_error",
        outcome: "fallback_provider_error",
        strategyId: resolved.strategyId,
        startedAt,
        toolsUsed,
        tokensIn,
        tokensOut,
      });
    }

    return await runDecisionToolCall({
      agent,
      call: decisionCall,
      toolCtx,
      engine,
      actorId,
      dispatchContext,
      gameSlug: resolved.gameSlug,
      providerId: provider.id,
      model: provider.defaultModel ?? "unknown",
      strategyId: resolved.strategyId,
      startedAt,
      toolsUsed,
      tokensIn,
      tokensOut,
    });
  } catch (error) {
    const aborted = abortController.signal.aborted;
    return await runHeuristicFallback({
      engine,
      actorId,
      dispatchContext,
      gameSlug: resolved.gameSlug,
      providerId: provider.id,
      model: provider.defaultModel ?? "unknown",
      reason: aborted ? "hard_budget_exceeded" : "provider_error",
      outcome: aborted ? "fallback_timeout" : "fallback_provider_error",
      strategyId: resolved.strategyId,
      startedAt,
      toolsUsed,
      tokensIn,
      tokensOut,
      caughtError: error,
    });
  } finally {
    clearTimeout(hardBudgetTimer);
  }
}

interface RunDecisionInput {
  agent: GameAgent;
  call: AgentToolCall;
  toolCtx: GameAgentToolContext;
  engine: TakeTurnInput["engine"];
  actorId: string;
  dispatchContext: TakeTurnInput["dispatchContext"];
  gameSlug: string;
  providerId: TurnTelemetry["provider"];
  model: string;
  strategyId: string | undefined;
  startedAt: number;
  toolsUsed: string[];
  tokensIn: number;
  tokensOut: number;
}

async function runDecisionToolCall(input: RunDecisionInput): Promise<TakeTurnOutcome> {
  const {
    agent,
    call,
    toolCtx,
    engine,
    actorId,
    dispatchContext,
    gameSlug,
    providerId,
    model,
    strategyId,
    startedAt,
    toolsUsed,
    tokensIn,
    tokensOut,
  } = input;

  const executeName = agent.tools.executeMove.definition.name;
  const fallbackName = agent.tools.fallbackToHeuristic.definition.name;

  if (call.name === executeName) {
    toolsUsed.push(executeName);
    const payload = safeParseJson(call.arguments);
    if (!payload || typeof payload !== "object") {
      return await runHeuristicFallback({
        engine,
        actorId,
        dispatchContext,
        gameSlug,
        providerId,
        model,
        reason: "illegal_tool_payload",
        outcome: "fallback_invalid_move",
        strategyId,
        startedAt,
        toolsUsed,
        tokensIn,
        tokensOut,
      });
    }
    const moveResult = await agent.tools.executeMove.run(payload as DecisionToolPayload, toolCtx);
    return unwrapDispatchResult(moveResult, {
      engine,
      actorId,
      dispatchContext,
      gameSlug,
      providerId,
      model,
      strategyId,
      startedAt,
      toolsUsed,
      tokensIn,
      tokensOut,
    });
  }

  if (call.name === fallbackName) {
    toolsUsed.push(fallbackName);
    const payload = (safeParseJson(call.arguments) ?? {}) as {
      reason?: string;
      strategyId?: string;
    };
    const fallbackResult = await agent.tools.fallbackToHeuristic.run(
      { reason: payload.reason, strategyId: payload.strategyId ?? strategyId },
      toolCtx,
    );
    if (!fallbackResult.ok) {
      // Engine rejected the heuristic — surface as fallback_explicit so ops
      // can distinguish "model chose fallback" from "fallback also failed".
      return buildOutcome({
        dispatch: makeBlockedBotResult(fallbackResult.error),
        usedFallback: true,
        fallbackReason: "engine_rejected",
        outcome: "fallback_explicit",
        gameSlug,
        providerId,
        model,
        startedAt,
        toolsUsed,
        tokensIn,
        tokensOut,
      });
    }
    return buildOutcome({
      dispatch: fallbackResult.value.dispatch,
      usedFallback: true,
      fallbackReason: "explicit_tool_choice",
      outcome: "fallback_explicit",
      gameSlug,
      providerId,
      model,
      startedAt,
      toolsUsed,
      tokensIn,
      tokensOut,
    });
  }

  // Model called an unknown tool — fall back.
  return await runHeuristicFallback({
    engine,
    actorId,
    dispatchContext,
    gameSlug,
    providerId,
    model,
    reason: "illegal_tool_payload",
    outcome: "fallback_invalid_move",
    strategyId,
    startedAt,
    toolsUsed,
    tokensIn,
    tokensOut,
  });
}

interface UnwrapDispatchInput {
  engine: TakeTurnInput["engine"];
  actorId: string;
  dispatchContext: TakeTurnInput["dispatchContext"];
  gameSlug: string;
  providerId: TurnTelemetry["provider"];
  model: string;
  strategyId: string | undefined;
  startedAt: number;
  toolsUsed: string[];
  tokensIn: number;
  tokensOut: number;
}

async function unwrapDispatchResult(
  result: ToolRunResult<ExecuteMoveResult>,
  ctx: UnwrapDispatchInput,
): Promise<TakeTurnOutcome> {
  if (!result.ok) {
    return await runHeuristicFallback({
      ...ctx,
      reason: result.code === "validation" ? "illegal_tool_payload" : "engine_rejected",
      outcome: "fallback_invalid_move",
    });
  }
  return buildOutcome({
    dispatch: result.value.dispatch,
    usedFallback: false,
    outcome: "executed",
    gameSlug: ctx.gameSlug,
    providerId: ctx.providerId,
    model: ctx.model,
    startedAt: ctx.startedAt,
    toolsUsed: ctx.toolsUsed,
    tokensIn: ctx.tokensIn,
    tokensOut: ctx.tokensOut,
  });
}

interface RunHeuristicFallbackInput {
  engine: TakeTurnInput["engine"];
  actorId: string;
  dispatchContext: TakeTurnInput["dispatchContext"];
  gameSlug: string;
  providerId: TurnTelemetry["provider"];
  model: string;
  reason: FallbackReason;
  outcome: TurnTelemetry["outcome"];
  strategyId: string | undefined;
  startedAt: number;
  toolsUsed: string[];
  tokensIn: number;
  tokensOut: number;
  caughtError?: unknown;
}

async function runHeuristicFallback(input: RunHeuristicFallbackInput): Promise<TakeTurnOutcome> {
  const dispatch = invokeEngineHeuristic(input.engine, input.dispatchContext, input.strategyId);
  return buildOutcome({
    dispatch,
    usedFallback: true,
    fallbackReason: input.reason,
    outcome: input.outcome,
    gameSlug: input.gameSlug,
    providerId: input.providerId,
    model: input.model,
    startedAt: input.startedAt,
    toolsUsed: input.toolsUsed,
    tokensIn: input.tokensIn,
    tokensOut: input.tokensOut,
  });
}

function invokeEngineHeuristic(
  engine: TakeTurnInput["engine"],
  dispatchContext: TakeTurnInput["dispatchContext"],
  strategyId: string | undefined,
): BotActionResult {
  if (!engine.takeAutomatedAction) {
    return makeBlockedBotResult(
      "Engine does not implement takeAutomatedAction; heuristic fallback unavailable.",
    );
  }
  return engine.takeAutomatedAction({ strategyId }, dispatchContext);
}

function makeBlockedBotResult(reason: string): BotActionResult {
  return {
    finalResult: {
      success: false,
      error: reason,
      errorCode: "not_supported",
    },
    blocked: { reason },
  };
}

interface BuildOutcomeInput {
  dispatch: BotActionResult;
  usedFallback: boolean;
  fallbackReason?: FallbackReason;
  outcome: TurnTelemetry["outcome"];
  gameSlug: string;
  providerId: TurnTelemetry["provider"];
  model: string;
  startedAt: number;
  toolsUsed: string[];
  tokensIn: number;
  tokensOut: number;
}

function buildOutcome(input: BuildOutcomeInput): TakeTurnOutcome {
  const telemetry: TurnTelemetry = {
    provider: input.providerId,
    model: input.model,
    gameSlug: input.gameSlug,
    durationMs: Math.round(performance.now() - input.startedAt),
    toolsUsed: input.toolsUsed,
    tokensIn: input.tokensIn,
    tokensOut: input.tokensOut,
    outcome: input.outcome,
  };
  return {
    dispatch: input.dispatch,
    usedFallback: input.usedFallback,
    fallbackReason: input.fallbackReason,
    telemetry,
  };
}

function safeParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

import type { BotActionResult, DispatchContext, ServerGameEngine } from "@tcg/shared/game-engine";
import type { InteractionSubmissionValue } from "@tcg/protocol";

/**
 * Identifies the LLM provider backing an agent turn. Selection happens via
 * `LLM_AGENT_PROVIDER` (server env) with a per-match override on the bot seat.
 */
export type AgentProviderId = "zhipu" | "deepseek";

/**
 * Per-seat strategy persisted on `MatchMeta.botSeats[]`. "heuristic" runs the
 * engine's built-in `takeAutomatedAction`; "llm" routes the turn through
 * `LlmAgentRunner.takeTurn`.
 */
export type BotSeatStrategy = "heuristic" | "llm";

/**
 * Single chat message in the runner's conversation. The runner is single-
 * decision per call but builds up an internal message list as tools are
 * called and their results pushed back.
 */
export type AgentMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; toolCalls?: AgentToolCall[] }
  | { role: "tool"; toolCallId: string; content: string };

export interface AgentToolCall {
  id: string;
  name: string;
  arguments: string;
}

export interface AgentToolDefinition {
  name: string;
  description: string;
  /** JSON-Schema-shaped parameter spec (OpenAI tool-call compatible). */
  parameters: Record<string, unknown>;
}

export type AgentToolChoice =
  | "auto"
  | "required"
  | "none"
  | { tool: string }
  | { oneOf: ReadonlyArray<string> };

export interface AgentChatRequest {
  system?: string;
  messages: AgentMessage[];
  tools: AgentToolDefinition[];
  toolChoice: AgentToolChoice;
  budgetMs: number;
  signal?: AbortSignal;
  model?: string;
}

export interface AgentChatResponse {
  message: Extract<AgentMessage, { role: "assistant" }>;
  tokensIn?: number;
  tokensOut?: number;
}

export interface AgentProvider {
  readonly id: AgentProviderId;
  readonly defaultModel: string | undefined;
  chat(request: AgentChatRequest): Promise<AgentChatResponse>;
}

/**
 * Game-specific agent definition; registered into the global registry by the
 * per-game agent package on import. Carries every game-specific bit the
 * runner needs: how to render the state for the model, what tools are
 * available, and the system prompt to anchor the conversation.
 */
export interface GameAgent {
  readonly slug: string;
  /**
   * Render the engine's state as a compact, player-scoped view fed to the
   * model. Must be deterministic and token-efficient — no card images, no
   * full effect text, only the move-relevant signals.
   */
  serializeState(input: { engine: ServerGameEngine; actorId: string }): unknown;
  /** Tool implementations (analyze_lines / execute_move / fallback_to_heuristic). */
  tools: GameAgentTools;
  /** Per-game system prompt with rules digest + decision guidelines. */
  systemPrompt: string;
}

export interface AnalyzeLinesPayload {
  rationale?: string;
}

export interface AnalyzeLinesResult {
  lines: ReadonlyArray<{
    id: string;
    summary: string;
    rationale: string;
    expectedValue: "high" | "med" | "low";
  }>;
  confidence: "high" | "med" | "low";
}

export interface ExecuteMovePayload {
  moveId: string;
  payload?: Record<string, unknown>;
}

export interface SubmitInteractionPayload {
  actionId: string;
  values?: Record<string, InteractionSubmissionValue>;
  correlationId?: string;
}

export type DecisionToolPayload = ExecuteMovePayload | SubmitInteractionPayload;

export interface ExecuteMoveResult {
  ok: true;
  dispatch: BotActionResult;
}

export interface FallbackPayload {
  reason?: string;
  strategyId?: string;
}

export interface GameAgentToolContext {
  engine: ServerGameEngine;
  actorId: string;
  dispatchContext: DispatchContext;
}

export type ToolRunResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; code: "validation" | "engine" | "internal" };

export interface GameAgentTools {
  analyzeLines: {
    definition: AgentToolDefinition;
    run(
      payload: AnalyzeLinesPayload,
      ctx: GameAgentToolContext,
    ): Promise<ToolRunResult<AnalyzeLinesResult>>;
  };
  executeMove: {
    definition: AgentToolDefinition;
    run(
      payload: DecisionToolPayload,
      ctx: GameAgentToolContext,
    ): Promise<ToolRunResult<ExecuteMoveResult>>;
  };
  fallbackToHeuristic: {
    definition: AgentToolDefinition;
    run(
      payload: FallbackPayload,
      ctx: GameAgentToolContext,
    ): Promise<ToolRunResult<ExecuteMoveResult>>;
  };
}

/** One LLM-driven decision (a single bot action). The outer priority loop in
 *  `MoveProcessor.processBotTurnUntilPriorityLeaves` calls `takeTurn` repeatedly
 *  until the engine's active player is no longer the LLM seat. */
export interface TakeTurnInput {
  engine: ServerGameEngine;
  actorId: string;
  dispatchContext: DispatchContext;
  /** Pre-resolved by the runner caller, includes provider override + strategyId. */
  resolved: ResolvedAgentConfig;
}

export interface TakeTurnOutcome {
  /** The dispatch the runner ultimately executed (LLM-selected or fallback). */
  dispatch: BotActionResult;
  /** True when execution went via the heuristic (because LLM erred / timed out / chose fallback). */
  usedFallback: boolean;
  /** Short, structured reason populated only when `usedFallback`. */
  fallbackReason?: FallbackReason;
  telemetry: TurnTelemetry;
}

export type FallbackReason =
  | "no_provider_configured"
  | "no_agent_registered"
  | "hard_budget_exceeded"
  | "provider_error"
  | "illegal_tool_payload"
  | "engine_rejected"
  | "explicit_tool_choice"
  | "missing_state";

export interface TurnTelemetry {
  provider: AgentProviderId | "none";
  model: string;
  gameSlug: string;
  durationMs: number;
  toolsUsed: string[];
  tokensIn: number;
  tokensOut: number;
  outcome:
    | "executed"
    | "fallback_no_provider"
    | "fallback_timeout"
    | "fallback_provider_error"
    | "fallback_invalid_move"
    | "fallback_explicit"
    | "fallback_no_agent";
}

export interface ResolvedAgentConfig {
  gameSlug: string;
  strategy: BotSeatStrategy;
  provider?: AgentProviderId;
  /** Pass-through to engine.takeAutomatedAction when running fallback. */
  strategyId?: string;
  /** Soft warn budget; runner emits a metric but does not abort. */
  softBudgetMs: number;
  /** Hard abort budget; runner aborts the provider call and falls back. */
  hardBudgetMs: number;
}

export const DEFAULT_SOFT_BUDGET_MS = 5_000;
export const DEFAULT_HARD_BUDGET_MS = 10_000;

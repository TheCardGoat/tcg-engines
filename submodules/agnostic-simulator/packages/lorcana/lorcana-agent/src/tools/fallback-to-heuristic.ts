import type {
  AgentToolDefinition,
  ExecuteMoveResult,
  FallbackPayload,
  GameAgentToolContext,
  ToolRunResult,
} from "@tcg/agent-core";

/**
 * `fallback_to_heuristic` for Lorcana. Lets the model defer to the engine's
 * deterministic bot when the position is unclear and a guessed move would
 * be risky. Delegates to `engine.takeAutomatedAction({ strategyId })` —
 * exactly the same path the runner uses on LLM error/timeout.
 */
export const fallbackToHeuristic = {
  definition: {
    name: "fallback_to_heuristic",
    description:
      "Run the engine's built-in heuristic bot for this decision instead of choosing a move yourself. Use when the position is ambiguous and a deterministic policy is safer than a guess.",
    parameters: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description: "Short rationale for falling back (for telemetry / debugging). Optional.",
        },
        strategyId: {
          type: "string",
          description:
            "Optional strategyId override for the heuristic. Leave unset to use the default.",
        },
      },
      additionalProperties: false,
    },
  } satisfies AgentToolDefinition,

  async run(
    payload: FallbackPayload,
    ctx: GameAgentToolContext,
  ): Promise<ToolRunResult<ExecuteMoveResult>> {
    if (!ctx.engine.takeAutomatedAction) {
      return {
        ok: false,
        error: "Lorcana engine does not implement takeAutomatedAction.",
        code: "engine",
      };
    }
    const dispatch = ctx.engine.takeAutomatedAction(
      { strategyId: payload.strategyId },
      ctx.dispatchContext,
    );
    return { ok: true, value: { ok: true, dispatch } };
  },
};

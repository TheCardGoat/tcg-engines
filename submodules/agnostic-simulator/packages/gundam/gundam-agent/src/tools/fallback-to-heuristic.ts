import type {
  AgentToolDefinition,
  ExecuteMoveResult,
  FallbackPayload,
  GameAgentToolContext,
  ToolRunResult,
} from "@tcg/agent-core";

export const fallbackToHeuristic = {
  definition: {
    name: "fallback_to_heuristic",
    description:
      "Run Gundam's engine-level heuristic bot for this decision instead of choosing a move yourself. Use when the position is unclear.",
    parameters: {
      type: "object",
      properties: {
        reason: { type: "string" },
        strategyId: {
          type: "string",
          enum: ["value-ranked", "greedy-legal", "pass-only"],
          description:
            "Optional strategy override. Defaults to value-ranked, the most card-aware option.",
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
        error:
          "Gundam engine does not implement takeAutomatedAction; the adapter must be on Phase 3a or later.",
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

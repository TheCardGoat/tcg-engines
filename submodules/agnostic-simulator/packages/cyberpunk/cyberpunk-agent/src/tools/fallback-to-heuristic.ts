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
      "Run Cyberpunk's engine heuristic bot for this decision. Use when the position is unclear; the heuristic picks the first legal move from a priority list.",
    parameters: {
      type: "object",
      properties: {
        reason: { type: "string" },
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
          "Cyberpunk engine does not implement takeAutomatedAction; the adapter must be on Phase 4a or later.",
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

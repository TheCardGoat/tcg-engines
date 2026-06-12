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
      "Run One Piece's engine-level heuristic bot for this decision instead of choosing a move yourself. Use when the position is unclear.",
    parameters: {
      type: "object",
      properties: {
        reason: { type: "string" },
      },
      additionalProperties: false,
    },
  } satisfies AgentToolDefinition,

  async run(
    _payload: FallbackPayload,
    ctx: GameAgentToolContext,
  ): Promise<ToolRunResult<ExecuteMoveResult>> {
    if (!ctx.engine.takeAutomatedAction) {
      return {
        ok: false,
        error: "One Piece engine does not implement takeAutomatedAction yet.",
        code: "engine",
      };
    }
    const dispatch = ctx.engine.takeAutomatedAction({}, ctx.dispatchContext);
    return { ok: true, value: { ok: true, dispatch } };
  },
};

import type {
  AgentToolDefinition,
  DecisionToolPayload,
  ExecuteMoveResult,
  GameAgentToolContext,
  ToolRunResult,
} from "@tcg/agent-core";
import { getLorcanaMoveIds, validateLorcanaMovePayload } from "../moves-schema";

/**
 * `execute_move` for Lorcana. Validates the payload against the Zod schema
 * for the chosen `moveId`, then dispatches through the game-agnostic
 * `engine.dispatch(moveId, actorId, payload, dispatchContext)` interface.
 *
 * On any failure (unknown move id, schema-invalid payload, engine rejection)
 * the runner falls back to `fallback_to_heuristic`. We surface specific error
 * messages so telemetry can distinguish the cases.
 */
export const executeMove = {
  definition: {
    name: "execute_move",
    description:
      "Execute a specific Lorcana move chosen for this decision. Validates the payload, then dispatches it through the engine. Use only after analyze_lines; payload must conform to the move's schema.",
    parameters: {
      type: "object",
      required: ["moveId"],
      properties: {
        moveId: {
          type: "string",
          description: "The Lorcana move identifier (e.g. quest, playCard, challenge, passTurn).",
          enum: getLorcanaMoveIds(),
        },
        payload: {
          type: "object",
          description:
            "Move-specific arguments. Keys vary per move; see Lorcana rules digest. For passTurn / questWithAll, pass {} or omit.",
          additionalProperties: true,
        },
      },
      additionalProperties: false,
    },
  } satisfies AgentToolDefinition,

  async run(
    payload: DecisionToolPayload,
    ctx: GameAgentToolContext,
  ): Promise<ToolRunResult<ExecuteMoveResult>> {
    if (!payload || !("moveId" in payload) || typeof payload.moveId !== "string") {
      return { ok: false, error: "execute_move requires a string moveId", code: "validation" };
    }

    const validated = validateLorcanaMovePayload(payload.moveId, payload.payload ?? {});
    if (!validated.ok) {
      return { ok: false, error: validated.error, code: "validation" };
    }

    const dispatch = ctx.engine.dispatch(
      payload.moveId,
      ctx.actorId,
      validated.value,
      ctx.dispatchContext,
    );

    if (!dispatch.success) {
      return {
        ok: false,
        error: dispatch.error ?? `Engine rejected ${payload.moveId}`,
        code: "engine",
      };
    }

    return {
      ok: true,
      value: {
        ok: true,
        dispatch: {
          finalResult: dispatch,
          selectedCandidate: { family: payload.moveId },
        },
      },
    };
  },
};

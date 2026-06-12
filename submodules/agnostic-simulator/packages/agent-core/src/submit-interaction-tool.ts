import {
  buildInteractionSubmissionForActionId,
  InteractionSubmissionValue,
  validateInteractionSubmission,
} from "@tcg/protocol";
import type {
  AgentToolDefinition,
  DecisionToolPayload,
  ExecuteMoveResult,
  GameAgentToolContext,
  GameAgentTools,
  SubmitInteractionPayload,
  ToolRunResult,
} from "./types";

export type SubmitInteractionToolOptions = {
  gameName: string;
};

export function createSubmitInteractionTool(
  options: SubmitInteractionToolOptions,
): GameAgentTools["executeMove"] {
  return {
    definition: {
      name: "submit_interaction",
      description: `Submit a ${options.gameName} protocol action chosen from the current interactionView. Use only after analyze_lines.`,
      parameters: {
        type: "object",
        required: ["actionId"],
        properties: {
          actionId: {
            type: "string",
            description: "The id of an enabled action from interactionView.actions.",
          },
          values: {
            type: "object",
            description:
              "Input values keyed by interaction input id. Omit or pass {} for actions with no inputs.",
            additionalProperties: true,
          },
          correlationId: {
            type: "string",
            description: "Optional telemetry correlation id.",
          },
        },
        additionalProperties: false,
      },
    } satisfies AgentToolDefinition,

    async run(
      payload: DecisionToolPayload,
      ctx: GameAgentToolContext,
    ): Promise<ToolRunResult<ExecuteMoveResult>> {
      if (!isSubmitInteractionPayload(payload)) {
        return {
          ok: false,
          error: "submit_interaction requires a string actionId",
          code: "validation",
        };
      }
      if (!ctx.engine.getInteractionView || !ctx.engine.submitInteraction) {
        return {
          ok: false,
          error: `${options.gameName} engine does not implement protocol interactions.`,
          code: "engine",
        };
      }

      const view = ctx.engine.getInteractionView(ctx.actorId);
      if (!view) {
        return { ok: false, error: "No interaction view is available.", code: "engine" };
      }

      const submission = buildInteractionSubmissionForActionId({
        view,
        actionId: payload.actionId,
        values: payload.values ?? {},
        correlationId: payload.correlationId,
      });
      if (!submission) {
        return {
          ok: false,
          error: `Interaction action "${payload.actionId}" is not available.`,
          code: "validation",
        };
      }

      const validation = validateInteractionSubmission(view, submission);
      if (!validation.ok) {
        return { ok: false, error: validation.error, code: "validation" };
      }

      const dispatch = ctx.engine.submitInteraction(ctx.actorId, submission, ctx.dispatchContext);
      if (!dispatch.success) {
        return {
          ok: false,
          error: dispatch.error ?? `Engine rejected interaction ${payload.actionId}`,
          code: "engine",
        };
      }

      return {
        ok: true,
        value: {
          ok: true,
          dispatch: {
            finalResult: dispatch,
            selectedCandidate: { family: payload.actionId },
          },
        },
      };
    },
  };
}

function isSubmitInteractionPayload(
  payload: DecisionToolPayload,
): payload is SubmitInteractionPayload {
  return (
    isRecord(payload) &&
    typeof payload.actionId === "string" &&
    (payload.values === undefined || isInteractionValues(payload.values)) &&
    (payload.correlationId === undefined || typeof payload.correlationId === "string")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInteractionValues(
  value: unknown,
): value is NonNullable<SubmitInteractionPayload["values"]> {
  return isRecord(value) && Object.values(value).every(isInteractionValue);
}

function isInteractionValue(
  value: unknown,
): value is NonNullable<SubmitInteractionPayload["values"]>[string] {
  return InteractionSubmissionValue.safeParse(value).success;
}

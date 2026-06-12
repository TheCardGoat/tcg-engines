import type {
  AgentToolDefinition,
  AnalyzeLinesPayload,
  AnalyzeLinesResult,
  GameAgentToolContext,
  ToolRunResult,
} from "@tcg/agent-core";
import type { InteractionAction, InteractionInput } from "@tcg/protocol";

export const analyzeLines = {
  definition: {
    name: "analyze_lines",
    description:
      "Inspect enabled Cyberpunk protocol actions for the current position. Returns action ids to rank.",
    parameters: {
      type: "object",
      properties: {
        rationale: {
          type: "string",
          description: "Optional free-form rationale; stored for telemetry only.",
        },
      },
      additionalProperties: false,
    },
  } satisfies AgentToolDefinition,

  async run(
    _payload: AnalyzeLinesPayload,
    ctx: GameAgentToolContext,
  ): Promise<ToolRunResult<AnalyzeLinesResult>> {
    const view = ctx.engine.getInteractionView?.(ctx.actorId);
    const actions = view?.actions.filter((action) => action.enabled) ?? [];
    return {
      ok: true,
      value: {
        lines: actions.map((action) => ({
          id: action.id,
          summary: summarizeAction(action),
          rationale: "",
          expectedValue: action.intent === "pass" ? "low" : "med",
        })),
        confidence: actions.length > 0 ? "med" : "low",
      },
    };
  },
};

function summarizeAction(action: InteractionAction): string {
  const inputSummary = action.inputs.map(summarizeInput).join("; ");
  return inputSummary ? `${action.text.key} (${inputSummary})` : action.text.key;
}

function summarizeInput(input: InteractionInput): string {
  switch (input.kind) {
    case "entity-selection":
      return `${input.id}: select ${input.min}-${input.max} ${input.entityKinds.join("|")} candidates=${input.candidates.filter((candidate) => candidate.enabled !== false).length}`;
    case "option-selection":
      return `${input.id}: choose ${input.min}-${input.max} options=${input.options.filter((option) => option.enabled !== false).length}`;
    case "boolean":
      return `${input.id}: boolean`;
    case "number":
      return `${input.id}: number`;
    case "ordering":
      return `${input.id}: order ${input.min}-${input.max} ${input.entityKind} candidates=${input.candidates.filter((candidate) => candidate.enabled !== false).length}`;
    default:
      return input;
  }
}

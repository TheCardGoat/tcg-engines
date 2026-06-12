import type {
  AgentToolDefinition,
  AnalyzeLinesPayload,
  AnalyzeLinesResult,
  GameAgentToolContext,
  ToolRunResult,
} from "@tcg/agent-core";
import { getLorcanaMoveIds } from "../moves-schema";

/**
 * `analyze_lines` for Lorcana. The runner forces this tool on the first
 * step, so we use it to enumerate plausible candidate moves and ask the
 * model to rank them with rationales. Candidate enumeration is *static* —
 * we just list all schema-known move ids; the model picks the relevant ones
 * for the current position based on the state view.
 *
 * Returns a deterministic stub list of move ids the model can rank. The
 * model's rationale comes back through the LLM tool-call response, not from
 * this function — we just provide the menu.
 */
export const analyzeLines = {
  definition: {
    name: "analyze_lines",
    description:
      "Inspect candidate Lorcana plays for the current position. Returns the menu of move ids the model should rank (top 3 with short rationales).",
    parameters: {
      type: "object",
      properties: {
        rationale: {
          type: "string",
          description:
            "Optional free-form rationale or planning notes the model wants to record before picking moves. Stored for telemetry only; ignored by the engine.",
        },
      },
      additionalProperties: false,
    },
  } satisfies AgentToolDefinition,

  async run(
    _payload: AnalyzeLinesPayload,
    _ctx: GameAgentToolContext,
  ): Promise<ToolRunResult<AnalyzeLinesResult>> {
    const moveIds = getLorcanaMoveIds();
    return {
      ok: true,
      value: {
        lines: moveIds.map((id) => ({
          id,
          summary: shortSummary(id),
          rationale: "",
          expectedValue: "med",
        })),
        confidence: "med",
      },
    };
  },
};

function shortSummary(moveId: string): string {
  switch (moveId) {
    case "playCard":
      return "Play a card from hand (pay ink, or shift onto an existing character).";
    case "quest":
      return "Quest with a ready, non-drying character to gain its lore.";
    case "questWithAll":
      return "Quest with every eligible ready, non-drying character at once.";
    case "challenge":
      return "Challenge an exerted opposing character with one of yours.";
    case "sing":
      return "Sing a song using a character whose ink cost meets the song's requirement.";
    case "singTogether":
      return "Combine multiple singers' ink to sing a song their costs jointly cover.";
    case "putCardIntoInkwell":
      return "Put a card from hand into your inkwell to grow your ink pool.";
    case "activateAbility":
      return "Activate a character / item / location ability.";
    case "moveCharacterToLocation":
      return "Move a character to a location you control.";
    case "resolveBag":
      return "Resolve a pending bag effect awaiting a decision.";
    case "resolveEffect":
      return "Resolve a pending effect awaiting a target or choice.";
    case "passTurn":
      return "End your turn.";
    case "concede":
      return "Concede the game (only for forfeit scenarios).";
    case "chooseWhoGoesFirst":
      return "Choose which player takes the first turn (game setup only).";
    case "alterHand":
      return "Mulligan: shuffle selected hand cards back into your deck (setup only).";
    default:
      return moveId;
  }
}

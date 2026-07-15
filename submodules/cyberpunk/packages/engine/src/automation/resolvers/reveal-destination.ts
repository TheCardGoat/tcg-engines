import type { RevealDestinationChoicePrompt } from "../../view/player-prompt.ts";
import type { ChoiceResolver, MoveDecision } from "../types.ts";

export const revealDestinationResolver: ChoiceResolver<RevealDestinationChoicePrompt> = (
  choice,
): MoveDecision => {
  const destination = choice.payload.destinations.includes("trash")
    ? "trash"
    : choice.payload.destinations[0];
  if (!destination) {
    return { kind: "stuck", reason: "revealDestination: no destinations available" };
  }
  return {
    kind: "command",
    move: "resolveRevealDestination",
    args: { destination },
  };
};

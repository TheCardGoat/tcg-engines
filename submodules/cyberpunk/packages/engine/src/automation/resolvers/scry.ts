import type { ScryDestinationZone } from "@tcg/cyberpunk-types";
import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ScryChoicePrompt } from "../../view/player-prompt.ts";

export const scryResolver: ChoiceResolver<ScryChoicePrompt> = (choice): MoveDecision => {
  const { destinations } = choice.payload;
  const selected = new Set<string>();
  const resolvedDestinations: Array<{ zone: ScryDestinationZone; cardIds: string[] }> = [];

  for (const destination of destinations) {
    if (destination.remainder) continue;
    const available = destination.eligibleCardIds
      .filter((cardId) => !selected.has(cardId))
      .sort((a, b) => a.localeCompare(b));
    const min = destination.min ?? 0;
    const max = destination.max ?? available.length;
    const count = Math.max(min, Math.min(max, available.length));
    const cardIds = available.slice(0, count);
    for (const cardId of cardIds) selected.add(cardId);
    resolvedDestinations.push({ zone: destination.zone, cardIds });
  }

  return {
    kind: "command",
    move: "resolveScry",
    args: { destinations: resolvedDestinations },
  };
};

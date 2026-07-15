import type { ScryDestinationZone } from "@tcg/cyberpunk-types";
import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ScryChoicePrompt, ScryTargetFilter } from "../../view/player-prompt.ts";
import type { FilteredCardView } from "../../view/filter.ts";

export const scryResolver: ChoiceResolver<ScryChoicePrompt> = (choice): MoveDecision => {
  const { destinations, revealedCards } = choice.payload;
  const selected = new Set<string>();
  const resolvedDestinations: Array<{ zone: ScryDestinationZone; cardIds: string[] }> = [];

  for (const destination of destinations) {
    if (destination.remainder) continue;
    const matching = destination.target
      ? revealedCards.filter((card) => matchesFilter(card, destination.target!))
      : revealedCards;
    const available = matching
      .filter((card) => !selected.has(card.instanceId))
      .sort((a, b) => a.instanceId.localeCompare(b.instanceId));
    const min = destination.min ?? 0;
    const max = destination.max ?? available.length;
    const count = Math.max(min, Math.min(max, available.length));
    const cardIds = available.slice(0, count).map((card) => card.instanceId);
    for (const cardId of cardIds) selected.add(cardId);
    resolvedDestinations.push({ zone: destination.zone, cardIds });
  }

  return {
    kind: "command",
    move: "resolveScry",
    args: { destinations: resolvedDestinations },
  };
};

function matchesFilter(card: FilteredCardView, filter: ScryTargetFilter): boolean {
  if (filter.cardTypes && (card.type === null || !filter.cardTypes.includes(card.type))) {
    return false;
  }
  if (filter.classifications) {
    const hasMatch = filter.classifications.some((classification) =>
      card.classifications.includes(classification),
    );
    if (!hasMatch) return false;
  }
  if (filter.minCost !== undefined) {
    const cost = card.cost ?? Number.NEGATIVE_INFINITY;
    if (cost < filter.minCost) return false;
  }
  if (filter.maxCost !== undefined) {
    const cost = card.cost ?? Number.POSITIVE_INFINITY;
    if (cost > filter.maxCost) return false;
  }
  if (filter.minPower !== undefined) {
    if ((card.effectivePower ?? Number.NEGATIVE_INFINITY) < filter.minPower) return false;
  }
  if (filter.maxPower !== undefined) {
    if ((card.effectivePower ?? Number.POSITIVE_INFINITY) > filter.maxPower) return false;
  }
  return true;
}

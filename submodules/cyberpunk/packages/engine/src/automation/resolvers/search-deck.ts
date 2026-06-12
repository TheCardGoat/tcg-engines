import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { SearchDeckChoicePrompt, SearchDeckTargetFilter } from "../../view/player-prompt.ts";
import type { FilteredCardView } from "../../view/filter.ts";

/**
 * Default search-deck resolver. Evaluates the optional `target` filter against
 * the projected revealed cards so the chosen ids are guaranteed to pass
 * validation. Picks deterministically (sorted by instance id) up to the
 * smaller of the matching pool and the select-spec's bound: `max` for `upTo`,
 * `amount` for `exact`, or all matches for `all`.
 *
 * Filter coverage must stay aligned with `resolveSearchDeckMove.validate` in
 * `packages/engine/src/moves/resolve-search-deck.ts` — if the engine starts
 * validating a new field, mirror it here (and vice versa) so the AI never
 * picks something the engine will reject.
 */
export const searchDeckResolver: ChoiceResolver<SearchDeckChoicePrompt> = (
  choice,
): MoveDecision => {
  const { select, target, revealedCards } = choice.payload;

  const matching = target
    ? revealedCards.filter((card) => matchesFilter(card, target))
    : revealedCards;

  const limit =
    select.kind === "all" ? matching.length : select.kind === "upTo" ? select.max : select.amount;
  const sorted = [...matching].sort((a, b) => a.instanceId.localeCompare(b.instanceId));
  const selectedCardIds = sorted.slice(0, Math.max(0, limit)).map((c) => c.instanceId);

  return {
    kind: "command",
    move: "resolveSearchDeck",
    args: { selectedCardIds },
  };
};

function matchesFilter(card: FilteredCardView, filter: SearchDeckTargetFilter): boolean {
  if (filter.cardTypes && (card.type === null || !filter.cardTypes.includes(card.type))) {
    return false;
  }
  if (filter.classifications) {
    const hasMatch = filter.classifications.some((c) => card.classifications.includes(c));
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

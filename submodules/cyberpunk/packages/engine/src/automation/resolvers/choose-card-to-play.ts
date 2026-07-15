import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseCardToPlayChoicePrompt } from "../../view/player-prompt.ts";
import type { FilteredCardView } from "../../view/filter.ts";

/**
 * Default chooseCardToPlay resolver. Picks the highest-impact candidate the
 * trigger is offering — most often "play one of these for free" effects where
 * picking the strongest card maximises tempo. Ranks by effective power, then
 * cost, then instance id for determinism.
 */
export const chooseCardToPlayResolver: ChoiceResolver<ChooseCardToPlayChoicePrompt> = (
  choice,
): MoveDecision => {
  if (choice.payload.cardIds.length === 0) {
    return { kind: "stuck", reason: "chooseCardToPlay has no candidates" };
  }
  const cardId = pickHighestImpact(choice.payload.cards) ?? choice.payload.cardIds[0]!;
  return {
    kind: "command",
    move: "resolveCardToPlay",
    args: { cardId },
  };
};

function pickHighestImpact(cards: FilteredCardView[]): string | null {
  if (cards.length === 0) return null;
  const sorted = [...cards].sort((a, b) => {
    const ap = a.effectivePower ?? 0;
    const bp = b.effectivePower ?? 0;
    if (ap !== bp) return bp - ap;
    const ac = a.cost ?? 0;
    const bc = b.cost ?? 0;
    if (ac !== bc) return bc - ac;
    return a.instanceId.localeCompare(b.instanceId);
  });
  return sorted[0]!.instanceId;
}

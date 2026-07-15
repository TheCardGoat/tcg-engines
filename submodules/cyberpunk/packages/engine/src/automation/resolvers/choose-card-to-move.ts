import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseCardToMoveChoicePrompt } from "../../view/player-prompt.ts";
import type { FilteredCardView } from "../../view/filter.ts";

const FAVOURABLE_DESTINATIONS = new Set(["field", "hand"]);

/**
 * Default chooseCardToMove resolver.
 *
 * - When no candidates: pass.
 * - When the destination is favourable (field/hand): move the highest-impact
 *   card so the effect lands on something valuable.
 * - When the destination is unfavourable (trash/deckBottom) or unknown:
 *   move the lowest-impact card so we sacrifice something cheap. Triggers
 *   that move cards into trash are usually self-discard effects.
 *
 * Ranks by effective power, then cost, then instance id for determinism.
 */
export const chooseCardToMoveResolver: ChoiceResolver<ChooseCardToMoveChoicePrompt> = (
  choice,
): MoveDecision => {
  const { cards, destination } = choice.payload;
  if (choice.payload.cardIds.length === 0) {
    return {
      kind: "command",
      move: "resolveCardToMove",
      args: { pass: true },
    };
  }
  const favourable = destination === undefined ? false : FAVOURABLE_DESTINATIONS.has(destination);
  const cardId =
    pickByImpact(cards, favourable ? "highest" : "lowest") ?? choice.payload.cardIds[0]!;
  return {
    kind: "command",
    move: "resolveCardToMove",
    args: { cardId },
  };
};

function pickByImpact(cards: FilteredCardView[], direction: "highest" | "lowest"): string | null {
  if (cards.length === 0) return null;
  const dir = direction === "highest" ? -1 : 1;
  const sorted = [...cards].sort((a, b) => {
    const ap = a.effectivePower ?? 0;
    const bp = b.effectivePower ?? 0;
    if (ap !== bp) return dir * (ap - bp);
    const ac = a.cost ?? 0;
    const bc = b.cost ?? 0;
    if (ac !== bc) return dir * (ac - bc);
    return a.instanceId.localeCompare(b.instanceId);
  });
  return sorted[0]!.instanceId;
}

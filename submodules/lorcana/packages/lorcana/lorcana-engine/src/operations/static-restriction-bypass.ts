import type { CardInstanceId, PlayerId } from "#core";
import type { LorcanaCard } from "@tcg/lorcana-types";
import {
  getStaticSelfRestrictionBypass,
  hasStaticSelfRestriction,
} from "../runtime-moves/rules/static-ability-utils";
import { spendInk } from "../runtime-moves/rules/play-card-rules";

type Ctx = Parameters<typeof spendInk>[0] & {
  framework: { state: Parameters<typeof hasStaticSelfRestriction>[0]["state"] };
  cards: { getDefinition: (id: string) => unknown };
};

/**
 * If `cardId` has an active SELF static restriction that matches and carries a
 * bypass cost, deduct the bypass ink from `playerId`. Returns true when ink was
 * spent. Mirrors the pattern duplicated across challenge.ts and quest.ts where
 * the validator confirmed a bypass is available and the executor must pay it.
 *
 * Pre-conditions: caller already validated the restriction is bypassable and
 * the player has enough ink — this helper does NOT re-check available ink.
 */
export function applyStaticRestrictionBypass(
  ctx: Ctx,
  params: {
    cardId: CardInstanceId;
    restriction: string;
    playerId: PlayerId;
    getCardWillpowerByInstanceId?: (id: CardInstanceId) => number;
  },
): boolean {
  const getDefinitionByInstanceId = (id: CardInstanceId) =>
    ctx.cards.getDefinition(id) as LorcanaCard | undefined;

  const bypass = getStaticSelfRestrictionBypass({
    state: ctx.framework.state,
    cardId: params.cardId,
    restriction: params.restriction,
    getDefinitionByInstanceId,
  });
  if (!bypass) {
    return false;
  }

  const restricted = hasStaticSelfRestriction({
    state: ctx.framework.state,
    cardId: params.cardId,
    restriction: params.restriction,
    getDefinitionByInstanceId,
    getCardWillpowerByInstanceId: params.getCardWillpowerByInstanceId,
  });
  if (!restricted) {
    return false;
  }

  spendInk(ctx, params.playerId, bypass.cost.ink);
  return true;
}

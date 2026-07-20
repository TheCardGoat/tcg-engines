/**
 * Strategic production strategy proven through BotLab paired evaluation.
 *
 * Unlike the value-ranked baseline, this strategy reasons across move
 * families as well as within them:
 *
 * - keep an opening hand only when it contains a Unit costing at most 2;
 * - attach Pilots, use Commands/abilities, and develop the board before
 *   committing attackers;
 * - retain value-ranked combat normally, then prioritize direct attacks once
 *   the opponent reaches two Shields.
 */

import type { GundamBotCandidateFamily } from "./candidate-types.ts";
import { composeStrategy, DEFAULT_FAMILY_PRIORITY, type FamilyPolicy } from "./shared-policies.ts";
import { rankByDamage, rankByStatTotal } from "./value-ranked-strategy.ts";

const mulliganForPlayableUnit: FamilyPolicy<"alterHand"> = (ctx) => {
  const ownId = ctx.parent.playerId as unknown as string;
  const hand = ctx.parent.view.zones.zones[`hand:${ownId}`];
  if (!hand) return ctx.candidates;
  const hasPlayableUnit = hand.cards.some(
    (card) => card.definition?.type === "unit" && (card.definition.cost ?? 99) <= 2,
  );
  const wanted = ctx.candidates.find((candidate) => candidate.wantsRedraw !== hasPlayableUnit);
  return wanted ? [wanted] : ctx.candidates;
};

const rankClosingPressure: FamilyPolicy<"enterBattle"> = (ctx) => {
  const ranked = rankByDamage(ctx);
  const ownId = ctx.parent.playerId as unknown as string;
  const opponentId = ctx.parent.state.ctx.playerIds.find((id) => id !== ownId);
  const shieldCount = opponentId
    ? (ctx.parent.view.zones.zones[`shieldArea:${opponentId}`]?.count ?? Number.POSITIVE_INFINITY)
    : Number.POSITIVE_INFINITY;
  if (shieldCount > 2) return ranked;
  return [...ranked].sort((a, b) => Number(b.target === "direct") - Number(a.target === "direct"));
};

const strategicFamilyPriority: Record<GundamBotCandidateFamily, number> = {
  ...DEFAULT_FAMILY_PRIORITY,
  assignPilot: 1,
  playCommandAsPilot: 2,
  activateAbility: 3,
  playCommand: 4,
  deployUnit: 5,
  deployBase: 6,
  enterBattle: 7,
};

export const strategicStrategy = composeStrategy(
  "strategic",
  {
    alterHand: mulliganForPlayableUnit,
    enterBattle: rankClosingPressure,
    deployUnit: rankByStatTotal,
  },
  { priority: strategicFamilyPriority },
);

export { mulliganForPlayableUnit, rankClosingPressure, strategicFamilyPriority };

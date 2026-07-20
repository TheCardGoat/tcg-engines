/**
 * Paired-evaluation-proven combat strategy.
 *
 * This preserves the promoted `strategic` strategy's mulligan, development,
 * and family priorities, then adds two rules-facing decisions:
 *
 * - attacks use effective stats and prefer favorable Unit combat without
 *   throwing away closing pressure;
 * - Blocker decisions compare the modeled board/Base/Shield loss with and
 *   without redirecting the attack, including First Strike outcomes.
 */

import type { GundamG } from "../gundam/types.ts";
import { getEffectiveStats } from "../gundam/rules/derived-state.ts";

import { composeStrategy, type FamilyPolicy } from "./shared-policies.ts";
import { mulliganForPlayableUnit, strategicFamilyPriority } from "./strategic-strategy.ts";
import { rankByStatTotal } from "./value-ranked-strategy.ts";
import { rankImpactfulCommands, withTempoAwareCommandSequencing } from "./command-strategy.ts";

export interface CombatUnitValue {
  readonly ap: number;
  readonly remainingHp: number;
  readonly cost: number;
  readonly keywords: readonly string[];
  readonly value: number;
}

export interface CombatOutcome {
  readonly attackerDestroyed: boolean;
  readonly defenderDestroyed: boolean;
}

export function combatUnitValue(
  parent: Parameters<FamilyPolicy<"enterBattle">>[0]["parent"],
  cardId: string,
): CombatUnitValue {
  const g = parent.state.G as unknown as GundamG;
  const stats = getEffectiveStats(cardId, g, parent.cards);
  const remainingHp = Math.max(0, stats.hp - (g.damage[cardId] ?? 0));
  const keywordValue =
    Number(stats.keywords.includes("Blocker")) * 2 +
    Number(stats.keywords.includes("FirstStrike")) * 2 +
    Number(stats.keywords.includes("HighManeuver")) * 2 +
    Number(stats.keywords.includes("Repair"));
  return {
    ap: stats.ap,
    remainingHp,
    cost: stats.cost,
    keywords: stats.keywords,
    value: stats.cost * 2 + stats.ap + remainingHp + keywordValue,
  };
}

/** Resolve the simultaneous/First Strike portion of rules 8-5-3 and 13-1-5. */
export function combatOutcome(attacker: CombatUnitValue, defender: CombatUnitValue): CombatOutcome {
  let attackerDestroyed = defender.ap >= attacker.remainingHp;
  let defenderDestroyed = attacker.ap >= defender.remainingHp;
  const attackerFirst = attacker.keywords.includes("FirstStrike");
  const defenderFirst = defender.keywords.includes("FirstStrike");
  if (attackerFirst && !defenderFirst && defenderDestroyed) attackerDestroyed = false;
  if (defenderFirst && !attackerFirst && attackerDestroyed) defenderDestroyed = false;
  return { attackerDestroyed, defenderDestroyed };
}

function directPressureScore(
  parent: Parameters<FamilyPolicy<"enterBattle">>[0]["parent"],
  attacker: CombatUnitValue,
): number {
  const ownId = parent.playerId as unknown as string;
  const opponentId = parent.state.ctx.playerIds.find((id) => id !== ownId);
  if (!opponentId) return 0;
  const shields = parent.view.zones.zones[`shieldArea:${opponentId}`]?.count ?? 0;
  const base = parent.view.zones.zones[`baseSection:${opponentId}`]?.cards[0];
  if (!base) {
    if (shields === 0) return 1_000;
    return 24 + (shields <= 2 ? 12 : 0) + (shields === 1 ? 20 : 0);
  }
  const g = parent.state.G as unknown as GundamG;
  const baseHp = base.definition?.type === "base" ? base.definition.hp : 0;
  const remainingBaseHp = Math.max(0, baseHp - (g.damage[base.instanceId] ?? 0));
  return 20 + Math.min(attacker.ap, remainingBaseHp) + (attacker.ap >= remainingBaseHp ? 30 : 0);
}

/** Rank effective-stat kills and favorable trades without losing direct pressure. */
export const rankEffectiveCombat: FamilyPolicy<"enterBattle"> = (ctx) => {
  return [...ctx.candidates]
    .map((candidate, index) => {
      const attacker = combatUnitValue(ctx.parent, candidate.attackerId);
      if (candidate.target === "direct") {
        return { candidate, index, score: directPressureScore(ctx.parent, attacker) };
      }
      const defender = combatUnitValue(ctx.parent, candidate.target);
      const outcome = combatOutcome(attacker, defender);
      let score = Math.min(attacker.ap, defender.remainingHp);
      if (outcome.defenderDestroyed) score += 20 + defender.value;
      if (outcome.attackerDestroyed) score -= 12 + attacker.value;
      if (outcome.defenderDestroyed && attacker.keywords.includes("Breach")) score += 10;
      if (!outcome.defenderDestroyed && outcome.attackerDestroyed) score -= 40;
      return { candidate, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ candidate }) => candidate);
};

function directLossValue(
  parent: Parameters<FamilyPolicy<"declareBlock">>[0]["parent"],
  attacker: CombatUnitValue,
): number {
  const ownId = parent.playerId as unknown as string;
  const shields = parent.view.zones.zones[`shieldArea:${ownId}`]?.count ?? 0;
  const base = parent.view.zones.zones[`baseSection:${ownId}`]?.cards[0];
  if (!base) {
    if (shields === 0) return 1_000;
    return shields <= 1 ? 24 : shields === 2 ? 10 : 4;
  }
  const g = parent.state.G as unknown as GundamG;
  const baseHp = base.definition?.type === "base" ? base.definition.hp : 0;
  const remainingBaseHp = Math.max(0, baseHp - (g.damage[base.instanceId] ?? 0));
  return Math.min(attacker.ap, remainingBaseHp) + (attacker.ap >= remainingBaseHp ? 24 : 0);
}

/**
 * Decline blocks whose modeled loss is not better than taking the attack, and
 * rank accepted blocks by improvement, survival, then lower Unit value.
 */
export const selectConservativeBlock: FamilyPolicy<"declareBlock"> = (ctx) => {
  const g = ctx.parent.state.G as unknown as GundamG;
  const combat = g.turnMetadata.pendingCombat;
  if (!combat) return [];
  const attacker = combatUnitValue(ctx.parent, combat.attackerId);
  if (attacker.keywords.includes("HighManeuver")) return [];

  let unblockedDefenderLoss = 0;
  let unblockedAttackerLoss = 0;
  if (combat.target === "direct") {
    unblockedDefenderLoss = directLossValue(ctx.parent, attacker);
  } else {
    const originalTarget = combatUnitValue(ctx.parent, combat.target);
    const unblocked = combatOutcome(attacker, originalTarget);
    if (unblocked.defenderDestroyed) unblockedDefenderLoss = originalTarget.value;
    if (unblocked.attackerDestroyed) unblockedAttackerLoss = attacker.value;
  }
  const unblockedNetLoss = unblockedDefenderLoss - unblockedAttackerLoss;

  return ctx.candidates
    .filter((candidate) => candidate.blockerId !== combat.target)
    .filter((candidate) =>
      getEffectiveStats(candidate.blockerId, g, ctx.parent.cards).keywords.includes("Blocker"),
    )
    .map((candidate, index) => {
      const blocker = combatUnitValue(ctx.parent, candidate.blockerId);
      const blocked = combatOutcome(attacker, blocker);
      const blockedNetLoss =
        (blocked.defenderDestroyed ? blocker.value : 0) -
        (blocked.attackerDestroyed ? attacker.value : 0);
      return {
        candidate,
        index,
        improvement: unblockedNetLoss - blockedNetLoss,
        survivor: Number(!blocked.defenderDestroyed),
        blockerValue: blocker.value,
      };
    })
    .filter(({ improvement }) => improvement > 0)
    .sort(
      (a, b) =>
        b.improvement - a.improvement ||
        b.survivor - a.survivor ||
        a.blockerValue - b.blockerValue ||
        a.index - b.index,
    )
    .map(({ candidate }) => candidate);
};

const combatAwareBaseStrategy = composeStrategy(
  "combat-aware-base",
  {
    alterHand: mulliganForPlayableUnit,
    enterBattle: rankEffectiveCombat,
    declareBlock: selectConservativeBlock,
    deployUnit: rankByStatTotal,
    playCommand: rankImpactfulCommands,
  },
  { priority: strategicFamilyPriority },
);

export const combatAwareStrategy = withTempoAwareCommandSequencing(
  "combat-aware",
  combatAwareBaseStrategy,
);

import type { GundamG } from "../../../types.ts";
import { getEffectiveStats, hasKeyword, isDefeated } from "../../../rules/derived-state.ts";
import { handleUnitDefeated } from "../../../effects/handlers/combat.ts";
import type { BattleEffCtx } from "./types.ts";
import { hasDamagePreventionFor } from "./damage-prevention.ts";
import { applyBattleDamage } from "./apply-damage.ts";

export function resolveBlockedBattle(
  g: GundamG,
  attackerId: string,
  attackerPlayerId: string,
  blockerId: string,
  blockerPlayerId: string,
  ctx: BattleEffCtx,
): void {
  const attackerStats = getEffectiveStats(attackerId, g, ctx.framework.cards, ctx.framework);
  const blockerStats = getEffectiveStats(blockerId, g, ctx.framework.cards, ctx.framework);
  const attackerFirstStrike = hasKeyword(attackerId, "FirstStrike", g, ctx.framework.cards);
  const blockerFirstStrike = hasKeyword(blockerId, "FirstStrike", g, ctx.framework.cards);
  const attackerDamagePrevented = hasDamagePreventionFor(attackerId, blockerId, g, ctx.framework);
  const blockerDamagePrevented = hasDamagePreventionFor(blockerId, attackerId, g, ctx.framework);

  const blockerCtx: BattleEffCtx = {
    ...ctx,
    sourcePlayerId: blockerPlayerId,
    sourceCardId: blockerId,
  };

  if (attackerFirstStrike && !blockerFirstStrike) {
    if (!blockerDamagePrevented) {
      applyBattleDamage(g, ctx.framework, blockerId, attackerStats.ap, attackerId);
    }

    if (isDefeated(blockerId, g, ctx.framework.cards)) {
      handleUnitDefeated(blockerId, ctx);
      return;
    }

    if (!attackerDamagePrevented) {
      applyBattleDamage(g, ctx.framework, attackerId, blockerStats.ap, blockerId);
    }

    if (isDefeated(attackerId, g, ctx.framework.cards)) {
      handleUnitDefeated(attackerId, blockerCtx);
    }
    return;
  }

  if (blockerFirstStrike && !attackerFirstStrike) {
    if (!attackerDamagePrevented) {
      applyBattleDamage(g, ctx.framework, attackerId, blockerStats.ap, blockerId);
    }

    if (isDefeated(attackerId, g, ctx.framework.cards)) {
      handleUnitDefeated(attackerId, blockerCtx);
      return;
    }

    if (!blockerDamagePrevented) {
      applyBattleDamage(g, ctx.framework, blockerId, attackerStats.ap, attackerId);
    }

    if (isDefeated(blockerId, g, ctx.framework.cards)) {
      handleUnitDefeated(blockerId, ctx);
    }
    return;
  }

  if (!attackerDamagePrevented) {
    applyBattleDamage(g, ctx.framework, attackerId, blockerStats.ap, blockerId);
  }
  if (!blockerDamagePrevented) {
    applyBattleDamage(g, ctx.framework, blockerId, attackerStats.ap, attackerId);
  }

  if (isDefeated(attackerId, g, ctx.framework.cards)) {
    handleUnitDefeated(attackerId, blockerCtx);
  }
  if (isDefeated(blockerId, g, ctx.framework.cards)) {
    handleUnitDefeated(blockerId, ctx);
  }
}

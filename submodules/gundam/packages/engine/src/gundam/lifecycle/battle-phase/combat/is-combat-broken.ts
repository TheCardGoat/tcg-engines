import type { GundamG } from "../../../types.ts";
import type { FrameworkReadAPI } from "../../../../types/move-types.ts";

/**
 * Whether the pending combat has been "broken" — i.e. the attacker or
 * the attack target has been destroyed or otherwise moved out of the
 * battle area since it was declared.
 *
 * Implements the interrupt rule shared by 8-2-4 / 8-3-5 / 8-4-2: if
 * either unit leaves the battle area mid-step, skip the remaining steps
 * and go straight to the battle end step.
 *
 * A direct attack (target === "direct") can still be broken by the
 * attacker leaving the battle area; the target "player" cannot itself
 * move, so is not checked.
 */
export function isCombatBroken(g: GundamG, framework: FrameworkReadAPI): boolean {
  const combat = g.turnMetadata.pendingCombat;
  if (!combat) return true;

  if (!isInBattleArea(combat.attackerId, framework)) return true;

  if (combat.target !== "direct") {
    if (!isInBattleArea(combat.target, framework)) return true;
  }

  return false;
}

function isInBattleArea(cardId: string, framework: FrameworkReadAPI): boolean {
  const card = framework.cards.get(cardId);
  if (!card) return false;
  return card.zoneId.split(":")[0] === "battleArea";
}

import type { Card } from "@tcg/gundam-types";
import type { GundamG } from "../../../types.ts";
import type { FrameworkWriteAPI } from "../../../../types/move-types.ts";
import { emitGundamEvent } from "../../../events.ts";
import { logCombatDamage } from "../../../logging.ts";
import {
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../../effects/pending-effects.ts";
import { applyDamageReduction } from "./damage-prevention.ts";

/**
 * Apply battle damage to a card. Centralizes the rule-5-5-5 guard so
 * zero damage is never written, never emits DAMAGE_DEALT, and never logs.
 *
 * Returns true if damage was actually applied (amount > 0). Callers
 * MAY use the return value to short-circuit a subsequent `isDefeated`
 * check; callers that already check `isDefeated` unconditionally
 * (e.g. blocked-combat resolution) can ignore it — `isDefeated` is
 * itself a no-op when damage is unchanged.
 */
export function applyBattleDamage(
  g: GundamG,
  framework: FrameworkWriteAPI,
  cardId: string,
  amount: number,
  sourceCardId: string,
): boolean {
  const redirectedCardId = resolveBattleDamageRedirect(g, cardId);
  if (redirectedCardId && redirectedCardId !== cardId) {
    cardId = redirectedCardId;
  }
  amount = applyDamageReduction(cardId, sourceCardId, amount, g, framework, "battle");
  if (amount <= 0) return false;
  g.damage[cardId] = (g.damage[cardId] ?? 0) + amount;
  emitGundamEvent(framework.events, {
    kind: "DAMAGE_DEALT",
    payload: { cardId, amount, sourceCardId },
  });
  logCombatDamage(framework, { cardId, amount, sourceCardId });

  const ownerId = framework.cards.getOwner(cardId);
  const sourceOwnerId = framework.cards.getOwner(sourceCardId);
  const targetDef = framework.cards.getDefinition(cardId) as Card | undefined;
  const sourceDef = framework.cards.getDefinition(sourceCardId) as Card | undefined;
  if (ownerId) {
    const event = {
      type: "battleDamageReceived" as const,
      cardId,
      playerId: ownerId,
      ownerId,
      amount,
      sourceCardId,
      damagedBy: sourceOwnerId,
    };
    enqueueOwnCardTriggers(g, event, cardId, ownerId, framework);
    enqueueObserverTriggers(g, event, framework, cardId);
  }

  if (sourceOwnerId && targetDef?.type === "unit" && sourceDef?.type === "unit") {
    const event = {
      type: "battleDamageDealtToUnit" as const,
      cardId,
      ownerId: sourceOwnerId,
      playerId: sourceOwnerId,
      amount,
      sourceCardId,
      damagedPlayerId: ownerId,
    };
    enqueueOwnCardTriggers(g, event, sourceCardId, sourceOwnerId, framework);
    enqueueObserverTriggers(g, event, framework, sourceCardId);
  }

  return true;
}

function resolveBattleDamageRedirect(g: GundamG, cardId: string): string | undefined {
  const effect = g.continuousEffects.find(
    (entry) => entry.targetId === cardId && entry.payload.kind === "battle-damage-redirect",
  );
  return effect?.payload.kind === "battle-damage-redirect"
    ? effect.payload.redirectToId
    : undefined;
}

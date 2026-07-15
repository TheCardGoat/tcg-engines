import type { CardInstanceId, PlayerId } from "#core";
import { recordDamagedCharacterThisTurn } from "../runtime-moves/state/turn-metrics";
import {
  emitTriggeredLorcanaEvent,
  snapshotTriggeredCandidatesForCard,
} from "../runtime-moves/effects/triggered-abilities";

type DamageCtx = Parameters<typeof recordDamagedCharacterThisTurn>[0] &
  Parameters<typeof emitTriggeredLorcanaEvent>[0] &
  Parameters<typeof snapshotTriggeredCandidatesForCard>[0] & {
    cards: {
      require: (id: CardInstanceId) => { meta?: Record<string, unknown> };
      patchMeta: (id: CardInstanceId, patch: Record<string, unknown>) => void;
    };
  };

/**
 * Applies challenge combat damage to one of the two combatants and emits the
 * standard triplet of events (`damageDealt`, `damage` on target, `deal-damage`
 * on source). Mirrors the original inline blocks in challenge.ts so that
 * attacker→defender and defender→attacker damage are produced identically.
 *
 * No-op when `amount <= 0`.
 */
export function applyChallengeDamage(
  ctx: DamageCtx,
  params: {
    targetId: CardInstanceId;
    sourceId: CardInstanceId;
    amount: number;
    attackerId: CardInstanceId;
    defenderId: CardInstanceId;
    targetOwnerId: PlayerId;
    sourceOwnerId: PlayerId;
  },
): { applied: boolean; nextDamage: number } {
  const { targetId, sourceId, amount, attackerId, defenderId, targetOwnerId, sourceOwnerId } =
    params;
  const currentDamage = Number(ctx.cards.require(targetId).meta?.damage ?? 0);
  const nextDamage = currentDamage + amount;

  if (amount <= 0) {
    return { applied: false, nextDamage: currentDamage };
  }

  // Snapshot trigger candidates from the source and target BEFORE recording
  // the events. Challenge damage is followed by a lethal-banish step that may
  // remove either combatant from play; if events are processed after that
  // step, live-board lookup loses the banished card's triggers entirely.
  // Mirrors the existing `attackerBanishInChallengeCandidates` /
  // `defenderBanishInChallengeCandidates` snapshots in challenge.ts. Without
  // these, "deal-damage" / "damage" triggers on a card that dies in the same
  // challenge silently drop — see Mulan, Elite Archer's TRIPLE SHOT (player
  // report 2026-05-06: "The Mulan Elite Archer trigger has not been happening
  // when she dies in a challenge.").
  const sourceTriggerCandidates = snapshotTriggeredCandidatesForCard(ctx, sourceId);
  const targetTriggerCandidates = snapshotTriggeredCandidatesForCard(ctx, targetId);

  ctx.cards.patchMeta(targetId, { damage: nextDamage });
  recordDamagedCharacterThisTurn(ctx, targetId);
  emitTriggeredLorcanaEvent(
    ctx,
    "damageDealt",
    {
      targetId,
      amount,
      newDamage: nextDamage,
      sourceId,
      damageType: "combat",
    },
    [
      {
        event: "damage",
        subjectCardId: targetId,
        triggerSourceCardId: sourceId,
        playerId: targetOwnerId,
        attackerId,
        defenderId,
        happenedInChallenge: true,
        triggerCandidates: targetTriggerCandidates,
        eventSnapshot: {
          triggerAmount: amount,
          damageDealt: amount,
        },
      },
      {
        event: "deal-damage",
        subjectCardId: sourceId,
        triggerSourceCardId: sourceId,
        playerId: sourceOwnerId,
        attackerId,
        defenderId,
        happenedInChallenge: true,
        triggerCandidates: sourceTriggerCandidates,
        eventSnapshot: {
          triggerAmount: amount,
          damageDealt: amount,
        },
      },
    ],
  );

  return { applied: true, nextDamage };
}

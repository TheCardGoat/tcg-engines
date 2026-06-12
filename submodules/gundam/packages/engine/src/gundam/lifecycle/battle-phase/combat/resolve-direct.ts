import type { GundamG } from "../../../types.ts";
import { getEffectiveStats, hasKeyword, isDefeated } from "../../../rules/derived-state.ts";
import { emitGundamEvent } from "../../../events.ts";
import { logShieldRemoved, logUnitDefeated } from "../../../logging.ts";
import { handleUnitDefeated } from "../../../effects/handlers/combat.ts";
import {
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../../effects/pending-effects.ts";
import type { BattleEffCtx } from "./types.ts";
import { hasDamagePreventionFor, hasZoneDamagePreventionFor } from "./damage-prevention.ts";
import { applyBattleDamage } from "./apply-damage.ts";

/**
 * Enqueue the `attackerDestroyedDefender` trigger on the *attacker* card
 * after its battle damage destroys the defender. Card text reading
 * "when this Unit destroys an enemy Unit with battle damage, do X"
 * keys on this event (timing string `"onDestroyByBattle"`).
 *
 * Called only from the unit-vs-unit battle-damage paths in this module
 * — i.e. paths where the attacker reduces the defender to 0 HP via AP.
 * Effect-damage destruction (e.g. dealDamage actions) deliberately does
 * NOT fire this event — those don't satisfy the "with battle damage"
 * predicate and would mis-fire cards like Gundam Kyrios (GD03-022).
 */
function enqueueAttackerDestroyedDefenderTrigger(
  g: GundamG,
  attackerId: string,
  defenderId: string,
  attackerPlayerId: string,
  ctx: BattleEffCtx,
): void {
  const event = {
    type: "attackerDestroyedDefender" as const,
    cardId: attackerId,
    sourceCardId: attackerId,
    defeatedCardId: defenderId,
    ownerId: attackerPlayerId,
    playerId: attackerPlayerId,
  };
  enqueueOwnCardTriggers(g, event, attackerId, attackerPlayerId, ctx.framework);
  enqueueObserverTriggers(g, event, ctx.framework, attackerId);
}

function enqueueShieldAreaCardDestroyedByBattleTrigger(
  g: GundamG,
  attackerId: string,
  destroyedCardId: string,
  attackerPlayerId: string,
  defenderPlayerId: string,
  ctx: BattleEffCtx,
): void {
  const event = {
    type: "shieldAreaCardDestroyedByBattle" as const,
    cardId: attackerId,
    destroyedCardId,
    ownerId: attackerPlayerId,
    playerId: attackerPlayerId,
    defenderPlayerId,
  };
  enqueueOwnCardTriggers(g, event, attackerId, attackerPlayerId, ctx.framework);
  enqueueObserverTriggers(g, event, ctx.framework, attackerId);
}

export function resolveDirectBattle(
  g: GundamG,
  attackerId: string,
  attackerPlayerId: string,
  target: string,
  ctx: BattleEffCtx,
): void {
  const attackerStats = getEffectiveStats(attackerId, g, ctx.framework.cards, ctx.framework);

  if (target === "direct") {
    const defenderPlayerId = Object.keys(g.players).find((id) => id !== attackerPlayerId);
    if (defenderPlayerId) {
      emitGundamEvent(ctx.framework.events, {
        kind: "DIRECT_ATTACK",
        payload: { attackerId, attackerPlayerId },
      });

      const baseCards = ctx.framework.zones.getCards({
        zone: "baseSection",
        playerId: defenderPlayerId,
      });

      if (baseCards.length > 0) {
        const baseId = baseCards[0]!;

        if (
          hasZoneDamagePreventionFor(
            "baseSection",
            defenderPlayerId,
            attackerId,
            g,
            ctx.framework,
          ) ||
          hasDamagePreventionFor(baseId, attackerId, g, ctx.framework, "battle")
        ) {
          return;
        }

        // Rule 5-5-5: 0 AP deals no damage — no counter, no event, no destroy check.
        if (!applyBattleDamage(g, ctx.framework, baseId, attackerStats.ap, attackerId)) return;

        const baseStats = getEffectiveStats(baseId, g, ctx.framework.cards, ctx.framework);
        if (g.damage[baseId]! >= baseStats.hp) {
          enqueueOwnCardTriggers(
            g,
            {
              type: "unitDestroyed",
              cardId: baseId,
              ownerId: defenderPlayerId,
              destroyedBy: attackerPlayerId,
            },
            baseId,
            defenderPlayerId,
            ctx.framework,
          );

          ctx.framework.zones.moveCard(baseId, { zone: "trash", playerId: defenderPlayerId });
          delete g.damage[baseId];
          delete g.exhausted[baseId];
          enqueueShieldAreaCardDestroyedByBattleTrigger(
            g,
            attackerId,
            baseId,
            attackerPlayerId,
            defenderPlayerId,
            ctx,
          );

          emitGundamEvent(ctx.framework.events, {
            kind: "UNIT_DEFEATED",
            payload: { cardId: baseId, ownerId: defenderPlayerId, defeatedBy: attackerPlayerId },
          });
          logUnitDefeated(ctx.framework, {
            cardId: baseId,
            ownerId: defenderPlayerId,
            defeatedBy: attackerPlayerId,
          });
        }
      } else {
        const shieldsBefore = ctx.framework.zones.getCards({
          zone: "shieldArea",
          playerId: defenderPlayerId,
        });

        // Rule 8-5-2-2: no base, no shields → defending player loses.
        // Suppression does NOT trigger this on the second iteration of a
        // 1-shield defender (rule 13-1-7-3); the check must reflect the
        // state BEFORE any removal, not mid-loop.
        if (shieldsBefore.length === 0) {
          ctx.framework.events.endGame({
            winner: attackerPlayerId,
            reason: `${defenderPlayerId} has no shields remaining`,
          });
          return;
        }

        if (
          hasZoneDamagePreventionFor("shieldArea", defenderPlayerId, attackerId, g, ctx.framework)
        ) {
          return;
        }

        // Rule 13-1-7-1..3: Suppression attempts to damage the first two
        // shields. If only one exists, only that one is affected.
        const requested = hasKeyword(attackerId, "Suppression", g, ctx.framework.cards) ? 2 : 1;
        const toRemove = shieldsBefore.slice(0, Math.min(requested, shieldsBefore.length));

        // Rule 13-1-7-4: shields destroyed by Suppression are revealed
        // simultaneously. Move them together first, then enqueue every
        // Burst trigger onto g.pendingEffects so the drain resolves them
        // in tier-0 order. Defender-chosen Burst ordering (within-tier
        // player choice) is still deferred to PR F.
        for (const shieldId of toRemove) {
          ctx.framework.zones.moveCard(shieldId, { zone: "trash", playerId: defenderPlayerId });
          enqueueShieldAreaCardDestroyedByBattleTrigger(
            g,
            attackerId,
            shieldId,
            attackerPlayerId,
            defenderPlayerId,
            ctx,
          );
          emitGundamEvent(ctx.framework.events, {
            kind: "SHIELD_REMOVED",
            payload: { cardId: shieldId, playerId: defenderPlayerId },
          });
          logShieldRemoved(ctx.framework, {
            cardId: shieldId,
            playerId: defenderPlayerId,
            sourceCardId: attackerId,
          });
        }

        for (const shieldId of toRemove) {
          enqueueOwnCardTriggers(
            g,
            {
              type: "shieldDestroyed",
              cardId: shieldId,
              playerId: defenderPlayerId,
              destroyedBy: attackerPlayerId,
            },
            shieldId,
            defenderPlayerId,
            ctx.framework,
          );
        }
      }
    }
  } else {
    const defenderOwnerId = ctx.framework.cards.getOwner(target) as string | undefined;
    if (!defenderOwnerId) return;

    const targetStats = getEffectiveStats(target, g, ctx.framework.cards, ctx.framework);

    if (hasDamagePreventionFor(target, attackerId, g, ctx.framework)) {
      if (!hasDamagePreventionFor(attackerId, target, g, ctx.framework)) {
        if (
          applyBattleDamage(g, ctx.framework, attackerId, targetStats.ap, target) &&
          isDefeated(attackerId, g, ctx.framework.cards)
        ) {
          const blockerCtx: BattleEffCtx = {
            ...ctx,
            sourcePlayerId: defenderOwnerId,
            sourceCardId: target,
          };
          handleUnitDefeated(attackerId, blockerCtx);
        }
      }
      return;
    }

    if (hasDamagePreventionFor(attackerId, target, g, ctx.framework)) {
      if (
        applyBattleDamage(g, ctx.framework, target, attackerStats.ap, attackerId) &&
        isDefeated(target, g, ctx.framework.cards)
      ) {
        handleUnitDefeated(target, ctx);
        enqueueAttackerDestroyedDefenderTrigger(g, attackerId, target, attackerPlayerId, ctx);
      }
      return;
    }

    // Rule 13-1-5-2: with no damage prevention on either side, <First Strike>
    // changes damage timing. The unit with First Strike deals damage first,
    // and if the opposing unit is destroyed, it deals no counter-damage.
    const attackerFirstStrike = hasKeyword(attackerId, "FirstStrike", g, ctx.framework.cards);
    const targetFirstStrike = hasKeyword(target, "FirstStrike", g, ctx.framework.cards);

    const targetDefeatCtx: BattleEffCtx = {
      ...ctx,
      sourcePlayerId: defenderOwnerId,
      sourceCardId: target,
    };

    if (attackerFirstStrike && !targetFirstStrike) {
      if (
        applyBattleDamage(g, ctx.framework, target, attackerStats.ap, attackerId) &&
        isDefeated(target, g, ctx.framework.cards)
      ) {
        handleUnitDefeated(target, ctx);
        enqueueAttackerDestroyedDefenderTrigger(g, attackerId, target, attackerPlayerId, ctx);
        return;
      }
      if (
        applyBattleDamage(g, ctx.framework, attackerId, targetStats.ap, target) &&
        isDefeated(attackerId, g, ctx.framework.cards)
      ) {
        handleUnitDefeated(attackerId, targetDefeatCtx);
      }
      return;
    }

    if (targetFirstStrike && !attackerFirstStrike) {
      if (
        applyBattleDamage(g, ctx.framework, attackerId, targetStats.ap, target) &&
        isDefeated(attackerId, g, ctx.framework.cards)
      ) {
        handleUnitDefeated(attackerId, targetDefeatCtx);
        return;
      }
      if (
        applyBattleDamage(g, ctx.framework, target, attackerStats.ap, attackerId) &&
        isDefeated(target, g, ctx.framework.cards)
      ) {
        handleUnitDefeated(target, ctx);
        enqueueAttackerDestroyedDefenderTrigger(g, attackerId, target, attackerPlayerId, ctx);
      }
      return;
    }

    // Default (both FS or neither FS): simultaneous mutual damage.
    applyBattleDamage(g, ctx.framework, target, attackerStats.ap, attackerId);
    applyBattleDamage(g, ctx.framework, attackerId, targetStats.ap, target);

    const attackerDefeated = isDefeated(attackerId, g, ctx.framework.cards);
    const targetDefeated = isDefeated(target, g, ctx.framework.cards);

    if (attackerDefeated) {
      handleUnitDefeated(attackerId, targetDefeatCtx);
    }
    if (targetDefeated) {
      handleUnitDefeated(target, ctx);
      // Fire `attackerDestroyedDefender` only when the attacker survives —
      // a mutual-defeat scenario means the attacker isn't around to fire
      // its trigger (rule 10-1-6-7: a card off the field can't activate
      // its on-field triggers).
      if (!attackerDefeated) {
        enqueueAttackerDestroyedDefenderTrigger(g, attackerId, target, attackerPlayerId, ctx);
      }
    }
  }
}

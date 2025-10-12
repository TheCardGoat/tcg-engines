import { createMove, createZoneId } from "@tcg/core";
import { useLorcanaOps } from "../../../operations";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";
import {
  and,
  canChallenge,
  cardInPlay,
  isMainPhase,
} from "../../../validators";

/**
 * Challenge Move
 *
 * Rule 4.3.6: Attack another character or location
 *
 * Requirements:
 * - Attacker is ready (not exerted)
 * - Attacker is not drying (summoning sickness)
 * - Defender is in play
 *
 * Effects:
 * - Exert attacker
 * - Deal damage to both characters based on Strength
 * - Check for banishing (damage >= Willpower)
 */
export const challenge = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "challenge",
  LorcanaCardMeta
>({
  condition: and(
    isMainPhase(),
    (state, context) => canChallenge(context.params.attackerId)(state, context),
    (state, context) => cardInPlay(context.params.defenderId)(state, context),
  ),
  reducer: (_draft, context) => {
    const { attackerId, defenderId } = context.params;
    const ops = useLorcanaOps(context);

    // Get card definitions to access Strength values
    const attackerCard = context.registry?.getCard(attackerId);
    const defenderCard = context.registry?.getCard(defenderId);

    if (!(attackerCard && defenderCard)) {
      throw new Error("Card not found in registry");
    }

    // Exert attacker
    ops.exertCard(attackerId);

    // Deal damage based on Strength
    const attackerStrength = attackerCard.strength ?? 0;
    const defenderStrength = defenderCard.strength ?? 0;

    const attackerNewDamage = ops.addDamage(attackerId, defenderStrength);
    const defenderNewDamage = ops.addDamage(defenderId, attackerStrength);

    // Check if characters should be banished (damage >= Willpower)
    const attackerWillpower = attackerCard.willpower ?? 0;
    const defenderWillpower = defenderCard.willpower ?? 0;

    if (attackerNewDamage >= attackerWillpower) {
      context.zones.moveCard({
        cardId: attackerId,
        targetZoneId: createZoneId("discard"),
      });
    }

    if (defenderNewDamage >= defenderWillpower) {
      context.zones.moveCard({
        cardId: defenderId,
        targetZoneId: createZoneId("discard"),
      });
    }
  },
});

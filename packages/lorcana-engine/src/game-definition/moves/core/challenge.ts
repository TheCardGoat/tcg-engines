import { createMove } from "@tcg/core";
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

    // Exert attacker
    ops.exertCard(attackerId);

    // Deal damage (simplified - assume 1 damage)
    // In full implementation, would calculate based on Strength
    ops.addDamage(attackerId, 1);
    ops.addDamage(defenderId, 1);

    // TODO: Check if characters should be banished (damage >= Willpower)
    // TODO: Add to bag for triggered effects
  },
});

/**
 * Field-wide 【Deploy】 Trigger Scanner (rule 10-1-6-1)
 *
 * When a unit is deployed, every card already in play may have a triggered
 * effect with 【Deploy】 timing that observes the event. This module scans
 * all in-play cards (both players' battleAreas) and fires any matching
 * triggered effects.
 *
 * The deployed card's own 【Deploy】 effects are intentionally skipped here —
 * those are already fired by the deploying move before calling this function.
 */

import type { Card, CardEffect } from "@tcg/gundam-types";
import type { FrameworkWriteAPI } from "../../types/move-types.ts";
import type { GundamG } from "../types.ts";
import { executeCardEffect, type EffectExecutionContext } from "./executor.ts";

/**
 * Fire 【Deploy】 triggered effects on all in-play cards that observe the
 * deployment of `deployedCardId` (rule 10-1-6-1).
 *
 * Skips the deployed card itself — its own effects are handled by the caller.
 *
 * @param deployedCardId - instance ID of the unit that was just deployed
 * @param deployedByPlayerId - player who performed the deployment
 * @param G - mutable game state
 * @param framework - framework write API
 */
export function fireFieldDeployTriggers(
  deployedCardId: string,
  deployedByPlayerId: string,
  G: GundamG,
  framework: FrameworkWriteAPI,
): void {
  const allPlayerIds = Object.keys(G.players);

  for (const ownerId of allPlayerIds) {
    const zones = [
      ...framework.zones.getCards({ zone: "battleArea", playerId: ownerId }),
      ...framework.zones.getCards({ zone: "baseSection", playerId: ownerId }),
    ];

    for (const observerCardId of zones) {
      // Skip the card that was just deployed — its own effects fire in the caller
      if (observerCardId === deployedCardId) continue;

      const def = framework.cards.getDefinition(observerCardId) as Card | undefined;
      if (!def?.effects?.length) continue;

      for (const effect of def.effects as CardEffect[]) {
        if (
          effect.type !== "triggered" ||
          !((effect.activation.timing ?? []) as string[]).includes("deploy")
        ) {
          continue;
        }

        // triggerContext is set for future DSL wiring — not yet consumed by
        // TargetResolutionContext. See EffectExecutionContext.triggerContext note.
        const effCtx: EffectExecutionContext = {
          G,
          sourcePlayerId: ownerId,
          sourceCardId: observerCardId,
          framework,
          triggerContext: {
            kind: "unitDeployed",
            deployedCardId,
            deployedByPlayerId,
          },
        };

        executeCardEffect(effect as CardEffect, effCtx);
      }
    }
  }
}

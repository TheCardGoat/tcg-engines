import type { LayerItem } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { LorcanaCoreOperations } from "~/game-engine/engines/lorcana/src/operations/lorcana-core-operations";
import { logger } from "~/shared/logger";

export function resolveTrigger(
  this: LorcanaCoreOperations,
  trigger: LayerItem,
) {
  if (!trigger.ability?.effects || trigger.ability.effects.length === 0) {
    logger.warn("DEBUG: Trigger has no effects, skipping resolution");
    return;
  }

  // Process each effect in the ability
  for (const effect of trigger.ability.effects) {
    switch (effect.type) {
      case "gainLore": {
        const playerId = trigger.controllerId;
        const amount = effect.parameters?.amount || 1;
        this.addLoreToPlayer(playerId, amount);
        break;
      }
      case "draw": {
        const amount = effect.parameters?.amount || 1;
        const target = effect.parameters?.target;
        // Determine which player should draw the card
        let targetPlayerId = trigger.controllerId;

        if (target?.value === "opponent") {
          // Find the opponent of the controller
          const allPlayers = Object.keys(this.state.ctx.players);
          targetPlayerId =
            allPlayers.find((p) => p !== trigger.controllerId) ||
            trigger.controllerId;
        } else if (target?.value === "self") {
          targetPlayerId = trigger.controllerId;
        }

        logger.log(
          `DEBUG: Player ${targetPlayerId} draws ${amount} card(s) from triggered effect (target: ${target?.value})`,
        );

        this.drawCard(targetPlayerId, amount);

        break;
      }
      case "multiEffect": {
        // Handle abilities with multiple effects
        const effects = effect.parameters?.effects || [];
        for (const nestedEffect of effects) {
          // Process each effect in the multiEffect
          // This is a simplified implementation - in a full implementation,
          // you'd want to handle each effect type properly
          logger.log(
            `DEBUG: Processing multi-effect with ${effects.length} effects`,
          );
          // For now, we'll just log the effects since the specific processing
          // depends on the exact effect types and their implementations
        }
        break;
      }
      // Add other effect types as needed
      default:
        logger.log(`DEBUG: Unhandled trigger effect type: ${effect.type}`);
    }
  }
}

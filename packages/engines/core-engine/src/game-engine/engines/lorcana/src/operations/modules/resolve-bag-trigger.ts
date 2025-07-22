import { resolveTrigger } from "~/game-engine/engines/lorcana/src/abilities/trigger-resolver";
import type { LorcanaCoreOperations } from "~/game-engine/engines/lorcana/src/operations/lorcana-core-operations";

/**
 * Resolve a specific trigger from the bag and execute its effects
 */
export function resolveBagTrigger(
  this: LorcanaCoreOperations,
  id: string,
): void {
  if (!this.state.G.bag || this.state.G.bag.length === 0) {
    return;
  }

  // Find the specific trigger
  const triggerIndex = this.state.G.bag.findIndex((item) => item.id === id);
  if (triggerIndex === -1) {
    return;
  }

  const trigger = this.state.G.bag[triggerIndex];

  // Execute the trigger's effect before removing it
  if (trigger.ability?.effect) {
    switch (trigger.ability.effect.type) {
      case "gainLore": {
        const amount = trigger.ability.effect.parameters?.amount || 1;
        if (this.state.ctx.players[trigger.controllerId]) {
          const playerState = this.state.ctx.players[
            trigger.controllerId
          ] as any;
          if (!playerState.lore) {
            playerState.lore = 0;
          }
          playerState.lore += amount;
        }
        break;
      }
      case "draw": {
        const amount = trigger.ability.effect.parameters?.amount || 1;
        const target = trigger.ability.effect.parameters?.target;

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

        // Draw the card(s) using the core operations
        for (let i = 0; i < amount; i++) {
          this.drawCard(targetPlayerId, 1);
        }
        break;
      }
      // Add other effect types as needed
      default:
        // Silently ignore unhandled effect types in production
        break;
    }
  }

  // Remove the trigger from the bag after executing
  this.state.G.bag.splice(triggerIndex, 1);
}

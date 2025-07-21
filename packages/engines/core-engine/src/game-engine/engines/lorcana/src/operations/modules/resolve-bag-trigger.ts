import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Resolve a specific trigger from the bag and execute its effects
 */
export function resolveBagTrigger(
  this: LorcanaCoreOperations,
  id: string,
): void {
  if (!this.state.G.bag) {
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
          console.log(
            `DEBUG: Player ${trigger.controllerId} gains ${amount} lore from triggered effect (total: ${playerState.lore})`,
          );
        }
        break;
      }
      // Add other effect types as needed
      default:
        console.log(
          `DEBUG: Unhandled trigger effect type: ${trigger.ability.effect.type}`,
        );
    }
  }

  // Remove the trigger from the bag after executing
  this.state.G.bag.splice(triggerIndex, 1);
}

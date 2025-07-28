import type { LorcanaEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { PlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
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

  // Execute the trigger's effects before removing it
  if (trigger.ability?.effects && trigger.ability.effects.length > 0) {
    // Process each effect in the ability
    for (const effect of trigger.ability.effects as LorcanaEffect[]) {
      switch (effect.type) {
        case "gainLore": {
          // Use value property, with fallback to 1 if not provided
          const valueParam = effect.parameters?.value || 1;
          const amount = typeof valueParam === "object" ? 1 : valueParam;
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
          // Use value property, with fallback to 1 if not provided
          const valueParam = effect.parameters?.value || 1;
          const target = effect.parameters?.target;

          // Determine which player should draw the card
          let targetPlayerId = trigger.controllerId;
          if (target && !Array.isArray(target) && target.type === "player") {
            const playerTarget = target as PlayerTarget;
            if (playerTarget.value === "opponent") {
              // Find the opponent of the controller
              const allPlayers = Object.keys(this.state.ctx.players);
              targetPlayerId =
                allPlayers.find((p) => p !== trigger.controllerId) ||
                trigger.controllerId;
            } else if (playerTarget.value === "self") {
              targetPlayerId = trigger.controllerId;
            }
          }

          // Draw the card(s) using the core operations
          const amountValue = typeof valueParam === "object" ? 1 : valueParam;
          for (let i = 0; i < amountValue; i++) {
            this.drawCard(targetPlayerId, 1);
          }
          break;
        }
        case "basicInkwellTrigger": {
          // This is a minimal implementation for inkwell triggers
          // Just log that the trigger was resolved - no actual effect for now
          // This will be expanded when we implement the full bag system
          break;
        }
        // Add other effect types as needed
        default:
          // Silently ignore unhandled effect types in production
          break;
      }
    }
  }

  // Remove the trigger from the bag after executing
  this.state.G.bag.splice(triggerIndex, 1);
}

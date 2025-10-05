import { logger } from "~/game-engine/core-engine/utils";
import type { LayerItem } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { LorcanaEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { CardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { PlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaCard } from "~/game-engine/engines/lorcana/src/cards/lorcana-game-card";
import type { LorcanaCoreOperations } from "~/game-engine/engines/lorcana/src/operations/lorcana-core-operations";

/**
 * Resolve a specific trigger from the bag and execute its effects
 */
export function resolveLayerItem(
  this: LorcanaCoreOperations,
  layer: LayerItem,
): void {
  const trigger = layer;

  // Execute the trigger's effects before removing it
  if (trigger.ability?.effects && trigger.ability.effects.length > 0) {
    // Get the source card for targeting
    const sourceCard = this.engine.cardInstanceStore.getCardByInstanceId(
      trigger.sourceCardId,
    );

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
        case "restrict": {
          // Restrict effect (e.g., "can't ready at the start of their next turn")
          const restriction = effect.parameters?.restriction;
          const duration = effect.duration;

          // Get target cards
          let targetCards: any[] = [];

          if ((trigger as any).selectedTargets) {
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets for restrict: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `Auto-resolving targets for restrict. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard);
          }

          logger.debug(
            `Applying ${restriction} restriction to ${targetCards.length} cards`,
            {
              restriction,
              duration: duration?.type,
              targetCardNames: targetCards.map((c) => c?.name || "unknown"),
            },
          );

          // Apply restriction to each target
          for (const targetCard of targetCards) {
            if (!this.state.ctx.cardMetas[targetCard.instanceId]) {
              this.state.ctx.cardMetas[targetCard.instanceId] = {} as any;
            }

            const cardMeta = this.state.ctx.cardMetas[
              targetCard.instanceId
            ] as any;

            // Initialize restrictions if they don't exist
            if (!cardMeta.restrictions) {
              cardMeta.restrictions = [];
            }

            // Add the restriction
            cardMeta.restrictions.push({
              type: restriction,
              duration,
              appliedTurn: this.state.G.turnCount || 0,
              appliedBy: sourceCard?.instanceId,
            });

            logger.debug(
              `Applied ${restriction} restriction to ${targetCard.name}`,
              {
                restriction,
                duration: duration?.type,
              },
            );
          }
          break;
        }
        case "costReduction": {
          // Cost reduction effect (e.g., "You pay 2 {I} less for the next character you play this turn")
          const value = effect.parameters?.value || 0;
          const cardType = effect.parameters?.cardType;
          const count = effect.parameters?.count || 1;
          const duration = effect.duration;

          // Get target players
          let targetPlayerIds: string[] = [trigger.controllerId]; // Default to controller

          if (effect.targets && effect.targets.length > 0) {
            targetPlayerIds = effect.targets
              .map((target: PlayerTarget) => {
                if (target.type === "player") {
                  if (target.value === "self") {
                    return trigger.controllerId;
                  } else if (target.value === "opponent") {
                    const allPlayers = Object.keys(this.state.ctx.players);
                    return allPlayers.find((p) => p !== trigger.controllerId) || trigger.controllerId;
                  }
                }
                return null;
              })
              .filter(Boolean) as string[];
          }

          // Apply cost reduction to each target player
          for (const playerId of targetPlayerIds) {
            const playerState = this.state.ctx.players[playerId] as any;

            // Initialize cost reduction tracking if it doesn't exist
            if (!playerState.costReductions) {
              playerState.costReductions = [];
            }

            // Add the cost reduction
            playerState.costReductions.push({
              value,
              cardType,
              remainingCount: count,
              duration,
              appliedTurn: this.state.G.turnCount || 0,
            });

            logger.debug(
              `Applied cost reduction of ${value} for ${count} ${cardType}(s) to player ${playerId}`,
              {
                duration: duration?.type,
                remainingReductions: playerState.costReductions.length,
              },
            );
          }
          break;
        }
        case "basicInkwellTrigger": {
          // This is a minimal implementation for inkwell triggers
          // Just log that the trigger was resolved - no actual effect for now
          // This will be expanded when we implement the full bag system
          break;
        }
        case "get": {
          // Stat modification effect (e.g., +5 strength this turn)
          const attribute = effect.parameters?.attribute;
          const valueParam = effect.parameters?.value || 0;
          const value = typeof valueParam === "object" ? 0 : valueParam;
          const duration = effect.duration;

          if (!attribute) {
            logger.warn("Get effect missing attribute parameter");
            break;
          }

          // Get target cards - either from selectedTargets (manual selection) or auto-resolve
          let targetCards: any[] = [];

          // Check if targets were manually selected (e.g., via resolveTopOfStack)
          if ((trigger as any).selectedTargets) {
            // Convert instance IDs to card objects
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            // Auto-resolve targets from target definitions
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `About to resolve targets. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard);
          }

          logger.debug(
            `Applying +${value} ${attribute} to ${targetCards.length} cards`,
            {
              duration: duration?.type,
              targetCardNames: targetCards.map((c) => c?.name || "unknown"),
            },
          );

          // Apply stat modification to each target
          for (const targetCard of targetCards) {
            logger.log(`Modifying card instanceId: ${targetCard.instanceId}`);

            // Ensure meta exists in state first
            if (!this.state.ctx.cardMetas[targetCard.instanceId]) {
              this.state.ctx.cardMetas[targetCard.instanceId] = {} as any;
            }

            // Now get the reference to the actual meta object in state
            const cardMeta = this.state.ctx.cardMetas[
              targetCard.instanceId
            ] as any;

            // Initialize modifiers if they don't exist
            if (!cardMeta.modifiers) {
              cardMeta.modifiers = {};
            }
            if (!cardMeta.modifiers[attribute]) {
              cardMeta.modifiers[attribute] = 0;
            }

            // Apply the modification
            cardMeta.modifiers[attribute] += value;
            logger.log(
              `Applied modifier to ${targetCard.instanceId}: ${attribute}=${cardMeta.modifiers[attribute]}`,
            );

            // If there's a duration, we need to track when to remove it
            if (duration) {
              if (!cardMeta.durationalModifiers) {
                cardMeta.durationalModifiers = [];
              }
              cardMeta.durationalModifiers.push({
                attribute,
                value,
                duration,
                appliedTurn: this.state.G.turnCount || 0,
                appliedBy: sourceCard?.instanceId,
              });
            }

            logger.debug(
              `Applied +${value} ${attribute} to ${targetCard.name}`,
              {
                currentValue: cardMeta.modifiers[attribute],
              },
            );
          }
          break;
        }
        case "modal": {
          // Modal effects require player to select a mode first
          const selectedMode = (trigger as any).selectedMode;
          const modes = effect.parameters?.modes || [];

          if (!selectedMode) {
            logger.warn("Modal effect requires selectedMode to be set");
            break;
          }

          // Find the selected mode (modes are 1-indexed in the test)
          const modeIndex = parseInt(selectedMode, 10) - 1;
          const selectedModeData = modes[modeIndex];

          if (!selectedModeData) {
            logger.warn(`Invalid mode index: ${selectedMode}`);
            break;
          }

          logger.debug(
            `Resolving modal effect mode ${selectedMode}: ${selectedModeData.text}`,
          );

          // Process the selected mode's effects directly
          // We don't create a new layer - we just process the effects inline
          for (const modeEffect of selectedModeData.effects) {
            // Process each effect type within the modal
            switch (modeEffect.type) {
              case "removeDamage": {
                // Get targets for this specific effect
                const valueParam = modeEffect.parameters?.value;
                const maxAmount =
                  typeof valueParam === "object" && "max" in valueParam
                    ? valueParam.max
                    : typeof valueParam === "number"
                      ? valueParam
                      : 0;

                let targetCards: any[] = [];

                if ((trigger as any).selectedTargets) {
                  const selectedIds = (trigger as any).selectedTargets;
                  targetCards = selectedIds
                    .map((id: string) =>
                      this.engine.cardInstanceStore.getCardByInstanceId(id),
                    )
                    .filter(Boolean);
                } else {
                  const targetDefs = modeEffect.targets || [];
                  targetCards = this.resolveTargets(targetDefs, sourceCard);
                }

                logger.debug(
                  `Removing up to ${maxAmount} damage from ${targetCards.length} cards`,
                );

                for (const targetCard of targetCards) {
                  if (!this.state.ctx.cardMetas[targetCard.instanceId]) {
                    this.state.ctx.cardMetas[targetCard.instanceId] = {} as any;
                  }

                  const cardMeta = this.state.ctx.cardMetas[
                    targetCard.instanceId
                  ] as any;
                  const currentDamage = cardMeta.damage || 0;
                  const damageToRemove = Math.min(currentDamage, maxAmount);

                  if (damageToRemove > 0) {
                    cardMeta.damage = currentDamage - damageToRemove;
                    logger.debug(
                      `Removed ${damageToRemove} damage from ${targetCard.name}`,
                      {
                        previousDamage: currentDamage,
                        newDamage: cardMeta.damage,
                      },
                    );
                  }
                }
                break;
              }
              // Add more effect types as needed for modal effects
              default:
                logger.warn(`Unhandled effect type in modal: ${modeEffect.type}`);
            }
          }
          break;
        }
        case "removeDamage": {
          // Remove damage effect (e.g., "Remove up to 3 damage from chosen character")
          const valueParam = effect.parameters?.value;
          const maxAmount =
            typeof valueParam === "object" && "max" in valueParam
              ? valueParam.max
              : typeof valueParam === "number"
                ? valueParam
                : 0;

          // Get target cards - either from selectedTargets (manual selection) or auto-resolve
          let targetCards: any[] = [];

          // Check if targets were manually selected
          if ((trigger as any).selectedTargets) {
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets for removeDamage: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            // Auto-resolve targets from target definitions
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `Auto-resolving targets for removeDamage. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard);
          }

          logger.debug(
            `Removing up to ${maxAmount} damage from ${targetCards.length} cards`,
            {
              targetCardNames: targetCards.map((c) => c?.name || "unknown"),
            },
          );

          // Remove damage from each target
          for (const targetCard of targetCards) {
            if (!this.state.ctx.cardMetas[targetCard.instanceId]) {
              this.state.ctx.cardMetas[targetCard.instanceId] = {} as any;
            }

            const cardMeta = this.state.ctx.cardMetas[
              targetCard.instanceId
            ] as any;
            const currentDamage = cardMeta.damage || 0;
            const damageToRemove = Math.min(currentDamage, maxAmount);

            if (damageToRemove > 0) {
              cardMeta.damage = currentDamage - damageToRemove;
              logger.debug(
                `Removed ${damageToRemove} damage from ${targetCard.name}`,
                {
                  previousDamage: currentDamage,
                  newDamage: cardMeta.damage,
                },
              );
            }
          }
          break;
        }
        case "moveCard": {
          // Move card effect (e.g., "Return chosen character to their player's hand")
          const toZone = effect.parameters?.zoneTo || effect.parameters?.to || "hand";
          const fromZone = effect.parameters?.zoneFrom || effect.parameters?.from;

          // Get target cards
          let targetCards: any[] = [];

          if ((trigger as any).selectedTargets) {
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets for moveCard: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `Auto-resolving targets for moveCard. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard);
          }

          logger.debug(
            `Moving ${targetCards.length} card(s) from ${fromZone || "any zone"} to ${toZone}`,
            {
              targetCardNames: targetCards.map((c) => c?.name || "unknown"),
            },
          );

          // Move each target card
          for (const targetCard of targetCards) {
            const currentZone = targetCard.zone;
            const ownerId = targetCard.ownerId;

            // Move the card to the destination zone
            this.moveCard({
              playerId: ownerId,
              instanceId: targetCard.instanceId,
              to: toZone,
            });

            logger.debug(`Moved ${targetCard.name} to ${ownerId}-${toZone}`, {
              from: currentZone,
              to: `${ownerId}-${toZone}`,
            });
          }
          break;
        }
        // Add other effect types as needed
        default:
          // Silently ignore unhandled effect types in production
          if (effect.type) {
            logger.warn(`Unhandled effect type: ${effect.type}`);
          }
          break;
      }
    }
  }
}

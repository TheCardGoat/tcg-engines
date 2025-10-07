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
          let amount = typeof valueParam === "object" ? 1 : valueParam;

          // Handle dynamic values
          if (
            typeof valueParam === "object" &&
            valueParam.type === "targetDamage"
          ) {
            // Get the target damage from the first selected target, or from ability-level targets
            let targetCard: any = null;

            if (
              (trigger as any).selectedTargets &&
              (trigger as any).selectedTargets.length > 0
            ) {
              const targetId = (trigger as any).selectedTargets[0];
              targetCard =
                this.engine.cardInstanceStore.getCardByInstanceId(targetId);
            } else if (
              trigger.ability?.targets &&
              trigger.ability.targets.length > 0
            ) {
              // Use ability-level targets
              const abilityTargets = trigger.ability.targets;
              const resolvedTargets = this.resolveTargets(
                abilityTargets,
                sourceCard as any,
              );
              if (resolvedTargets.length > 0) {
                targetCard = resolvedTargets[0];
              }
            }

            if (targetCard) {
              amount = this.getCardMeta(targetCard.instanceId).damage || 0;
              logger.debug(
                `Resolved targetDamage dynamic value: ${amount} from ${targetCard.name}`,
              );
            }
          } else if (
            typeof valueParam === "object" &&
            valueParam.type === "singerCount"
          ) {
            // Get the singer count from the source card's meta
            if (sourceCard) {
              amount = this.getCardMeta(sourceCard.instanceId).singerCount || 0;
              logger.debug(
                `Resolved singerCount dynamic value: ${amount} from ${sourceCard.name}`,
              );
            }
          }

          if (this.state.ctx.players[trigger.controllerId]) {
            const playerState = this.state.ctx.players[
              trigger.controllerId
            ] as any;
            if (!playerState.lore) {
              playerState.lore = 0;
            }
            playerState.lore += amount;
            logger.debug(
              `Player ${trigger.controllerId} gained ${amount} lore, total: ${playerState.lore}`,
            );
          }

          // Process followedBy effect if present
          if (effect.followedBy) {
            logger.debug(
              `Processing followedBy effect: ${effect.followedBy.type}`,
            );
            // Process the followedBy effect inline
            const followedByEffect = effect.followedBy;
            switch (followedByEffect.type) {
              case "banish": {
                // Banish effect (e.g., "Banish chosen character")
                const optional = followedByEffect.optional;

                // Get target cards - use the same selected targets as the main effect
                let targetCards: any[] = [];

                if ((trigger as any).selectedTargets) {
                  const selectedIds = (trigger as any).selectedTargets;
                  logger.debug(
                    `Using manually selected targets for followedBy banish: ${selectedIds.join(", ")}`,
                  );
                  targetCards = selectedIds
                    .map((id: string) =>
                      this.engine.cardInstanceStore.getCardByInstanceId(id),
                    )
                    .filter(Boolean);
                } else {
                  const targetDefs =
                    followedByEffect.targets || trigger.ability?.targets || [];
                  logger.debug(
                    `Auto-resolving targets for followedBy banish. targetDefs count: ${targetDefs.length}`,
                  );
                  targetCards = this.resolveTargets(
                    targetDefs,
                    sourceCard as any,
                  );
                }

                logger.debug(
                  `Banishing ${targetCards.length} cards (followedBy)`,
                  {
                    targetCardNames: targetCards.map(
                      (c) => c?.name || "unknown",
                    ),
                  },
                );

                // Banish each target card (move to discard)
                for (const targetCard of targetCards) {
                  const currentZone = targetCard.zone;
                  const ownerId = targetCard.ownerId;

                  // Move the card to discard
                  this.moveCard({
                    playerId: ownerId,
                    instanceId: targetCard.instanceId,
                    to: "discard",
                  });

                  logger.debug(
                    `Banished ${targetCard.name} to discard (followedBy)`,
                    {
                      from: currentZone,
                      to: `${ownerId}-discard`,
                    },
                  );
                }
                break;
              }
              default:
                logger.warn(
                  `Unhandled followedBy effect type: ${followedByEffect.type}`,
                );
            }
          }
          break;
        }
        case "draw": {
          // Use value property, with fallback to 1 if not provided
          const valueParam = effect.parameters?.value || 1;

          // Check both effect.targets and effect.parameters.target
          const targets =
            effect.targets ||
            (effect.parameters?.target ? [effect.parameters.target] : []);

          // Determine which players should draw cards
          const targetPlayerIds: string[] = [];

          if (targets.length === 0) {
            // Default to controller if no targets specified
            targetPlayerIds.push(trigger.controllerId);
          } else {
            for (const target of targets) {
              if (target.type === "player") {
                const playerTarget = target as PlayerTarget;
                if (
                  playerTarget.value === "opponent" ||
                  (playerTarget.value as any) === "eachOpponent"
                ) {
                  // Find all opponents of the controller
                  const allPlayers = Object.keys(this.state.ctx.players);
                  const opponents = allPlayers.filter(
                    (p) => p !== trigger.controllerId,
                  );
                  targetPlayerIds.push(...opponents);
                } else if (playerTarget.value === "self") {
                  targetPlayerIds.push(trigger.controllerId);
                } else if (playerTarget.value === "all") {
                  targetPlayerIds.push(...Object.keys(this.state.ctx.players));
                }
              }
            }
          }

          // Draw the card(s) using the core operations
          let amountValue = typeof valueParam === "object" ? 1 : valueParam;

          // Handle dynamic values for draw
          if (
            typeof valueParam === "object" &&
            valueParam.type === "singerCount"
          ) {
            // Get the singer count from the source card's meta
            if (sourceCard) {
              amountValue =
                this.getCardMeta(sourceCard.instanceId).singerCount || 0;
              logger.debug(
                `Resolved singerCount dynamic value for draw: ${amountValue} from ${sourceCard.name}`,
              );
            }
          }

          // Draw for each target player
          for (const playerId of targetPlayerIds) {
            for (let i = 0; i < amountValue; i++) {
              this.drawCard(playerId, 1);
            }
          }
          break;
        }
        case "discard": {
          // Discard effect (e.g., "Chosen opponent chooses and discards a card")
          const valueParam = effect.parameters?.value || 1;
          const random = effect.parameters?.random;

          // Get target players - either from effect.targets or default to controller
          let targetPlayerIds: string[] = [];

          if (effect.targets && effect.targets.length > 0) {
            // Resolve player targets
            for (const target of effect.targets as PlayerTarget[]) {
              if (target.type === "player") {
                if (target.value === "self") {
                  targetPlayerIds.push(trigger.controllerId);
                } else if (
                  target.value === "opponent" ||
                  (target.value as any) === "eachOpponent"
                ) {
                  // Find opponent(s)
                  const allPlayers = Object.keys(this.state.ctx.players);
                  const opponents = allPlayers.filter(
                    (p) => p !== trigger.controllerId,
                  );
                  targetPlayerIds.push(...opponents);
                } else if (
                  (target.value as any) === "each" ||
                  target.value === "all"
                ) {
                  // All players
                  targetPlayerIds.push(...Object.keys(this.state.ctx.players));
                }
              }
            }
          } else {
            // Default to controller
            targetPlayerIds = [trigger.controllerId];
          }

          // Discard cards from each target player
          for (const playerId of targetPlayerIds) {
            const handZone = this.getZone("hand", playerId);

            if (!(handZone && handZone.cards) || handZone.cards.length === 0) {
              logger.debug(
                `Player ${playerId} has no cards in hand to discard`,
              );
              continue;
            }

            // Determine how many cards to discard
            const cardsToDiscard =
              typeof valueParam === "object"
                ? handZone.cards.length
                : Math.min(valueParam, handZone.cards.length);

            logger.debug(
              `Player ${playerId} discarding ${cardsToDiscard} card(s) from hand`,
              {
                handSize: handZone.cards.length,
                random,
              },
            );

            // For now, discard from the end of hand (simplification)
            // In a real implementation, player would choose which cards
            const cardsToMove = handZone.cards.slice(-cardsToDiscard);

            for (const cardInstanceId of cardsToMove) {
              this.moveCard({
                playerId,
                instanceId: cardInstanceId,
                to: "discard",
              });

              logger.debug(
                `Discarded card ${cardInstanceId} from ${playerId} hand to discard`,
              );
            }
          }

          // Process followedBy effect if present
          if (effect.followedBy) {
            logger.debug(
              `Processing followedBy effect after discard: ${effect.followedBy.type}`,
            );
            // For now, just log - followedBy for discard would need specific handling
            // This is mainly used for draw effects that follow discard
          }
          break;
        }
        case "restrict": {
          // Restrict effect (e.g., "can't ready at the start of their next turn")
          const restriction = (effect as any).restriction;
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
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
          }

          logger.debug(
            `Applying ${restriction} restriction to ${targetCards.length} cards`,
            {
              restriction,
              duration:
                typeof duration === "object" ? duration?.type : duration,
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
              appliedTurn: (this.state.G as any).turnCount || 0,
              appliedBy: sourceCard?.instanceId,
            });

            logger.debug(
              `Applied ${restriction} restriction to ${targetCard.name}`,
              {
                restriction,
                duration:
                  typeof duration === "object" ? duration?.type : duration,
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
                  }
                  if (target.value === "opponent") {
                    const allPlayers = Object.keys(this.state.ctx.players);
                    return (
                      allPlayers.find((p) => p !== trigger.controllerId) ||
                      trigger.controllerId
                    );
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
              appliedTurn: (this.state.G as any).turnCount || 0,
            });

            logger.debug(
              `Applied cost reduction of ${value} for ${count} ${cardType}(s) to player ${playerId}`,
              {
                duration:
                  typeof duration === "object" ? duration?.type : duration,
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
          let value = typeof valueParam === "object" ? 0 : valueParam;
          const duration = effect.duration;

          if (!attribute) {
            logger.warn("Get effect missing attribute parameter");
            break;
          }

          // Handle dynamic values for get
          if (typeof valueParam === "object" && valueParam.type === "count") {
            // Count cards matching the filter
            const filter = valueParam.filter;
            if (filter) {
              // Convert filter to target format for resolveTargets
              const countTarget = {
                type: "card" as const,
                ...filter,
                targetAll: true, // We want to count all matching cards
              };
              const matchingCards = this.resolveTargets(
                [countTarget],
                sourceCard as any,
              );
              value = matchingCards.length;
              logger.debug(
                `Resolved dynamic count value for get: ${value} cards match filter`,
                {
                  filter,
                  matchingCardNames: matchingCards.map(
                    (c) => c?.name || "unknown",
                  ),
                },
              );
            }
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
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
          }

          logger.debug(
            `Applying +${value} ${attribute} to ${targetCards.length} cards`,
            {
              duration:
                typeof duration === "object" ? duration?.type : duration,
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
                appliedTurn: (this.state.G as any).turnCount || 0,
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
          const modeIndex = Number.parseInt(selectedMode, 10) - 1;
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
                  targetCards = this.resolveTargets(
                    targetDefs,
                    sourceCard as any,
                  );
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
              case "discard": {
                // Discard effect within modal
                const valueParam = modeEffect.parameters?.value || 1;
                const random = modeEffect.parameters?.random;

                // Get target players
                let targetPlayerIds: string[] = [];

                if (modeEffect.targets && modeEffect.targets.length > 0) {
                  for (const target of modeEffect.targets as PlayerTarget[]) {
                    if (target.type === "player") {
                      if (target.value === "self") {
                        targetPlayerIds.push(trigger.controllerId);
                      } else if (
                        target.value === "opponent" ||
                        (target.value as any) === "eachOpponent"
                      ) {
                        const allPlayers = Object.keys(this.state.ctx.players);
                        const opponents = allPlayers.filter(
                          (p) => p !== trigger.controllerId,
                        );
                        targetPlayerIds.push(...opponents);
                      } else if (
                        (target.value as any) === "each" ||
                        target.value === "all"
                      ) {
                        targetPlayerIds.push(
                          ...Object.keys(this.state.ctx.players),
                        );
                      }
                    }
                  }
                } else {
                  targetPlayerIds = [trigger.controllerId];
                }

                // Discard from each target player
                for (const playerId of targetPlayerIds) {
                  const handZone = this.getZone("hand", playerId);

                  if (
                    !(handZone && handZone.cards) ||
                    handZone.cards.length === 0
                  ) {
                    logger.debug(
                      `Player ${playerId} has no cards in hand to discard (modal)`,
                    );
                    continue;
                  }

                  const cardsToDiscard =
                    typeof valueParam === "object"
                      ? handZone.cards.length
                      : Math.min(valueParam, handZone.cards.length);

                  logger.debug(
                    `Player ${playerId} discarding ${cardsToDiscard} card(s) from hand (modal)`,
                    {
                      handSize: handZone.cards.length,
                      random,
                    },
                  );

                  const cardsToMove = handZone.cards.slice(-cardsToDiscard);

                  for (const cardInstanceId of cardsToMove) {
                    this.moveCard({
                      playerId,
                      instanceId: cardInstanceId,
                      to: "discard",
                    });

                    logger.debug(
                      `Discarded card ${cardInstanceId} from ${playerId} hand to discard (modal)`,
                    );
                  }
                }
                break;
              }
              case "draw": {
                // Draw effect within modal
                const valueParam = modeEffect.parameters?.value || 1;
                const target = modeEffect.parameters?.target;

                // Get target players
                let targetPlayerIds: string[] = [];

                if (modeEffect.targets && modeEffect.targets.length > 0) {
                  for (const playerTarget of modeEffect.targets as PlayerTarget[]) {
                    if (playerTarget.type === "player") {
                      if (playerTarget.value === "self") {
                        targetPlayerIds.push(trigger.controllerId);
                      } else if (
                        playerTarget.value === "opponent" ||
                        (playerTarget.value as any) === "eachOpponent"
                      ) {
                        const allPlayers = Object.keys(this.state.ctx.players);
                        const opponents = allPlayers.filter(
                          (p) => p !== trigger.controllerId,
                        );
                        targetPlayerIds.push(...opponents);
                      } else if (
                        (playerTarget.value as any) === "each" ||
                        playerTarget.value === "all"
                      ) {
                        targetPlayerIds.push(
                          ...Object.keys(this.state.ctx.players),
                        );
                      }
                    }
                  }
                } else if (
                  target &&
                  !Array.isArray(target) &&
                  target.type === "player"
                ) {
                  const playerTarget = target as PlayerTarget;
                  if (playerTarget.value === "opponent") {
                    const allPlayers = Object.keys(this.state.ctx.players);
                    const opponentId =
                      allPlayers.find((p) => p !== trigger.controllerId) ||
                      trigger.controllerId;
                    targetPlayerIds.push(opponentId);
                  } else if (playerTarget.value === "self") {
                    targetPlayerIds.push(trigger.controllerId);
                  }
                } else {
                  targetPlayerIds = [trigger.controllerId];
                }

                // Draw cards for each target player
                const amountValue =
                  typeof valueParam === "object" ? 1 : valueParam;
                for (const playerId of targetPlayerIds) {
                  for (let i = 0; i < amountValue; i++) {
                    this.drawCard(playerId, 1);
                  }
                  logger.debug(
                    `Player ${playerId} drew ${amountValue} card(s) (modal)`,
                  );
                }
                break;
              }
              case "moveCard": {
                // Move card effect within modal (e.g., "Return chosen character to hand", "Put card to bottom of deck")
                const toZone =
                  modeEffect.parameters?.zoneTo ||
                  (modeEffect.parameters as any)?.to ||
                  "hand";
                const fromZone =
                  modeEffect.parameters?.zoneFrom ||
                  (modeEffect.parameters as any)?.from;
                const position = (modeEffect.parameters as any)?.position; // "top" or "bottom" for deck

                // Get target cards
                let targetCards: any[] = [];

                if ((trigger as any).selectedTargets) {
                  const selectedIds = (trigger as any).selectedTargets;
                  logger.debug(
                    `Using manually selected targets for moveCard (modal): ${selectedIds.join(", ")}`,
                  );
                  targetCards = selectedIds
                    .map((id: string) =>
                      this.engine.cardInstanceStore.getCardByInstanceId(id),
                    )
                    .filter(Boolean);
                } else {
                  // Override target zone with fromZone if specified
                  const targetDefs = (modeEffect.targets || []).map(
                    (t: any) => ({
                      ...t,
                      zone: fromZone || t.zone,
                    }),
                  );
                  logger.debug(
                    `Auto-resolving targets for moveCard (modal). targetDefs count: ${targetDefs.length}, fromZone: ${fromZone}`,
                  );
                  targetCards = this.resolveTargets(
                    targetDefs,
                    sourceCard as any,
                  );
                }

                // Check if any targets were found
                if (targetCards.length === 0) {
                  logger.debug(
                    "No targets found for moveCard effect, skipping",
                  );
                  break;
                }

                logger.debug(
                  `Moving ${targetCards.length} card(s) from ${fromZone || "current zone"} to ${toZone} (modal)`,
                  {
                    targetCardNames: targetCards.map(
                      (c) => c?.name || "unknown",
                    ),
                    position,
                  },
                );

                // Move each target card
                for (const targetCard of targetCards) {
                  const currentZone = fromZone || targetCard.zone;
                  const ownerId = targetCard.ownerId;

                  // Move the card to the destination zone
                  this.moveCard({
                    playerId: ownerId,
                    instanceId: targetCard.instanceId,
                    to: toZone,
                    position, // Pass position for deck placement (top/bottom)
                  } as any); // Legacy: position property

                  logger.debug(
                    `Moved ${targetCard.name} from ${currentZone} to ${toZone}`,
                    {
                      position,
                    },
                  );
                }

                // Process followedBy effect if present
                if (modeEffect.followedBy) {
                  logger.debug(
                    `Processing followedBy effect after moveCard (modal): ${modeEffect.followedBy.type}`,
                  );
                  const followedByEffect = modeEffect.followedBy;

                  // Check if followedBy effect requires targeting (count > 0 or count undefined)
                  const followedByTargets = followedByEffect.targets || [];
                  const requiresTargeting = followedByTargets.some(
                    (t: any) =>
                      (t.count === undefined || t.count > 0) &&
                      t.type === "card",
                  );

                  if (requiresTargeting) {
                    // Push followedBy effect as a new layer for manual targeting
                    logger.debug(
                      "followedBy effect requires targeting, creating new layer",
                    );
                    this.addAbilitiesToResolve({
                      instanceId: sourceCard?.instanceId || "",
                      name: sourceCard?.name || "Unknown",
                      abilities: [
                        {
                          type: "static",
                          effects: [followedByEffect],
                        },
                      ],
                    } as any);
                  } else {
                    // Execute followedBy inline if no targeting required
                    switch (followedByEffect.type) {
                      case "moveCard": {
                        // Nested moveCard effect (e.g., "Put card X to bottom of deck to put card Y to bottom of deck")
                        const followedByToZone =
                          followedByEffect.parameters?.zoneTo ||
                          followedByEffect.parameters?.to ||
                          "hand";
                        const followedByFromZone =
                          followedByEffect.parameters?.zoneFrom ||
                          followedByEffect.parameters?.from;
                        const followedByPosition = (
                          followedByEffect.parameters as any
                        )?.position;

                        // Override target zone with fromZone if specified
                        const followedByTargetDefs = (
                          followedByEffect.targets || []
                        ).map((t: any) => ({
                          ...t,
                          zone: followedByFromZone || t.zone,
                        }));
                        logger.debug(
                          `Auto-resolving targets for followedBy moveCard (modal). targetDefs count: ${followedByTargetDefs.length}`,
                        );
                        const followedByTargetCards = this.resolveTargets(
                          followedByTargetDefs,
                          sourceCard as any,
                        );

                        logger.debug(
                          `Moving ${followedByTargetCards.length} card(s) from ${followedByFromZone || "any zone"} to ${followedByToZone} (followedBy modal inline)`,
                          {
                            targetCardNames: followedByTargetCards.map(
                              (c) => c?.name || "unknown",
                            ),
                            position: followedByPosition,
                          },
                        );

                        // Move each followedBy target card
                        for (const followedByCard of followedByTargetCards) {
                          const ownerId = followedByCard.ownerId;

                          this.moveCard({
                            playerId: ownerId,
                            instanceId: followedByCard.instanceId,
                            to: followedByToZone,
                            position: followedByPosition,
                          } as any); // Legacy: position property

                          logger.debug(
                            `Moved ${followedByCard.name} to ${followedByToZone} (followedBy modal inline)`,
                            {
                              position: followedByPosition,
                            },
                          );
                        }
                        break;
                      }
                      default:
                        logger.warn(
                          `Unhandled followedBy effect type after moveCard (modal): ${followedByEffect.type}`,
                        );
                    }
                  }
                }
                break;
              }
              // Add more effect types as needed for modal effects
              default:
                logger.warn(
                  `Unhandled effect type in modal: ${modeEffect.type}`,
                );
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

          // Check if this effect should use manual targets or auto-resolve
          // If the effect has targets with count: -1, it should always auto-resolve (target all matching)
          const targetDefs = effect.targets || trigger.ability?.targets || [];
          const shouldAutoResolve = targetDefs.some((t: any) => t.count === -1);

          // Check if targets were manually selected AND this effect doesn't force auto-resolve
          if ((trigger as any).selectedTargets && !shouldAutoResolve) {
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
            logger.debug(
              `Auto-resolving targets for removeDamage. targetDefs count: ${targetDefs.length}, shouldAutoResolve: ${shouldAutoResolve}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
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
          const toZone =
            effect.parameters?.zoneTo ||
            (effect.parameters as any)?.to ||
            "hand";
          const fromZone =
            effect.parameters?.zoneFrom || (effect.parameters as any)?.from;
          const exerted = effect.parameters?.exerted;

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
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
          }

          logger.debug(
            `Moving ${targetCards.length} card(s) from ${fromZone || "any zone"} to ${toZone}`,
            {
              targetCardNames: targetCards.map((c) => c?.name || "unknown"),
              exerted,
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

            // Set exerted state if specified
            if (exerted !== undefined) {
              this.setCardMeta(targetCard.instanceId, { exerted });
              logger.debug(`Set exerted=${exerted} for ${targetCard.name}`);
            }

            logger.debug(`Moved ${targetCard.name} to ${ownerId}-${toZone}`, {
              from: currentZone,
              to: `${ownerId}-${toZone}`,
              exerted,
            });
          }

          // Process followedBy effect if present
          if (effect.followedBy) {
            logger.debug(
              `Processing followedBy effect after moveCard: ${effect.followedBy.type}`,
            );
            const followedByEffect = effect.followedBy;

            // Check if followedBy effect requires manual targeting
            const followedByTargets = followedByEffect.targets || [];
            const requiresTargeting = followedByTargets.some(
              (t: any) =>
                (t.count === undefined || t.count > 0) && t.type === "card",
            );

            if (requiresTargeting) {
              // Push followedBy effect as a new layer for manual targeting
              logger.debug(
                "followedBy effect requires targeting, creating new layer",
              );
              this.addAbilitiesToResolve({
                instanceId: sourceCard?.instanceId || "",
                name: sourceCard?.name || "Unknown",
                abilities: [
                  {
                    type: "static",
                    effects: [followedByEffect],
                  },
                ],
              } as any);
              break; // Exit the moveCard case
            }

            // Process the followedBy effect inline if no targeting required
            switch (followedByEffect.type) {
              case "moveCard": {
                // Another moveCard effect (e.g., "return item from discard to hand")
                const followedByToZone =
                  followedByEffect.parameters?.zoneTo ||
                  followedByEffect.parameters?.to ||
                  "hand";
                const followedByFromZone =
                  followedByEffect.parameters?.zoneFrom ||
                  followedByEffect.parameters?.from;

                // Get target cards for followedBy
                let followedByTargetCards: any[] = [];

                if ((trigger as any).selectedFollowedByTargets) {
                  const selectedIds = (trigger as any)
                    .selectedFollowedByTargets;
                  logger.debug(
                    `Using manually selected followedBy targets: ${selectedIds.join(", ")}`,
                  );
                  followedByTargetCards = selectedIds
                    .map((id: string) =>
                      this.engine.cardInstanceStore.getCardByInstanceId(id),
                    )
                    .filter(Boolean);
                } else {
                  const targetDefs = followedByEffect.targets || [];
                  logger.debug(
                    `Auto-resolving targets for followedBy moveCard. targetDefs count: ${targetDefs.length}`,
                  );
                  followedByTargetCards = this.resolveTargets(
                    targetDefs,
                    sourceCard as any,
                  );
                }

                logger.debug(
                  `Moving ${followedByTargetCards.length} card(s) from ${followedByFromZone || "any zone"} to ${followedByToZone} (followedBy)`,
                  {
                    targetCardNames: followedByTargetCards.map(
                      (c) => c?.name || "unknown",
                    ),
                  },
                );

                // Move each followedBy target card
                for (const followedByCard of followedByTargetCards) {
                  const currentZone = followedByCard.zone;
                  const ownerId = followedByCard.ownerId;

                  this.moveCard({
                    playerId: ownerId,
                    instanceId: followedByCard.instanceId,
                    to: followedByToZone,
                  });

                  logger.debug(
                    `Moved ${followedByCard.name} to ${ownerId}-${followedByToZone} (followedBy)`,
                    {
                      from: currentZone,
                      to: `${ownerId}-${followedByToZone}`,
                    },
                  );
                }
                break;
              }
              default:
                logger.warn(
                  `Unhandled followedBy effect type after moveCard: ${followedByEffect.type}`,
                );
            }
          }
          break;
        }
        case "gainsAbility": {
          // Gains ability effect (e.g., "Chosen character gains Evasive this turn")
          const ability = effect.parameters?.ability;
          const duration = effect.duration;

          if (!ability) {
            logger.warn("Gains ability effect missing ability parameter");
            break;
          }

          // Get target cards - either from selectedTargets (manual selection) or auto-resolve
          let targetCards: any[] = [];

          if ((trigger as any).selectedTargets) {
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets for gainsAbility: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `Auto-resolving targets for gainsAbility. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
          }

          logger.debug(
            `Granting ability "${(ability as any).keyword || ability.text?.substring(0, 20)}..." to ${targetCards.length} cards`,
            {
              duration:
                typeof duration === "object" ? duration?.type : duration,
              targetCardNames: targetCards.map((c) => c?.name || "unknown"),
            },
          );

          // Grant ability to each target
          for (const targetCard of targetCards) {
            if (!this.state.ctx.cardMetas[targetCard.instanceId]) {
              this.state.ctx.cardMetas[targetCard.instanceId] = {} as any;
            }

            const cardMeta = this.state.ctx.cardMetas[
              targetCard.instanceId
            ] as any;

            // Initialize granted abilities if they don't exist
            if (!cardMeta.grantedAbilities) {
              cardMeta.grantedAbilities = [];
            }

            // Add the granted ability
            cardMeta.grantedAbilities.push({
              ability,
              duration,
              appliedTurn: (this.state.G as any).turnCount || 0,
              appliedBy: sourceCard?.instanceId,
            });

            logger.debug(`Granted ability to ${targetCard.name}`, {
              ability: (ability as any).keyword || "custom ability",
              duration:
                typeof duration === "object" ? duration?.type : duration,
            });
          }
          break;
        }
        case "banish": {
          // Banish effect (e.g., "Banish chosen character")
          const optional = effect.optional;

          // Get target cards - either from selectedTargets (manual selection) or auto-resolve
          let targetCards: any[] = [];

          if ((trigger as any).selectedTargets) {
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets for banish: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `Auto-resolving targets for banish. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
          }

          logger.debug(`Banishing ${targetCards.length} cards`, {
            targetCardNames: targetCards.map((c) => c?.name || "unknown"),
          });

          // Banish each target card (move to discard)
          for (const targetCard of targetCards) {
            const currentZone = targetCard.zone;
            const ownerId = targetCard.ownerId;

            // Move the card to discard
            this.moveCard({
              playerId: ownerId,
              instanceId: targetCard.instanceId,
              to: "discard",
            });

            logger.debug(`Banished ${targetCard.name} to discard`, {
              from: currentZone,
              to: `${ownerId}-discard`,
            });
          }

          // Process followedBy effect if present
          if (effect.followedBy) {
            logger.debug(
              `Processing followedBy effect after banish: ${effect.followedBy.type}`,
            );
            // Process the followedBy effect inline
            const followedByEffect = effect.followedBy;
            switch (followedByEffect.type) {
              case "moveCard": {
                // Move card effect (e.g., "return item from discard to hand")
                const followedByToZone =
                  followedByEffect.parameters?.zoneTo ||
                  followedByEffect.parameters?.to ||
                  "hand";
                const followedByFromZone =
                  followedByEffect.parameters?.zoneFrom ||
                  followedByEffect.parameters?.from;

                // Get target cards for followedBy
                let followedByTargetCards: any[] = [];

                if ((trigger as any).selectedFollowedByTargets) {
                  const selectedIds = (trigger as any)
                    .selectedFollowedByTargets;
                  logger.debug(
                    `Using manually selected followedBy targets: ${selectedIds.join(", ")}`,
                  );
                  followedByTargetCards = selectedIds
                    .map((id: string) =>
                      this.engine.cardInstanceStore.getCardByInstanceId(id),
                    )
                    .filter(Boolean);
                } else {
                  const targetDefs = followedByEffect.targets || [];
                  logger.debug(
                    `Auto-resolving targets for followedBy moveCard. targetDefs count: ${targetDefs.length}`,
                  );
                  followedByTargetCards = this.resolveTargets(
                    targetDefs,
                    sourceCard as any,
                  );
                }

                logger.debug(
                  `Moving ${followedByTargetCards.length} card(s) from ${followedByFromZone || "any zone"} to ${followedByToZone} (followedBy)`,
                  {
                    targetCardNames: followedByTargetCards.map(
                      (c) => c?.name || "unknown",
                    ),
                  },
                );

                // Move each followedBy target card
                for (const followedByCard of followedByTargetCards) {
                  const currentZone = followedByCard.zone;
                  const ownerId = followedByCard.ownerId;

                  this.moveCard({
                    playerId: ownerId,
                    instanceId: followedByCard.instanceId,
                    to: followedByToZone,
                  });

                  logger.debug(
                    `Moved ${followedByCard.name} to ${ownerId}-${followedByToZone} (followedBy)`,
                    {
                      from: currentZone,
                      to: `${ownerId}-${followedByToZone}`,
                    },
                  );
                }
                break;
              }
              default:
                logger.warn(
                  `Unhandled followedBy effect type after banish: ${followedByEffect.type}`,
                );
            }
          }
          break;
        }
        case "ready": {
          // Ready effect (e.g., "Ready all your characters")
          // Get target cards - either from selectedTargets (manual selection) or auto-resolve
          let targetCards: any[] = [];

          if ((trigger as any).selectedTargets) {
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets for ready: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `Auto-resolving targets for ready. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
          }

          logger.debug(`Readying ${targetCards.length} cards`, {
            targetCardNames: targetCards.map((c) => c?.name || "unknown"),
          });

          // Ready (unexert) each target card
          for (const targetCard of targetCards) {
            const meta = this.state.ctx.cardMetas[targetCard.instanceId];
            if (meta?.exerted) {
              meta.exerted = false;
              logger.debug(`Readied ${targetCard.name}`, {
                instanceId: targetCard.instanceId,
              });
            }
          }
          break;
        }
        case "exertCard": {
          // Exert card effect (e.g., "Exert chosen character")
          // Get target cards - either from selectedTargets (manual selection) or auto-resolve
          let targetCards: any[] = [];

          if ((trigger as any).selectedTargets) {
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets for exertCard: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `Auto-resolving targets for exertCard. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
          }

          logger.debug(`Exerting ${targetCards.length} cards`, {
            targetCardNames: targetCards.map((c) => c?.name || "unknown"),
          });

          // Exert each target card
          for (const targetCard of targetCards) {
            this.setCardMeta(targetCard.instanceId, { exerted: true });
            logger.debug(`Exerted ${targetCard.name}`, {
              instanceId: targetCard.instanceId,
            });
          }
          break;
        }
        case "damageImmunity": {
          // Damage immunity effect (e.g., "take no damage from challenges")
          const sources = effect.parameters?.sources || [];
          const duration = effect.duration;

          // Get target cards
          let targetCards: any[] = [];

          if ((trigger as any).selectedTargets) {
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets for damageImmunity: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `Auto-resolving targets for damageImmunity. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
          }

          logger.debug(
            `Applying damage immunity to ${targetCards.length} cards`,
            {
              sources,
              duration:
                typeof duration === "object" ? duration?.type : duration,
              targetCardNames: targetCards.map((c) => c?.name || "unknown"),
            },
          );

          // Apply damage immunity to each target
          for (const targetCard of targetCards) {
            if (!this.state.ctx.cardMetas[targetCard.instanceId]) {
              this.state.ctx.cardMetas[targetCard.instanceId] = {} as any;
            }

            const cardMeta = this.state.ctx.cardMetas[
              targetCard.instanceId
            ] as any;

            // Initialize damage immunities if they don't exist
            if (!cardMeta.damageImmunities) {
              cardMeta.damageImmunities = [];
            }

            // Add the damage immunity
            cardMeta.damageImmunities.push({
              sources,
              duration,
              appliedTurn: (this.state.G as any).turnCount || 0,
              appliedBy: sourceCard?.instanceId,
            });

            logger.debug(`Applied damage immunity to ${targetCard.name}`, {
              sources,
              duration:
                typeof duration === "object" ? duration?.type : duration,
            });
          }
          break;
        }
        case "dealDamage": {
          // Deal damage effect (e.g., "Deal 1 damage to chosen character")
          const valueParam = effect.parameters?.value || 1;
          let amount = typeof valueParam === "object" ? 1 : valueParam;

          // Handle dynamic values
          if (typeof valueParam === "object" && valueParam.type === "count") {
            // Count cards matching the filter - need to create a CardTarget from the filter
            const filter = valueParam.filter;
            if (filter) {
              // Convert filter to target format for resolveTargets
              const countTarget = {
                type: "card" as const,
                ...filter,
                targetAll: true, // We want to count all matching cards
              };
              const matchingCards = this.resolveTargets(
                [countTarget],
                sourceCard as any,
              );
              amount = matchingCards.length;
              logger.debug(
                `Resolved dynamic count value: ${amount} cards match filter`,
                {
                  filter,
                  matchingCardNames: matchingCards.map(
                    (c) => c?.name || "unknown",
                  ),
                },
              );
            }
          }

          // Get target cards - either from selectedTargets (manual selection) or auto-resolve
          let targetCards: any[] = [];

          if ((trigger as any).selectedTargets) {
            const selectedIds = (trigger as any).selectedTargets;
            logger.debug(
              `Using manually selected targets for dealDamage: ${selectedIds.join(", ")}`,
            );
            targetCards = selectedIds
              .map((id: string) =>
                this.engine.cardInstanceStore.getCardByInstanceId(id),
              )
              .filter(Boolean);
          } else {
            const targetDefs = effect.targets || trigger.ability?.targets || [];
            logger.debug(
              `Auto-resolving targets for dealDamage. targetDefs count: ${targetDefs.length}`,
            );
            targetCards = this.resolveTargets(targetDefs, sourceCard as any);
          }

          logger.debug(
            `Dealing ${amount} damage to ${targetCards.length} cards`,
            {
              targetCardNames: targetCards.map((c) => c?.name || "unknown"),
            },
          );

          // Apply damage to each target
          for (const targetCard of targetCards) {
            this.applyDamage(targetCard.instanceId, amount);
            logger.debug(`Dealt ${amount} damage to ${targetCard.name}`, {
              totalDamage: this.getCardMeta(targetCard.instanceId).damage,
            });
          }

          // Process followedBy effect if present
          if (effect.followedBy) {
            logger.debug(
              `Processing followedBy effect after dealDamage: ${effect.followedBy.type}`,
            );
            const followedByEffect = effect.followedBy;
            switch (followedByEffect.type) {
              case "draw": {
                // Draw cards effect
                const drawValueParam = followedByEffect.parameters?.value || 1;
                let drawAmount =
                  typeof drawValueParam === "number" ? drawValueParam : 1;

                // Handle dynamic draw values
                if (
                  typeof drawValueParam === "object" &&
                  drawValueParam.type === "count"
                ) {
                  const filter = drawValueParam.filter;
                  if (filter) {
                    const countTarget = {
                      type: "card" as const,
                      ...filter,
                      targetAll: true,
                    };
                    const matchingCards = this.resolveTargets(
                      [countTarget],
                      sourceCard as any,
                    );
                    drawAmount = matchingCards.length;
                    logger.debug(
                      `Resolved dynamic draw count: ${drawAmount} cards match filter`,
                      {
                        filter,
                        matchingCardNames: matchingCards.map(
                          (c) => c?.name || "unknown",
                        ),
                      },
                    );
                  }
                }

                // Get target players for draw
                const drawTargets = followedByEffect.targets || [];
                for (const playerTarget of drawTargets) {
                  const playerId =
                    playerTarget.value === "opponent"
                      ? (this.engine as any).getOpponentId(
                          sourceCard?.ownerId || trigger.controllerId,
                        )
                      : playerTarget.value === "self"
                        ? sourceCard?.ownerId || trigger.controllerId
                        : trigger.controllerId;

                  logger.debug(
                    `Drawing ${drawAmount} cards for player ${playerId}`,
                  );
                  for (let i = 0; i < drawAmount; i++) {
                    this.drawCard(playerId, 1);
                  }
                }
                break;
              }
              default:
                logger.warn(
                  `Unhandled followedBy effect type after dealDamage: ${followedByEffect.type}`,
                );
            }
          }
          break;
        }
        case "scry": {
          // Scry effect (e.g., "Look at the top 3 cards of your deck. You may reveal a character card and play it for free.")
          const { lookAt, destinations } = effect.parameters || {};
          const scryParams = (trigger as any).scryParams;

          if (!scryParams) {
            logger.warn("Scry effect requires scryParams to be set");
            break;
          }

          // Determine target player - use targetPlayer if provided (for cards like Water Has Memory),
          // otherwise default to the card's owner/controller
          const targetPlayer = (trigger as any).targetPlayer;
          const playerId =
            targetPlayer || sourceCard?.ownerId || trigger.controllerId;
          const deckZone = this.getZone("deck", playerId);

          if (!(deckZone && deckZone.cards) || deckZone.cards.length === 0) {
            logger.debug("No cards in deck for scry effect");
            break;
          }

          logger.debug(`Scry effect: looking at ${lookAt} cards`, {
            destinations: destinations?.map((d) => d.zone),
            scryParams,
          });

          // Validate scryParams against destination constraints
          // If any card is invalid, reject the entire scry operation
          for (const [zone, cardInstanceIds] of Object.entries(scryParams)) {
            if (
              !Array.isArray(cardInstanceIds) ||
              cardInstanceIds.length === 0
            ) {
              continue;
            }

            // Map "top"/"bottom" to "deck" with position "top"/"bottom" for validation
            const normalizedZone =
              zone === "top" || zone === "bottom" ? "deck" : zone;
            // Track the position from the zone name for matching
            const zonePosition =
              zone === "top" ? "top" : zone === "bottom" ? "bottom" : undefined;

            // Find ALL destinations for this zone
            // If zone was "top" or "bottom", match both zone and position
            const zoneDestinations = (destinations || []).filter((d) => {
              if (d.zone !== normalizedZone) return false;
              // If we have a specific position from the zone name, match it
              if (zonePosition && d.position !== zonePosition) return false;
              return true;
            });

            if (zoneDestinations.length === 0) {
              continue;
            }

            // Track cards matched to each destination for max constraint validation
            const cardsPerDestination = new Map<any, string[]>();

            // For each card, check if it matches at least one destination
            for (const cardInstanceId of cardInstanceIds as string[]) {
              const card =
                this.engine.cardInstanceStore.getCardByInstanceId(
                  cardInstanceId,
                );

              if (!card) {
                logger.warn(
                  `Card ${cardInstanceId} not found for scry validation`,
                );
                return; // Invalid move - reject
              }

              // Check if card matches any of the destinations for this zone
              let matchingDestination: any = null;

              for (const destination of zoneDestinations) {
                // If destination has no filter and no max constraint, or is a remainder, it matches everything
                if (
                  !destination.filter &&
                  (destination.remainder || destination.max === undefined)
                ) {
                  matchingDestination = destination;
                  break;
                }

                // Check filter constraints if present
                if (destination.filter) {
                  let matchesFilter = true;

                  // Check cardType filter
                  if (
                    destination.filter.cardType &&
                    card.card.type !== destination.filter.cardType
                  ) {
                    matchesFilter = false;
                  }

                  // Check withCharacteristics filter
                  if (
                    matchesFilter &&
                    destination.filter.withCharacteristics &&
                    Array.isArray(destination.filter.withCharacteristics)
                  ) {
                    const hasAllCharacteristics =
                      destination.filter.withCharacteristics.every(
                        (char: string) =>
                          card.card.characteristics?.includes(char as any),
                      );
                    if (!hasAllCharacteristics) {
                      matchesFilter = false;
                    }
                  }

                  // Check withSubtypes filter (check both card.subtypes and card.name for madrigal)
                  if (
                    matchesFilter &&
                    destination.filter.withSubtypes &&
                    Array.isArray(destination.filter.withSubtypes)
                  ) {
                    const hasAllSubtypes =
                      destination.filter.withSubtypes.every(
                        (subtype: string) => {
                          const subtypeLower = subtype.toLowerCase();
                          return (
                            (card.card as any).subtypes?.some(
                              (s: string) => s.toLowerCase() === subtypeLower,
                            ) ||
                            (card.card as any).versions?.some((v: any) =>
                              v.subtypes?.some(
                                (s: string) => s.toLowerCase() === subtypeLower,
                              ),
                            ) ||
                            card.card.name.toLowerCase().includes(subtypeLower)
                          );
                        },
                      );
                    if (!hasAllSubtypes) {
                      matchesFilter = false;
                    }
                  }

                  if (matchesFilter) {
                    matchingDestination = destination;
                    break;
                  }
                }
              }

              if (!matchingDestination) {
                logger.warn(
                  `Scry validation failed: ${card.name} doesn't match any destination for zone ${normalizedZone}`,
                );
                return; // Invalid move - reject
              }

              // Track this card for max constraint validation
              if (!cardsPerDestination.has(matchingDestination)) {
                cardsPerDestination.set(matchingDestination, []);
              }
              const destinationCards =
                cardsPerDestination.get(matchingDestination);
              if (destinationCards) {
                destinationCards.push(cardInstanceId);
              }
            }

            // Validate max constraints for each destination
            for (const [
              destination,
              matchedCards,
            ] of cardsPerDestination.entries()) {
              if (destination.max !== undefined && !destination.remainder) {
                if (matchedCards.length > destination.max) {
                  logger.warn(
                    `Scry validation failed: ${matchedCards.length} cards selected for destination with max ${destination.max}`,
                  );
                  return; // Invalid move - reject
                }
              }
            }
          }

          // Process each zone in scryParams
          for (const [zone, cardInstanceIds] of Object.entries(scryParams)) {
            if (
              !Array.isArray(cardInstanceIds) ||
              cardInstanceIds.length === 0
            ) {
              continue;
            }

            // Map "top"/"bottom" to "deck" for processing
            const normalizedZone =
              zone === "top" || zone === "bottom" ? "deck" : zone;
            // Track the position from the zone name for matching
            const zonePosition =
              zone === "top" ? "top" : zone === "bottom" ? "bottom" : undefined;

            // Find the matching destination from the effect definition
            // If zone was "top" or "bottom", match both zone and position
            const destination = (destinations || []).find((d) => {
              if (d.zone !== normalizedZone) return false;
              // If we have a specific position from the zone name, match it
              if (zonePosition && d.position !== zonePosition) return false;
              return true;
            });
            const { position, exerted, reveal } = destination || {};

            logger.debug(
              `Processing scry zone: ${zone}, cards: ${cardInstanceIds.length}`,
            );

            for (const cardInstanceId of cardInstanceIds) {
              const card =
                this.engine.cardInstanceStore.getCardByInstanceId(
                  cardInstanceId,
                );

              if (!card) {
                logger.warn(`Card ${cardInstanceId} not found for scry`);
                continue;
              }

              // Special handling for "play" destination - play the card for free
              if (normalizedZone === "play") {
                logger.debug(`Playing card ${card.name} for free via scry`);

                // Move to play zone
                this.moveCard({
                  playerId: playerId,
                  instanceId: card.instanceId,
                  to: "play",
                  from: "deck",
                });

                // Mark as played this turn if it's a character
                if (card.card.type === "character") {
                  this.setCardMeta(card.instanceId, {
                    playedThisTurn: true,
                    exerted: exerted,
                  });
                }

                // Trigger onPlay effects
                this.addTriggeredEffectsToTheBag("onPlay", card.instanceId);

                // Reveal if specified
                if (reveal) {
                  logger.debug(`Revealing card ${card.name}`);
                }
              } else {
                // Move card to destination zone
                // Map position ("top" | "bottom") to destination parameter ("start" | "end")
                const destinationParam: "start" | "end" =
                  position === "top"
                    ? "start"
                    : position === "bottom"
                      ? "end"
                      : "end";

                this.moveCard({
                  playerId: playerId,
                  instanceId: card.instanceId,
                  to: normalizedZone,
                  from: "deck",
                  destination: destinationParam,
                });

                logger.debug(
                  `Moved ${card.name} to ${normalizedZone}${position ? ` at ${position}` : ""}`,
                );
              }
            }
          }

          break;
        }
        case "inkwellManagement": {
          // Inkwell management effect (exert all, conditional return, etc.)
          const action = effect.parameters?.action;
          const condition = effect.parameters?.condition;
          const targetSize = effect.parameters?.targetSize;

          // Get target players from effect.targets
          const targets = effect.targets || [];
          const targetPlayerIds: string[] = [];

          for (const target of targets) {
            if (target.type === "player") {
              const playerTarget = target as PlayerTarget;
              if (
                playerTarget.value === "opponent" ||
                (playerTarget.value as any) === "eachOpponent"
              ) {
                const allPlayers = Object.keys(this.state.ctx.players);
                const opponents = allPlayers.filter(
                  (p) => p !== trigger.controllerId,
                );
                targetPlayerIds.push(...opponents);
              } else if (playerTarget.value === "self") {
                targetPlayerIds.push(trigger.controllerId);
              } else if (playerTarget.value === "all") {
                targetPlayerIds.push(...Object.keys(this.state.ctx.players));
              }
            }
          }

          // Process each target player
          for (const playerId of targetPlayerIds) {
            const inkwellZone = this.getZone("inkwell", playerId);

            if (!(inkwellZone && inkwellZone.cards)) {
              logger.warn(`No inkwell zone found for player ${playerId}`);
              continue;
            }

            switch (action) {
              case "exertAll": {
                // Exert all cards in inkwell
                for (const cardInstanceId of inkwellZone.cards) {
                  this.setCardMeta(cardInstanceId, { exerted: true });
                }
                logger.debug(
                  `Exerted all ${inkwellZone.cards.length} cards in ${playerId}'s inkwell`,
                );
                break;
              }

              case "conditionalReturn": {
                // Return cards if condition is met
                if (!(condition && targetSize)) {
                  logger.warn(
                    "conditionalReturn requires condition and targetSize",
                  );
                  break;
                }

                const currentSize = inkwellZone.cards.length;

                // Check condition
                let conditionMet = false;
                if (condition.type === "sizeGreaterThan") {
                  conditionMet = currentSize > (condition.value || 0);
                } else if (condition.type === "sizeLessThan") {
                  conditionMet = currentSize < (condition.value || 0);
                } else if (condition.type === "sizeEquals") {
                  conditionMet = currentSize === (condition.value || 0);
                }

                if (!conditionMet) {
                  logger.debug(
                    `Condition not met for ${playerId}, inkwell size: ${currentSize}`,
                  );
                  break;
                }

                // Return cards until we reach target size
                const cardsToReturn = currentSize - targetSize;
                if (cardsToReturn <= 0) {
                  break;
                }

                logger.debug(
                  `Returning ${cardsToReturn} cards from ${playerId}'s inkwell to hand`,
                );

                // Get random cards to return
                const cardsToMove = [...inkwellZone.cards]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, cardsToReturn);

                for (const cardInstanceId of cardsToMove) {
                  this.moveCard({
                    playerId,
                    instanceId: cardInstanceId,
                    from: "inkwell",
                    to: "hand",
                  });
                }
                break;
              }

              case "returnRandom": {
                // Return random number of cards
                const count = effect.parameters?.count || 1;
                const cardsToMove = [...inkwellZone.cards]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, count);

                for (const cardInstanceId of cardsToMove) {
                  this.moveCard({
                    playerId,
                    instanceId: cardInstanceId,
                    from: "inkwell",
                    to: "hand",
                  });
                }
                logger.debug(
                  `Returned ${cardsToMove.length} random cards from ${playerId}'s inkwell`,
                );
                break;
              }

              default:
                logger.warn(`Unknown inkwellManagement action: ${action}`);
            }
          }

          break;
        }
        case "conditionalPlayer": {
          // Conditional effect (e.g., "If you have no cards in hand, draw 3. Otherwise, discard then draw.")
          const condition = effect.parameters?.condition;
          const conditionalEffect = effect.parameters?.effect;
          const elseEffect = effect.parameters?.elseEffect;

          if (!(condition && conditionalEffect)) {
            logger.warn("conditionalPlayer effect missing condition or effect");
            break;
          }

          // Evaluate the condition
          let conditionMet = false;

          switch (condition.type) {
            case "hasCardsInHand": {
              const maxCount = condition.maxCount ?? Number.POSITIVE_INFINITY;
              const minCount = condition.minCount ?? 0;

              // Get the player's hand size
              const playerId = sourceCard?.ownerId || trigger.controllerId;
              const handZone = this.getZone("hand", playerId);
              const handSize = handZone?.cards?.length || 0;

              conditionMet = handSize >= minCount && handSize <= maxCount;

              logger.debug(
                `Condition hasCardsInHand evaluated: handSize=${handSize}, min=${minCount}, max=${maxCount}, met=${conditionMet}`,
              );
              break;
            }
            case "handSizeComparison": {
              const comparison = condition.comparison || "equalTo";

              const playerId = sourceCard?.ownerId || trigger.controllerId;
              const opponentId = (this.engine as any).getOpponentId(playerId);

              const playerHandSize =
                this.getZone("hand", playerId)?.cards?.length || 0;
              const opponentHandSize =
                this.getZone("hand", opponentId)?.cards?.length || 0;

              switch (comparison) {
                case "lessThan":
                  conditionMet = playerHandSize < opponentHandSize;
                  break;
                case "greaterThan":
                  conditionMet = playerHandSize > opponentHandSize;
                  break;
                case "equalTo":
                  conditionMet = playerHandSize === opponentHandSize;
                  break;
              }

              logger.debug(
                `Condition handSizeComparison evaluated: player=${playerHandSize}, opponent=${opponentHandSize}, comparison=${comparison}, met=${conditionMet}`,
              );
              break;
            }
            default:
              logger.warn(`Unknown condition type: ${condition.type}`);
              break;
          }

          // Execute the appropriate effect based on condition
          const effectToExecute = conditionMet ? conditionalEffect : elseEffect;

          if (effectToExecute) {
            // Process the effect by handling common effect types inline
            const effectsArray = Array.isArray(effectToExecute)
              ? effectToExecute
              : [effectToExecute];

            // Check if the effect requires targeting and we don't have targets
            const requiresTargeting = effectsArray.some(
              (e: any) => e.type === "discard",
            );

            if (requiresTargeting && !(trigger as any).selectedTargets) {
              logger.warn(
                "conditionalPlayer effect requires targeting but no targets provided - layer should not have auto-resolved",
              );
              // Don't execute - wait for player to provide targets
              break;
            }

            logger.debug(
              `Executing ${conditionMet ? "effect" : "elseEffect"} for conditionalPlayer`,
            );

            let discardedCount = 0; // Track discarded cards for dynamic values

            for (const subEffect of effectsArray) {
              switch (subEffect.type) {
                case "draw": {
                  let drawValueParam = subEffect.parameters?.value || 1;

                  // Handle dynamic value "discardCount"
                  if (drawValueParam === "discardCount") {
                    drawValueParam = discardedCount;
                  }

                  const drawAmount =
                    typeof drawValueParam === "number" ? drawValueParam : 1;

                  const drawTargets = (subEffect as any).targets || [
                    { player: "self" },
                  ];

                  for (const playerTarget of drawTargets) {
                    const playerId =
                      playerTarget.player === "opponent"
                        ? (this.engine as any).getOpponentId(
                            sourceCard?.ownerId || trigger.controllerId,
                          )
                        : playerTarget.player === "self"
                          ? sourceCard?.ownerId || trigger.controllerId
                          : trigger.controllerId;

                    logger.debug(
                      `Drawing ${drawAmount} cards for player ${playerId} (conditional)`,
                    );
                    for (let i = 0; i < drawAmount; i++) {
                      this.drawCard(playerId, 1);
                    }
                  }
                  break;
                }
                case "discard": {
                  const playerId = sourceCard?.ownerId || trigger.controllerId;

                  // Get targets from trigger.selectedTargets (injected by TestEngine) or trigger.targets
                  const targetInstanceIds =
                    (trigger as any).selectedTargets ||
                    (trigger as any).targets ||
                    [];

                  logger.debug(
                    `Discarding ${targetInstanceIds.length} cards for player ${playerId} (conditional)`,
                  );

                  for (const instanceId of targetInstanceIds) {
                    this.moveCard({
                      playerId: playerId,
                      instanceId: instanceId,
                      to: "discard",
                      from: "hand",
                    });
                    discardedCount++;
                  }
                  break;
                }
                default:
                  logger.warn(
                    `Unhandled conditional sub-effect type: ${subEffect.type}`,
                  );
                  break;
              }
            }
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

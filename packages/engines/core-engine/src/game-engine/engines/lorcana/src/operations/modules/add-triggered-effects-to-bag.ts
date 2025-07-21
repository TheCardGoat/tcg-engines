import { createId } from "~/game-engine/core-engine/utils/id-utils";
import type {
  EffectDefinition,
  TriggeredEffect,
} from "../../lorcana-engine-types";
import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Add triggered effects to the bag for processing
 * This is a Lorcana-specific mechanism for handling card triggers
 */
export function addTriggeredEffectsToTheBag(
  this: LorcanaCoreOperations,
  opts:
    | {
        timing:
          | "onPlay"
          | "onQuest"
          | "onPutIntoInkwell"
          | "onChallenge"
          | "onBanish"
          | "onDamage"
          | "onMove";
        cardInstanceId: string;
      }
    | {
        timing: "startOfTurn" | "endOfTurn";
        cardInstanceId: string;
      },
): void {
  const { timing, cardInstanceId } = opts;
  const card =
    timing !== "startOfTurn" && timing !== "endOfTurn"
      ? this.getCardInstance(cardInstanceId)
      : undefined;

  if (!card && timing !== "startOfTurn" && timing !== "endOfTurn") {
    return;
  }

  // Initialize the triggered effects bag if needed
  if (!this.state.G.triggeredEffectsBag) {
    this.state.G.triggeredEffectsBag = [];
  }

  // Initialize triggerEvents for backward compatibility
  if (!this.state.G.triggerEvents) {
    this.state.G.triggerEvents = [];
  }

  // Handle move-related triggers
  if (timing === "onMove") {
    const locationId = this.state.G.metas[cardInstanceId]?.location;

    if (locationId) {
      const location = this.getCardInstance(locationId);
      if (location) {
        // Check if the location has any triggered abilities for this timing
        checkAndAddTriggeredAbilities(
          this,
          location,
          timing,
          "characterMovesToThisLocation",
          cardInstanceId,
        );

        // Check if the character has any triggered abilities for moving
        checkAndAddTriggeredAbilities(
          this,
          card,
          timing,
          "thisCharacterMoves",
          cardInstanceId,
        );

        // Add tracking events for backward compatibility
        this.state.G.triggerEvents.push({
          type: "locationTrigger",
          timing,
          locationId,
          characterId: cardInstanceId,
          timestamp: Date.now(),
        });

        this.state.G.triggerEvents.push({
          type: "characterTrigger",
          timing,
          locationId,
          characterId: cardInstanceId,
          timestamp: Date.now(),
        });
      }
    }
  } else if (timing === "onPutIntoInkwell") {
    // Check if the card has any triggered abilities for inkwell
    checkAndAddTriggeredAbilities(
      this,
      card,
      timing,
      "thisCardPutIntoInkwell",
      cardInstanceId,
    );

    // Handle inkwell-related triggers
    this.state.G.triggerEvents.push({
      type: "inkwellTrigger",
      timing,
      characterId: cardInstanceId,
      timestamp: Date.now(),
    });
  }

  // Process any triggered effects that were added to the bag
  resolveTriggeredEffects.call(this);
}

/**
 * Check a card for triggered abilities and add them to the bag if they match
 */
function checkAndAddTriggeredAbilities(
  coreOps: LorcanaCoreOperations,
  cardInstance: any,
  timing: string,
  condition: string,
  triggeringCardId: string,
): void {
  if (!cardInstance.card.abilities) return;

  for (const ability of cardInstance.card.abilities) {
    // Handle our simplified format for testing
    if (
      ability.type === "triggered" &&
      ability.trigger === timing &&
      ability.condition === condition
    ) {
      const controller = coreOps.getCardOwner(cardInstance.instanceId);
      if (!controller) continue;

      const effect: EffectDefinition = {
        type: ability.effect,
        value: ability.value,
        targetType: ability.targetType || "controller",
        condition: ability.condition,
      };

      const triggeredEffect: TriggeredEffect = {
        id: createId(),
        sourceInstanceId: cardInstance.instanceId,
        effect,
        controller,
        optional: ability.optional,
        timestamp: Date.now(),
      };

      coreOps.state.G.triggeredEffectsBag!.push(triggeredEffect);
    }
    // Handle the actual Lorcana card format
    else if (
      ability.type === "static-triggered" &&
      ability.trigger?.on === "moves-to-a-location" &&
      timing === "onMove" &&
      condition === "thisCharacterMoves"
    ) {
      const controller = coreOps.getCardOwner(cardInstance.instanceId);
      if (!controller) continue;

      // Process the layer effects
      if (ability.layer?.effects) {
        for (const layerEffect of ability.layer.effects) {
          if (layerEffect.type === "lore") {
            const effect: EffectDefinition = {
              type: "gainLore",
              value: layerEffect.amount,
              targetType: "controller",
            };

            const triggeredEffect: TriggeredEffect = {
              id: createId(),
              sourceInstanceId: cardInstance.instanceId,
              effect,
              controller,
              optional: ability.layer.optional,
              timestamp: Date.now(),
            };

            coreOps.state.G.triggeredEffectsBag!.push(triggeredEffect);
          }
        }
      }
    }
  }
}

/**
 * Resolve all triggered effects in the bag
 */
function resolveTriggeredEffects(this: LorcanaCoreOperations): void {
  if (
    !this.state.G.triggeredEffectsBag ||
    this.state.G.triggeredEffectsBag.length === 0
  ) {
    return;
  }

  // Process effects in timestamp order (FIFO)
  const effectsToResolve = [...this.state.G.triggeredEffectsBag];
  this.state.G.triggeredEffectsBag = [];

  for (const triggeredEffect of effectsToResolve) {
    resolveTriggeredEffect.call(this, triggeredEffect);
  }
}

/**
 * Resolve a single triggered effect
 */
function resolveTriggeredEffect(
  this: LorcanaCoreOperations,
  triggeredEffect: TriggeredEffect,
): void {
  const { effect, controller } = triggeredEffect;

  switch (effect.type) {
    case "gainLore":
      if (effect.value && this.state.ctx.players[controller]) {
        this.state.ctx.players[controller].lore =
          (this.state.ctx.players[controller].lore || 0) + effect.value;
      }
      break;

    case "drawCard":
      // TODO: Implement draw card effect
      break;

    case "dealDamage":
      // TODO: Implement deal damage effect
      break;

    case "exertCard":
      // TODO: Implement exert card effect
      break;

    case "readyCard":
      // TODO: Implement ready card effect
      break;

    default:
      console.warn(`Unknown effect type: ${effect.type}`);
  }
}

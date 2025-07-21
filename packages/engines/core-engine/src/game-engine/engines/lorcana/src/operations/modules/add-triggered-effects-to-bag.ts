import { createId } from "~/game-engine/core-engine/utils/id-utils";
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
          | "onMove"
          | "onActivatedAbility";
        cardInstanceId: string;
      }
    | {
        timing: "startOfTurn" | "endOfTurn";
        cardInstanceId?: undefined;
      },
): void {
  const { timing, cardInstanceId } = opts;

  // Initialize the bag if needed
  if (!this.state.G.bag) {
    this.state.G.bag = [];
  }
  const cardsInPlay = this.lorcanaEngine.queryCardsInPlay();
  const cardsWithTriggered = cardsInPlay.filter((card) =>
    card.hasTriggerFor(timing),
  );

  // Handle end-of-turn and start-of-turn triggers by scanning all cards in play
  if (timing === "endOfTurn" || timing === "startOfTurn") {
    for (const cardInstance of cardsWithTriggered) {
      // Check if this card has triggered abilities for this timing
      // Check for end-of-turn triggers in various formats
      // Create a LayerItem for the bag
      const layerItem = {
        id: createId(),
        sourceCardId: cardInstance.instanceId,
        controllerId: cardInstance.owner,
        ability: {
          id: createId(),
          type: "triggered" as const,
          text: `${timing} trigger`,
          effect: {
            type: "gainLore",
            parameters: { amount: 1 },
          },
          timing: timing as any,
        },
        targets: [], // Will be resolved when the effect is processed
        timestamp: Date.now(),
        optional: false,
      };

      this.state.G.bag.push(layerItem);
    }

    return;
  }

  // Handle specific card triggers (for other timings like onMove, onPlay, etc.)
  if (!cardInstanceId) {
    return;
  }

  const card = this.getCardInstance(cardInstanceId);
  if (!card) {
    return;
  }

  // Handle move-related triggers
  switch (timing) {
    case "onMove": {
      console.log(`DEBUG: Handling onMove trigger for card ${cardInstanceId}`);

      const locationId = this.state.G.metas[cardInstanceId]?.location;
      console.log(`DEBUG: Location ID found: ${locationId}`);

      if (locationId) {
        const location = this.getCardInstance(locationId);
        if (location) {
          console.log("DEBUG: Location card:", {
            name: location.card.name,
            abilities: location.card.abilities,
          });

          // Check if the location has any triggered abilities for this timing
          checkAndAddTriggeredAbilities.call(
            this,
            location,
            timing,
            "characterMovesToThisLocation",
            cardInstanceId,
          );

          // Check if the character has any triggered abilities for moving
          console.log("DEBUG: Character card:", {
            name: card.card.name,
            abilities: card.card.abilities,
          });

          checkAndAddTriggeredAbilities.call(
            this,
            card,
            timing,
            "thisCharacterMoves",
            cardInstanceId,
          );
        }
      }
      break;
    }
    case "onPutIntoInkwell": // Check if the card has any triggered abilities for inkwell
      checkAndAddTriggeredAbilities.call(
        this,
        card,
        timing,
        "thisCardPutIntoInkwell",
        cardInstanceId,
      );
      break;
    case "onActivatedAbility": // Check if the card has any triggered abilities for activated abilities
      checkAndAddTriggeredAbilities.call(
        this,
        card,
        timing,
        "thisCardActivatesAbility",
        cardInstanceId,
      );
      break;
    case "onBanish": {
    }
  }
}

/**
 * Check a card for triggered abilities and add them to the bag if they match
 */
function checkAndAddTriggeredAbilities(
  this: LorcanaCoreOperations,
  cardInstance: any,
  timing: string,
  condition: string,
  triggeringCardId: string,
): void {
  console.log("DEBUG: checkAndAddTriggeredAbilities called with:", {
    cardName: cardInstance.card.name,
    timing,
    condition,
    triggeringCardId,
    hasAbilities: !!cardInstance.card.abilities,
    abilitiesCount: cardInstance.card.abilities?.length || 0,
  });

  if (!cardInstance.card.abilities) return;

  for (const ability of cardInstance.card.abilities) {
    console.log("DEBUG: Checking ability:", {
      type: ability.type,
      triggerOn: ability.trigger?.on,
      condition,
      timing,
    });

    // Handle our simplified format for testing
    if (
      ability.type === "triggered" &&
      ability.trigger === timing &&
      ability.condition === condition
    ) {
      const controller = this.getCardOwner(cardInstance.instanceId);
      if (!controller) continue;

      const layerItem = {
        id: createId(),
        sourceCardId: cardInstance.instanceId,
        controllerId: controller,
        ability: {
          id: createId(),
          type: "triggered" as const,
          text: `${timing} ${condition}`,
          effect: {
            type: ability.effect || "gainLore",
            parameters: { amount: ability.value || 1 },
          },
          timing: timing as any,
        },
        targets: [], // Will be resolved when the effect is processed
        timestamp: Date.now(),
        optional: ability.optional,
      };

      this.state.G.bag.push(layerItem);
    }
    // Handle the actual Lorcana card format
    else if (
      ability.type === "static-triggered" &&
      ability.trigger?.on === "moves-to-a-location" &&
      timing === "onMove" &&
      condition === "thisCharacterMoves"
    ) {
      console.log(
        "DEBUG: MATCHED static-triggered ability for character move!",
      );

      const controller = this.getCardOwner(cardInstance.instanceId);
      if (!controller) continue;

      console.log(`DEBUG: Controller found: ${controller}`);

      // Process the layer effects
      if (ability.layer?.effects) {
        console.log(
          `DEBUG: Processing ${ability.layer.effects.length} layer effects`,
        );

        for (const layerEffect of ability.layer.effects) {
          console.log("DEBUG: Processing layer effect:", layerEffect);

          if (layerEffect.type === "lore") {
            console.log(
              `DEBUG: Adding lore effect to bag: +${layerEffect.amount} lore`,
            );

            const layerItem = {
              id: createId(),
              sourceCardId: cardInstance.instanceId,
              controllerId: controller,
              ability: {
                id: createId(),
                type: "triggered" as const,
                text: "Character moves to location",
                effect: {
                  type: "gainLore",
                  parameters: { amount: layerEffect.amount },
                },
                timing: timing as any,
              },
              targets: [],
              timestamp: Date.now(),
              optional: ability.layer.optional,
            };

            this.state.G.bag.push(layerItem);
            console.log(
              `DEBUG: Added trigger to bag. Bag length now: ${this.state.G.bag.length}`,
            );
          }
        }
      } else {
        console.log("DEBUG: No layer effects found on ability");
      }
    } else {
      console.log("DEBUG: Ability did not match any conditions");
    }
  }
}

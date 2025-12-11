/**
 * Triggered Abilities (Rule 7.4)
 *
 * Triggered abilities automatically activate when their trigger condition is met.
 * - "When" triggers once per event
 * - "Whenever" triggers for each occurrence
 * - Floating triggers can occur after the card leaves play
 */

import type { Trigger } from "../cards";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import type {
  GameEvent,
  TriggerCondition,
  TriggeredAbilityDefinition,
  TriggeredAbilityInstance,
} from "./ability-types";

/**
 * Check if an event matches a trigger condition
 */
export function matchesTrigger(
  trigger: TriggerCondition | Trigger,
  event: GameEvent,
  sourceCardId: CardId,
  controllerId: PlayerId,
): boolean {
  // Handle Type 2: Core DSL Trigger
  if ("event" in trigger) {
    // TODO: Implement full DSL matching logic
    // For now, partial implementation to satisfy types
    if (
      trigger.event === "play" &&
      trigger.timing === "when" &&
      trigger.on === "SELF"
    ) {
      return event.type === "cardPlayed" && event.sourceCardId === sourceCardId;
    }
    return false;
  }

  // Handle Type 1: TriggerCondition (Legacy/Module)
  switch (trigger.type) {
    case "whenPlayed":
      return event.type === "cardPlayed" && event.sourceCardId === sourceCardId;

    case "whenBanished":
      return (
        event.type === "cardBanished" && event.targetCardId === sourceCardId
      );

    case "whenQuests":
      return event.type === "quest" && event.sourceCardId === sourceCardId;

    case "whenChallenges":
      return event.type === "challenge" && event.sourceCardId === sourceCardId;

    case "whenChallenged":
      return event.type === "challenge" && event.targetCardId === sourceCardId;

    case "whenExerted":
      return event.type === "exerted" && event.sourceCardId === sourceCardId;

    case "whenDamaged":
      return (
        event.type === "damageDealt" && event.targetCardId === sourceCardId
      );

    case "atStartOfTurn":
      return event.type === "turnStart" && event.playerId === controllerId;

    case "atEndOfTurn":
      return event.type === "turnEnd" && event.playerId === controllerId;

    case "wheneverYouPlay":
      if (event.type !== "cardPlayed") return false;
      if (event.playerId !== controllerId) return false;
      // Card filter check would go here if trigger.cardFilter is provided
      return true;

    case "wheneverOpponentPlays":
      if (event.type !== "cardPlayed") return false;
      if (event.playerId === controllerId) return false;
      return true;

    case "wheneverCharacterBanished":
      if (event.type !== "cardBanished") return false;
      // Would check if banished card is a character
      return true;

    case "custom":
      // Custom checks would be registered and looked up by checkId
      return false;

    default:
      return false;
  }
}

/**
 * Create a triggered ability instance ready for resolution
 */
export function createTriggeredInstance(
  ability: TriggeredAbilityDefinition,
  sourceCardId: CardId,
  controllerId: PlayerId,
  targets?: CardId[],
): TriggeredAbilityInstance {
  return {
    instanceId: `trigger-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    sourceCardId,
    controllerId,
    ability,
    isOptional: ability.isOptional ?? false,
    targets,
  };
}

/**
 * Get triggered abilities from a card that match an event
 */
export function getMatchingTriggers(
  card: LorcanaCardDefinition,
  cardId: CardId,
  controllerId: PlayerId,
  event: GameEvent,
  cardInPlay: boolean,
): TriggeredAbilityInstance[] {
  const abilities = card.abilities ?? [];
  const instances: TriggeredAbilityInstance[] = [];

  for (const ability of abilities) {
    if (ability.type !== "triggered") continue;

    // Skip if card not in play and ability doesn't float
    if (!(cardInPlay || ability.isFloating)) continue;

    if (matchesTrigger(ability.trigger, event, cardId, controllerId)) {
      instances.push(
        createTriggeredInstance(
          ability as unknown as TriggeredAbilityDefinition,
          cardId,
          controllerId,
        ),
      );
    }
  }

  return instances;
}

/**
 * Check if a trigger is a "floating" trigger that works after leaving play
 */
export function isFloatingTrigger(
  ability: TriggeredAbilityDefinition,
): boolean {
  return ability.isFloating ?? false;
}

/**
 * Check if a trigger condition is a "when" (once) or "whenever" (multiple) type
 */
export function isWheneverTrigger(
  trigger: TriggerCondition | Trigger,
): boolean {
  if ("timing" in trigger) {
    return trigger.timing === "whenever";
  }
  return trigger.type.startsWith("whenever");
}

/**
 * Get all triggered ability definitions from a card
 */
export function getTriggeredAbilities(
  card: LorcanaCardDefinition,
): TriggeredAbilityDefinition[] {
  const abilities = card.abilities ?? [];
  return abilities.filter(
    (a): boolean => a.type === "triggered",
  ) as unknown as TriggeredAbilityDefinition[];
}

/**
 * Check if ability is optional ("may" keyword)
 */
export function isOptionalTrigger(
  ability: TriggeredAbilityDefinition,
): boolean {
  return ability.isOptional ?? ability.effect.isOptional ?? false;
}

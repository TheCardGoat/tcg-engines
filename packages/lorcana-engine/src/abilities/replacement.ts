/**
 * Replacement Effects (Rule 7.7)
 *
 * Replacement effects modify events before they happen.
 * - Identified by "instead" keyword
 * - Only one replacement applies per event
 * - "Skip" effects prevent the event entirely
 */

import type { CardId } from "../types/game-state";
import type {
  EffectDefinition,
  GameEvent,
  GameEventType,
  ReplacementEffect,
} from "./ability-types";

/**
 * Check if an event can be replaced by a replacement effect
 */
export function canReplaceEvent(
  replacement: ReplacementEffect,
  event: GameEvent,
): boolean {
  // Match event type
  return replacement.replaceEvent === event.type;
}

/**
 * Check if a replacement effect prevents the event entirely
 */
export function isSkipEffect(replacement: ReplacementEffect): boolean {
  return replacement.withEffect === "nothing";
}

/**
 * Get the replacement effect to apply
 */
export function getReplacementEffect(
  replacement: ReplacementEffect,
): EffectDefinition | null {
  if (replacement.withEffect === "nothing") {
    return null;
  }
  return replacement.withEffect;
}

/**
 * Find applicable replacement effect for an event
 * Only one replacement can apply per event (first one wins)
 */
export function findApplicableReplacement(
  replacements: ReplacementEffect[],
  event: GameEvent,
): ReplacementEffect | null {
  for (const replacement of replacements) {
    if (canReplaceEvent(replacement, event)) {
      return replacement;
    }
  }
  return null;
}

/**
 * Apply a replacement effect to an event
 * Returns the modified event or null if event should be skipped
 */
export function applyReplacementToEvent(
  replacement: ReplacementEffect,
  originalEvent: GameEvent,
): GameEvent | null {
  if (isSkipEffect(replacement)) {
    // Event is completely prevented
    return null;
  }

  // Return modified event
  // The actual effect will be resolved by the effect resolver
  return {
    ...originalEvent,
    type: `replaced_${originalEvent.type}`,
    params: {
      ...originalEvent.params,
      originalEvent,
      replacementId: replacement.id,
    },
  };
}

/**
 * Create a replacement effect definition
 */
export function createReplacementEffect(
  id: string,
  text: string,
  replaceEvent: GameEventType,
  withEffect: EffectDefinition | "nothing",
): ReplacementEffect {
  return {
    type: "replacement",
    id,
    text,
    replaceEvent,
    withEffect,
  };
}

/**
 * Common replacement effects
 */
export const CommonReplacements = {
  /**
   * "If this character would be banished, [instead effect]"
   */
  preventBanish: (
    id: string,
    text: string,
    insteadEffect: EffectDefinition,
  ): ReplacementEffect =>
    createReplacementEffect(id, text, "banish", insteadEffect),

  /**
   * "Skip your draw phase"
   */
  skipDraw: (id: string, text: string): ReplacementEffect =>
    createReplacementEffect(id, text, "draw", "nothing"),

  /**
   * "If this character would take damage, prevent that damage"
   */
  preventDamage: (id: string, text: string): ReplacementEffect =>
    createReplacementEffect(id, text, "damage", "nothing"),
};

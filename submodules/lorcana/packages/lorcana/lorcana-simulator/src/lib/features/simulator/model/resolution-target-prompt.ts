import type { CardInstanceId, SlottedTargetInput, SlottedTargetKind } from "@tcg/lorcana-engine";
import { assertNeverSlottedKind } from "@tcg/lorcana-engine";

/**
 * Effect families the simulator is wired to render via
 * `ResolutionTargetOverlay`. Used by `prompt-snapshot.ts` and
 * `game-context.svelte.ts` to gate the overlay and pick localized copy.
 *
 * The renderer-side slot machinery that previously lived here was removed
 * once `buildPlayerInteractionView` from `@tcg/lorcana-interaction` became
 * the single source of truth for prompt rendering. Only these four exports
 * survive — the rest is exercised by integration tests in
 * `lorcana-simulator/src/testing/ui-state/`.
 */
export type SupportedResolutionTargetEffectType =
  | "move-damage"
  | "move-to-location"
  | "deal-damage"
  | "banish"
  | "discard"
  | "return-to-hand"
  | "ready"
  | "exert"
  | "modify-stat"
  | "gain-keyword"
  | "remove-damage";

const SUPPORTED_EFFECT_TYPES = new Set<SupportedResolutionTargetEffectType>([
  "move-damage",
  "move-to-location",
  "deal-damage",
  "banish",
  "discard",
  "return-to-hand",
  "ready",
  "exert",
  "modify-stat",
  "gain-keyword",
  "remove-damage",
]);

export function isSupportedResolutionTargetEffectType(
  effectType: string | null | undefined,
): effectType is SupportedResolutionTargetEffectType {
  return (
    typeof effectType === "string" &&
    SUPPORTED_EFFECT_TYPES.has(effectType as SupportedResolutionTargetEffectType)
  );
}

/**
 * Localized prompt copy for the active slot of a target-selection prompt.
 *
 * Returns `null` when the (effectType, slotIndex) pair has no dedicated
 * message — the renderer falls back to its own copy in that case.
 *
 * Still consumed by `game-context.svelte.ts` for status-line copy and by
 * `prompt-snapshot.ts` for assertable test snapshots.
 */
export function getResolutionTargetPromptMessage(
  effectType: SupportedResolutionTargetEffectType | null,
  activeSlotIndex: number | null,
  totalSlots?: number,
): string | null {
  const hasActiveSlot = typeof activeSlotIndex === "number";

  if (effectType === "move-damage") {
    if (activeSlotIndex === 0) {
      return "Choose the character to move damage from.";
    }

    if (activeSlotIndex === 1) {
      return "Choose the character to move damage to.";
    }
  }

  if (effectType === "move-to-location") {
    // Slot 0 is always a character slot. The location slot is always the last slot —
    // index 1 for a standard single-character move, or index N-1 for multi-character
    // moves (e.g. GATHERING FORCES with N characters + 1 location).
    // Intermediate character slots (index > 0 and index < N-1) get the character message.
    if (activeSlotIndex === 0) {
      return "Choose the character to move.";
    }

    if (typeof activeSlotIndex === "number" && activeSlotIndex > 0) {
      if (totalSlots !== undefined) {
        // Multi-character move: show location only if this is the final slot.
        if (activeSlotIndex === totalSlots - 1) {
          return "Choose the location to move to.";
        }
        return "Choose the character to move.";
      }
      // Single-character move assumption (when totalSlots is unknown).
      return "Choose the location to move to.";
    }
  }

  if (effectType === "deal-damage" && hasActiveSlot) {
    return "Choose the character to deal damage to.";
  }

  if (effectType === "banish" && hasActiveSlot) {
    return "Choose the character to banish.";
  }

  if (effectType === "discard" && hasActiveSlot) {
    return "Choose a card to discard.";
  }

  if (effectType === "return-to-hand" && hasActiveSlot) {
    return "Choose the character to return to its player's hand.";
  }

  if (effectType === "ready" && hasActiveSlot) {
    return "Choose the character to ready.";
  }

  if (effectType === "exert" && hasActiveSlot) {
    return "Choose the character to exert.";
  }

  if (effectType === "modify-stat" && hasActiveSlot) {
    return "Choose the character.";
  }

  if (effectType === "gain-keyword" && hasActiveSlot) {
    return "Choose the character.";
  }

  if (effectType === "remove-damage" && hasActiveSlot) {
    return "Choose the character to remove damage from.";
  }

  return null;
}

/**
 * Assemble a `SlottedTargetInput` for the given kind from the flat positional
 * selection state the simulator maintains. Exhaustiveness is enforced: adding
 * a new variant to `SlottedTargetInput` without extending this switch is a
 * compile error (see `assertNeverSlottedKind`).
 *
 * The caller is responsible for only invoking this when the engine asked for a
 * slotted form (i.e. `context.expectedSlottedKind` is set) and enough slots
 * have been filled (see `SLOTTED_TARGET_SLOT_KEYS` on the engine side for slot
 * counts). Under-filled cases should fall back to the flat-array path.
 */
export function buildSlottedTargetsFromSelection(
  kind: SlottedTargetKind,
  selected: readonly string[],
): SlottedTargetInput {
  const at = (index: number): CardInstanceId[] =>
    selected[index] ? [selected[index] as CardInstanceId] : [];

  switch (kind) {
    case "move-damage":
      return { kind: "move-damage", from: at(0), to: at(1) };
    case "move-to-location": {
      // Multi-character move (e.g. GATHERING FORCES): all selections except the last
      // are character subjects; the last selection is the destination location.
      // Filter out empty slots (null/undefined) — they appear when the user skips
      // to the location slot before filling every character slot.
      const locationIndex = Math.max(0, selected.length - 1);
      const subjects = selected
        .slice(0, locationIndex)
        .filter((id): id is string => Boolean(id))
        .map((id) => id as CardInstanceId);
      return { kind: "move-to-location", subject: subjects, location: at(locationIndex) };
    }
    case "shift-and-choose":
    case "banish-and-play":
      // v1 scope: these kinds have no simulator prompt yet. Throw rather than
      // silently emit an empty slotted input so misuse is loud.
      throw new Error(`slotted kind ${kind} is not wired to a UI prompt yet`);
    default:
      return assertNeverSlottedKind(kind);
  }
}

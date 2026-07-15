import type { AvailableMovesSelectionState } from "@/features/simulator/model/contracts.js";

// Effects whose slot structure doesn't map cleanly to picking cards on the
// board. Multi-character `move-to-location` prompts are intentionally handled
// through the inline board prompt so they stay non-intrusive.
const OVERLAY_EFFECT_TYPES = new Set<string>(["move-damage"]);

export function shouldUseResolutionTargetOverlay(
  selectionState: AvailableMovesSelectionState | null | undefined,
): boolean {
  return Boolean(
    selectionState?.mode === "resolution-target" &&
    selectionState.effectType &&
    OVERLAY_EFFECT_TYPES.has(selectionState.effectType) &&
    selectionState.slots.length > 0,
  );
}

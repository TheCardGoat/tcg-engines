import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabRulesView } from "../rules-view.ts";
import type { FabPriorityAutomationMode } from "../../state.ts";

export type { FabLegalCommand } from "./types.ts";

/** Every per-seat priority mode, in UI display order. */
export const FAB_PRIORITY_MODES = [
  "auto-pass",
  "always-hold",
  "play-and-skip",
] as const satisfies readonly FabPriorityAutomationMode[];

/**
 * Stable action labels for player-owned priority-seat configuration. The
 * adapter projects these as interaction-action text keys and the simulator
 * identifies the per-mode controls by them, so they are API — rename only
 * with a coordinated client update.
 */
export const FAB_PRIORITY_MODE_ACTION_LABEL: Record<FabPriorityAutomationMode, string> = {
  "auto-pass": "Pass priority automatically",
  "always-hold": "Hold priority windows",
  "play-and-skip": "Play and skip follow-up windows",
};

/** Stable action label for the one-shot "play and hold" arm command. */
export const FAB_ARM_PRIORITY_HOLD_LABEL = "Play and hold priority";

/**
 * Stable labels for the per-seat automation-preference toggles beyond the
 * three priority modes. Like the mode labels, the adapter projects these as
 * interaction-action text keys and clients identify controls by them.
 */
export const FAB_AUTOMATION_PREFERENCE_LABELS = {
  autoOrderTriggersOn: "Auto-order simultaneous triggers",
  autoOrderTriggersOff: "Ask about simultaneous trigger order",
  autoSelectSingletonTargetsOn: "Auto-select the only legal target",
  autoSelectSingletonTargetsOff: "Ask when an effect has one legal target",
  playAndSkipHoldAdd: "Keep priority after playing this card",
  playAndSkipHoldRemove: "Resume skipping after this card",
  opponentYieldAdd: "Always pass to this card's triggers",
  opponentYieldRemove: "Stop passing to this card's triggers",
  instantYieldAdd: "Auto-yield this card",
  instantYieldRemove: "Stop auto-yielding this card",
} as const;

export function evaluatedObject(state: FabRulesSnapshot, view: FabRulesView, instanceId: string) {
  const record = state.objects[instanceId];
  return record
    ? view.object({ instanceId: record.instanceId, incarnation: record.incarnation })
    : null;
}

export function shortId(id: string): string {
  return id.length > 18 ? `${id.slice(0, 12)}…` : id;
}

export function stablePayloadKey(payload: Record<string, unknown>): string {
  // Sort pitch arrays for stable dedupe.
  const clone: Record<string, unknown> = { ...payload };
  if (Array.isArray(clone.pitch)) {
    clone.pitch = [...(clone.pitch as string[])].sort();
  }
  if (Array.isArray(clone.cardIds)) {
    clone.cardIds = [...(clone.cardIds as string[])].sort();
  }
  return JSON.stringify(clone);
}

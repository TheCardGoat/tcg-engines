import type { FabPresentationState } from "./state";

export type FabCombatPriorityPresentation =
  | {
      readonly kind: "close-chain";
      readonly buttonLabel: "Close combat chain";
      readonly compactButtonLabel: "Close chain";
    }
  | {
      readonly kind: "pass";
      readonly buttonLabel: "Pass priority";
      readonly compactButtonLabel: "Pass";
    }
  | { readonly kind: "waiting" };

/**
 * Translate the engine-owned priority-window meaning into FAB combat controls.
 * Combat step alone is deliberately insufficient: both players receive
 * priority during Resolution, but only the attacker owns chain continuation.
 */
export function deriveFabCombatPriorityPresentation(
  priorityWindow: FabPresentationState["priorityWindow"],
): FabCombatPriorityPresentation {
  if (priorityWindow == null) return { kind: "waiting" };
  switch (priorityWindow.kind) {
    case "combat-chain-continuation":
      return {
        kind: "close-chain",
        buttonLabel: "Close combat chain",
        compactButtonLabel: "Close chain",
      };
    case "combat-resolution-response":
    case "ordinary-priority":
      return {
        kind: "pass",
        buttonLabel: "Pass priority",
        compactButtonLabel: "Pass",
      };
    case "none":
    case "defense-declaration":
    case "terminal-action-phase":
    case "decision":
      return { kind: "waiting" };
  }
}

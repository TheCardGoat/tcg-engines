import type { EngineInteractionView } from "@tcg/protocol";

import type { MoveName } from "../../game/index.ts";

export interface RequiredPrimaryAction {
  readonly id: MoveName;
  readonly label: string;
  readonly hint: string;
}

/**
 * Projects mandatory, non-pass decisions into the simulator's primary-action
 * slot. Keep this list deliberately small: optional card actions remain on
 * their cards, while flow-blocking decisions need an explicit entry point.
 */
export function requiredPrimaryAction(view: EngineInteractionView): RequiredPrimaryAction | null {
  if (view.status !== "ready") return null;

  const discard = view.actions.find(
    (action) => action.id === "discardToHandLimit" && action.enabled,
  );
  if (!discard) return null;

  const selection = discard.inputs.find(
    (input) => input.kind === "entity-selection" && input.id === "cardIds",
  );
  const count = selection?.kind === "entity-selection" ? selection.min : undefined;
  const cardLabel = count === 1 ? "card" : "cards";

  return {
    id: "discardToHandLimit",
    label: count === undefined ? "DISCARD CARDS" : `DISCARD ${count}`,
    hint:
      count === undefined
        ? "Choose cards to discard until your hand contains ten cards."
        : `Choose ${count} ${cardLabel} to discard.`,
  };
}

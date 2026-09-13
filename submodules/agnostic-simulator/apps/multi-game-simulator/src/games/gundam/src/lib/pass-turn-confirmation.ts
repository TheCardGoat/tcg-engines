import type { InteractionAction } from "@tcg/protocol";

const NON_GAMEPLAY_ACTIONS = new Set([
  "concede",
  "passActionStep",
  "passBattleAction",
  "passBlock",
  "passTurn",
]);

/**
 * Returns whether passing the main phase would leave another enabled gameplay
 * move unused. Disabled moves and alternate pass/concede controls do not count.
 */
export function hasOpenTurnActions(
  actions: readonly Pick<InteractionAction, "enabled" | "id">[],
): boolean {
  return actions.some((action) => action.enabled && !NON_GAMEPLAY_ACTIONS.has(action.id));
}

/**
 * MatchRuntime Priority Resolution
 */

import type { CtxPriority } from "./types";

/**
 * Resolves the effective priority player, accounting for pendingChoice.
 * During target selection, pendingChoice.playerID (the decision-maker) takes
 * precedence over priority.holder (the priority holder).
 */
export function resolvePriorityPlayer(priority: CtxPriority): string | undefined {
  return (priority.pendingChoice?.playerID ?? priority.holder) as string | undefined;
}

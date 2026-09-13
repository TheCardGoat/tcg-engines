/**
 * Arsenal zone capacity (CR arsenal zones / New Horizon additional zone).
 *
 * Base capacity is 1. Continuous `rule-modification` allow
 * `additional-arsenal-zone` under a controller raises capacity by 1 each.
 */
import type { FabMatchState } from "../state.ts";
import type { FabRulesView } from "./rules-view.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";

export function arsenalCapacity(
  state: FabRulesSnapshot | FabMatchState,
  playerId: string,
  view?: FabRulesView,
): number {
  const resolved = view ?? buildFabRulesView(state as FabMatchState);
  const extras = resolved
    .rules("additional-arsenal-zone")
    .filter((rule) => rule.mode === "allow" && rule.controllerId === playerId).length;
  return 1 + extras;
}

/** True when the player can put another card into arsenal. */
export function arsenalHasRoom(
  state: FabRulesSnapshot | FabMatchState,
  playerId: string,
  view?: FabRulesView,
): boolean {
  const arsenal = state.containers.zonesByPlayerId[playerId]?.arsenal ?? [];
  return arsenal.length < arsenalCapacity(state, playerId, view);
}

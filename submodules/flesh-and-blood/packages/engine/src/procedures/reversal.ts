import type { FabMatchState } from "../state.ts";
import type { FabProcessId } from "../rules/events.ts";

export type FabRulesActionReversalReason =
  | {
      readonly code: "required_targets_unavailable";
      readonly message: string;
      /** Public printed instruction whose target requirement could not be satisfied. */
      readonly targetDescription?: string;
    }
  | { readonly code: "required_cost_unpayable"; readonly message: string }
  | { readonly code: "illegal_parameters"; readonly message: string };

/**
 * CR 1.10.3 / 5.1.5: erase the complete tentative action without rewinding
 * deterministic counters or the command revision. Tentative journals are
 * owned solely by the active process, so dropping the process drops every
 * uncommitted event, replacement, trigger, and analytics candidate together.
 */
export function reverseFabRulesAction(
  state: FabMatchState,
  processId: FabProcessId,
  actorId: string,
): FabMatchState {
  const process = state.rulesProcess;
  if (!process || process.processId !== processId) {
    throw new Error("Cannot reverse a stale FAB rules process.");
  }
  if (
    (process.procedure?.kind !== "play-card" && process.procedure?.kind !== "activate") ||
    process.procedure.actorId !== actorId
  ) {
    throw new Error("Only the owner of an active play or activation may reverse it.");
  }
  state.decision = null;
  state.rulesProcess = null;
  return state;
}

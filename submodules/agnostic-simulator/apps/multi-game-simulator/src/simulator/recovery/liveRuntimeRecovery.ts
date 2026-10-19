import type { RuntimeRecoveryCode } from "@tcg/protocol";

export interface LiveRuntimeRecovery {
  code: RuntimeRecoveryCode;
  version: number;
  incidentId?: string;
  phase: "syncing" | "blocked" | "review";
}

/** Never replay an action here. Sync resolves uncertainty; the player chooses their next action. */
export function startRuntimeRecovery(
  code: RuntimeRecoveryCode,
  version: number,
  previous: LiveRuntimeRecovery | null,
  incidentId?: string,
): LiveRuntimeRecovery {
  return {
    code,
    version,
    incidentId,
    phase:
      code === "game_state_incompatible" || previous?.version === version ? "blocked" : "syncing",
  };
}

export function reconcileRuntimeRecovery(
  recovery: LiveRuntimeRecovery | null,
  version: number,
  hasUsableActions: boolean,
): LiveRuntimeRecovery | null {
  if (!recovery || !hasUsableActions || version < recovery.version) return recovery;
  if (version > recovery.version) return null;
  // An unchanged board is not proof the failed engine action is now fixed.
  // Allow an explicit player retry after a successful, requested refresh only.
  return recovery.phase === "syncing" ? { ...recovery, phase: "review" } : recovery;
}

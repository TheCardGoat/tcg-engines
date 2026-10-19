import { describe, expect, it } from "vitest";
import { startRuntimeRecovery, reconcileRuntimeRecovery } from "./liveRuntimeRecovery";

describe("runtime recovery", () => {
  it("offers one automatic refresh per failing board, then requires a player decision", () => {
    const first = startRuntimeRecovery("game_engine_failed", 38, null, "incident-1");
    expect(first.phase).toBe("syncing");
    const refreshed = reconcileRuntimeRecovery(first, 38, true);
    expect(refreshed?.phase).toBe("review");
    const repeated = startRuntimeRecovery("game_engine_failed", 38, refreshed, "incident-2");
    expect(repeated.phase).toBe("blocked");
    expect(reconcileRuntimeRecovery(repeated, 38, true)).toBe(repeated);
    expect(reconcileRuntimeRecovery(repeated, 39, true)).toBeNull();
  });
  it("does not refresh an unsupported snapshot or accept a stale/incomplete recovery", () => {
    const incompatible = startRuntimeRecovery("game_state_incompatible", 38, null);
    expect(incompatible.phase).toBe("blocked");
    const syncing = startRuntimeRecovery("game_engine_failed", 38, null);
    expect(reconcileRuntimeRecovery(syncing, 37, true)).toBe(syncing);
    expect(reconcileRuntimeRecovery(syncing, 39, false)).toBe(syncing);
  });
});

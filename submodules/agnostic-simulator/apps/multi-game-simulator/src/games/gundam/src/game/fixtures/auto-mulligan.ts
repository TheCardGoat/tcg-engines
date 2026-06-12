import { asPlayerId, type MatchRuntime, type PlayerId } from "@tcg/gundam-engine";

/**
 * Scaffolding helper: reactively submits `alterHand {wantsRedraw:false}` for a
 * non-viewer player the moment the engine enters the mulligan phase with that
 * player still in `pendingDecision`. Unblocks the setup flow past mulligan
 * for simulator seats that only speak for the viewer.
 *
 * This is NOT a general-purpose bot — it exists to let single-seat E2E tests
 * cover shields / EX-base / main-phase milestones without requiring a
 * hot-seat view-swap or network peer. Use a real bot (see the engine's
 * `PassOnlyBot`) once we need opponent decisions beyond mulligan.
 *
 * Reaches into `state.ctx._stateID` for `prevStateID` — acceptable here since
 * this is test-only orchestration, not production adapter code. Returns the
 * `unsubscribe` function for cleanup.
 */
export function attachAutoMulliganKeep(runtime: MatchRuntime, playerName: string): () => void {
  const player = asPlayerId(playerName) as PlayerId;

  const tryAutoKeep = () => {
    const state = runtime.getState();
    if (state.ctx.status.phase !== "mulligan") return;
    const pending = state.ctx.status.pendingDecision ?? [];
    if (!pending.includes(player)) return;
    // The mulligan move advances `activePlayer` to the next pending id after
    // each submission, so this listener will typically only clear validation
    // once the viewer has already mulliganed. If `activePlayer` still points
    // at somebody else (e.g. the viewer hasn't acted yet), the submit below
    // will fail NOT_ACTIVE_PLAYER and we quietly wait for the next update.
    if (state.ctx.status.activePlayer !== player) return;

    runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "alterHand",
        prevStateID: state.ctx._stateID,
        actorRole: "player",
        args: { wantsRedraw: false },
      },
      player,
    );
  };

  // Check immediately in case the runtime is already in mulligan at install
  // time, then subscribe for future transitions.
  tryAutoKeep();
  return runtime.onStateUpdate(tryAutoKeep);
}

import { describe, expect, it } from "vite-plus/test";
import { asPlayerId } from "@tcg/gundam-engine";

import { DEV_PLAYER_ONE, DEV_PLAYER_TWO } from "../dev-runtime.ts";
import { loadSetupDefaultOpponentKeeps } from "./setup-default-opponent-keeps.ts";

/**
 * Verifies that the opponent-keeps scaffolding unblocks the setup flow when
 * the viewer submits only their own moves. If this passes, the Playwright
 * milestones past mulligan (shields / EX Base / main-phase) can boot into
 * this fixture and drive through the viewer's UI alone.
 */
describe("setup-default-opponent-keeps", () => {
  it("auto-mulligans the opponent so the viewer alone can reach main-phase", () => {
    const { runtime } = loadSetupDefaultOpponentKeeps();
    const viewer = asPlayerId(DEV_PLAYER_ONE);
    const opponent = asPlayerId(DEV_PLAYER_TWO);

    // Viewer picks first player — engine enters mulligan; onEnter deals 5.
    const afterChoose = runtime.executeCommand(
      {
        commandID: "test-choose",
        move: "chooseFirstPlayer",
        prevStateID: runtime.getState().ctx._stateID,
        actorRole: "player",
        args: { playerId: DEV_PLAYER_ONE },
      },
      viewer,
    );
    expect(afterChoose.success).toBe(true);

    // At this point activePlayer is still the viewer (P1), so the auto-keep
    // listener correctly holds off — the opponent is still in pendingDecision.
    expect(runtime.getState().ctx.status.pendingDecision).toContain(opponent);

    // Viewer keeps too. Mulligan's `execute` flips activePlayer to the next
    // pending id (P2), which causes the state-update listener to fire the
    // opponent's auto-keep before executeCommand returns. With both keeps
    // applied, mulligan's endIf fires and onExit fills shields (6-2-2), EX
    // Base (6-2-3), and the P2 EX Resource (6-2-4).
    const afterKeep = runtime.executeCommand(
      {
        commandID: "test-keep",
        move: "alterHand",
        prevStateID: runtime.getState().ctx._stateID,
        actorRole: "player",
        args: { wantsRedraw: false },
      },
      viewer,
    );
    expect(afterKeep.success).toBe(true);

    const finalState = runtime.getState();
    expect(finalState.ctx.status.pendingDecision ?? []).not.toContain(opponent);
    expect(finalState.ctx.status.gameSegment).toBe("turnCycle");

    const shieldsP1 = finalState.ctx.zones.private.zoneCards[`shieldArea:${DEV_PLAYER_ONE}`] ?? [];
    const shieldsP2 = finalState.ctx.zones.private.zoneCards[`shieldArea:${DEV_PLAYER_TWO}`] ?? [];
    expect(shieldsP1.length).toBe(6);
    expect(shieldsP2.length).toBe(6);
  });
});

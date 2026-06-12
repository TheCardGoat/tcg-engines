/**
 * chooseFirstPlayer — focused move unit tests.
 *
 * The end-to-end setup flow is covered in
 * `lifecycle/setup/setup-flow.test.ts`. This file exercises only the
 * `chooseFirstPlayer` move definition: its validate guard and the
 * status patch produced by execute (turnPlayer / activePlayer /
 * pendingDecision ordering). Unhappy paths route through
 * `executeCommand` so rejections surface without throwing.
 */

import { describe, it, expect } from "vite-plus/test";
import "../../testing/register-matchers.ts";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, asPlayerId } from "../../../index.ts";

function createEngine() {
  return GundamTestEngine.create(
    { deck: 12, resourceDeck: 10 },
    { deck: 12, resourceDeck: 10 },
    { skipToMainPhase: false },
  );
}

describe("chooseFirstPlayer — move unit", () => {
  it("sets turnPlayer and activePlayer to the chosen player", () => {
    const engine = createEngine();

    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });

    const status = engine.getState().ctx.status;
    expect(status.turnPlayer).toBe(PLAYER_ONE);
    expect(status.activePlayer).toBe(PLAYER_ONE);
  });

  it("orders pendingDecision with the first player ahead", () => {
    const engine = createEngine();

    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });

    const { pendingDecision } = engine.getState().ctx.status;
    expect(pendingDecision).toEqual([PLAYER_ONE, PLAYER_TWO]);
  });

  it("allows the active player to designate the opponent as first", () => {
    const engine = createEngine();

    // The RPS-winning caller (PLAYER_ONE here) may still pick PLAYER_TWO.
    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_TWO });

    const status = engine.getState().ctx.status;
    expect(status.turnPlayer).toBe(PLAYER_TWO);
    expect(status.activePlayer).toBe(PLAYER_TWO);
    expect(status.pendingDecision).toEqual([PLAYER_TWO, PLAYER_ONE]);
  });

  it("rejects an unknown player id with INVALID_PLAYER + typed envelope", () => {
    const engine = createEngine();
    const runtime = engine.getRuntime();

    const result = runtime.executeCommand(
      {
        commandID: "test-invalid-player",
        move: "chooseFirstPlayer",
        prevStateID: runtime.state.ctx._stateID,
        actorRole: "player",
        args: { playerId: "ghost-player" },
      },
      asPlayerId(PLAYER_ONE),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INVALID_PLAYER");
      expect(result.envelope).toEqual({
        key: "gundam.error.setup.invalidPlayerId",
        values: { playerId: "ghost-player" },
      });
    }
  });
});

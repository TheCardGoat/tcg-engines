/**
 * alterHand (mulligan) — focused move unit tests.
 *
 * The end-to-end setup flow is covered in
 * `lifecycle/setup/setup-flow.test.ts`. This file exercises only the
 * `alterHand` move: the all-or-nothing redraw, pendingDecision
 * bookkeeping, and the already-decided rejection path.
 */

import { describe, it, expect } from "vite-plus/test";
import "../../testing/register-matchers.ts";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, asPlayerId } from "../../../index.ts";

const INITIAL_HAND_SIZE = 5;

function createEngineAtMulligan() {
  const engine = GundamTestEngine.create(
    { deck: 12, resourceDeck: 10 },
    { deck: 12, resourceDeck: 10 },
    { skipToMainPhase: false },
  );
  engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });
  return engine;
}

describe("alterHand (mulligan) — move unit", () => {
  it("keeps the hand when wantsRedraw=false and removes the player from pendingDecision", () => {
    const engine = createEngineAtMulligan();
    const handBefore = engine.getCardsInZone({ zone: "hand", playerId: PLAYER_ONE });

    engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: false });

    const handAfter = engine.getCardsInZone({ zone: "hand", playerId: PLAYER_ONE });
    expect(handAfter).toEqual(handBefore);

    const { pendingDecision, activePlayer } = engine.getState().ctx.status;
    expect(pendingDecision).toEqual([PLAYER_TWO]);
    expect(activePlayer).toBe(PLAYER_TWO);
  });

  it("redraws the full hand when wantsRedraw=true, preserving deck+hand contents as a set", () => {
    const engine = createEngineAtMulligan();
    const handBefore = engine.getCardsInZone({ zone: "hand", playerId: PLAYER_ONE });
    const deckBefore = engine.getCardsInZone({ zone: "deck", playerId: PLAYER_ONE });

    const result = engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: true });

    expect(result.success).toBe(true);
    expect(engine).toHaveCardCountInZone({ zone: "hand", playerId: PLAYER_ONE }, INITIAL_HAND_SIZE);

    const handAfter = engine.getCardsInZone({ zone: "hand", playerId: PLAYER_ONE });
    const deckAfter = engine.getCardsInZone({ zone: "deck", playerId: PLAYER_ONE });
    expect(deckAfter.length).toBe(deckBefore.length);
    expect([...handAfter, ...deckAfter].sort()).toEqual([...handBefore, ...deckBefore].sort());
  });

  it("rejects a second alterHand from the same player with MULLIGAN_ALREADY_DONE or NOT_ACTIVE_PLAYER", () => {
    const engine = createEngineAtMulligan();
    const runtime = engine.getRuntime();

    engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: false });

    const result = runtime.executeCommand(
      {
        commandID: "test-double-mulligan",
        move: "alterHand",
        prevStateID: runtime.state.ctx._stateID,
        actorRole: "player",
        args: { wantsRedraw: false },
      },
      asPlayerId(PLAYER_ONE),
    );

    expect(result.success).toBe(false);
    // Either guard may fire first depending on flow-order. Both are
    // correct rejections; keep the test tolerant to that ordering.
    if (!result.success) {
      expect(["NOT_ACTIVE_PLAYER", "MULLIGAN_ALREADY_DONE"]).toContain(result.errorCode);
    }
  });
});

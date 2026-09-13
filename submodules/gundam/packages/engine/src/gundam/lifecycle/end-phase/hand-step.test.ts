import { describe, expect, it } from "vite-plus/test";

import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "../../testing/index.ts";
import { asPlayerId } from "../../../types/branded.ts";

describe("end-phase hand-step", () => {
  it("gives the turn player priority to discard an oversized hand after both action passes", () => {
    const hand = Array.from({ length: 11 }, (_, index) =>
      createMockUnit({ name: `Hand card ${index + 1}` }),
    );
    const engine = GundamTestEngine.create({ hand }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(engine.getState().ctx.status).toMatchObject({
      phase: "end-phase",
      step: "hand-step",
      turnPlayer: PLAYER_ONE,
      activePlayer: PLAYER_ONE,
    });

    const discardId = p1.getHand()[0]!;
    expectSuccess(
      engine.doMove("discardToHandLimit", asPlayerId(PLAYER_ONE), { cardIds: [discardId] }),
    );
    expect(p1.getHand()).toHaveLength(10);
    expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);
    expect(engine.getState().ctx.status).toMatchObject({
      phase: "main-phase",
      turnPlayer: PLAYER_TWO,
      activePlayer: PLAYER_TWO,
    });
  });
});

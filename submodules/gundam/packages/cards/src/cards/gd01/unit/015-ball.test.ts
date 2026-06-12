import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Ball015 } from "./015-ball.ts";

describe("Ball (GD01-015)", () => {
  it("【Attack】 recovers 1 HP on the lone friendly Unit when this Unit attacks", () => {
    // Ball (AP 1, HP 1) attacks direct. The Attack trigger auto-picks
    // the lone friendly — Ball itself — as the recovery target. We
    // pre-damage Ball so the recoverHP has an observable delta.
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [gd01Ball015] }, { play: [defender] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p1Id = asPlayerId(PLAYER_ONE);
    const p2Id = asPlayerId(PLAYER_TWO);
    const ballId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;
    const defenderId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[0]!;

    engine.getG().damage[ballId] = 1;
    engine.getG().exhausted[ballId] = false;

    expectSuccess(p1.enterBattle(ballId, defenderId));

    // Attack trigger recovered 1 HP from Ball — damage cleared.
    expect(engine.getG().damage[ballId] ?? 0).toBe(0);
  });
});

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { betaBall015 } from "./015-ball.ts";

describe("Ball (GD01-015)", () => {
  it("【Attack】Choose 1 of your Units. It recovers 1 HP.", () => {
    const friendly = createMockUnit({ ap: 1, hp: 5 });
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [betaBall015, friendly] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const ballId = p1.getCardsInZone("battleArea")[0]!;
    const friendlyId = p1.getCardsInZone("battleArea")[1]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    // Pre-damage both friendlies; the auto-picked target gets healed first.
    engine.getG().damage[friendlyId] = 2;
    engine.getG().damage[ballId] = 2;
    const totalDamageBefore =
      getDamageCounter(engine, friendlyId) + getDamageCounter(engine, ballId);
    expect(totalDamageBefore).toBe(4);

    expectSuccess(p1.enterBattle(ballId, enemyId));

    // 【Attack】 trigger auto-drained and healed 1 HP off exactly one friendly Unit.
    const totalDamageAfter =
      getDamageCounter(engine, friendlyId) + getDamageCounter(engine, ballId);
    expect(totalDamageAfter).toBe(totalDamageBefore - 1);
  });
});

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaChangWufei091 } from "./091-chang-wufei.ts";
describe("Chang Wufei (GD01-091)", () => {
  it("【Burst】 adds Chang to hand when his shield is destroyed", () => {
    // Baseline: the "Add this card to your hand" clause always resolves.
    // The subordinate preventDamage rider ("if this Unit has <Breach>, it
    // can't receive battle damage from enemy Units with 3 or less AP") is
    // delegated (see docs/card-delegations/beta.md — `preventDamage unitFilter`).
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { deck: [betaChangWufei091] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getHand()).toContain(shieldId!);
  });
});

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaRickDom030 } from "./030-rick-dom.ts";
describe("Rick Dom (GD01-030)", () => {
  it("<Breach 2> deals 2 damage to a shield when the attacker destroys a Unit", () => {
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const shieldSeed = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [betaRickDom030] },
      { play: [defender], deck: [shieldSeed] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const rickId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(rickId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Rick Dom (AP 3) destroys defender (HP 1) → Breach 2 lands on the shield.
    expect(getDamageCounter(engine, shieldId!)).toBe(2);
  });
});

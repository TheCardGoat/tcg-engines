import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { betaShenlongGundam041 } from "./041-shenlong-gundam.ts";
describe("Shenlong Gundam (GD01-041)", () => {
  it("<Breach 3> deals 3 damage to a shield when the attacker destroys a Unit", () => {
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const shieldSeed = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [betaShenlongGundam041] },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shieldSeed] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shenlongId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(shenlongId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
  });
});

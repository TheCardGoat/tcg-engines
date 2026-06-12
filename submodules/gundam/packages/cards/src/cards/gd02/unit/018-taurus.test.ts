import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd02Taurus018 } from "./018-taurus.ts";

describe("Taurus (GD02-018)", () => {
  it("This Unit can't choose the enemy player as its attack target.", () => {
    const enemy = createMockUnit({ ap: 1, hp: 2 });
    const engine = GundamTestEngine.create({ play: [gd02Taurus018] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [taurusId] = p1.getCardsInZone("battleArea");
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    // Direct attack should be rejected
    expectFailure(p1.enterBattle(taurusId!, "direct"), "CANNOT_TARGET_PLAYER");

    // Attacking an enemy unit should still work
    expectSuccess(p1.enterBattle(taurusId!, enemyId!));
  });
});

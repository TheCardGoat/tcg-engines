import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd02Gafran066 } from "./066-gafran.ts";

describe("Gafran (GD02-066)", () => {
  it("This Unit can't choose the enemy player as its attack target.", () => {
    const enemy = createMockUnit({ ap: 1, hp: 2 });
    const engine = GundamTestEngine.create({ play: [gd02Gafran066] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [gafranId] = p1.getCardsInZone("battleArea");
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    // Direct attack should be rejected
    expectFailure(p1.enterBattle(gafranId!, "direct"), "CANNOT_TARGET_PLAYER");

    // Attacking an enemy unit should still work
    expectSuccess(p1.enterBattle(gafranId!, enemyId!));
  });
});

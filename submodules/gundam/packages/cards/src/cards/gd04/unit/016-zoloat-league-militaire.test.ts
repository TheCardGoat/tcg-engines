import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ZoloatLeagueMilitaire016 } from "./016-zoloat-league-militaire.ts";

describe("Zoloat (League Militaire) (GD04-016)", () => {
  it("<Blocker> redirects an enemy attack to this Unit", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04ZoloatLeagueMilitaire016] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zoloatId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.declareBlock(zoloatId));
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.isExhausted(zoloatId)).toBe(true);
    expect(p1.getDamage(zoloatId)).toBe(1);
  });

  it("cannot choose the enemy player as its attack target", () => {
    const engine = GundamTestEngine.create(
      { play: [gd04ZoloatLeagueMilitaire016], deck: 5 },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zoloatId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.enterBattle(zoloatId, "direct"), "CANNOT_TARGET_PLAYER");
  });
});

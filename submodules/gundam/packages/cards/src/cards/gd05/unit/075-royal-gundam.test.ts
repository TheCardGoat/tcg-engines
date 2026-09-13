import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd05RoyalGundam075 } from "./075-royal-gundam.ts";

describe("Royal Gundam (GD05-075)", () => {
  it("<Blocker> rests this Unit and redirects an attack to it", () => {
    expectBlockerAbility(gd05RoyalGundam075);
  });

  it("cannot attack the enemy player but can still attack a rested enemy Unit", () => {
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      { play: [gd05RoyalGundam075], shieldArea: [createMockUnit()] },
      { play: [{ card: enemy, exhausted: true }], shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const royalId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.enterBattle(royalId, "direct"), "CANNOT_TARGET_PLAYER");
    expect(p1.isExhausted(royalId)).toBe(false);
    expectSuccess(p1.enterBattle(royalId, enemyId));
  });
});

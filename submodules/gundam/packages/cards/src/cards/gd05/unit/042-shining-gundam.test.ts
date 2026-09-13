import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectCard,
  expectPlayer,
  expectFailure,
  expectPublicLog,
} from "@tcg/gundam-engine";
import { gd05ShiningGundam042 } from "./042-shining-gundam.ts";

describe("Shining Gundam (GD05-042)", () => {
  it("deploys at Lv.2, pays 1 Resource(s), and shows AP2/HP2", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05ShiningGundam042],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    p1.must.deployUnit(gd05ShiningGundam042);

    expectPublicLog(engine, "gundam.move.deployUnit", {
      playerId: PLAYER_ONE,
      cost: gd05ShiningGundam042.cost,
    });
    expectPlayer(p1).toHaveHandCount(0);
    expectCard(p1, gd05ShiningGundam042).toBeIn("battleArea").toHaveAp(2).toHaveHp(2);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
  });

  it("cannot deploy below Lv.2", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05ShiningGundam042],
      resourceArea: activeResources(1),
      deck: 5,
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd05ShiningGundam042),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("can declare a direct attack when already in play (body role)", () => {
    const engine = GundamTestEngine.create(
      { play: [gd05ShiningGundam042], deck: 5 },
      { shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.attack(gd05ShiningGundam042).into("direct");
    expectCard(p1, gd05ShiningGundam042).toBeRested();
  });
});

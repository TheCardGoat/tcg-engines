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
import { gd01Rezel018 } from "./018-rezel.ts";

describe("ReZEL (GD01-018)", () => {
  it("deploys at Lv.3, pays 2 Resource(s), and shows AP4/HP3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Rezel018],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    p1.must.deployUnit(gd01Rezel018);

    expectPublicLog(engine, "gundam.move.deployUnit", {
      playerId: PLAYER_ONE,
      cost: gd01Rezel018.cost,
    });
    expectPlayer(p1).toHaveHandCount(0);
    expectCard(p1, gd01Rezel018).toBeIn("battleArea").toHaveAp(4).toHaveHp(3);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("cannot deploy below Lv.3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Rezel018],
      resourceArea: activeResources(2),
      deck: 5,
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd01Rezel018),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("can declare a direct attack when already in play (body role)", () => {
    const engine = GundamTestEngine.create(
      { play: [gd01Rezel018], deck: 5 },
      { shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.attack(gd01Rezel018).into("direct");
    expectCard(p1, gd01Rezel018).toBeRested();
  });
});

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
import { gd01Zaku035 } from "./035-zaku.ts";

describe("Zaku Ⅱ (GD01-035)", () => {
  it("deploys at Lv.2, pays 1 Resource(s), and shows AP2/HP2", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Zaku035],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    p1.must.deployUnit(gd01Zaku035);

    expectPublicLog(engine, "gundam.move.deployUnit", {
      playerId: PLAYER_ONE,
      cost: gd01Zaku035.cost,
    });
    expectPlayer(p1).toHaveHandCount(0);
    expectCard(p1, gd01Zaku035).toBeIn("battleArea").toHaveAp(2).toHaveHp(2);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
  });

  it("cannot deploy below Lv.2", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Zaku035],
      resourceArea: activeResources(1),
      deck: 5,
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd01Zaku035),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("can declare a direct attack when already in play (body role)", () => {
    const engine = GundamTestEngine.create(
      { play: [gd01Zaku035], deck: 5 },
      { shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.attack(gd01Zaku035).into("direct");
    expectCard(p1, gd01Zaku035).toBeRested();
  });
});

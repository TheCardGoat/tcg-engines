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
import { st01Gm005 } from "./005-gm.ts";

describe("GM (ST01-005)", () => {
  it("deploys at Lv.2, pays 1 Resource(s), and shows AP2/HP2", () => {
    const engine = GundamTestEngine.create({
      hand: [st01Gm005],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    p1.must.deployUnit(st01Gm005);

    expectPublicLog(engine, "gundam.move.deployUnit", {
      playerId: PLAYER_ONE,
      cost: st01Gm005.cost,
    });
    expectPlayer(p1).toHaveHandCount(0);
    expectCard(p1, st01Gm005).toBeIn("battleArea").toHaveAp(2).toHaveHp(2);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
  });

  it("cannot deploy below Lv.2", () => {
    const engine = GundamTestEngine.create({
      hand: [st01Gm005],
      resourceArea: activeResources(1),
      deck: 5,
    });
    expectFailure(engine.asPlayer(PLAYER_ONE).deployUnit(st01Gm005), "INSUFFICIENT_RESOURCE_LEVEL");
  });

  it("can declare a direct attack when already in play (body role)", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gm005], deck: 5 },
      { shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.attack(st01Gm005).into("direct");
    expectCard(p1, st01Gm005).toBeRested();
  });
});

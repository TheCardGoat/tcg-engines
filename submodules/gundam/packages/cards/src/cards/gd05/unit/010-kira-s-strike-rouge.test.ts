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
import { gd05KiraSStrikeRouge010 } from "./010-kira-s-strike-rouge.ts";

describe("Kira's Strike Rouge (GD05-010)", () => {
  it("deploys at Lv.4, pays 2 Resource(s), and shows AP3/HP4", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05KiraSStrikeRouge010],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    p1.must.deployUnit(gd05KiraSStrikeRouge010);

    expectPublicLog(engine, "gundam.move.deployUnit", {
      playerId: PLAYER_ONE,
      cost: gd05KiraSStrikeRouge010.cost,
    });
    expectPlayer(p1).toHaveHandCount(0);
    expectCard(p1, gd05KiraSStrikeRouge010).toBeIn("battleArea").toHaveAp(3).toHaveHp(4);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("cannot deploy below Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05KiraSStrikeRouge010],
      resourceArea: activeResources(3),
      deck: 5,
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd05KiraSStrikeRouge010),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("can declare a direct attack when already in play (body role)", () => {
    const engine = GundamTestEngine.create(
      { play: [gd05KiraSStrikeRouge010], deck: 5 },
      { shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.attack(gd05KiraSStrikeRouge010).into("direct");
    expectCard(p1, gd05KiraSStrikeRouge010).toBeRested();
  });
});

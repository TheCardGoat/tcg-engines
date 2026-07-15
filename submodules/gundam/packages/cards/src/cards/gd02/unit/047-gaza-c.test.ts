import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GazaC047 } from "./047-gaza-c.ts";

describe("Gaza C (GD02-047)", () => {
  it("【Activate·Main】Rest this Unit：Destroy this and choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.", () => {
    const enemy = createMockUnit({ ap: 3, hp: 3, level: 4 });
    const engine = GundamTestEngine.create(
      {
        play: [gd02GazaC047],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");
    if (!enemyId) throw new Error("setup failed");

    // Gaza-C activated: cost = rest self, directives = destroy self + deal 1 damage to enemy
    expectSuccess(p1.activateAbility(gd02GazaC047, 0, { targets: [enemyId] }));

    // Gaza-C should be destroyed (moved to trash)
    const gazaZone =
      engine.getState().ctx.zones.private.cardIndex[p1.getCardsInZone("trash")[0]!]?.zoneKey;
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    expect(p1.getCardsInZone("trash")).toHaveLength(1);
    expect(gazaZone).toBe(`trash:${PLAYER_ONE}`);

    // Enemy took 1 damage
    expect(engine.getG().damage[enemyId] ?? 0).toBe(1);
  });
});

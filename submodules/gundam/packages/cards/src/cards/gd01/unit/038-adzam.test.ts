import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Adzam038 } from "./038-adzam.ts";

describe("Adzam (GD01-038)", () => {
  it("damages all 5 enemy Units, leaves friendly Units untouched, and can attack after linking with a Zeon Pilot", () => {
    const pilot = createMockPilot({ traits: ["zeon"], level: 1, cost: 1 });
    const friendly = createMockUnit({ hp: 3 });
    const enemies = Array.from({ length: 5 }, (_, index) => ({
      card: createMockUnit({ hp: 3 }),
      exhausted: index === 0,
    }));
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Adzam038, pilot],
        play: [friendly],
        resourceArea: activeResources(5),
      },
      { play: enemies },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyIds = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01Adzam038));
    expectSuccess(p1.assignPilot(pilot, gd01Adzam038));

    expect(p1.getDamage(friendlyId)).toBe(0);
    for (const enemyId of enemyIds) expect(p2.getDamage(enemyId)).toBe(1);
    expectSuccess(p1.enterBattle(gd01Adzam038, enemyIds[0]!));
  });

  it("does not deal damage while fewer than 5 enemy Units are in play", () => {
    const enemies = Array.from({ length: 4 }, () => createMockUnit({ hp: 3 }));
    const engine = GundamTestEngine.create(
      { hand: [gd01Adzam038], resourceArea: activeResources(5) },
      { play: enemies },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyIds = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01Adzam038));

    for (const enemyId of enemyIds) expect(p2.getDamage(enemyId)).toBe(0);
  });
});

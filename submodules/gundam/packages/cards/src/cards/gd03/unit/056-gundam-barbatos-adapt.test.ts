import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03GundamBarbatosAdapt056 } from "./056-gundam-barbatos-adapt.ts";

describe("Gundam Barbatos Adapt (GD03-056)", () => {
  it("【Deploy】 deals 1 damage to one friendly Unit and one enemy Unit", () => {
    const ally = createMockUnit({ hp: 4 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03GundamBarbatosAdapt056],
        play: [ally],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03GundamBarbatosAdapt056, { targets: [allyId, enemyId] }));

    expect(getDamageCounter(engine, allyId)).toBe(1);
    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });
});

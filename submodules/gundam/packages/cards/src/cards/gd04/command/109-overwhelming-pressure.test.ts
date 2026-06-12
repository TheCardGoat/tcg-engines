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
import { gd04OverwhelmingPressure109 } from "./109-overwhelming-pressure.ts";

describe("Overwhelming Pressure (GD04-109)", () => {
  it("【Main】/【Action】deals 4 damage to an enemy Unit that is Lv.6 or lower", () => {
    const enemy = createMockUnit({ level: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd04OverwhelmingPressure109], resourceArea: activeResources(5) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd04OverwhelmingPressure109, { targets: [enemyId] }));

    expect(getDamageCounter(engine, enemyId)).toBe(4);
  });
});

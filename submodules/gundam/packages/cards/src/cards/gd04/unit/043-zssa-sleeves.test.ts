import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd04ZssaSleeves043 } from "./043-zssa-sleeves.ts";

describe("Zssa (Sleeves) (GD04-043)", () => {
  it("【Deploy】 deals 1 damage to a chosen enemy Base", () => {
    const enemyBase = createMockBase({ hp: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd04ZssaSleeves043],
        resourceArea: activeResources(5),
      },
      { baseSection: [enemyBase] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p2.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.deployUnit(gd04ZssaSleeves043, { targets: [baseId] }));

    expect(getDamageCounter(engine, baseId)).toBe(1);
  });
});

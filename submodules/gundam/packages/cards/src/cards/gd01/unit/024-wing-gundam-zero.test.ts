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
import { gd01WingGundamZero024 } from "./024-wing-gundam-zero.ts";

describe("Wing Gundam Zero (GD01-024)", () => {
  it("data declares High-Maneuver and deploy damage to all Lv.5-or-lower Units", () => {
    expect(gd01WingGundamZero024.keywordEffects).toEqual([{ keyword: "HighManeuver" }]);
    expect(gd01WingGundamZero024.effects?.[0]?.directives).toEqual([
      {
        action: {
          action: "dealDamageAll",
          amount: 3,
          target: {
            owner: "any",
            cardType: "unit",
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
          },
        },
      },
    ]);
  });

  it("deals 3 damage to Lv.5-or-lower Units on deploy and leaves Lv.6 Units untouched", () => {
    const friendlyLow = createMockUnit({ level: 5, hp: 5 });
    const enemyLow = createMockUnit({ level: 4, hp: 5 });
    const enemyHigh = createMockUnit({ level: 6, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01WingGundamZero024],
        play: [friendlyLow],
        resourceArea: activeResources(8),
      },
      { play: [enemyLow, enemyHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [friendlyLowId] = p1.getCardsInZone("battleArea");
    const [enemyLowId, enemyHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01WingGundamZero024));

    expect(getDamageCounter(engine, friendlyLowId!)).toBe(3);
    expect(getDamageCounter(engine, enemyLowId!)).toBe(3);
    expect(getDamageCounter(engine, enemyHighId!)).toBe(0);
  });
});

import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd04CoreBooster005CoreBooster006012 } from "./012-core-booster-005-core-booster-006.ts";

describe("Core Booster (005) & Core Booster (006) (GD04-012)", () => {
  it("deploys at Lv.3, pays 2 Resources, and shows AP3/HP3 in the battle area", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04CoreBooster005CoreBooster006012],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;
    const resourceIds = p1.getCardsInZone("resourceArea");

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getHand()).not.toContain(unitId);
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(resourceIds.filter((resourceId) => p1.isExhausted(resourceId))).toHaveLength(2);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
  });

  it("cannot deploy below Lv.3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04CoreBooster005CoreBooster006012],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd04CoreBooster005CoreBooster006012),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });
});

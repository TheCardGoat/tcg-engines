import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd04GmIii005 } from "./005-gm-iii.ts";

describe("GM III (GD04-005)", () => {
  it("deploys at Lv.2, pays 2 Resources, and shows AP3/HP2 in the battle area", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04GmIii005],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;
    const resourceIds = p1.getCardsInZone("resourceArea");

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getHand()).not.toContain(unitId);
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(resourceIds.filter((resourceId) => p1.isExhausted(resourceId))).toHaveLength(2);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 3, effectiveHp: 2 });
  });

  it("cannot deploy below Lv.2", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04GmIii005],
      resourceArea: activeResources(1),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd04GmIii005),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });
});

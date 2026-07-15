import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd04Shokew014 } from "./014-shokew.ts";

describe("Shokew (GD04-014)", () => {
  it("deploys at Lv.2, pays 2 Resources, and shows AP2/HP3 in the battle area", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Shokew014],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;
    const resourceIds = p1.getCardsInZone("resourceArea");

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getHand()).not.toContain(unitId);
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(resourceIds.filter((resourceId) => p1.isExhausted(resourceId))).toHaveLength(2);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 2, effectiveHp: 3 });
  });

  it("cannot deploy below Lv.2", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Shokew014],
      resourceArea: activeResources(1),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd04Shokew014),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });
});

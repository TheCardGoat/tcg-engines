import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd04Gaplant010 } from "./010-gaplant.ts";

describe("Gaplant (GD04-010)", () => {
  it("deploys at Lv.4, pays 2 Resources, and shows AP3/HP4 in the battle area", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Gaplant010],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;
    const resourceIds = p1.getCardsInZone("resourceArea");

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getHand()).not.toContain(unitId);
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(resourceIds.filter((resourceId) => p1.isExhausted(resourceId))).toHaveLength(2);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });

  it("cannot deploy below Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Gaplant010],
      resourceArea: activeResources(3),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd04Gaplant010),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });
});

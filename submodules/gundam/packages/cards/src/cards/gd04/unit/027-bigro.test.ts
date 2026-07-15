import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd04Bigro027 } from "./027-bigro.ts";

describe("Bigro (GD04-027)", () => {
  it("deploys at Lv.5, pays 3 Resources, and shows AP5/HP4 in the battle area", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Bigro027],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;
    const resourceIds = p1.getCardsInZone("resourceArea");

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getHand()).not.toContain(unitId);
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(resourceIds.filter((resourceId) => p1.isExhausted(resourceId))).toHaveLength(3);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5, effectiveHp: 4 });
  });

  it("cannot deploy below Lv.5", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Bigro027],
      resourceArea: activeResources(4),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd04Bigro027),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });
});

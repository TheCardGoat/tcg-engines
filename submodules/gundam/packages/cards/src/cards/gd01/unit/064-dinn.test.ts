import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd01Dinn064 } from "./064-dinn.ts";

describe("DINN (GD01-064)", () => {
  it("deploys from hand and exposes its combat stats to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Dinn064],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Dinn064));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 3, effectiveHp: 2 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });
});

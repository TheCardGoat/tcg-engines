import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd01Goohn062 } from "./062-goohn.ts";

describe("GOOhN (GD01-062)", () => {
  it("deploys from hand and exposes its combat stats to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Goohn062],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Goohn062));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 1, effectiveHp: 2 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
  });
});

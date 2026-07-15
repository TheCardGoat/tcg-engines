import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { st08MesserTypeF02Minelayer005 } from "./005-messer-type-f02-minelayer.ts";

describe("Messer Type-F02 Minelayer (ST08-005)", () => {
  it("can be deployed with 3 resources by paying 2", () => {
    const engine = GundamTestEngine.create({
      hand: [st08MesserTypeF02Minelayer005],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getCardsInZone("battleArea")).toContain(unitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, effectiveHp: 3 });
  });
});

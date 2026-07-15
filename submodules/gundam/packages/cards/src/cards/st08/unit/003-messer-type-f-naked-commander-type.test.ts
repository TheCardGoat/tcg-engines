import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { st08MesserTypeFNakedCommanderType003 } from "./003-messer-type-f-naked-commander-type.ts";

describe("Messer (Type-F Naked) (Commander Type) (ST08-003)", () => {
  it("can be deployed with 4 resources by paying 2", () => {
    const engine = GundamTestEngine.create({
      hand: [st08MesserTypeFNakedCommanderType003],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getCardsInZone("battleArea")).toContain(unitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, effectiveHp: 3 });
  });
});

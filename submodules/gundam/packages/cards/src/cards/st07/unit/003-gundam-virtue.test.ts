import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { st07GundamVirtue003 } from "./003-gundam-virtue.ts";

describe("Gundam Virtue (ST07-003)", () => {
  it("can be deployed with 5 resources by paying 3", () => {
    const engine = GundamTestEngine.create({
      hand: [st07GundamVirtue003],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getCardsInZone("battleArea")).toContain(unitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5, effectiveHp: 4 });
  });
});

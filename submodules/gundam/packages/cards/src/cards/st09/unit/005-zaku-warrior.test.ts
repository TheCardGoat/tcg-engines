import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { st09ZakuWarrior005 } from "./005-zaku-warrior.ts";

describe("Zaku Warrior (ST09-005)", () => {
  it("can be deployed with 2 resources by paying 1", () => {
    const engine = GundamTestEngine.create({
      hand: [st09ZakuWarrior005],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));

    expect(p1.getCardsInZone("battleArea")).toContain(unitId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 2, effectiveHp: 2 });
  });
});

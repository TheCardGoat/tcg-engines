import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd04Gundam073 } from "./073-gundam.ts";

describe("∀ Gundam (GD04-073)", () => {
  it("【Activate･Main】 grants AP+2 to itself for the turn (cost: 1 resource)", () => {
    const engine = GundamTestEngine.create({
      play: [gd04Gundam073],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expect(findStatModifier(engine, unitId, "ap")).toBeUndefined();

    expectSuccess(p1.activateAbility(unitId, 0));

    expect(findStatModifier(engine, unitId, "ap")?.modifier).toBe(2);
    // The 1-resource cost was paid: 1 resource is exhausted.
    const exhaustedResources = p1
      .getCardsInZone("resourceArea")
      .filter((id) => p1.isExhausted(id)).length;
    expect(exhaustedResources).toBe(1);
  });
});

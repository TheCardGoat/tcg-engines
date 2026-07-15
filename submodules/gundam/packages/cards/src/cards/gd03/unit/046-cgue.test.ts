import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03Cgue046 } from "./046-cgue.ts";

describe("CGUE (GD03-046)", () => {
  it("deploys from hand after paying 2 resources", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03Cgue046],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03Cgue046));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardsInZone("resourceArea").every((id) => p1.isExhausted(id))).toBe(true);
  });

  it("stays in hand when one of its resources is rested", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03Cgue046],
      resourceArea: [...activeResources(1), ...restedResources(1)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd03Cgue046), "INSUFFICIENT_RESOURCES");

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });
});

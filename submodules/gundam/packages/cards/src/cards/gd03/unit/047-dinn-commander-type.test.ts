import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03DinnCommanderType047 } from "./047-dinn-commander-type.ts";

describe("DINN (Commander Type) (GD03-047)", () => {
  it("deploys from hand after paying 2 resources", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03DinnCommanderType047],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03DinnCommanderType047));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("stays in hand when fewer than 2 resources are active", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03DinnCommanderType047],
      resourceArea: [...activeResources(1), ...restedResources(3)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd03DinnCommanderType047), "INSUFFICIENT_RESOURCES");

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });
});

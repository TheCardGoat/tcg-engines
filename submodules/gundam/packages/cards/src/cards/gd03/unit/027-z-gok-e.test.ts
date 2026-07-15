import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03ZGokE027 } from "./027-z-gok-e.ts";

describe("Z’Gok E (GD03-027)", () => {
  it("deploys from hand and exposes its combat stats to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03ZGokE027],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03ZGokE027));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot deploy without enough active Resources", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03ZGokE027],
      resourceArea: [...activeResources(1), ...restedResources(2)],
    });

    expectFailure(engine.asPlayer(PLAYER_ONE).deployUnit(gd03ZGokE027), "INSUFFICIENT_RESOURCES");
  });
});

import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02Nemo080 } from "./080-nemo.ts";

describe("Nemo (GD02-080)", () => {
  it("cannot deploy below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Nemo080],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd02Nemo080), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd02Nemo080)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("deploys from hand and exposes its combat stats", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Nemo080],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02Nemo080));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 2, effectiveHp: 2 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot deploy without an active Resource", () => {
    const resourceSpender = createMockUnit({ level: 1, cost: 2 });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Nemo080],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(resourceSpender));
    expectFailure(p1.deployUnit(gd02Nemo080), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02Nemo080)).toBe(`hand:${PLAYER_ONE}`);
  });
});

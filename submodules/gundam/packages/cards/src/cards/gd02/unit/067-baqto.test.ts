import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02Baqto067 } from "./067-baqto.ts";

describe("Baqto (GD02-067)", () => {
  it("cannot deploy below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Baqto067],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd02Baqto067), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd02Baqto067)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("deploys from hand and exposes its combat stats", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Baqto067],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02Baqto067));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 2, effectiveHp: 3 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot deploy without enough active Resources", () => {
    const resourceSpender = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Baqto067],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(resourceSpender));
    expectFailure(p1.deployUnit(gd02Baqto067), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02Baqto067)).toBe(`hand:${PLAYER_ONE}`);
  });
});

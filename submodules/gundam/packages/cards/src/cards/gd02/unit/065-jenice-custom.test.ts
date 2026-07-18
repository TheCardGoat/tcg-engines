import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  expectFailure,
  expectSuccess,
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02JeniceCustom065 } from "./065-jenice-custom.ts";

describe("Jenice Custom (GD02-065)", () => {
  it("cannot deploy below its printed Lv.1 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02JeniceCustom065],
      resourceArea: activeResources(0),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd02JeniceCustom065), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd02JeniceCustom065)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("deploys from hand and exposes its combat stats", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02JeniceCustom065],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02JeniceCustom065));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 1, effectiveHp: 2 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot deploy without an active Resource", () => {
    const resourceSpender = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02JeniceCustom065],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(resourceSpender));
    expectFailure(p1.deployUnit(gd02JeniceCustom065), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02JeniceCustom065)).toBe(`hand:${PLAYER_ONE}`);
  });
});

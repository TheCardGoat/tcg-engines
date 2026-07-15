import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03GmSniperIi011 } from "./011-gm-sniper-ii.ts";

describe("GM Sniper II (GD03-011)", () => {
  it("deploys from hand and exposes its combat stats to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03GmSniperIi011],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03GmSniperIi011));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 2, effectiveHp: 3 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot deploy without enough active Resources", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03GmSniperIi011],
      resourceArea: [...activeResources(1), ...restedResources(1)],
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd03GmSniperIi011),
      "INSUFFICIENT_RESOURCES",
    );
  });
});

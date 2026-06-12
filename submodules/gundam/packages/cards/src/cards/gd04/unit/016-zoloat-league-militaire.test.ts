import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, expectFailure } from "@tcg/gundam-engine";
import { gd04ZoloatLeagueMilitaire016 } from "./016-zoloat-league-militaire.ts";

describe("Zoloat (League Militaire) (GD04-016)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04ZoloatLeagueMilitaire016.keywordEffects.map((effect) => effect.keyword)).toEqual([
      "Blocker",
    ]);
  });

  it("cantTargetPlayer restriction blocks direct attacks", () => {
    const engine = GundamTestEngine.create(
      { play: [gd04ZoloatLeagueMilitaire016], deck: 5 },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zoloatId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.enterBattle(zoloatId, "direct"), "CANNOT_TARGET_PLAYER");
  });
});

import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, expectFailure } from "@tcg/gundam-engine";
import { tParts021 } from "./021-parts.ts";

describe("Parts (T-021)", () => {
  it("declares cantTargetPlayer in card data", () => {
    expect(tParts021.effects?.[0]?.directives[0]).toMatchObject({
      action: {
        action: "cantTargetPlayer",
        whose: "opponent",
      },
    });
  });

  it("cannot choose the enemy player as its attack target", () => {
    const engine = GundamTestEngine.create({ play: [tParts021], deck: 5 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const partsId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.enterBattle(partsId, "direct"), "CANNOT_TARGET_PLAYER");
  });
});

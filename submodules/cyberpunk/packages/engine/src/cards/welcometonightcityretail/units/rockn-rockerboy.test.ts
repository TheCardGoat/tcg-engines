import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailRocknRockerboy } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const rocker = welcomeToNightCityRetailRocknRockerboy;

describe("Rockn' Rockerboy", () => {
  it("is the exact flavor-only yellow Rocker Unit", () => {
    expect(rocker).toMatchObject({
      canonicalId: "rockn-rockerboy",
      slug: "rockn-rockerboy",
      name: "Rockn' Rockerboy",
      displayName: "Rockn' Rockerboy",
      type: "unit",
      color: "yellow",
      classifications: ["Rocker"],
      cost: 5,
      power: 8,
      ram: 1,
      hasSellTag: false,
      printNumber: "052",
      rarity: "Common",
      rulesText: "[Flavor] Scream your throat raw for something. Anything.",
      keywords: [],
      timingTriggers: [],
    });
    expect(rocker.abilities).toEqual([]);
  });

  it("pays exactly 5 Eddies and enters as a vanilla Unit with Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [rocker],
      legendArea: [],
      eddies: 5,
    });

    engine.playCard(rocker, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      rocker.id,
    );
    expect(engine.getCard(rocker, "field", P1).meta.hasLag).toBe(true);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("makes an ordinary direct attack after Lag clears without card-specific effects", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: rocker, spent: false, hasLag: false }] },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );

    engine.attackRival(rocker, { as: P1 });

    expect(engine.getAttackState()).toMatchObject({ rivalId: P2, kind: "direct" });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});

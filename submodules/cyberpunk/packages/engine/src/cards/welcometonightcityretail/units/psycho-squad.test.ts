import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailPsychoSquad } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectNotAttackCandidate } from "../../../testing/index.ts";

describe("Psycho Squad", () => {
  it("is the exact vanilla blue NCPD Unit with flavor text only", () => {
    expect(welcomeToNightCityRetailPsychoSquad).toMatchObject({
      canonicalId: "psycho-squad",
      slug: "psycho-squad",
      name: "Psycho Squad",
      displayName: "Psycho Squad",
      type: "unit",
      color: "blue",
      classifications: ["NCPD"],
      cost: 4,
      power: 6,
      ram: 1,
      hasSellTag: false,
      printNumber: "124",
      rarity: "Common",
      rulesText: "[Flavour] Their protocol stops at “shoot first.”",
    });
    expect(welcomeToNightCityRetailPsychoSquad.abilities).toEqual([]);
    expect(welcomeToNightCityRetailPsychoSquad.timingTriggers).toEqual([]);
  });

  it("pays exactly 4 Eddies and enters the field with Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailPsychoSquad],
      eddies: 4,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(welcomeToNightCityRetailPsychoSquad, { as: P1 });

    const squad = engine.getCard(welcomeToNightCityRetailPsychoSquad, "field", P1);
    expect(squad.meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expectNotAttackCandidate(engine, welcomeToNightCityRetailPsychoSquad, { as: P1 });
  });

  it("can make a normal direct attack after lag clears", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailPsychoSquad, spent: false, hasLag: false }],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailPsychoSquad, { as: P1 });

    expect(engine.getState().G.attackState).toMatchObject({ kind: "direct" });
    expect(engine.getCard(welcomeToNightCityRetailPsychoSquad, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});

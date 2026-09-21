import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Riding Nomad", () => {
  it("is the exact green Nomad Unit with ADRENALINE", () => {
    expect(welcomeToNightCityRetailRidingNomad).toMatchObject({
      canonicalId: "riding-nomad",
      slug: "riding-nomad",
      name: "Riding Nomad",
      displayName: "Riding Nomad",
      type: "unit",
      color: "green",
      classifications: ["Nomad"],
      cost: 5,
      power: 4,
      ram: 4,
      hasSellTag: false,
      printNumber: "087",
      rarity: "Common",
      keywords: ["adrenaline"],
      rulesText: "{Adrenaline} (This Unit can attack the turn it's played.)",
      abilities: [{ kind: "keyword", keyword: "adrenaline", source: { selector: "self" } }],
    });
  });

  it("pays exactly 5 Eddies, enters with Lag, and attacks a spent rival Unit immediately", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRidingNomad],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(welcomeToNightCityRetailRidingNomad, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1).meta.hasLag).toBe(true);
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailCorpoSecurity, {
      as: P1,
    });

    expect(engine.getAttackState()?.defenderId).toBe(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("can attack the rival Gig area while still Lagging on its played turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRidingNomad],
        eddies: 5,
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P1 });

    expect(engine.getAttackState()).toMatchObject({
      attackerId: engine.findCardId(welcomeToNightCityRetailRidingNomad, "field", P1),
      rivalId: P2,
    });
  });

  it("still cannot attack a ready rival unit while played this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRidingNomad],
        eddies: 6,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRidingNomad, { as: P1 });
    const failure = engine.expectFailure(() =>
      engine.attackUnit(
        welcomeToNightCityRetailRidingNomad,
        welcomeToNightCityRetailCorpoSecurity,
        {
          as: P1,
        },
      ),
    );

    expect(failure.errorCode).toBe("TARGET_READY");
  });
});

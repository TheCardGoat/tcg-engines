import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailSecondhandBombus,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Secondhand Bombus (retail)", () => {
  it("has the exact yellow zero-power Drone Zetatech BLOCKER identity", () => {
    expect(welcomeToNightCityRetailSecondhandBombus).toMatchObject({
      canonicalId: "secondhand-bombus",
      slug: "secondhand-bombus",
      name: "Secondhand Bombus",
      displayName: "Secondhand Bombus",
      type: "unit",
      color: "yellow",
      classifications: ["Drone", "Zetatech"],
      cost: 2,
      power: 0,
      ram: 2,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "053",
      keywords: ["blocker"],
      reminderText: ["Units with power 0 don't steal Gigs."],
      rulesText:
        "{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)\n(Units with power 0 don't steal Gigs.)",
      abilities: [
        {
          kind: "keyword",
          keyword: "blocker",
          source: { selector: "self" },
        },
      ],
    });
  });

  it("costs exactly 2 to play and enters with Lag", () => {
    const successEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSecondhandBombus],
      eddies: 2,
    });
    for (const legend of successEngine.getCardsInZone("legendArea", P1)) {
      successEngine.judgeSpendCard(legend, { as: P1 });
    }
    successEngine.playCard(welcomeToNightCityRetailSecondhandBombus, { as: P1 });
    expect(successEngine.getEddies(P1)).toBe(0);
    expect(
      successEngine.getCard(welcomeToNightCityRetailSecondhandBombus, "field", P1).meta.hasLag,
    ).toBe(true);

    const failureEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSecondhandBombus],
      eddies: 1,
    });
    for (const legend of failureEngine.getCardsInZone("legendArea", P1)) {
      failureEngine.judgeSpendCard(legend, { as: P1 });
    }
    expect(() =>
      failureEngine.playCard(welcomeToNightCityRetailSecondhandBombus, { as: P1 }),
    ).toThrow(/INSUFFICIENT_EDDIES/);
  });

  it("spends as BLOCKER to redirect a rival direct attack into a fight", () => {
    // Printed text: "{Blocker} (You may spend this Unit to redirect a rival
    // Unit's attack to it instead.)"
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailSecondhandBombus, spent: false }],
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
      },
    );

    // Hand the turn to P2 so P2 can declare an attack.
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 }); // attack → react

    expect(engine.useBlocker(welcomeToNightCityRetailSecondhandBombus, { as: P1 })).toMatchObject({
      success: true,
    });

    // Bombus spent, attack redirected from direct → fight.
    expect(engine.getCard(welcomeToNightCityRetailSecondhandBombus, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("steals 0 Gigs on a direct attack because power is 0", () => {
    // Printed reminder: "(Units with power 0 don't steal Gigs.)"
    // Secondhand Bombus has 0 power → direct attack resolves but steals 0.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailSecondhandBombus,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(1);

    engine.attackRival(welcomeToNightCityRetailSecondhandBombus, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    // Direct attack resolved but 0 power → 0 Gigs stolen.
    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(1);
  });

  it("cannot use BLOCKER while already spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailSecondhandBombus, spent: true }] },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });

    expect(() => engine.useBlocker(welcomeToNightCityRetailSecondhandBombus, { as: P1 })).toThrow(
      /CARD_SPENT/,
    );
  });
});

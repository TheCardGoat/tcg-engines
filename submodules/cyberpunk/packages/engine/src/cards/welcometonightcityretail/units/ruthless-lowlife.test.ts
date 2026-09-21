import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailRuthlessLowlife,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Ruthless Lowlife", () => {
  it("has the exact red Ganger Maelstrom identity and continuous attack restriction", () => {
    expect(welcomeToNightCityRetailRuthlessLowlife).toMatchObject({
      canonicalId: "ruthless-lowlife",
      slug: "ruthless-lowlife",
      name: "Ruthless Lowlife",
      displayName: "Ruthless Lowlife",
      type: "unit",
      color: "red",
      classifications: ["Ganger", "Maelstrom"],
      cost: 2,
      power: 4,
      ram: 1,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "017",
      rulesText: "This Unit can only attack rival Units. (It can't attack Gig areas.)",
      abilities: [
        {
          kind: "static",
          effects: [
            {
              effect: "grantRule",
              target: { selector: "self" },
              rule: "cantAttackRival",
              duration: "continuous",
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 2 Eddies and enters the field with Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailRuthlessLowlife],
      legendArea: [],
      eddies: 2,
    });

    engine.playCard(welcomeToNightCityRetailRuthlessLowlife, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    const lowlife = engine.getCard(welcomeToNightCityRetailRuthlessLowlife, "field", P1);
    expect(lowlife.meta.hasLag).toBe(true);
    expect(lowlife.meta.spent).toBe(false);
  });

  it("can attack rival Units but cannot attack the rival Gig area", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailRuthlessLowlife, spent: false, hasLag: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    expect(
      engine.attackUnit(
        welcomeToNightCityRetailRuthlessLowlife,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ).success,
    ).toBe(true);

    const directEngine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailRuthlessLowlife, spent: false, hasLag: false }] },
      { gigArea: [{ dieType: "d6", faceValue: 3 }] },
    );
    const failure = directEngine.expectFailure(() =>
      directEngine.attackRival(welcomeToNightCityRetailRuthlessLowlife, { as: P1 }),
    );
    expect(failure.errorCode).toBe("CANT_ATTACK_RIVAL");
  });
});

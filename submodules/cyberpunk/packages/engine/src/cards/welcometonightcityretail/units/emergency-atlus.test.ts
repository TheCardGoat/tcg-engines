import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailEmergencyAtlus } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectNotAttackCandidate } from "../../../testing/index.ts";

describe("Emergency - Atlus", () => {
  it("is the exact vanilla 3-cost 4-power green Trauma Team Vehicle Zetatech Unit", () => {
    expect(welcomeToNightCityRetailEmergencyAtlus).toMatchObject({
      canonicalId: "emergency-atlus",
      slug: "emergency-atlus",
      name: "Emergency Atlus",
      displayName: "Emergency Atlus",
      type: "unit",
      color: "green",
      classifications: ["Trauma Team", "Vehicle", "Zetatech"],
      cost: 3,
      power: 4,
      ram: 1,
      hasSellTag: false,
      printNumber: "077",
      rarity: "Common",
      legality: "legal",
      rulesText: '"Grab the policyholder, leave the rest for the city meatwagon."',
      abilities: [],
      timingTriggers: [],
      keywords: [],
      reminderText: [],
    });
  });

  it("plays as a vanilla Vehicle Unit, pays cost, and enters with lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailEmergencyAtlus],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailEmergencyAtlus, { as: P1 });

    const atlus = engine.getCard(welcomeToNightCityRetailEmergencyAtlus, "field", P1);
    expect(atlus.meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expectNotAttackCandidate(engine, welcomeToNightCityRetailEmergencyAtlus, { as: P1 });
  });

  it("can attack normally after lag clears because it has no card-specific restriction", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailEmergencyAtlus, spent: false, hasLag: false }],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailEmergencyAtlus, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d4");
    expect(engine.getEvents("gigStolen")).toHaveLength(1);
  });
});

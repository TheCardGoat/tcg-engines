import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailEmergencyAtlus } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectNotAttackCandidate } from "../../../testing/index.ts";

describe("Emergency - Atlus", () => {
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

    expect(engine.getState().G.attackState).toMatchObject({ kind: "direct" });
  });
});

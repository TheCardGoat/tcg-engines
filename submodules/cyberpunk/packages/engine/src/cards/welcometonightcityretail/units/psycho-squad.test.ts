import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailPsychoSquad } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectNotAttackCandidate } from "../../../testing/index.ts";

describe("Psycho Squad", () => {
  it("plays as a vanilla NCPD Unit, pays cost, and enters with lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailPsychoSquad],
      eddies: 4,
    });

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
  });
});

import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetail6thStreetRecruits } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("6th Street Recruits", () => {
  it("increases a friendly Gig by up to 6 after a friendly Unit steals a d6", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 1 }],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      },
    );

    const targetGig = engine.getGigDice(P1).find((die) => die.dieType === "d8");
    if (!targetGig) throw new Error("Expected P1 to start with a d8 Gig");
    expect(targetGig.faceValue).toBe(1);

    engine.attackRival(welcomeToNightCityRetail6thStreetRecruits, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.resolveEffectTargetIds([targetGig.id as string], {
      as: P1,
      allowPendingChoice: true,
      reason: "6th Street Recruits still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(targetGig.faceValue + 6, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.id === targetGig.id)?.faceValue).toBe(7);
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(1);
    expect(engine.getGigDice(P2)).toHaveLength(0);
  });

  it("does not trigger after stealing a non-d6 Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, spent: false, hasLag: false }],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetail6thStreetRecruits, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(1);
  });
});

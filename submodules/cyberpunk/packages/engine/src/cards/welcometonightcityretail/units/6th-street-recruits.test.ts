import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetail6thStreetRecruits } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("6th Street Recruits", () => {
  it("increases a friendly Gig by up to 6 after a friendly Unit steals a d6", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetail6thStreetRecruits, spent: false, playedThisTurn: false },
        ],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetail6thStreetRecruits, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "6th Street Recruits still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(6, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(6);
    expect(engine.getGigDice(P2)).toHaveLength(0);
  });

  it("does not trigger after stealing a non-d6 Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetail6thStreetRecruits, spent: false, playedThisTurn: false },
        ],
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

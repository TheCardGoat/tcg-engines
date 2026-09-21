import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetail6thStreetRecruits,
  welcomeToNightCityRetailMaxtacHeavy,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  expectAdjustGigChoice,
  expectEligibleGigs,
  P1,
  P2,
} from "../../../testing/index.ts";

describe("6th Street Recruits", () => {
  /**
   * Oracle: CR 6.7.1.1 and 6.7.3 make MaxTac Heavy the friendly actor and
   * resolve this trigger only after the d6 changes control. The printed text
   * says "a Gig", not "a friendly Gig", so either player's Gig is eligible.
   * CR 2.8 permits choosing 0; CR 6.4.1 and 6.4.4 cap the chosen increase at
   * both six and the die's actual faces.
   */
  it("lets its controller increase any Gig by up to 6 after another friendly Unit steals a d6", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetail6thStreetRecruits, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailMaxtacHeavy, spent: false, hasLag: false },
        ],
        gigArea: [{ dieType: "d8", faceValue: 1 }],
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 1 },
          { dieType: "d10", faceValue: 2 },
        ],
      },
    );

    const rivalTarget = engine.getGigDice(P2).find((die) => die.dieType === "d10");
    const d6ToSteal = engine.getGigDice(P2).find((die) => die.dieType === "d6");
    if (!rivalTarget) throw new Error("Expected P2 to start with a d10 Gig");
    if (!d6ToSteal) throw new Error("Expected P2 to start with a d6 Gig");

    engine.attackRival(welcomeToNightCityRetailMaxtacHeavy, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1, gigIdsToSteal: [d6ToSteal.id as string] });
    expectEligibleGigs(engine, [
      { dieType: "d8", as: P1 },
      { dieType: "d6", as: P1 },
      { dieType: "d10", as: P2 },
    ]);
    engine.resolveEffectTargetIds([rivalTarget.id as string], {
      as: P1,
      allowPendingChoice: true,
      reason: "6th Street Recruits still needs the selected Gig's new face value",
    });
    expectAdjustGigChoice(engine, { direction: "increase", maxAmount: 6 });
    const excessiveIncrease = engine.expectFailure(() =>
      engine.resolveAdjustGig(rivalTarget.faceValue + 7, { as: P1 }),
    );
    expect(excessiveIncrease.errorCode).toBe("EXCEEDS_MAX_AMOUNT");
    expect(engine.getGigDice(P2).find((die) => die.id === rivalTarget.id)?.faceValue).toBe(2);
    expectAdjustGigChoice(engine, { direction: "increase", maxAmount: 6 });
    engine.resolveAdjustGig(rivalTarget.faceValue + 6, { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.id === rivalTarget.id)?.faceValue).toBe(8);
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(1);
    engine.expectNoPendingChoice();
  });

  it("allows choosing zero Gigs for the up-to instruction and continues the turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetail6thStreetRecruits, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailMaxtacHeavy, spent: false, hasLag: false },
        ],
      },
      { gigArea: [{ dieType: "d6", faceValue: 1 }] },
    );

    engine.attackRival(welcomeToNightCityRetailMaxtacHeavy, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.resolveEffectTargetIds([], { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(1);
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

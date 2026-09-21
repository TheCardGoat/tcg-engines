import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAdjustGigChoice,
  expectEligibleGigs,
} from "../../../testing/index.ts";

describe("La Llorona - Ghost of the Past", () => {
  function beginRivalDirectAttack(engine: CyberpunkTestEngine): void {
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
  }

  it("is the exact red 3-cost 3-power Ganger Valentino Unit with Blocker", () => {
    expect(welcomeToNightCityRetailLaLloronaGhostOfThePast).toMatchObject({
      type: "unit",
      color: "red",
      classifications: ["Ganger", "Valentino"],
      printNumber: "013",
      cost: 3,
      power: 3,
      ram: 1,
      hasSellTag: false,
      keywords: ["blocker"],
      abilities: [
        expect.objectContaining({ kind: "keyword", keyword: "blocker" }),
        expect.objectContaining({
          trigger: {
            trigger: "event",
            event: expect.objectContaining({ event: "blockerActivated", player: "friendly" }),
          },
          effects: [
            expect.objectContaining({
              effect: "adjustGig",
              direction: "increase",
              maxAmount: 3,
              chooseUpTo: true,
            }),
          ],
        }),
      ],
    });
  });

  it("uses Blocker, then may increase either player's Gig by up to 3", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailLaLloronaGhostOfThePast,
            spent: false,
            hasLag: true,
          },
        ],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 2 }],
      },
    );

    beginRivalDirectAttack(engine);
    engine.useBlocker(welcomeToNightCityRetailLaLloronaGhostOfThePast, { as: P1 });

    expectEligibleGigs(engine, [
      { dieType: "d6", as: P1 },
      { dieType: "d8", as: P2 },
    ]);
    const targetChoice = engine.getPrompt(P1).choice;
    expect(targetChoice?.type).toBe("chooseTarget");
    if (targetChoice?.type === "chooseTarget") {
      expect(targetChoice.payload.min).toBe(0);
      expect(targetChoice.payload.max).toBe(1);
    }
    const dieId = engine.findGigIdByType(P2, "d8");
    engine.resolveEffectTargetIds([dieId], {
      as: P1,
      allowPendingChoice: true,
      reason: "La Llorona still needs the selected Gig's new face value",
    });
    expectAdjustGigChoice(engine, { direction: "increase", maxAmount: 3 });
    engine.resolveAdjustGig(5, { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.dieType === "d8")?.faceValue).toBe(5);
    expect(
      engine.getCard(welcomeToNightCityRetailLaLloronaGhostOfThePast, "field", P1).meta.spent,
    ).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({
      kind: "fight",
      defenderId: engine.findCardId(welcomeToNightCityRetailLaLloronaGhostOfThePast, "field", P1),
      redirectedByBlocker: true,
    });
  });

  it("may choose an increase of 0 because the effect says up to 3", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailLaLloronaGhostOfThePast, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }] },
    );

    beginRivalDirectAttack(engine);
    engine.useBlocker(welcomeToNightCityRetailLaLloronaGhostOfThePast, { as: P1 });
    const dieId = engine.findGigIdByType(P1, "d6");
    engine.resolveEffectTargetIds([dieId], {
      as: P1,
      allowPendingChoice: true,
      reason: "La Llorona still needs the optional increase amount",
    });
    expectAdjustGigChoice(engine, { direction: "increase", maxAmount: 3 });
    engine.resolveAdjustGig(2, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(2);
    engine.expectNoPendingChoice();
  });

  it("normalizes the increase to the selected Gig's maximum face", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailLaLloronaGhostOfThePast, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }] },
    );

    beginRivalDirectAttack(engine);
    engine.useBlocker(welcomeToNightCityRetailLaLloronaGhostOfThePast, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "La Llorona still needs the bounded increase amount",
    });
    expectAdjustGigChoice(engine, { direction: "increase", maxAmount: 3 });
    const valueChoice = engine.getPrompt(P1).choice;
    expect(valueChoice?.type).toBe("chooseTarget");
    if (valueChoice?.type === "chooseTarget") {
      expect(valueChoice.payload.currentValue).toBe(5);
      expect(valueChoice.payload.maxFaceValue).toBe(6);
    }
    const excessive = engine.expectFailure(() => engine.resolveAdjustGig(7, { as: P1 }));
    expect(excessive.errorCode).toBe("VALUE_OUT_OF_RANGE");
    engine.resolveAdjustGig(6, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(6);
  });

  it("still redirects and drains its trigger when no Gig exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: welcomeToNightCityRetailLaLloronaGhostOfThePast, spent: false }] },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }] },
    );

    beginRivalDirectAttack(engine);
    engine.useBlocker(welcomeToNightCityRetailLaLloronaGhostOfThePast, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getState().G.attackState).toMatchObject({
      kind: "fight",
      redirectedByBlocker: true,
    });
  });

  it("does not trigger when another friendly Unit uses Blocker", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailLaLloronaGhostOfThePast, spent: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
        ],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }] },
    );

    beginRivalDirectAttack(engine);
    engine.useBlocker(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getGigValue(P1)).toBe(2);
  });
});

import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMuamarReyesElCapitan,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const muamar = welcomeToNightCityRetailMuamarReyesElCapitan;

describe("Muamar Reyes — El Capitán", () => {
  it("is the exact yellow Fixer Legend with its Call modal and Spend Gig adjustment", () => {
    expect(muamar).toMatchObject({
      canonicalId: "muamar-reyes-el-capitan",
      slug: "muamar-reyes-el-capitan",
      name: "Muamar Reyes",
      subname: "El Capitán",
      displayName: "Muamar Reyes: El Capitán",
      type: "legend",
      color: "yellow",
      classifications: ["Fixer"],
      printNumber: "038",
      ram: 2,
      hasSellTag: true,
      timingTriggers: ["call"],
      rulesText:
        "{Call} Choose one effect.\nA friendly Unit can't be defeated in a fight this turn. // Draw 1.\n{Spend} Adjust a Gig by 1.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "call" },
          source: { selector: "self" },
          effects: [
            {
              effect: "chooseEffect",
              options: [
                expect.objectContaining({ id: "protect" }),
                expect.objectContaining({ id: "draw" }),
              ],
            },
          ],
        },
        {
          kind: "triggered",
          trigger: { trigger: "activated" },
          source: { selector: "self" },
          bindings: [
            expect.objectContaining({
              id: "selectedGig",
              target: expect.objectContaining({ selector: "gig", amount: 1 }),
            }),
          ],
          costs: [{ cost: "spend", target: { selector: "self" } }],
          effects: [
            {
              effect: "adjustGig",
              target: { selector: "bound", id: "selectedGig" },
              maxAmount: 1,
              direction: "either",
            },
          ],
        },
      ],
    });
  });

  it("on Call can protect a friendly Unit from being defeated in a fight this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: muamar, faceDown: true }],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
    );

    engine.callLegend(muamar, { as: P1 });
    expect(engine.getEddies(P1)).toBe(1);
    engine.resolveChooseEffect("protect", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectiveRules(engine.getState(), unit.instanceId as string)).toContain(
      "cantBeDefeatedInFight",
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("can protect a friendly attacking Unit that loses its fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: muamar, faceDown: true }],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: true, hasLag: false }],
      },
    );

    engine.callLegend(muamar, { as: P1 });
    engine.resolveChooseEffect("protect", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailRidingNomad, {
      as: P1,
    });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1)).toHaveLength(0);
  });

  it("expires the fight protection when the Call turn ends", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: muamar, faceDown: true }],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
    );

    engine.callLegend(muamar, { as: P1 });
    engine.resolveChooseEffect("protect", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.completeTurn({ as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("on Call can draw 1 instead", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: muamar, faceDown: true }],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 2,
    });
    const handBefore = engine.getHandCount(P1);
    engine.callLegend(muamar, { as: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("may choose protection with no friendly Unit and resolves as much as possible", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: muamar, faceDown: true }],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 1,
    });

    engine.callLegend(muamar, { as: P1 });

    expect(engine.getPrompt(P1).choice).toMatchObject({
      type: "chooseEffect",
      payload: {
        options: expect.arrayContaining([
          expect.objectContaining({ id: "protect" }),
          expect.objectContaining({ id: "draw" }),
        ]),
      },
    });
    engine.resolveChooseEffect("protect", { as: P1 });
    engine.expectNoPendingChoice();
    expect(engine.getHandCount(P1)).toBe(0);
  });

  it("spends to adjust a Gig by 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: muamar, faceDown: false, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });

    engine.activateAbility(muamar, 1, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Muamar still needs the Gig adjustment amount",
    });
    engine.resolveAdjustGig(4, { as: P1 });
    expect(engine.getCard(muamar, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getGigValue(P1)).toBe(4);
  });

  it("can spend to decrease a rival Gig by exactly 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: muamar, faceDown: false, spent: false }] },
      { gigArea: [{ dieType: "d8", faceValue: 5 }] },
    );

    engine.activateAbility(muamar, 1, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P2, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Muamar still needs the exact rival Gig adjustment amount",
    });
    engine.resolveAdjustGig(4, { as: P1 });

    expect(engine.getCard(muamar, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getGigValue(P2)).toBe(4);
  });

  it("rejects adjusting a Gig by more than exactly 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: muamar, faceDown: false, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });

    engine.activateAbility(muamar, 1, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Muamar still needs the exact adjustment amount",
    });
    const failure = engine.expectFailure(() => engine.resolveAdjustGig(5, { as: P1 }));

    expect(failure.errorCode).toBe("EXCEEDS_MAX_AMOUNT");
    expect(engine.getGigValue(P1)).toBe(3);
  });

  it("cannot activate the Spend ability without any Gig and does not spend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: muamar, faceDown: false, spent: false }],
    });

    const failure = engine.expectFailure(() => engine.activateAbility(muamar, 1, { as: P1 }));

    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(engine.getCard(muamar, "legendArea", P1).meta.spent).toBe(false);
  });

  it("cannot activate the Spend ability while already spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: muamar, faceDown: false, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });
    engine.judgeSpendCard(muamar, { as: P1 });

    const failure = engine.expectFailure(() => engine.activateAbility(muamar, 1, { as: P1 }));

    expect(failure.errorCode).toBe("CARD_SPENT");
    expect(engine.getGigValue(P1)).toBe(3);
  });
});

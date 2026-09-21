import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJohnnySilverhandRockingRenegade,
  welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
  welcomeToNightCityRetailOffdutyMalfini,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower, getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const johnny = welcomeToNightCityRetailJohnnySilverhandRockingRenegade;
const fieldOperator = welcomeToNightCityRetailFieldOperator;
const kerry = welcomeToNightCityRetailKerryEurodyneTheLastRockerboy;
const malfini = welcomeToNightCityRetailOffdutyMalfini;

describe("Johnny Silverhand — Rocking Renegade", () => {
  it("is the exact red Merc Rocker Samurai Legend with its reduced Spend ability", () => {
    expect(johnny).toMatchObject({
      type: "legend",
      color: "red",
      classifications: ["Merc", "Rocker", "Samurai"],
      printNumber: "003",
      ram: 2,
      hasSellTag: true,
    });
    expect(johnny.abilities).toEqual([
      expect.objectContaining({
        kind: "triggered",
        trigger: { trigger: "activated" },
        costs: [
          {
            cost: "payEddies",
            amount: 2,
            reduction: {
              target: {
                selector: "gig",
                controller: "friendly",
                amount: "all",
                minValue: 8,
              },
              reductionPerCount: 1,
              min: 1,
            },
          },
          { cost: "spend", target: { selector: "self" } },
        ],
        bindings: [
          {
            id: "selectedUnit",
            target: expect.objectContaining({
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
              selection: { mode: "choose", min: 1, max: 1 },
            }),
          },
        ],
        effects: [
          expect.objectContaining({
            effect: "grantRule",
            rule: "canAttackOnPlayedTurnAgainstUnits",
            duration: "turn",
          }),
          expect.objectContaining({
            effect: "modifyPower",
            value: 2,
            duration: "turn",
          }),
        ],
      }),
    ]);
  });

  it("lets a non-Rocker played this turn attack a spent Unit without granting +2 power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [fieldOperator],
        legendArea: [{ card: johnny, faceDown: false, spent: false }],
        eddies: 5,
      },
      { field: [{ card: malfini, spent: true, hasLag: false }] },
    );

    engine.playCard(fieldOperator, { as: P1 });
    const operator = engine.getCard(fieldOperator, "field", P1);
    expect(operator.meta.hasLag).toBe(true);
    const basePower = getEffectivePower(engine.getState(), operator.instanceId);

    const result = engine.activateAbility(johnny, 0, { as: P1 });
    expect(result.success).toBe(true);
    const rules = getEffectiveRules(engine.getState(), operator.instanceId as string);
    expect(rules).toContain("canAttackOnPlayedTurnAgainstUnits");
    expect(getEffectivePower(engine.getState(), operator.instanceId)).toBe(basePower);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(johnny, "legendArea", P1).meta.spent).toBe(true);

    expect(engine.attackUnit(operator, malfini, { as: P1 }).success).toBe(true);
    engine.resolveFullFight({ as: P1 });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      fieldOperator.id,
    );
  });

  it("gives a played ROCKER +2 power, enables its Unit attack, and expires both effects", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [kerry],
        legendArea: [{ card: johnny, faceDown: false, spent: false }],
        eddies: 6,
      },
      { field: [{ card: malfini, spent: true, hasLag: false }] },
    );

    engine.playCard(kerry, { as: P1 });
    const rocker = engine.getCard(kerry, "field", P1);
    const basePower = getEffectivePower(engine.getState(), rocker.instanceId);
    engine.activateAbility(johnny, 0, { as: P1 });

    expect(getEffectivePower(engine.getState(), rocker.instanceId)).toBe(basePower + 2);
    expect(getEffectiveRules(engine.getState(), rocker.instanceId)).toContain(
      "canAttackOnPlayedTurnAgainstUnits",
    );
    engine.attackUnit(rocker, malfini, { as: P1 });
    engine.resolveFullFight({ as: P1 });
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      malfini.id,
    );

    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), rocker.instanceId)).toBe(basePower);
    expect(getEffectiveRules(engine.getState(), rocker.instanceId)).not.toContain(
      "canAttackOnPlayedTurnAgainstUnits",
    );
  });

  it("reduces the Eddie cost by 1 per friendly 8+ Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: johnny, faceDown: false, spent: false }],
      field: [{ card: fieldOperator, spent: false, hasLag: true }],
      eddies: 1,
      gigArea: [{ dieType: "d10", faceValue: 8 }],
    });

    const result = engine.activateAbility(johnny, 0, { as: P1 });
    expect(result.success).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("cannot reduce the activation below 1 Eddie with multiple friendly 8+ Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: johnny, faceDown: false, spent: false }],
      field: [{ card: fieldOperator, spent: false, hasLag: true }],
      eddies: 0,
      gigArea: [
        { dieType: "d10", faceValue: 8 },
        { dieType: "d12", faceValue: 9 },
      ],
    });

    const failure = engine.expectFailure(() => engine.activateAbility(johnny, 0, { as: P1 }));

    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getCard(johnny, "legendArea", P1).meta.spent).toBe(false);
    engine.expectNoPendingChoice();
  });

  it("pays the 1-Eddie minimum with multiple qualifying friendly Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: johnny, faceDown: false, spent: false }],
      field: [{ card: fieldOperator, spent: false, hasLag: true }],
      eddies: 1,
      gigArea: [
        { dieType: "d10", faceValue: 8 },
        { dieType: "d12", faceValue: 9 },
      ],
    });

    engine.activateAbility(johnny, 0, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(johnny, "legendArea", P1).meta.spent).toBe(true);
  });

  it("does not reduce the cost for friendly value 7 or rival value 8 Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: johnny, faceDown: false, spent: false }],
        field: [{ card: fieldOperator, spent: false, hasLag: true }],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      { gigArea: [{ dieType: "d10", faceValue: 8 }] },
    );

    const failure = engine.expectFailure(() => engine.activateAbility(johnny, 0, { as: P1 }));

    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCard(johnny, "legendArea", P1).meta.spent).toBe(false);
  });

  it("requires exactly one friendly field Unit and excludes rival Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: johnny, faceDown: false, spent: false }],
        field: [
          { card: fieldOperator, spent: false, hasLag: true },
          { card: kerry, spent: false, hasLag: true },
        ],
        eddies: 2,
      },
      { field: [{ card: malfini, spent: true, hasLag: false }] },
    );

    engine.activateAbility(johnny, 0, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Unit target choice.");
    expect(choice.chooserId).toBe(P1);
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.findCardId(fieldOperator, "field", P1),
        engine.findCardId(kerry, "field", P1),
      ]),
    );
    expect(choice.payload.eligibleIds).not.toContain(engine.findCardId(malfini, "field", P2));
  });
});

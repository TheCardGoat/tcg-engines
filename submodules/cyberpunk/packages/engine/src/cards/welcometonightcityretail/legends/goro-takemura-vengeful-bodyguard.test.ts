import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGildedMaton,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower, getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Goro Takemura - Vengeful Bodyguard", () => {
  it("is the exact green Arasaka Corpo Legend with QUICK, paid BLOCKER grant, and discard-draw trigger", () => {
    const goro = welcomeToNightCityRetailGoroTakemuraVengefulBodyguard;

    expect(goro).toMatchObject({
      canonicalId: "goro-takemura-vengeful-bodyguard",
      slug: "goro-takemura-vengeful-bodyguard",
      name: "Goro Takemura",
      subname: "Vengeful Bodyguard",
      displayName: "Goro Takemura: Vengeful Bodyguard",
      type: "legend",
      color: "green",
      classifications: ["Arasaka", "Corpo"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      keywords: ["quick"],
      printNumber: "071",
      rarity: "Rare",
      rulesText:
        "{Quick} 1 €$, {Spend} Give a friendly Unit with cost 4 or less {Blocker} this turn. If you control a value-pair of Gigs, also give it +1 power this turn.\nWhen a friendly Unit uses {Blocker}, you may discard 1. If you do, draw 1.",
    });
    expect(goro.abilities).toHaveLength(3);
    expect(goro.abilities[0]).toMatchObject({ kind: "keyword", keyword: "quick" });
    expect(goro.abilities[1]).toMatchObject({
      trigger: { trigger: "activated" },
      bindings: [
        {
          target: {
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 4,
            selection: { min: 1, max: 1 },
          },
        },
      ],
      costs: [
        { cost: "payEddies", amount: 1 },
        { cost: "spend", target: { selector: "self" } },
      ],
      effects: [
        { effect: "grantRule", rule: "blocker", duration: "turn" },
        {
          effect: "modifyPower",
          value: 1,
          duration: "turn",
          conditions: [{ condition: "hasGigPair", controller: "friendly" }],
        },
      ],
    });
    expect(goro.abilities[2]).toMatchObject({
      trigger: {
        trigger: "event",
        event: { event: "blockerActivated", player: "friendly" },
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "discardFromHand",
            player: "friendly",
            amount: 1,
            optional: true,
          },
          ifEffects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });
  });

  it("spends to grant BLOCKER and +1 power to a cheap friendly Unit when you control a Gig pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      legendArea: [
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 2 },
      ],
      eddies: 1,
    });
    const fieldOperatorId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    const before = getEffectivePower(engine.getState(), fieldOperatorId);

    engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 });

    expect(getEffectiveRules(engine.getState(), fieldOperatorId)).toContain("blocker");
    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(before + 1);
    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);

    engine.completeTurn({ as: P1 });
    expect(getEffectiveRules(engine.getState(), fieldOperatorId)).not.toContain("blocker");
    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(before);
  });

  it("grants BLOCKER without +1 power when there is no friendly Gig value-pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      legendArea: [
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 3 },
      ],
      eddies: 1,
    });
    const unitId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);

    engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 });

    expect(getEffectiveRules(engine.getState(), unitId)).toContain("blocker");
    expect(getEffectivePower(engine.getState(), unitId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
  });

  it("offers exactly a friendly Unit at the inclusive cost-4 boundary and excludes cost 5", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: welcomeToNightCityRetailGildedMaton, spent: false, hasLag: false },
        { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        { card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false },
      ],
      legendArea: [
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 1,
    });

    engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Unit choice.");
    const costFour = engine.getCard(welcomeToNightCityRetailGildedMaton, "field", P1);
    const costFive = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1);
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(choice.payload.eligibleIds).toContain(costFour.instanceId);
    expect(choice.payload.eligibleIds).toContain(
      engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
    );
    expect(choice.payload.eligibleIds).not.toContain(costFive.instanceId);

    engine.resolveEffectTarget(welcomeToNightCityRetailGildedMaton, { as: P1 });
    expect(getEffectiveRules(engine.getState(), costFour.instanceId)).toContain("blocker");
  });

  it("activates as QUICK during a rival attack and grants BLOCKER in time to redirect it", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 1,
      },
      { field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }] },
      { activePlayerId: P2 },
    );

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expect(
      engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 }),
    ).toMatchObject({ success: true });
    engine.useBlocker(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getAttackState()).toMatchObject({
      kind: "fight",
      defenderId: engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
    });
  });

  it("draws 1 if you discard after a friendly Unit uses BLOCKER", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDyingNightVSPistol],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveDiscardFromHand([welcomeToNightCityRetailDyingNightVSPistol], { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDyingNightVSPistol.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("may decline the discard after BLOCKER and then does not draw", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDyingNightVSPistol],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.executeMove("resolveDiscardFromHand", { args: { pass: true } }, P1);

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailDyingNightVSPistol.id,
    ]);
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1)).toHaveLength(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("does not activate when there is no eligible cheap friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 1,
    });

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 }),
    );

    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
  });
});

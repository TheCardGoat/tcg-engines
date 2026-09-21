import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailDumDumMaelstromTriggerman,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailTheRelicExperimentalBiochip,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCardToMoveCount,
  expectNoPendingChoice,
  expectPendingChoice,
} from "../../../testing/index.ts";

describe("Dum Dum - Maelstrom Triggerman", () => {
  it("is the exact yellow Ganger Maelstrom Legend with Call and paid Quick abilities", () => {
    const dumDum = welcomeToNightCityRetailDumDumMaelstromTriggerman;
    expect(dumDum).toMatchObject({
      canonicalId: "dum-dum-maelstrom-triggerman",
      slug: "dum-dum-maelstrom-triggerman",
      name: "Dum Dum",
      subname: "Maelstrom Triggerman",
      displayName: "Dum Dum: Maelstrom Triggerman",
      type: "legend",
      color: "yellow",
      classifications: ["Ganger", "Maelstrom"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "036",
      timingTriggers: ["call"],
      keywords: ["quick"],
      rulesText:
        "{Call} You may defeat a friendly Gear. If you do, draw 2. Otherwise, draw 1.\n{Quick} 1 €$, {Spend} Give a friendly Unit +1 power this turn for each of its equipped Gear.",
    });
    expect(dumDum.abilities).toHaveLength(3);
    expect(dumDum.abilities[0]).toMatchObject({ kind: "keyword", keyword: "quick" });
    expect(dumDum.abilities[1]).toMatchObject({
      trigger: { trigger: "call" },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "defeat",
            optional: true,
            target: {
              controller: "friendly",
              cardTypes: ["gear"],
              selection: { min: 0, max: 1 },
            },
          },
          ifEffects: [{ effect: "draw", player: "friendly", amount: 2 }],
          elseEffects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });
    expect(dumDum.abilities[2]).toMatchObject({
      trigger: { trigger: "activated" },
      bindings: [
        {
          target: {
            controller: "friendly",
            cardTypes: ["unit"],
            selection: { min: 1, max: 1 },
          },
        },
      ],
      costs: [
        { cost: "payEddies", amount: 1 },
        { cost: "spend", target: { selector: "self" } },
      ],
      effects: [
        {
          effect: "modifyPower",
          value: { type: "perCount", multiplier: 1 },
          duration: "turn",
        },
      ],
    });
  });

  it("defeats a friendly Gear on call and draws 2 if you do", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailDumDumMaelstromTriggerman, { as: P1 });
    const choice = expectPendingChoice(engine, "chooseCardToMove");
    expect(choice.payload.canDecline).toBe(true);
    expectCardToMoveCount(engine, 1);
    const hostId = engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    const gearId = engine.findCardId(welcomeToNightCityRetailKiroshiOptics, "field", P1);
    const resolveResult = engine.resolveCardToMove(welcomeToNightCityRetailKiroshiOptics, {
      as: P1,
    });
    // The optional defeat is a real defeat: it animates as a card exit to the
    // trash (same presentation as combat and effect defeats), not a cardMove.
    const move = resolveResult.animationScript.steps.find((step) => step.kind === "cardExit");
    expect(move).toMatchObject({
      kind: "cardExit",
      exitReason: "defeated",
      cardId: gearId,
      fromHostId: hostId,
      fromZone: "field",
      toZone: "trash",
    });
    expect(
      resolveResult.animationScript.steps.filter((step) => step.kind === "cardEnter"),
    ).toHaveLength(2);

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailDelamainCab.id,
    ]);
    expectNoPendingChoice(engine);
  });

  it("lets the player skip the optional Gear defeat and draw 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailDumDumMaelstromTriggerman, { as: P1 });
    const choice = expectPendingChoice(engine, "chooseCardToMove");
    expect(choice.payload.canDecline).toBe(true);
    engine.resolveCardToMove(undefined, { as: P1, pass: true });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
    ]);
    expectNoPendingChoice(engine);
  });

  it("lets the player choose which friendly Gear to defeat when more than one is equipped", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: false,
            hasLag: false,
            attachedGears: [
              welcomeToNightCityRetailKiroshiOptics,
              welcomeToNightCityRetailMantisBlades,
            ],
          },
        ],
        legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailDumDumMaelstromTriggerman, { as: P1 });
    expectCardToMoveCount(engine, 2);
    engine.resolveCardToMove(welcomeToNightCityRetailMantisBlades, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailMantisBlades.id,
    ]);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailDelamainCab.id,
    ]);
    expectNoPendingChoice(engine);
  });

  it("draws 1 on call when there is no friendly Gear to defeat", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
        legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailDumDumMaelstromTriggerman, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
    ]);
    expectNoPendingChoice(engine);
  });

  it("spends to give a friendly Unit +1 power per equipped Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: false,
          hasLag: false,
          attachedGears: [
            welcomeToNightCityRetailKiroshiOptics,
            welcomeToNightCityRetailMantisBlades,
          ],
        },
      ],
      legendArea: [
        { card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false, spent: false },
      ],
      eddies: 1,
    });
    const swordwiseId = engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    const before = getEffectivePower(engine.getState(), swordwiseId);

    engine.activateAbility(welcomeToNightCityRetailDumDumMaelstromTriggerman, 2, { as: P1 });

    expect(getEffectivePower(engine.getState(), swordwiseId)).toBe(before + 2);
    expect(
      engine.getCard(welcomeToNightCityRetailDumDumMaelstromTriggerman, "legendArea", P1).meta
        .spent,
    ).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), swordwiseId)).toBe(before);
  });

  it("pays and spends for +0 when the chosen friendly Unit has no equipped Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: false }],
      legendArea: [
        { card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false, spent: false },
      ],
      eddies: 1,
    });
    const unit = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    const before = getEffectivePower(engine.getState(), unit.instanceId);

    engine.activateAbility(welcomeToNightCityRetailDumDumMaelstromTriggerman, 2, { as: P1 });

    expect(getEffectivePower(engine.getState(), unit.instanceId)).toBe(before);
    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailDumDumMaelstromTriggerman, "legendArea", P1).meta
        .spent,
    ).toBe(true);
  });

  it("activates the paid power ability as a QUICK reaction during a rival attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailDumDumMaelstromTriggerman,
            faceDown: false,
            spent: false,
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );
    const unit = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    const before = getEffectivePower(engine.getState(), unit.instanceId);
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expect(
      engine.activateAbility(welcomeToNightCityRetailDumDumMaelstromTriggerman, 2, { as: P1 }),
    ).toMatchObject({ success: true });

    expect(getEffectivePower(engine.getState(), unit.instanceId)).toBe(before + 1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailDumDumMaelstromTriggerman, "legendArea", P1).meta
        .spent,
    ).toBe(true);
  });

  it("does not activate the power ability when there is no friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false, spent: false },
      ],
      eddies: 1,
    });

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailDumDumMaelstromTriggerman, 2, { as: P1 }),
    );

    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(
      engine.getCard(welcomeToNightCityRetailDumDumMaelstromTriggerman, "legendArea", P1).meta
        .spent,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
  });

  it("lets the defeated Gear's {Defeated} trigger fire (The Relic via the optional defeat)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
          },
        ],
        trash: [welcomeToNightCityRetailSwordwiseHuscle],
        legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailDumDumMaelstromTriggerman, { as: P1 });
    const choice = expectPendingChoice(engine, "chooseCardToMove");
    expect(choice.payload.defeat).toBe(true);
    engine.resolveCardToMove(welcomeToNightCityRetailTheRelicExperimentalBiochip, { as: P1 });

    // The draw-2 of the {Call} ability resolves first.
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailDelamainCab.id,
    ]);

    // The Relic's {Defeated} fires: free-play Swordwise from the trash.
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );

    // The Relic is defeated in the trash; its host is bottom-decked.
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailTheRelicExperimentalBiochip.id,
    );
    const deckIds = engine.getCardsInZone("deck", P1).map((card) => card.definitionId);
    expect(deckIds[deckIds.length - 1]).toBe(welcomeToNightCityRetailFieldOperator.id);
    expectNoPendingChoice(engine);
  });
});

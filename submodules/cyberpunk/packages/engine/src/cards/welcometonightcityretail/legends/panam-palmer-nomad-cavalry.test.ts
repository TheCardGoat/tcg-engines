import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailPanamPalmerNomadCavalry,
  welcomeToNightCityRetailPadreManOfTheCross,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const panam = welcomeToNightCityRetailPanamPalmerNomadCavalry;
const kiroshi = welcomeToNightCityRetailKiroshiOptics;

function activateAbilityCandidates(engine: CyberpunkTestEngine) {
  const spec = engine
    .getPrompt(P1)
    .availableMoves.find((move) => move.moveId === "activateAbility")?.inputSpec;
  return spec?.type === "selectAbility" ? spec.candidates : [];
}

describe("Panam Palmer: Nomad Cavalry", () => {
  it("is the exact green Aldecado Merc Nomad Legend with both printed abilities", () => {
    expect(panam).toMatchObject({
      canonicalId: "panam-palmer-nomad-cavalry",
      slug: "panam-palmer-nomad-cavalry",
      name: "Panam Palmer",
      subname: "Nomad Cavalry",
      displayName: "Panam Palmer: Nomad Cavalry",
      type: "legend",
      color: "green",
      classifications: ["Aldecado", "Merc", "Nomad"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "075",
      rulesText:
        "2 €$, {Spend} Move a Gear from this Legend to an unequipped friendly Unit. If you do, ready that Unit.\nAt the end of your turn, if 5 or more friendly Units and/or Legends are equipped, ready them.",
    });
    expect(panam.abilities).toHaveLength(2);
    expect(panam.abilities[0]).toMatchObject({
      trigger: { trigger: "activated" },
      bindings: [
        {
          id: "selectedUnit",
          target: expect.objectContaining({
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            hasAttachedCards: false,
          }),
        },
      ],
      costs: [
        { cost: "payEddies", amount: 2 },
        { cost: "spend", target: { selector: "self" } },
      ],
      effects: [expect.objectContaining({ effect: "ifYouDo" })],
    });
    expect(panam.abilities[1]).toMatchObject({
      trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
      effects: [
        expect.objectContaining({
          effect: "ready",
          conditions: [
            { condition: "hasEquippedUnitsOrLegends", controller: "friendly", minCount: 5 },
          ],
        }),
      ],
    });
  });

  it("offers only unequipped friendly Units as move destinations", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true },
          { card: welcomeToNightCityRetailMoxInciters, spent: true },
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            attachedGears: [kiroshi],
          },
        ],
        legendArea: [{ card: panam, faceDown: false, spent: false, attachedGears: [kiroshi] }],
        eddies: 2,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );

    engine.activateAbility(panam, 0, { as: P1 });
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    expect(pending).toMatchObject({ type: "chooseTarget", payload: { min: 1, max: 1 } });
    if (!pending || pending.type !== "chooseTarget") throw new Error("Expected destination Unit");
    expect(new Set(pending.payload.eligibleIds)).toEqual(
      new Set([
        engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1),
        engine.findCardId(welcomeToNightCityRetailMoxInciters, "field", P1),
      ]),
    );
    expect(pending.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("pays 2, spends Panam, moves one chosen Gear, and readies the chosen Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
      legendArea: [
        { card: panam, faceDown: false, spent: false, attachedGears: [kiroshi] },
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
          attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
        },
      ],
      eddies: 2,
    });

    engine.activateAbility(panam, 0, { as: P1 });
    const gearChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(gearChoice).toMatchObject({
      type: "chooseTarget",
      payload: {
        eligibleIds: [engine.findCardId(kiroshi, "legendArea", P1)],
      },
    });
    engine.resolveEffectTarget(kiroshi, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    expect(unit.meta.spent).toBe(false);
    expect(unit.meta.attachedGearIds).toHaveLength(1);
    expect(engine.getCard(panam, "legendArea", P1).meta).toMatchObject({
      spent: true,
      attachedGearIds: [],
    });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("does not offer or allow the move without Gear on Panam", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
      legendArea: [{ card: panam, faceDown: false, spent: false }],
      eddies: 2,
    });
    const panamId = engine.findCardId(panam, "legendArea", P1);
    expect(activateAbilityCandidates(engine)).not.toContainEqual(
      expect.objectContaining({ cardId: panamId as string, abilityIndex: 0 }),
    );
    expect(
      engine.executeMove(
        "activateAbility",
        { args: { cardId: panamId as string, abilityIndex: 0 } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "NO_VALID_TARGETS" });
    expect(engine.getEddies(P1)).toBe(2);
    expect(engine.getCard(panam, "legendArea", P1).meta.spent).toBe(false);
  });

  it("does not offer the move when every friendly Unit is already equipped", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: true,
          attachedGears: [kiroshi],
        },
      ],
      legendArea: [
        { card: panam, faceDown: false, spent: false, attachedGears: [kiroshi] },
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: true,
          spent: true,
        },
        { card: welcomeToNightCityRetailPadreManOfTheCross, faceDown: true, spent: true },
      ],
      eddies: 2,
    });

    expect(activateAbilityCandidates(engine)).not.toContainEqual(
      expect.objectContaining({ abilityIndex: 0 }),
    );
  });

  it("rejects insufficient Eddies without spending Panam or moving Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
      legendArea: [
        { card: panam, faceDown: false, spent: false, attachedGears: [kiroshi] },
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: true,
          spent: true,
        },
        { card: welcomeToNightCityRetailPadreManOfTheCross, faceDown: true, spent: true },
      ],
      eddies: 1,
    });
    const panamId = engine.findCardId(panam, "legendArea", P1);
    for (const legend of engine
      .getCardsInZone("legendArea", P1)
      .filter((card) => card.definitionId !== panam.id && card.definitionId !== kiroshi.id)) {
      legend.meta.spent = true;
    }

    expect(
      engine.executeMove(
        "activateAbility",
        { args: { cardId: panamId as string, abilityIndex: 0 } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCard(panam, "legendArea", P1).meta).toMatchObject({
      spent: false,
      attachedGearIds: [expect.any(String)],
    });
  });

  it("at exactly five equipped friendly Units and Legends, readies all five at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, attachedGears: [kiroshi] },
        { card: welcomeToNightCityRetailFieldOperator, spent: true, attachedGears: [kiroshi] },
        { card: welcomeToNightCityRetailCorpoSecurity, spent: true, attachedGears: [kiroshi] },
        { card: welcomeToNightCityRetailMoxInciters, spent: true, attachedGears: [kiroshi] },
      ],
      legendArea: [{ card: panam, faceDown: false, spent: true, attachedGears: [kiroshi] }],
    });
    engine.getCard(panam, "legendArea", P1).meta.spent = true;

    engine.completeTurn({ as: P1 });

    const equipped = [
      ...engine.getCardsInZone("field", P1).filter((card) => card.definitionId !== kiroshi.id),
      engine.getCard(panam, "legendArea", P1),
    ];
    expect(equipped).toHaveLength(5);
    expect(equipped.every((card) => card.meta.spent === false)).toBe(true);
  });

  it("at four equipped friendlies, the end-turn ability does not ready them", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, attachedGears: [kiroshi] },
        { card: welcomeToNightCityRetailFieldOperator, spent: true, attachedGears: [kiroshi] },
        { card: welcomeToNightCityRetailCorpoSecurity, spent: true, attachedGears: [kiroshi] },
      ],
      legendArea: [{ card: panam, faceDown: false, spent: true, attachedGears: [kiroshi] }],
    });
    engine.getCard(panam, "legendArea", P1).meta.spent = true;

    const equippedBefore = [
      ...engine.getCardsInZone("field", P1),
      ...engine.getCardsInZone("legendArea", P1),
    ].filter((card) => card.meta.attachedGearIds.length > 0);
    expect(equippedBefore).toHaveLength(4);

    engine.completeTurn({ as: P1 });

    expect(
      engine
        .getCardsInZone("field", P1)
        .filter((card) => card.definitionId !== kiroshi.id)
        .every((card) => card.meta.spent),
    ).toBe(true);
    expect(engine.getCard(panam, "legendArea", P1).meta.spent).toBe(true);
  });
});

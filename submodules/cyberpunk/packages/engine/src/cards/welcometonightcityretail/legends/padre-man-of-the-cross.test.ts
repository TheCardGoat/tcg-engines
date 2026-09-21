import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailPadreManOfTheCross,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const padre = welcomeToNightCityRetailPadreManOfTheCross;

function activateAbilityCandidates(engine: CyberpunkTestEngine) {
  const spec = engine
    .getPrompt(P1)
    .availableMoves.find((move) => move.moveId === "activateAbility")?.inputSpec;
  return spec?.type === "selectAbility" ? spec.candidates : [];
}

describe("Padre: Man of the Cross", () => {
  it("is the exact green Fixer Ganger Valentino Legend with CALL and SPEND abilities", () => {
    expect(padre).toMatchObject({
      canonicalId: "padre-man-of-the-cross",
      slug: "padre-man-of-the-cross",
      name: "Padre",
      subname: "Man of the Cross",
      displayName: "Padre: Man of the Cross",
      type: "legend",
      color: "green",
      classifications: ["Fixer", "Ganger", "Valentino"],
      ram: 2,
      hasSellTag: true,
      printNumber: "074",
      timingTriggers: ["call"],
      rulesText:
        "{Call} Choose one effect.\nSpend a rival Unit. // Draw 1.\n{Spend} Set a player's Gig to the same value as another player's Gig.",
      abilities: [
        expect.objectContaining({
          trigger: { trigger: "call" },
          source: { selector: "self" },
          effects: [
            {
              effect: "chooseEffect",
              options: [
                expect.objectContaining({ id: "spend", label: "Spend a rival Unit" }),
                expect.objectContaining({ id: "draw", label: "Draw 1" }),
              ],
            },
          ],
        }),
        expect.objectContaining({
          trigger: { trigger: "activated" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedGigs",
              target: {
                selector: "gig",
                amount: 2,
                selection: {
                  mode: "choose",
                  min: 2,
                  max: 2,
                  pairConstraint: "gig-copy-between-players",
                },
              },
            },
          ],
          costs: [{ cost: "spend", target: { selector: "self" } }],
          effects: [
            {
              effect: "copyGigValue",
              source: { selector: "bound", id: "selectedGigs", index: 0 },
              target: { selector: "bound", id: "selectedGigs", index: 1 },
            },
          ],
        }),
      ],
    });
  });

  it("CALL pays its cost and the spend mode offers only ready rival Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: padre, faceDown: true }],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 2,
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
        ],
      },
    );

    engine.callLegend(padre, { as: P1 });
    expect(engine.getEddies(P1)).toBe(1);
    engine.resolveChooseEffect("spend", { as: P1 });
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    expect(pending).toMatchObject({ type: "chooseTarget", payload: { min: 1, max: 1 } });
    if (!pending || pending.type !== "chooseTarget") throw new Error("Expected ready rival Unit");
    expect(pending.payload.eligibleIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P2),
    ]);
    expect(
      engine.executeMove(
        "resolveEffectTarget",
        {
          args: {
            targetIds: [engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2)],
          },
        },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
  });

  it("CALL spend mode spends its chosen ready rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: padre, faceDown: true }], eddies: 2 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );

    engine.callLegend(padre, { as: P1 });
    engine.resolveChooseEffect("spend", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
  });

  it("CALL draw mode draws exactly one instead", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: padre, faceDown: true }],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 2,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.callLegend(padre, { as: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
    ]);
  });

  it("copies a friendly Gig value to a rival Gig and spends Padre", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: padre, faceDown: false, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 2 }] },
    );
    const source = engine.findGigIdByType(P1, "d6");
    const target = engine.findGigIdByType(P2, "d8");

    engine.activateAbility(padre, 1, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      payload: {
        targetKind: "gig",
        min: 2,
        max: 2,
        pairConstraint: "gig-copy-between-players",
      },
    });
    engine.resolveEffectTargetIds([source, target], { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.id === target)?.faceValue).toBe(5);
    expect(engine.getCard(padre, "legendArea", P1).meta.spent).toBe(true);
  });

  it("copies in the reverse rival-to-friendly direction", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: padre, faceDown: false, spent: false }],
        gigArea: [{ dieType: "d10", faceValue: 2 }],
      },
      { gigArea: [{ dieType: "d6", faceValue: 4 }] },
    );
    const source = engine.findGigIdByType(P2, "d6");
    const target = engine.findGigIdByType(P1, "d10");

    engine.activateAbility(padre, 1, { as: P1 });
    engine.resolveEffectTargetIds([source, target], { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.id === target)?.faceValue).toBe(4);
  });

  it("rejects same-player and out-of-range ordered Gig pairs without changing values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: padre, faceDown: false, spent: false }],
        gigArea: [
          { dieType: "d20", faceValue: 10 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      { gigArea: [{ dieType: "d4", faceValue: 2 }] },
    );
    const friendlyD20 = engine.findGigIdByType(P1, "d20");
    const friendlyD6 = engine.findGigIdByType(P1, "d6");
    const rivalD4 = engine.findGigIdByType(P2, "d4");

    engine.activateAbility(padre, 1, { as: P1 });
    expect(
      engine.executeMove(
        "resolveEffectTarget",
        { args: { targetIds: [friendlyD6, friendlyD20] } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
    expect(
      engine.executeMove(
        "resolveEffectTarget",
        { args: { targetIds: [friendlyD20, rivalD4] } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
    expect(engine.getGigDice(P1).find((die) => die.id === friendlyD6)?.faceValue).toBe(3);
    expect(engine.getGigDice(P2).find((die) => die.id === rivalD4)?.faceValue).toBe(2);
  });

  it("does not offer or allow the SPEND ability when no Gig value can legally change", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: padre, faceDown: false, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 3 }] },
    );
    const padreId = engine.findCardId(padre, "legendArea", P1);

    expect(activateAbilityCandidates(engine)).not.toContainEqual(
      expect.objectContaining({ cardId: padreId as string, abilityIndex: 1 }),
    );
    expect(
      engine.executeMove(
        "activateAbility",
        { args: { cardId: padreId as string, abilityIndex: 1 } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "NO_VALID_TARGETS" });
    expect(engine.getCard(padre, "legendArea", P1).meta.spent).toBe(false);
  });
});

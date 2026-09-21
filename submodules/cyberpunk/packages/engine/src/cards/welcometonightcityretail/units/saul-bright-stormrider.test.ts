import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailSaulBrightStormrider,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Saul Bright - Stormrider", () => {
  it("has the exact green Aldecado Nomad identity, attack aura, and end-turn ready choice", () => {
    expect(welcomeToNightCityRetailSaulBrightStormrider).toMatchObject({
      canonicalId: "saul-bright-stormrider",
      slug: "saul-bright-stormrider",
      name: "Saul Bright",
      displayName: "Saul Bright: Stormrider",
      subname: "Stormrider",
      type: "unit",
      color: "green",
      classifications: ["Aldecado", "Nomad"],
      cost: 8,
      power: 14,
      ram: 2,
      hasSellTag: false,
      rarity: "Rare",
      printNumber: "089",
      rulesText:
        "Other friendly Units have +2 power while attacking.\nAt the end of your turn, ready up to 3 friendly Units.",
      abilities: [
        {
          kind: "static",
          effects: [
            {
              effect: "modifyPower",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                excludeSelf: true,
              },
              value: 2,
              duration: "continuous",
              conditions: [{ condition: "attacking", target: { selector: "self" } }],
            },
          ],
        },
        {
          kind: "triggered",
          trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
          source: { selector: "self" },
          effects: [
            {
              effect: "ready",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "spent",
                selection: { mode: "choose", min: 0, max: 3 },
              },
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 8 to play and enters with Lag", () => {
    const successEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSaulBrightStormrider],
      eddies: 8,
    });
    for (const legend of successEngine.getCardsInZone("legendArea", P1)) {
      successEngine.judgeSpendCard(legend, { as: P1 });
    }
    successEngine.playCard(welcomeToNightCityRetailSaulBrightStormrider, { as: P1 });
    expect(successEngine.getEddies(P1)).toBe(0);
    expect(
      successEngine.getCard(welcomeToNightCityRetailSaulBrightStormrider, "field", P1).meta.hasLag,
    ).toBe(true);

    const failureEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSaulBrightStormrider],
      eddies: 7,
    });
    for (const legend of failureEngine.getCardsInZone("legendArea", P1)) {
      failureEngine.judgeSpendCard(legend, { as: P1 });
    }
    expect(() =>
      failureEngine.playCard(welcomeToNightCityRetailSaulBrightStormrider, { as: P1 }),
    ).toThrow(/INSUFFICIENT_EDDIES/);
  });

  it("buffs another friendly Unit only while it attacks and never buffs Saul himself", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailSaulBrightStormrider, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    const fieldOperatorId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    const saulId = engine.findCardId(welcomeToNightCityRetailSaulBrightStormrider, "field", P1);
    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 2,
    );
    engine.resolveFullFight({ as: P1 });
    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );

    engine.attackRival(welcomeToNightCityRetailSaulBrightStormrider, { as: P1 });
    expect(getEffectivePower(engine.getState(), saulId)).toBe(
      welcomeToNightCityRetailSaulBrightStormrider.power,
    );
  });

  it("offers all spent friendly Units but readies no more than 3", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailSaulBrightStormrider, spent: true, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, hasLag: false },
          { card: welcomeToNightCityRetailOffdutyMalfini, spent: true, hasLag: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    const spentIds = [
      welcomeToNightCityRetailSaulBrightStormrider,
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailOffdutyMalfini,
    ].map((card) => engine.findCardId(card, "field", P1) as string);
    const readyId = engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P1) as string;
    const rivalId = engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2) as string;

    engine.completeTurn({ as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected Saul's end-turn ready ability to ask for effect targets.");
    }
    expect(choice.payload).toMatchObject({ min: 0, max: 3 });
    expect(choice.payload.eligibleIds).toEqual(expect.arrayContaining(spentIds));
    expect(choice.payload.eligibleIds).not.toEqual(expect.arrayContaining([readyId, rivalId]));

    engine.resolveEffectTargetIds(spentIds.slice(0, 3), { as: P1 });
    for (const id of spentIds.slice(0, 3)) expect(engine.getCard(id).meta.spent).toBe(false);
    expect(engine.getCard(spentIds[3]!).meta.spent).toBe(true);
  });

  it("gives another friendly attacking Unit +2 power and readies up to 3 Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          welcomeToNightCityRetailSaulBrightStormrider,
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, hasLag: false },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    const attackerId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    expect(getEffectivePower(engine.getState(), attackerId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 2,
    );
    engine.resolveFullFight({ as: P1 });

    engine.completeTurn({ as: P1 });
    const spentUnitId = engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    engine.resolveEffectTargetIds([spentUnitId], { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      false,
    );
    expect(engine.getActivePlayerId()).toBe(P2);
  });

  it("can choose zero end-turn ready targets", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          welcomeToNightCityRetailSaulBrightStormrider,
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, hasLag: false },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.completeTurn({ as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected Saul's end-turn ready ability to ask for effect targets.");
    }
    expect(choice.payload.min).toBe(0);
    expect(choice.payload.max).toBe(3);

    engine.resolveEffectTargetIds([], { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});

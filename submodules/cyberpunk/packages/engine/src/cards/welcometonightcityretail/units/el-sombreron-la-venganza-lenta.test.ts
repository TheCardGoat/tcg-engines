import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailElSombreronLaVenganzaLenta,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, type GigFixtureEntry } from "../../../testing/index.ts";

describe("El Sombreron - La Venganza Lenta", () => {
  it("is the exact 5-cost 4-power red Ganger Valentino Unit with an optional paid Attack buff", () => {
    const sombrero = welcomeToNightCityRetailElSombreronLaVenganzaLenta;
    expect(sombrero).toMatchObject({
      canonicalId: "el-sombreron-la-venganza-lenta",
      slug: "el-sombreron-la-venganza-lenta",
      name: "El Sombrerón",
      subname: "La Venganza Lenta",
      displayName: "El Sombrerón: La Venganza Lenta",
      type: "unit",
      color: "red",
      classifications: ["Ganger", "Valentino"],
      cost: 5,
      power: 4,
      ram: 4,
      hasSellTag: false,
      printNumber: "009",
      timingTriggers: ["attack"],
      rulesText:
        "{Attack} You may pay 2 €$. If you do, this Unit gains power equal to a friendly max Gig this turn.",
    });
    expect(sombrero.abilities).toEqual([
      {
        kind: "triggered",
        text: "ATTACK You may pay 2 €$. If you do, this Unit gains power equal to a friendly max Gig this turn.",
        trigger: { trigger: "attack" },
        source: { selector: "self" },
        bindings: [
          {
            id: "maxGig",
            target: {
              selector: "gig",
              controller: "friendly",
              atMax: true,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
        ],
        costs: [{ cost: "payEddies", amount: 2 }],
        effects: [
          {
            effect: "modifyPower",
            target: { selector: "self" },
            value: { type: "gigValue", target: { selector: "bound", id: "maxGig" } },
            duration: "turn",
          },
        ],
      },
    ]);
  });

  function attackSpentCorpoSecurityWithSombrero(p1: {
    eddies: number;
    gigArea?: GigFixtureEntry[];
    spendLegends?: boolean;
  }) {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        eddies: p1.eddies,
        gigArea: p1.gigArea,
        field: [
          {
            card: welcomeToNightCityRetailElSombreronLaVenganzaLenta,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    if (p1.spendLegends) {
      for (const legend of engine.getCardsInZone("legendArea", P1)) {
        engine.judgeSpendCard(legend, { as: P1 });
      }
    }

    engine.attackUnit(
      welcomeToNightCityRetailElSombreronLaVenganzaLenta,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    return engine;
  }

  function resolveSombreroAttackTrigger(engine: CyberpunkTestEngine) {
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTrigger");
    if (!choice || choice.type !== "chooseTrigger") {
      throw new Error("Expected El Sombreron's optional attack trigger to be pending");
    }

    expect(choice.payload.canPass).toBe(true);
    expect(choice.payload.options).toHaveLength(1);

    const triggerId = choice.payload.options[0]!.triggerId;
    const result = engine.executeMove("resolveTrigger", { args: { triggerId } }, P1);
    expect(result).toMatchObject({ success: true });
  }

  it("pays 2 Eddies and auto-selects when there is one friendly max Gig", () => {
    const engine = attackSpentCorpoSecurityWithSombrero({
      eddies: 2,
      gigArea: [
        { dieType: "d4", faceValue: 4 },
        { dieType: "d8", faceValue: 7 },
      ],
    });
    const sombrero = engine.getCard(welcomeToNightCityRetailElSombreronLaVenganzaLenta);

    resolveSombreroAttackTrigger(engine);

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(8);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();

    engine.resolveFullFight({ as: P1 });
    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(4);
  });

  it("asks which friendly max Gig to use when multiple are available", () => {
    const engine = attackSpentCorpoSecurityWithSombrero({
      eddies: 2,
      gigArea: [
        { dieType: "d4", faceValue: 4 },
        { dieType: "d12", faceValue: 12 },
      ],
    });
    const sombrero = engine.getCard(welcomeToNightCityRetailElSombreronLaVenganzaLenta);

    resolveSombreroAttackTrigger(engine);

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: {
        type: "effectTarget",
        targetKind: "gig",
        min: 1,
        max: 1,
      },
    });
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected El Sombreron to ask which friendly max Gig to use.");
    }
    expect(choice.payload.eligibleIds).toHaveLength(2);

    const d4 = engine.findGigIdByType(P1, "d4");
    engine.resolveEffectTargetIds([d4], { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(8);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("skips the optional attack trigger automatically when the controller cannot pay 2 Eddies", () => {
    const engine = attackSpentCorpoSecurityWithSombrero({
      eddies: 0,
      gigArea: [{ dieType: "d8", faceValue: 7 }],
      spendLegends: true,
    });
    const sombrero = engine.getCard(welcomeToNightCityRetailElSombreronLaVenganzaLenta);

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.players[P1].spentEddies).toBe(0);
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(4);
  });

  it("skips the optional attack trigger when the controller has no max Gigs", () => {
    const engine = attackSpentCorpoSecurityWithSombrero({
      eddies: 2,
      gigArea: [{ dieType: "d8", faceValue: 7 }],
    });
    const sombrero = engine.getCard(welcomeToNightCityRetailElSombreronLaVenganzaLenta);

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEddies(P1)).toBe(2);
    expect(engine.getState().G.players[P1].spentEddies).toBe(0);
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(4);
  });

  it("may decline the payable Attack trigger without paying or gaining power", () => {
    const engine = attackSpentCorpoSecurityWithSombrero({
      eddies: 2,
      gigArea: [{ dieType: "d4", faceValue: 4 }],
    });
    const sombrero = engine.getCard(welcomeToNightCityRetailElSombreronLaVenganzaLenta);

    const result = engine.executeMove("resolveTrigger", { args: { pass: true } }, P1);

    expect(result).toMatchObject({ success: true });
    expect(engine.getEddies(P1)).toBe(2);
    expect(engine.getState().G.players[P1].spentEddies).toBe(0);
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(4);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("can pay the 2 Eddie cost by spending two ready Legends", () => {
    const engine = attackSpentCorpoSecurityWithSombrero({
      eddies: 0,
      gigArea: [{ dieType: "d4", faceValue: 4 }],
    });
    const sombrero = engine.getCard(welcomeToNightCityRetailElSombreronLaVenganzaLenta);

    resolveSombreroAttackTrigger(engine);

    expect(
      engine.getCardsInZone("legendArea", P1).filter((legend) => legend.meta.spent),
    ).toHaveLength(2);
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(8);
  });
});

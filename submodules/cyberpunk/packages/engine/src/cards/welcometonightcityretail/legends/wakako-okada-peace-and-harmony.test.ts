import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailWakakoOkadaPeaceAndHarmony,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const wakako = welcomeToNightCityRetailWakakoOkadaPeaceAndHarmony;

describe("Wakako Okada — Peace and Harmony", () => {
  it("has the exact blue Fixer Tyger Claws identity and two-ability DSL", () => {
    expect(wakako).toMatchObject({
      canonicalId: "wakako-okada-peace-and-harmony",
      slug: "wakako-okada-peace-and-harmony",
      name: "Wakako Okada",
      subname: "Peace and Harmony",
      displayName: "Wakako Okada: Peace and Harmony",
      type: "legend",
      color: "blue",
      classifications: ["Fixer", "Tyger Claws"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      rarity: "Rare",
      printNumber: "110",
      timingTriggers: ["call"],
      rulesText:
        "{Call} Choose one effect.\nGive a rival Unit -2 power this turn. // Draw 1.\n{Spend}: Decrease a Gig by up to 2.",
      abilities: [
        {
          kind: "triggered",
          text: "{Call} Choose one effect. Give a rival Unit -2 power this turn. // Draw 1.",
          trigger: { trigger: "call" },
          source: { selector: "self" },
          effects: [
            {
              effect: "chooseEffect",
              options: [
                {
                  id: "weaken",
                  label: "Give a rival Unit -2 power this turn",
                  effects: [
                    {
                      effect: "modifyPower",
                      target: {
                        selector: "card",
                        controller: "rival",
                        zones: ["field"],
                        cardTypes: ["unit"],
                        selection: { mode: "choose", min: 1, max: 1 },
                      },
                      value: -2,
                      duration: "turn",
                    },
                  ],
                },
                {
                  id: "draw",
                  label: "Draw 1",
                  effects: [{ effect: "draw", player: "friendly", amount: 1 }],
                },
              ],
            },
          ],
        },
        {
          kind: "triggered",
          text: "{Spend}: Decrease a Gig by up to 2.",
          trigger: { trigger: "activated" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedGig",
              target: {
                selector: "gig",
                amount: 1,
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
          costs: [{ cost: "spend", target: { selector: "self" } }],
          effects: [
            {
              effect: "adjustGig",
              target: { selector: "bound", id: "selectedGig" },
              maxAmount: 2,
              direction: "decrease",
              chooseUpTo: true,
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 1 to Call, turns face up, and rejects no available Eddie", () => {
    const success = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: wakako, faceDown: true }],
      eddies: 1,
    });
    success.spendAllLegends();
    success.callLegend(wakako, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getCard(wakako, "legendArea", P1).meta.faceDown).toBe(false);

    const short = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: wakako, faceDown: true }],
      eddies: 0,
    });
    short.spendAllLegends();
    expect(short.expectFailure(() => short.callLegend(wakako, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("on Call can give a rival Unit -2 power this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: wakako, faceDown: true }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    engine.callLegend(wakako, { as: P1 });
    engine.resolveChooseEffect("weaken", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const rival = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2);
    expect(getEffectivePower(engine.getState(), rival.instanceId as string)).toBe(
      (welcomeToNightCityRetailCorpoSecurity.power ?? 0) - 2,
    );
    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), rival.instanceId as string)).toBe(
      welcomeToNightCityRetailCorpoSecurity.power ?? 0,
    );
  });

  it("on Call can draw 1 instead", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: wakako, faceDown: true }],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 2,
    });
    const handBefore = engine.getHandCount(P1);
    engine.callLegend(wakako, { as: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("spends to decrease a Gig by up to 2", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: wakako, faceDown: false, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 5 }],
    });

    engine.activateAbility(wakako, 1, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Wakako still needs the Gig decrease amount",
    });
    engine.resolveAdjustGig(3, { as: P1 });
    expect(engine.getCard(wakako, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getGigValue(P1)).toBe(3);
  });

  it("may decrease the chosen Gig by zero", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: wakako, faceDown: false, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 5 }],
    });
    engine.activateAbility(wakako, 1, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Wakako still needs the optional decrease amount",
    });
    engine.resolveAdjustGig(5, { as: P1 });
    expect(engine.getGigValue(P1)).toBe(5);
    expect(engine.getCard(wakako, "legendArea", P1).meta.spent).toBe(true);
  });
});

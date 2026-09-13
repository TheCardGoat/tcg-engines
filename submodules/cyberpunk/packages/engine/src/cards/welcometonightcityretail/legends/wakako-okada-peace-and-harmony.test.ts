import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailWakakoOkadaPeaceAndHarmony,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const wakako = welcomeToNightCityRetailWakakoOkadaPeaceAndHarmony;

describe("Wakako Okada — Peace and Harmony", () => {
  it("is a blue Fixer/Tyger Claws legend", () => {
    expect(wakako).toMatchObject({
      type: "legend",
      color: "blue",
      classifications: ["Fixer", "Tyger Claws"],
      printNumber: "110",
    });
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
});

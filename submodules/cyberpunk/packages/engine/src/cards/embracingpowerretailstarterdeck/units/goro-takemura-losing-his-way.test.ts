import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckVCorporateExile,
  embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Goro Takemura - Losing His Way", () => {
  it("is the exact 4-cost 4-power green Arasaka Corpo Unit with its conditional Attack buff", () => {
    const goro = embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay;

    expect(goro).toMatchObject({
      canonicalId: "goro-takemura-losing-his-way",
      slug: "goro-takemura-losing-his-way",
      name: "Goro Takemura",
      subname: "Losing His Way",
      displayName: "Goro Takemura: Losing His Way",
      type: "unit",
      color: "green",
      classifications: ["Arasaka", "Corpo"],
      cost: 4,
      power: 4,
      ram: 3,
      hasSellTag: false,
      timingTriggers: ["attack"],
      printNumber: "017",
      rarity: "Uncommon",
      rulesText: "{Attack} If all friendly Legends are face-up, this Unit has +5 power this turn.",
    });
    expect(goro.abilities).toEqual([
      expect.objectContaining({
        trigger: { trigger: "attack" },
        conditions: [{ condition: "allFriendlyLegendsFaceUp" }],
        effects: [
          {
            effect: "modifyPower",
            target: { selector: "self" },
            value: 5,
            duration: "turn",
          },
        ],
      }),
    ]);
  });

  it("gains +5 power on attack when all friendly Legends are face-up", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
            spent: false,
            hasLag: false,
          },
        ],
        legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: true }],
      },
    );

    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
      "field",
      P1,
    );
    engine.attackUnit(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(getEffectivePower(engine.getState(), goroId)).toBe(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay.power + 5,
    );

    engine.resolveFullFight({ as: P1 });
    engine.completeTurn({ as: P1 });

    expect(getEffectivePower(engine.getState(), goroId)).toBe(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay.power,
    );
  });

  it("does not gain power while a friendly Legend is still face-down", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
            spent: false,
            hasLag: false,
          },
        ],
        legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: true }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
      "field",
      P1,
    );
    engine.attackUnit(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(getEffectivePower(engine.getState(), goroId)).toBe(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay.power,
    );
  });
});

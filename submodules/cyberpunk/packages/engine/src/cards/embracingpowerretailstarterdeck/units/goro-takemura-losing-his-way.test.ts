import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaVCorporateExile,
  embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Goro Takemura - Losing His Way", () => {
  it("gains +5 power on attack when all friendly Legends are face-up", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
            spent: false,
            playedThisTurn: false,
          },
        ],
        legendArea: [{ card: alphaVCorporateExile, faceDown: false }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
      "field",
      P1,
    );
    engine.attackUnit(embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay, alphaCorpoSecurity, {
      as: P1,
    });

    expect(getEffectivePower(engine.getState(), goroId)).toBe(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay.power + 5,
    );
  });

  it("does not gain power while a friendly Legend is still face-down", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
            spent: false,
            playedThisTurn: false,
          },
        ],
        legendArea: [{ card: alphaVCorporateExile, faceDown: true }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
      "field",
      P1,
    );
    engine.attackUnit(embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay, alphaCorpoSecurity, {
      as: P1,
    });

    expect(getEffectivePower(engine.getState(), goroId)).toBe(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay.power,
    );
  });
});

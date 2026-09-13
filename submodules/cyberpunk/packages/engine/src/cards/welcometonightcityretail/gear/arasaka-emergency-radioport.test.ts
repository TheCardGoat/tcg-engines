import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailArasakaEmergencyRadioport,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailDexterDeshawnOffTheGrid,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const radioport = welcomeToNightCityRetailArasakaEmergencyRadioport;

describe("Arasaka Emergency Radioport", () => {
  it("is a red Arasaka/Cyberware gear", () => {
    expect(radioport).toMatchObject({
      type: "gear",
      color: "red",
      classifications: ["Arasaka", "Cyberware"],
      cost: 2,
      power: 2,
      printNumber: "023",
    });
  });

  it("when the host is spent, can look at and free-call a face-down GO SOLO Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [radioport],
        },
      ],
      legendArea: [
        { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: true },
        { card: theHeistRetailStarterDeckVCorporateExile, faceDown: false },
      ],
      eddies: 0,
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "legendArea", P1).meta
        .faceDown,
    ).toBe(false);
  });

  it("does not free-call a face-down Legend that is neither ARASAKA nor GO SOLO", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [radioport],
        },
      ],
      legendArea: [{ card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true }],
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDexterDeshawnOffTheGrid, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailDexterDeshawnOffTheGrid, "legendArea", P1).meta
        .faceDown,
    ).toBe(true);
  });

  it("does not bypass the once-per-rival-turn defensive Call limit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            spent: false,
            attachedGears: [radioport],
          },
        ],
        legendArea: [
          { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: true },
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: true },
        ],
        eddies: 1,
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.callLegend(theHeistRetailStarterDeckVCorporateExile, { as: P1 });
    engine.useBlocker(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "legendArea", P1).meta
        .faceDown,
    ).toBe(true);
  });
});

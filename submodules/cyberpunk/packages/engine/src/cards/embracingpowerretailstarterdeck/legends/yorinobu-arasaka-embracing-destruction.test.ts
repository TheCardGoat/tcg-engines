import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Yorinobu Arasaka - Embracing Destruction (Embracing Power retail starter)", () => {
  it("draws for the first friendly Arasaka Unit attack and discards below 20 Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDyingNightVSPistol],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
            faceDown: false,
          },
        ],
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    engine.resolveDiscardFromHand([welcomeToNightCityRetailDyingNightVSPistol], { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDyingNightVSPistol.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("does not trigger from a non-Arasaka Unit attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d12", faceValue: 12 },
          { dieType: "d8", faceValue: 8 },
        ],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("draws without discarding at 20 or more Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d12", faceValue: 12 },
          { dieType: "d8", faceValue: 8 },
        ],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});

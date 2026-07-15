import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailRoyceDonTCallMeSimon,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Royce - Don't Call Me Simon", () => {
  it("defeats a rival unit with power two or less on play", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRoyceDonTCallMeSimon],
        eddies: 5,
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not offer a 6-power rival unit as the low-Street-Cred target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRoyceDonTCallMeSimon],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [embracingPowerRetailStarterDeckMinotaur],
        gigArea: [{ dieType: "d8", faceValue: 8 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailRoyceDonTCallMeSimon, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBeUndefined();
  });
});

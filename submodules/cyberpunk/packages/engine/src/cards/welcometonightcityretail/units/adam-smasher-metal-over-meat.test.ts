import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailAdamSmasherMetalOverMeat,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Adam Smasher - Metal Over Meat", () => {
  it("defeats every other unit when played and leaves Adam on the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAdamSmasherMetalOverMeat],
        field: [embracingPowerRetailStarterDeckMinotaur],
        eddies: 9,
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailAdamSmasherMetalOverMeat, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailAdamSmasherMetalOverMeat.id,
    ]);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      embracingPowerRetailStarterDeckMinotaur.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});

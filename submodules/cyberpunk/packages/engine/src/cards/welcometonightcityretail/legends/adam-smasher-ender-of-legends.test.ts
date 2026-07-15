import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";

describe("Adam Smasher - Ender of Legends", () => {
  it("goes solo and defeats a chosen rival Unit on play", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false }],
        eddies: 9,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );
    const adamId = engine.findCardId(
      welcomeToNightCityRetailAdamSmasherEnderOfLegends,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: adamId as string } }, P1);
    expect(result.success).toBe(true);
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expectAttackCandidate(engine, welcomeToNightCityRetailAdamSmasherEnderOfLegends, { as: P1 });
  });

  it("still goes solo without creating a dangling choice when there is no rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false }],
      eddies: 9,
    });
    const adamId = engine.findCardId(
      welcomeToNightCityRetailAdamSmasherEnderOfLegends,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: adamId as string } }, P1);

    expect(result.success).toBe(true);
    expect(
      engine.getCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, "field", P1),
    ).toBeDefined();
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});

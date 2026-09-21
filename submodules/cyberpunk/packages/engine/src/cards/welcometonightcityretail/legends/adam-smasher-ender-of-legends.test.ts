import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailAdamSmasherMetalOverMeat,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMaxtacHeavy,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  expectAttackCandidate,
  expectEligibleTargets,
  expectPendingChoice,
  P1,
  P2,
} from "../../../testing/index.ts";

describe("Adam Smasher - Ender of Legends", () => {
  /**
   * Oracle: GO SOLO pays 9 €$ to play Adam as a ready, non-lagging Unit that
   * can attack this turn (CR 4.5, 11.25.1). PLAY then enters pending and its
   * controller must choose exactly one rival Unit, never a friendly Unit
   * (CR 10.16.1, 10.31, 11.20.1-2).
   */
  it("pays for GO SOLO, becomes attack-ready, and defeats exactly one chosen rival Unit on PLAY", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false }],
        eddies: 9,
        field: [{ card: welcomeToNightCityRetailMaxtacHeavy, spent: false }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: false },
        ],
      },
    );
    const adamId = engine.findCardId(
      welcomeToNightCityRetailAdamSmasherEnderOfLegends,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: adamId as string } }, P1);
    expect(result.success).toBe(true);
    // Adam has a Sell Tag, so CR 5.7.2 lets him pay 1 €$ toward his own cost;
    // GO SOLO then plays him ready. The remaining eight come from the Eddie pool.
    expect(engine.getEddies(P1)).toBe(1);
    const adam = engine.getCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, "field", P1);
    expect(adam.meta.spent).toBe(false);
    expect(adam.meta.hasLag).toBe(false);
    expect(expectPendingChoice(engine, "chooseTarget").chooserId).toBe(P1);
    expectEligibleTargets(
      engine,
      [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailSwordwiseHuscle],
      { as: P2, zone: "field" },
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCard(welcomeToNightCityRetailMaxtacHeavy, "field", P1)).toBeDefined();
    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P2)).toBeDefined();
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

  it("does not fire PLAY when it is Called rather than played", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: true }],
        eddies: 1,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );

    engine.callLegend(welcomeToNightCityRetailAdamSmasherEnderOfLegends, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2)).toBeDefined();
    expect(
      engine.getCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, "legendArea", P1).meta
        .faceDown,
    ).toBe(false);
  });

  it("is removed from the game when another real card defeats it after GO SOLO", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAdamSmasherMetalOverMeat],
      legendArea: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false }],
      eddies: 18,
    });
    const adamId = engine.findCardId(
      welcomeToNightCityRetailAdamSmasherEnderOfLegends,
      "legendArea",
      P1,
    );

    engine.executeMove("goSolo", { args: { cardId: adamId as string } }, P1);
    engine.playCard(welcomeToNightCityRetailAdamSmasherMetalOverMeat, { as: P1 });

    expect(engine.getCardsInZone("removedFromGame", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailAdamSmasherEnderOfLegends.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailAdamSmasherEnderOfLegends.id,
    );
  });
});

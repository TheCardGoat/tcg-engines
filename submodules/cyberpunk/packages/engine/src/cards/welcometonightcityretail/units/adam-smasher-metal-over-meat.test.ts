import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailAdamSmasherMetalOverMeat,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Adam Smasher - Metal Over Meat", () => {
  /**
   * Oracle: PLAY becomes pending only after this card is played (CR 10.16.1,
   * 11.20.1-2). "All other Units" includes both players' field Units, excludes
   * this Adam, and does not include a Legend outside the field (CR 4.2.1,
   * 10.1.3). Defeated Units move to their owners' trash (CR 9.19.1.1).
   */
  it("pays exactly 9 and defeats every other friendly and rival Unit but not itself or a non-field Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAdamSmasherMetalOverMeat],
        field: [embracingPowerRetailStarterDeckMinotaur],
        legendArea: [
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
        ],
        eddies: 9,
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailAdamSmasherMetalOverMeat, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailAdamSmasherMetalOverMeat.id,
    ]);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      embracingPowerRetailStarterDeckMinotaur.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, "legendArea", P1),
    ).toBeDefined();
    engine.expectNoPendingChoice();
  });

  it("defeats a real GO SOLO Legend as a Unit and removes it from the game", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAdamSmasherMetalOverMeat],
      legendArea: [
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
      ],
      eddies: 14,
    });
    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
      "legendArea",
      P1,
    );

    expect(engine.executeMove("goSolo", { args: { cardId: goroId as string } }, P1).success).toBe(
      true,
    );
    engine.playCard(welcomeToNightCityRetailAdamSmasherMetalOverMeat, { as: P1 });

    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCardsInZone("removedFromGame", P1).map((card) => card.definitionId)).toContain(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.id,
    );
    expect(
      engine.getCard(welcomeToNightCityRetailAdamSmasherMetalOverMeat, "field", P1),
    ).toBeDefined();
    engine.expectNoPendingChoice();
  });

  it("resolves and leaves Adam on the field when there are no other Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAdamSmasherMetalOverMeat],
      eddies: 9,
    });

    engine.playCard(welcomeToNightCityRetailAdamSmasherMetalOverMeat, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailAdamSmasherMetalOverMeat.id,
    ]);
    expect(engine.getCardsInZone("trash", P1)).toHaveLength(0);
    engine.expectNoPendingChoice();
  });
});

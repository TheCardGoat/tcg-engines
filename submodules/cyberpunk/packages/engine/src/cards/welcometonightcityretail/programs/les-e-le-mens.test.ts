import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailLesELeMens,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Les Élémens", () => {
  it("is a playable Program with a lowest-power target", () => {
    expect(welcomeToNightCityRetailLesELeMens.type).toBe("program");
    expect(welcomeToNightCityRetailLesELeMens.abilities[0]).toMatchObject({
      trigger: { trigger: "play" },
      effects: [{ effect: "moveCard", destination: "deckBottom", target: { lowestPower: true } }],
    });
  });

  it("bottom-decks the rival's uniquely lowest-power Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailLesELeMens], eddies: 5 },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailLesELeMens, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("deck", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
  });

  it("allows the player to choose among tied lowest-power Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailLesELeMens], eddies: 5 },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailLesELeMens, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      payload: { eligibleIds: expect.any(Array) },
    });
    if (choice?.type !== "chooseTarget") throw new Error("Expected a tied lowest-power choice.");
    expect(choice.payload.eligibleIds).toHaveLength(2);
    engine.resolveEffectTargetIds([choice.payload.eligibleIds![1]!], { as: P1 });

    expect(engine.getCardsInZone("field", P2)).toHaveLength(1);
  });
});

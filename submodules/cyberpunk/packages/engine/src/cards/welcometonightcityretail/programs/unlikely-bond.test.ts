import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailUnlikelyBond,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Unlikely Bond", () => {
  it("bottom-decks a ready friendly Unit, then a spent rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailUnlikelyBond],
        eddies: 4,
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );

    engine.playCard(welcomeToNightCityRetailUnlikelyBond, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      allowPendingChoice: true,
      reason: "Unlikely Bond next requires choosing a spent rival Unit.",
    });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("deck", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not bottom-deck a spent friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailUnlikelyBond],
      eddies: 4,
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
    });

    engine.playCard(welcomeToNightCityRetailUnlikelyBond, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });
});

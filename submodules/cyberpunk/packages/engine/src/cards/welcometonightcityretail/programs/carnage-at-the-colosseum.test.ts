import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCarnageAtTheColosseum,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Carnage At The Colosseum", () => {
  it("defeats a rival unit with less power than a friendly unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
        field: [embracingPowerRetailStarterDeckMinotaur],
        eddies: 6,
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not offer a rival unit that is not weaker than a friendly unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
        field: [welcomeToNightCityRetailTBugAmateurPhilosopher],
        eddies: 6,
      },
      {
        field: [embracingPowerRetailStarterDeckMinotaur, welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected target choice.");
    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toContain(welcomeToNightCityRetailCorpoSecurity.id);
    expect(eligibleDefinitions).not.toContain(embracingPowerRetailStarterDeckMinotaur.id);
  });
});

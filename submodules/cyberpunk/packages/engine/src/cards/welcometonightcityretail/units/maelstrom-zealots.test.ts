import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMaelstromZealots,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Maelstrom Zealots", () => {
  it("defeats the opposing rival Unit when it loses a fight as the attacker", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaelstromZealots, spent: false, hasLag: false }],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailMaelstromZealots,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    // Maelstrom (power 0) loses to Corpo Security (power 2). The loss trigger
    // fires from the trash and defeats the opposing defender anyway.
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMaelstromZealots.id,
    );
  });

  it("defeats its opponent after River Ward's defeated trigger suspends the fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailMaelstromZealots,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
            faceDown: false,
            spent: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailMaelstromZealots,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "scry") throw new Error("Expected River Ward's scry choice.");
    engine.resolveScryTo("trash", [choice.payload.revealedCardIds[0]!], { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});

import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailModdedKusanagi,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Modded Kusanagi retail printing", () => {
  it("attacks on the played turn with ADRENALINE", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailModdedKusanagi],
        eddies: 6,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailModdedKusanagi, { as: P1 });

    engine.attackUnit(
      welcomeToNightCityRetailModdedKusanagi,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    expect(engine.getAttackState()?.defenderId).toBe(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("returns to its owner's hand at the end of its controller's turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailModdedKusanagi],
      eddies: 6,
    });

    engine.playCard(welcomeToNightCityRetailModdedKusanagi, { as: P1 });
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailModdedKusanagi.id,
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailModdedKusanagi.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailModdedKusanagi.id,
    );
  });
});

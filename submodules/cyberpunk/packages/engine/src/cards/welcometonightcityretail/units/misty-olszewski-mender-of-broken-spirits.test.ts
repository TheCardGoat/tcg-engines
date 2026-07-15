import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Misty Olszewski - Mender of Broken Spirits", () => {
  it("guesses the top card type, adds a hit to hand, and readies 1 Eddie", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailMoxInciters],
        field: [welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits],
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.getState().G.players[P1]!.eddies = 0;
    engine.getState().G.players[P1]!.spentEddies = 1;

    engine.completeTurn({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardType");
    engine.resolveCardTypeChoice("unit", { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getActivePlayerId()).toBe(P2);
  });
});

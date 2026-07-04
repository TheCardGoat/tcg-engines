import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAllIsLost,
  alphaCorpoSecurity,
  alphaKiroshiOptics,
  alphaMantisBlades,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("All is Lost", () => {
  it("trashes 3 and moves a chosen Unit from among the trashed cards to hand", () => {
    // Deck top 3: a Unit plus two Gear. Only the Unit should be selectable
    // ("Add a Unit from among them"), and the Gear must stay in trash.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAllIsLost],
        deck: [alphaCorpoSecurity, alphaKiroshiOptics, alphaMantisBlades],
        eddies: 2,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailAllIsLost, { as: P1 });

    // The moveCard suspends as a chooseTarget offering the Unit(s) among the
    // just-trashed cards (the binding is filtered by cardTypes: ["unit"]).
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    const eligible =
      (choice as { payload?: { eligibleIds?: string[]; type?: string } }).payload?.eligibleIds ??
      [];
    expect((choice as { payload?: { type?: string } }).payload?.type).toBe("effectTarget");
    expect(eligible.length).toBe(1);

    engine.resolveEffectTargetIds(eligible, { as: P1 });

    const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
    expect(hand).toContain(alphaCorpoSecurity.id);
    // Gear was among the trashed but is NOT a Unit, so it stays in trash.
    expect(hand).not.toContain(alphaKiroshiOptics.id);
    const trash = engine.getCardsInZone("trash", P1).map((c) => c.definitionId);
    expect(trash).toContain(alphaKiroshiOptics.id);
    expect(trash).toContain(alphaMantisBlades.id);
  });
});

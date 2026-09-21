import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAllIsLost,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailEmergencyAtlus,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("All is Lost", () => {
  /**
   * Oracle: resolve the two sentences in order (CR 10.2): trash the top three
   * cards individually (CR 11.7.2.1.1), then its controller chooses exactly
   * one Unit from only those cards and moves it to hand. Existing trash and
   * non-Units are ineligible; if fewer than three cards or no Unit exists,
   * resolve as much as possible without a dangling choice (CR 10.2.1, 10.7).
   */
  it("pays 1, trashes exactly the top 3, and offers only their Units to its controller", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAllIsLost],
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailEmergencyAtlus,
          welcomeToNightCityRetailKiroshiOptics,
        ],
        trash: [welcomeToNightCityRetailFieldOperator],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );
    const existingTrashId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "trash", P1);

    engine.playCard(welcomeToNightCityRetailAllIsLost, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    expect(choice?.chooserId).toBe(P1);
    const payload = choice?.payload as
      | { eligibleIds?: string[]; type?: string; min?: number; max?: number }
      | undefined;
    const eligible = payload?.eligibleIds ?? [];
    expect(payload?.type).toBe("effectTarget");
    expect(payload?.min).toBe(1);
    expect(payload?.max).toBe(1);
    expect(eligible).toHaveLength(2);
    expect(eligible).not.toContain(existingTrashId);
    const corpoId = engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "trash", P1);
    const atlusId = engine.findCardId(welcomeToNightCityRetailEmergencyAtlus, "trash", P1);
    expect(eligible).toEqual(expect.arrayContaining([corpoId, atlusId]));

    engine.resolveEffectTargetIds([corpoId as string], { as: P1 });

    const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
    expect(hand).toContain(welcomeToNightCityRetailCorpoSecurity.id);
    const trash = engine.getCardsInZone("trash", P1).map((c) => c.definitionId);
    expect(trash).toContain(welcomeToNightCityRetailEmergencyAtlus.id);
    expect(trash).toContain(welcomeToNightCityRetailKiroshiOptics.id);
    expect(trash).toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(trash).toContain(welcomeToNightCityRetailAllIsLost.id);
    engine.expectNoPendingChoice();
  });

  it("trashes 3 non-Units and continues without offering an impossible Unit choice", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAllIsLost],
        deck: [
          welcomeToNightCityRetailKiroshiOptics,
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailKiroshiOptics,
        ],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );
    const deckBefore = engine.getCardsInZone("deck", P1).length;

    engine.playCard(welcomeToNightCityRetailAllIsLost, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckBefore - 3);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("trash", P1)).toHaveLength(4);
  });

  it("trashes as many as possible from a two-card deck and can recover its Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAllIsLost],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailMantisBlades],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.judgeStackDeck(
      [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailMantisBlades],
      { as: P1, replace: true },
    );

    engine.playCard(welcomeToNightCityRetailAllIsLost, { as: P1 });
    const unitId = engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "trash", P1);
    engine.resolveEffectTargetIds([unitId as string], { as: P1 });

    expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "hand", P1)).toBeDefined();
    expect(engine.getCard(welcomeToNightCityRetailMantisBlades, "trash", P1)).toBeDefined();
    engine.expectNoPendingChoice();
  });
});

import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailThreeMouthsOneDesire,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const threeMouths = welcomeToNightCityRetailThreeMouthsOneDesire;

describe("Three Mouths, One Desire", () => {
  it("searches the top 3 and can add extra cards for each friendly min Gig", () => {
    expect(threeMouths.abilities[0]?.effects[0]).toMatchObject({
      effect: "searchDeck",
      lookCount: 3,
      destination: "hand",
      reveal: false,
    });
  });

  it("adds 1 of the top 3 to hand and bottom-decks the rest without revealing the selection", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [threeMouths],
        deck: [
          welcomeToNightCityRetailKiroshiOptics,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
        ],
        eddies: 2,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(threeMouths, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("scry");
    engine.resolveScryTo("hand", [welcomeToNightCityRetailKiroshiOptics], { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorpoSecurity.id,
        welcomeToNightCityRetailFieldOperator.id,
      ]),
    );
    expect(engine.getEvents("cardsRevealed")).toHaveLength(0);
    expect(
      engine.getEvents("actionLog").some((log) => log.messageKey === "move.resolveSearchDeckNamed"),
    ).toBe(false);
  });
});

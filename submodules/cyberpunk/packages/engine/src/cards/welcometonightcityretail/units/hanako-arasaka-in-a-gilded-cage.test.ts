import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailHanakoArasakaInAGildedCage,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Hanako Arasaka - In A Gilded Cage", () => {
  it("searches the top four and reveals matching friendly Gig costs into hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHanakoArasakaInAGildedCage],
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailRebootOptics,
        ],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHanakoArasakaInAGildedCage, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailHanakoArasakaInAGildedCage.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailRebootOptics.id,
    ]);
    expect(
      engine
        .getCardsInZone("deck", P1)
        .map((card) => card.definitionId)
        .slice(-2),
    ).toEqual([welcomeToNightCityRetailFieldOperator.id, welcomeToNightCityRetailMantisBlades.id]);

    const revealed = engine.getEvents("cardsRevealed");
    expect(revealed).toHaveLength(1);
    expect(
      revealed[0]?.cardIds.map((cardId) => engine.getState().G.cardIndex[cardId]?.definitionId),
    ).toEqual([welcomeToNightCityRetailCorpoSecurity.id, welcomeToNightCityRetailRebootOptics.id]);

    const movedToHand = engine
      .getEvents("cardMoved")
      .filter((event) => event.fromZone === "deck" && event.toZone === "hand");
    expect(
      movedToHand.map((event) => engine.getState().G.cardIndex[event.cardId]?.definitionId),
    ).toEqual([welcomeToNightCityRetailCorpoSecurity.id, welcomeToNightCityRetailRebootOptics.id]);

    const revealLog = engine
      .getEvents("actionLog")
      .find((log) => log.messageKey === "move.searchDeck.revealSelected");
    expect(revealLog ? formatActionLog(revealLog, enMessages) : "").toBe(
      "Revealed 2 searched card(s): Corpo Security, Reboot Optics.",
    );

    const resolveLog = engine
      .getEvents("actionLog")
      .find((log) => log.messageKey === "move.resolveSearchDeckNamed");
    expect(resolveLog ? formatActionLog(resolveLog, enMessages) : "").toBe(
      "Searched the top 4 cards and added Corpo Security, Reboot Optics to hand. Bottom-decked 2.",
    );
  });
});

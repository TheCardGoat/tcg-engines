import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailHanakoArasakaInAGildedCage,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import { buildPlayerPrompt } from "../../../view/player-prompt.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Hanako Arasaka - In A Gilded Cage", () => {
  it("is the exact yellow Arasaka Corpo Netrunner with an optional top-four Gig-value search", () => {
    const hanako = welcomeToNightCityRetailHanakoArasakaInAGildedCage;

    expect(hanako).toMatchObject({
      canonicalId: "hanako-arasaka-in-a-gilded-cage",
      slug: "hanako-arasaka-in-a-gilded-cage",
      name: "Hanako Arasaka",
      subname: "In a Gilded Cage",
      displayName: "Hanako Arasaka: In a Gilded Cage",
      type: "unit",
      color: "yellow",
      classifications: ["Arasaka", "Corpo", "Netrunner"],
      cost: 4,
      power: 1,
      ram: 2,
      hasSellTag: false,
      timingTriggers: ["play"],
      printNumber: "046",
      rarity: "Rare",
      rulesText:
        "{Play} Search the top 4 cards of your deck. Reveal any number of cards with cost equal to any friendly Gig values and add them to your hand. Bottom-deck the rest.",
    });
    expect(hanako.abilities).toEqual([
      expect.objectContaining({
        trigger: { trigger: "play" },
        source: { selector: "self" },
        effects: [
          {
            effect: "scry",
            player: "friendly",
            amount: 4,
            destinations: [
              {
                zone: "hand",
                reveal: true,
                min: 0,
                max: 4,
                target: {
                  selector: "card",
                  controller: "friendly",
                  zones: ["deck"],
                  costEqualsGigValueOf: {
                    selector: "gig",
                    controller: "friendly",
                    amount: "all",
                  },
                },
              },
              { zone: "deckBottom", remainder: true, order: "random" },
            ],
          },
        ],
      }),
    ]);
  });

  it("chooses and reveals any subset whose costs match friendly Gig values", () => {
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
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHanakoArasakaInAGildedCage, { as: P1 });

    const playerPrompt = buildPlayerPrompt(engine.getState(), P1).choice;
    if (!playerPrompt || playerPrompt.type !== "scry") {
      throw new Error("Expected Hanako's player-safe scry prompt.");
    }
    expect(playerPrompt.payload.destinations[0]?.target?.allowedCosts).toEqual([2, 3]);

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "scry") throw new Error("Expected Hanako's scry choice.");
    expect(choice.chooserId).toBe(P1);
    expect(choice.payload.revealedCardIds).toHaveLength(4);
    expect(choice.payload.destinations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ zone: "hand", reveal: true, min: 0, max: 3 }),
        expect.objectContaining({ zone: "deckBottom", remainder: true, order: "random" }),
      ]),
    );
    engine.resolveScryTo(
      "hand",
      [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      { as: P1 },
    );

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailHanakoArasakaInAGildedCage.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailFieldOperator.id,
    ]);
    expect(
      engine
        .getCardsInZone("deck", P1)
        .map((card) => card.definitionId)
        .slice(-2),
    ).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailMantisBlades.id,
        welcomeToNightCityRetailRebootOptics.id,
      ]),
    );

    const revealed = engine.getEvents("cardsRevealed");
    expect(revealed).toHaveLength(1);
    expect(
      revealed[0]?.cardIds.map((cardId) => engine.getState().G.cardIndex[cardId]?.definitionId),
    ).toEqual([welcomeToNightCityRetailCorpoSecurity.id, welcomeToNightCityRetailFieldOperator.id]);

    const resolveLog = engine
      .getEvents("actionLog")
      .find((log) => log.messageKey === "move.resolveSearchDeckNamed");
    expect(resolveLog ? formatActionLog(resolveLog, enMessages) : "").toBe(
      "Searched the top 4 cards and added Corpo Security, Field Operator to hand. Bottom-decked 2.",
    );
  });

  it("may reveal none and randomizes all four together before bottom-decking", () => {
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
    engine.resolveScryTo("hand", [], { as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
    const originalOrder = [
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailFieldOperator.id,
      welcomeToNightCityRetailMantisBlades.id,
      welcomeToNightCityRetailRebootOptics.id,
    ];
    const bottomFour = engine
      .getCardsInZone("deck", P1)
      .map((card) => card.definitionId)
      .slice(-4);
    expect(bottomFour).toEqual(expect.arrayContaining(originalOrder));
    expect(bottomFour).not.toEqual(originalOrder);
    expect(engine.getEvents("cardsRevealed")).toHaveLength(0);
  });

  it("rejects a revealed card whose cost matches no friendly Gig value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHanakoArasakaInAGildedCage],
        deck: [
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailRebootOptics,
        ],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHanakoArasakaInAGildedCage, { as: P1 });
    const failure = engine.expectFailure(() =>
      engine.resolveScryTo("hand", [welcomeToNightCityRetailMantisBlades], { as: P1 }),
    );

    expect(failure.errorCode).toBe("INVALID_CARD");
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("scry");
    engine.resolveScryTo("hand", [welcomeToNightCityRetailCorpoSecurity], { as: P1 });
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
    ]);
  });

  it("searches only the top four and leaves the fifth card on top", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHanakoArasakaInAGildedCage],
        deck: [
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailMoxInciters,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHanakoArasakaInAGildedCage, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "scry") throw new Error("Expected Hanako's scry choice.");
    expect(choice.payload.revealedCardIds).toHaveLength(4);
    expect(choice.payload.revealedCardIds).not.toContain(
      engine.getCard(welcomeToNightCityRetailCorpoSecurity, "deck", P1).instanceId,
    );
    engine.resolveScryTo("hand", [], { as: P1 });

    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("offers only an empty optional selection when there are no friendly Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHanakoArasakaInAGildedCage],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailRebootOptics],
        eddies: 4,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHanakoArasakaInAGildedCage, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "scry") throw new Error("Expected Hanako's scry choice.");
    expect(choice.payload.destinations).toEqual(
      expect.arrayContaining([expect.objectContaining({ zone: "hand", min: 0, max: 0 })]),
    );
    engine.resolveScryTo("hand", [], { as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});

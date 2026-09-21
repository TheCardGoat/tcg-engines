import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailThreeMouthsOneDesire,
} from "@tcg/cyberpunk-cards";
import { buildPlayerPrompt } from "../../../view/player-prompt.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const threeMouths = welcomeToNightCityRetailThreeMouthsOneDesire;

describe("Three Mouths, One Desire", () => {
  it("has the exact blue Braindance/Doll identity and mandatory-base search DSL", () => {
    expect(threeMouths).toMatchObject({
      canonicalId: "three-mouths-one-desire",
      slug: "three-mouths-one-desire",
      name: "Three Mouths, One Desire",
      displayName: "Three Mouths, One Desire",
      type: "program",
      color: "blue",
      classifications: ["Braindance", "Doll"],
      cost: 2,
      power: null,
      ram: 3,
      hasSellTag: true,
      rarity: "Common",
      printNumber: "137",
      timingTriggers: ["play"],
      reminderText: ["Discard programs after they resolve."],
      rulesText:
        "Search the top 3 cards of your deck. Add 1 to your hand. You may add 1 more for each friendly min Gig. Bottom-deck the rest.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "searchDeck",
              player: "friendly",
              lookCount: 3,
              target: { selector: "card", controller: "friendly", zones: ["deck"] },
              select: {
                kind: "upTo",
                min: 1,
                max: {
                  type: "basePlusPerCount",
                  base: 1,
                  multiplier: 1,
                  target: {
                    selector: "gig",
                    controller: "friendly",
                    amount: "all",
                    minValue: 1,
                    maxValue: 1,
                  },
                },
              },
              reveal: false,
              destination: "hand",
              remainder: { zone: "deckBottom", order: "random" },
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 2 and rejects one less before searching", () => {
    const createEngine = (eddies: number) => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [threeMouths],
        deck: 0,
        eddies,
      });
      for (const legend of engine.getCardsInZone("legendArea", P1)) {
        engine.judgeSpendCard(legend, { as: P1 });
      }
      return engine;
    };

    const success = createEngine(2);
    success.playCard(threeMouths, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    success.expectNoPendingChoice();

    const short = createEngine(1);
    expect(short.expectFailure(() => short.playCard(threeMouths, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
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

  it("requires the printed first card even when there are no friendly min Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [threeMouths],
        deck: [
          welcomeToNightCityRetailKiroshiOptics,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
        ],
        eddies: 2,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(threeMouths, { as: P1 });
    expect(engine.expectFailure(() => engine.resolveScryTo("hand", [], { as: P1 })).errorCode).toBe(
      "TOO_FEW_SELECTED",
    );
    expect(
      engine.expectFailure(() =>
        engine.resolveScryTo(
          "hand",
          [welcomeToNightCityRetailKiroshiOptics, welcomeToNightCityRetailCorpoSecurity],
          { as: P1 },
        ),
      ).errorCode,
    ).toBe("TOO_MANY_SELECTED");
    engine.resolveScryTo("hand", [welcomeToNightCityRetailKiroshiOptics], { as: P1 });
  });

  it("may add one extra card for each friendly min Gig, up to all three", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [threeMouths],
        deck: [
          welcomeToNightCityRetailKiroshiOptics,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
        ],
        eddies: 2,
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 1 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(threeMouths, { as: P1 });
    const prompt = buildPlayerPrompt(engine.getState(), P1).choice;
    if (!prompt || prompt.type !== "scry") throw new Error("Expected a scry prompt.");
    expect(prompt.payload.destinations[0]?.selectionLimitContext).toEqual({
      kind: "basePlusPerCount",
      base: 1,
      multiplier: 1,
      matchCount: 2,
      countedTarget: {
        selector: "gig",
        controller: "friendly",
        minValue: 1,
        maxValue: 1,
      },
    });
    engine.resolveScryTo(
      "hand",
      [
        welcomeToNightCityRetailKiroshiOptics,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailFieldOperator,
      ],
      { as: P1 },
    );

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailKiroshiOptics.id,
        welcomeToNightCityRetailCorpoSecurity.id,
        welcomeToNightCityRetailFieldOperator.id,
      ]),
    );
  });

  it("clamps the mandatory minimum to an empty deck without creating a choice", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [threeMouths],
      deck: 0,
      eddies: 2,
    });

    engine.playCard(threeMouths, { as: P1 });
    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
  });
});

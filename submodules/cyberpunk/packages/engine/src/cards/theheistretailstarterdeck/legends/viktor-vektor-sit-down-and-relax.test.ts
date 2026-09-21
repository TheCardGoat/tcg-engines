import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRiotShield,
  welcomeToNightCityRetailSandevistan,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectScryChoice } from "../../../testing/index.ts";
import type { ActionLogEvent } from "../../../types/game-events.ts";

const viktor = theHeistRetailStarterDeckViktorVektorSitDownAndRelax;
const createEngine = (
  deck: Parameters<typeof CyberpunkTestEngine.createWithFixture>[0]["deck"],
  eddies = 1,
) =>
  CyberpunkTestEngine.createWithFixture(
    { legendArea: [{ card: viktor, faceDown: true }], deck, eddies },
    undefined,
    { preserveDeckOrder: true },
  );

describe("Viktor Vektor — Sit Down and Relax", () => {
  it("has the exact yellow Merc Ripperdoc identity and optional top-five search DSL", () => {
    expect(viktor).toMatchObject({
      canonicalId: "viktor-vektor-sit-down-and-relax",
      slug: "viktor-vektor-sit-down-and-relax",
      name: "Viktor Vektor",
      subname: "Sit Down and Relax",
      displayName: "Viktor Vektor: Sit Down and Relax",
      type: "legend",
      color: "yellow",
      classifications: ["Merc", "Ripperdoc"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      rarity: "Epic",
      printNumber: "001",
      timingTriggers: ["call"],
      rulesText:
        "{Call} Search the top 5 cards of your deck. Reveal up to 2 Gears with cost 2 or less and add them to your hand. Bottom-deck the rest in a random order.",
      abilities: [
        {
          kind: "triggered",
          text: "{Call} Search the top 5 cards of your deck. Reveal up to 2 Gears with cost 2 or less and add them to your hand. Bottom-deck the rest in a random order.",
          trigger: { trigger: "call" },
          source: { selector: "self" },
          effects: [
            {
              effect: "scry",
              player: "friendly",
              amount: 5,
              destinations: [
                {
                  zone: "hand",
                  min: 0,
                  max: 2,
                  reveal: true,
                  target: {
                    selector: "card",
                    controller: "friendly",
                    zones: ["deck"],
                    cardTypes: ["gear"],
                    maxCost: 2,
                  },
                },
                { zone: "deckBottom", remainder: true, order: "random" },
              ],
            },
          ],
        },
      ],
    });
  });

  it("pays the one-Eddie Call cost, turns face up, and rejects zero Eddies", () => {
    const success = createEngine([welcomeToNightCityRetailCorpoSecurity]);
    success.spendAllLegends();
    success.callLegend(viktor, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getCard(viktor, "legendArea", P1).meta.faceDown).toBe(false);

    const short = createEngine([welcomeToNightCityRetailCorpoSecurity], 0);
    short.spendAllLegends();
    expect(short.expectFailure(() => short.callLegend(viktor, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
    expect(short.getCard(viktor, "legendArea", P1).meta.faceDown).toBe(true);
  });

  it("reveals and adds up to two eligible low-cost Gear, then bottom-decks the rest", () => {
    const engine = createEngine([
      welcomeToNightCityRetailDyingNightVSPistol,
      welcomeToNightCityRetailMantisBlades,
      welcomeToNightCityRetailSandevistan,
      welcomeToNightCityRetailCorpoSecurity,
    ]);
    engine.callLegend(viktor, { as: P1 });
    expectScryChoice(engine, {
      amount: 5,
      destination: { zone: "hand", min: 0, max: 2, reveal: true },
    });
    engine.resolveScryTo(
      "hand",
      [welcomeToNightCityRetailDyingNightVSPistol, welcomeToNightCityRetailMantisBlades],
      { as: P1 },
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailDyingNightVSPistol.id,
      welcomeToNightCityRetailMantisBlades.id,
    ]);
    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailSandevistan.id,
        welcomeToNightCityRetailCorpoSecurity.id,
      ]),
    );
    expect(engine.getEvents("cardsRevealed")).toHaveLength(1);
    const revealLog = engine
      .getEvents("actionLog")
      .find((event): event is ActionLogEvent => event.messageKey === "move.resolveSearchDeckNamed");
    expect(revealLog?.params).toMatchObject({
      selectedCardNames: "Dying Night: V's Pistol, Mantis Blades",
    });
  });

  it("rejects a Unit, a cost-three Gear, and a third eligible Gear", () => {
    const engine = createEngine([
      welcomeToNightCityRetailDyingNightVSPistol,
      welcomeToNightCityRetailMantisBlades,
      welcomeToNightCityRetailRiotShield,
      welcomeToNightCityRetailSandevistan,
      welcomeToNightCityRetailCorpoSecurity,
    ]);
    engine.callLegend(viktor, { as: P1 });
    expect(
      engine.expectFailure(() =>
        engine.resolveScryTo("hand", [welcomeToNightCityRetailCorpoSecurity], { as: P1 }),
      ).errorCode,
    ).toBe("INVALID_CARD");
    expect(
      engine.expectFailure(() =>
        engine.resolveScryTo("hand", [welcomeToNightCityRetailSandevistan], { as: P1 }),
      ).errorCode,
    ).toBe("INVALID_CARD");
    expect(
      engine.expectFailure(() =>
        engine.resolveScryTo(
          "hand",
          [
            welcomeToNightCityRetailDyingNightVSPistol,
            welcomeToNightCityRetailMantisBlades,
            welcomeToNightCityRetailRiotShield,
          ],
          { as: P1 },
        ),
      ).errorCode,
    ).toBe("TOO_MANY_SELECTED");
    engine.resolveScryTo("hand", [], { as: P1 });
  });

  it("normalizes an all-ineligible search to zero choices and resolves the optional search", () => {
    const engine = createEngine([
      welcomeToNightCityRetailCorpoSecurity,
      welcomeToNightCityRetailSandevistan,
    ]);
    engine.callLegend(viktor, { as: P1 });
    expectScryChoice(engine, {
      amount: 5,
      destination: { zone: "hand", min: 0, max: 0, reveal: true },
    });
    engine.resolveScryTo("hand", [], { as: P1 });
    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEvents("cardsRevealed")).toHaveLength(0);
  });

  it("searches only the top five and leaves the sixth card in the deck", () => {
    const engine = createEngine([
      welcomeToNightCityRetailDyingNightVSPistol,
      welcomeToNightCityRetailMantisBlades,
      welcomeToNightCityRetailRiotShield,
      welcomeToNightCityRetailKiroshiOptics,
      welcomeToNightCityRetailZetatechFaceplate,
      welcomeToNightCityRetailSandevistan,
    ]);
    engine.callLegend(viktor, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "scry") throw new Error("Expected Viktor's scry choice.");
    expect(choice.payload.revealedCardIds).toHaveLength(5);
    expect(
      choice.payload.revealedCardIds.map(
        (cardId) => engine.getState().G.cardIndex[cardId]?.definitionId,
      ),
    ).not.toContain(welcomeToNightCityRetailSandevistan.id);
    engine.resolveScryTo("hand", [], { as: P1 });
    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSandevistan.id,
    );
  });
});

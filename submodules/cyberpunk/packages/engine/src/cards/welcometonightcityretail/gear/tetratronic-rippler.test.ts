import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailTetratronicRippler,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const rippler = welcomeToNightCityRetailTetratronicRippler;

describe("Tetratronic Rippler", () => {
  it("has the exact blue Cyberware identity, attachment, and spent-host search DSL", () => {
    expect(rippler).toMatchObject({
      canonicalId: "tetratronic-rippler",
      slug: "tetratronic-rippler",
      name: "Tetratronic Rippler",
      displayName: "Tetratronic Rippler",
      type: "gear",
      color: "blue",
      classifications: ["Cyberware"],
      cost: 1,
      power: 1,
      ram: 2,
      hasSellTag: true,
      rarity: "Common",
      printNumber: "130",
      rulesText:
        "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit or Legend is spent, search the top card of your deck. You may trash it. (Otherwise, keep it on the top of your deck.)",
      reminderText: ["Otherwise, keep it on the top of your deck."],
      attachment: {
        text: "Equip to a unit or face-up legend.",
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field", "legendArea"],
          cardTypes: ["unit", "legend"],
          face: "faceUp",
        },
      },
      abilities: [
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: {
              event: "cardSpent",
              player: "friendly",
              target: { selector: "host" },
            },
          },
          source: { selector: "host" },
          effects: [
            {
              effect: "searchDeck",
              player: "friendly",
              lookCount: 1,
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["deck"],
              },
              select: { kind: "upTo", max: 1 },
              reveal: false,
              destination: "trash",
              remainder: { zone: "deckTop" },
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 1 and equips through the public command, rejecting one less", () => {
    const success = CyberpunkTestEngine.createWithFixture({
      hand: [rippler],
      field: [welcomeToNightCityRetailFieldOperator],
      eddies: 1,
    });
    for (const legend of success.getCardsInZone("legendArea", P1)) {
      success.judgeSpendCard(legend, { as: P1 });
    }
    success.attachGear(rippler, welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(
      success.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.attachedGearIds,
    ).toHaveLength(1);

    const short = CyberpunkTestEngine.createWithFixture({
      hand: [rippler],
      field: [welcomeToNightCityRetailFieldOperator],
      eddies: 0,
    });
    for (const legend of short.getCardsInZone("legendArea", P1)) {
      short.judgeSpendCard(legend, { as: P1 });
    }
    expect(
      short.expectFailure(() =>
        short.attachGear(rippler, welcomeToNightCityRetailFieldOperator, { as: P1 }),
      ).errorCode,
    ).toBe("INSUFFICIENT_EDDIES");
  });

  it("rejects a friendly face-down Legend and a rival Unit as hosts", () => {
    const faceDown = CyberpunkTestEngine.createWithFixture({
      hand: [rippler],
      legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: true }],
      eddies: 1,
    });
    expect(
      faceDown.expectFailure(() =>
        faceDown.attachGear(rippler, welcomeToNightCityRetailJackieWellesMamaSFavorite, {
          as: P1,
        }),
      ).errorCode,
    ).toBe("INVALID_CHOICE");

    const rival = CyberpunkTestEngine.createWithFixture(
      { hand: [rippler], eddies: 1 },
      { field: [welcomeToNightCityRetailFieldOperator] },
    );
    expect(
      rival.expectFailure(() =>
        rival.attachGear(rippler, welcomeToNightCityRetailFieldOperator, { as: P1 }),
      ).errorCode,
    ).toBe("INVALID_CHOICE");
    expect(rival.getCard(welcomeToNightCityRetailFieldOperator, "field", P2)).toBeDefined();
  });

  it("when the host is spent, lets you trash the top card of your deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [rippler],
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("scry");
    if (!choice || choice.type !== "scry") throw new Error("Expected scry");
    engine.resolveScryTo("trash", [choice.payload.revealedCardIds[0]!], { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getEvents("cardsRevealed")).toHaveLength(0);
    expect(
      engine.getEvents("actionLog").some((log) => log.messageKey === "move.resolveSearchDeckNamed"),
    ).toBe(false);
  });

  it("keeps the top card on top when you decline to trash it", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [rippler],
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveScryTo("deckTop", [], { as: P1 });

    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("triggers when its face-up Legend host is spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            faceDown: false,
            spent: false,
            attachedGears: [rippler],
          },
        ],
        eddies: 2,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("scry");
    if (!choice || choice.type !== "scry") throw new Error("Expected scry");
    engine.resolveScryTo("trash", [choice.payload.revealedCardIds[0]!], { as: P1 });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not trigger when an unrelated friendly Unit is spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            spent: false,
            hasLag: false,
            attachedGears: [rippler],
          },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("auto-resolves without a choice when the host is spent with an empty deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [rippler],
        },
      ],
      deck: 0,
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
  });
});

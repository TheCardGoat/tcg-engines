import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Sketchy Ripper", () => {
  it("has the exact yellow zero-power Ripperdoc identity and top-three Gear scry DSL", () => {
    expect(welcomeToNightCityRetailSketchyRipper).toMatchObject({
      canonicalId: "sketchy-ripper",
      slug: "sketchy-ripper",
      name: "Sketchy Ripper",
      displayName: "Sketchy Ripper",
      type: "unit",
      color: "yellow",
      classifications: ["Ganger", "Ripperdoc", "Scavenger"],
      cost: 2,
      power: 0,
      ram: 2,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "054",
      timingTriggers: ["attack"],
      reminderText: ["Units with power 0 don't steal Gigs."],
      rulesText:
        "{Attack} Search the top 3 cards of your deck. Reveal a Gear and add it to your hand. Bottom-deck the rest.\n(Units with power 0 don't steal Gigs.)",
      abilities: [
        {
          kind: "triggered",
          text: "{Attack} Search the top 3 cards of your deck. Reveal a Gear and add it to your hand. Bottom-deck the rest.",
          trigger: { trigger: "attack" },
          source: { selector: "self" },
          effects: [
            {
              effect: "scry",
              player: "friendly",
              amount: 3,
              destinations: [
                {
                  zone: "hand",
                  min: 0,
                  max: 1,
                  reveal: true,
                  target: {
                    selector: "card",
                    controller: "friendly",
                    zones: ["deck"],
                    cardTypes: ["gear"],
                  },
                },
                { zone: "deckBottom", remainder: true, order: "original" },
              ],
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 2 to play and enters with Lag", () => {
    const successEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSketchyRipper],
      eddies: 2,
    });
    for (const legend of successEngine.getCardsInZone("legendArea", P1)) {
      successEngine.judgeSpendCard(legend, { as: P1 });
    }
    successEngine.playCard(welcomeToNightCityRetailSketchyRipper, { as: P1 });
    expect(successEngine.getEddies(P1)).toBe(0);
    expect(
      successEngine.getCard(welcomeToNightCityRetailSketchyRipper, "field", P1).meta.hasLag,
    ).toBe(true);

    const failureEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSketchyRipper],
      eddies: 1,
    });
    for (const legend of failureEngine.getCardsInZone("legendArea", P1)) {
      failureEngine.judgeSpendCard(legend, { as: P1 });
    }
    expect(() => failureEngine.playCard(welcomeToNightCityRetailSketchyRipper, { as: P1 })).toThrow(
      /INSUFFICIENT_EDDIES/,
    );
  });

  it("searches the top 3 on attack, reveals a Gear, and adds it to hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailSketchyRipper, spent: false, hasLag: false }],
        deck: [welcomeToNightCityRetailMoxInciters, welcomeToNightCityRetailKiroshiOptics],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailSketchyRipper, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({ type: "scry" });
    const choice = engine.getPrompt(P1).choice;
    expect(choice).toMatchObject({
      type: "scry",
      payload: {
        source: {
          displayName: "Sketchy Ripper",
          rulesText: expect.stringContaining("Search the top 3 cards"),
        },
      },
    });
    if (choice?.type !== "scry") {
      throw new Error("Expected Sketchy Ripper to open the scry prompt.");
    }
    expect(choice.payload.revealedCardIds).toHaveLength(3);
    expect(choice.payload.revealedCardIds).toEqual(
      expect.arrayContaining([
        engine.getCard(welcomeToNightCityRetailMoxInciters, "deck", P1).instanceId,
        engine.getCard(welcomeToNightCityRetailKiroshiOptics, "deck", P1).instanceId,
      ]),
    );
    expect(choice.payload.destinations[0]?.target).toMatchObject({ cardTypes: ["gear"] });
    const selectedKiroshi = engine.getCard(welcomeToNightCityRetailKiroshiOptics, "deck", P1);
    expect(
      engine.executeMove(
        "resolveScry",
        { args: { destinations: [{ zone: "hand", cardIds: [selectedKiroshi.instanceId] }] } },
        P1,
      ),
    ).toMatchObject({ success: true });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    const movedToHandLog = engine
      .getEvents("actionLog")
      .find((log) => log.messageKey === "move.resolveSearchDeckNamed");
    expect(movedToHandLog ? formatActionLog(movedToHandLog, enMessages) : "").toBe(
      "Searched the top 3 cards and added Kiroshi Optics to hand. Bottom-decked 2.",
    );
  });

  it("can choose no Gear and still resolves the attack trigger", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailSketchyRipper, spent: false, hasLag: false }],
        deck: [welcomeToNightCityRetailMoxInciters],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailSketchyRipper, { as: P1 });
    expect(engine.getPrompt(P1).choice).toMatchObject({ type: "scry" });
    expect(
      engine.executeMove(
        "resolveScry",
        { args: { destinations: [{ zone: "hand", cardIds: [] }] } },
        P1,
      ).success,
    ).toBe(true);

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });

  it("rejects invalid scry selections", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailSketchyRipper, spent: false, hasLag: false }],
        deck: [
          welcomeToNightCityRetailMoxInciters,
          welcomeToNightCityRetailKiroshiOptics,
          welcomeToNightCityRetailMantisBlades,
        ],
        hand: [welcomeToNightCityRetailMantisBlades],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailSketchyRipper, { as: P1 });
    const kiroshi = engine.getCard(welcomeToNightCityRetailKiroshiOptics, "deck", P1);
    const mantisInDeck = engine
      .getCardsInZone("deck", P1)
      .find((card) => card.definitionId === welcomeToNightCityRetailMantisBlades.id);
    if (!mantisInDeck) {
      throw new Error("Expected Mantis Blades in the scry window.");
    }
    const mantisInHand = engine.getCard(welcomeToNightCityRetailMantisBlades, "hand", P1);
    const mox = engine.getCard(welcomeToNightCityRetailMoxInciters, "deck", P1);

    expect(
      engine.executeMove(
        "resolveScry",
        {
          args: {
            destinations: [
              {
                zone: "hand",
                cardIds: [kiroshi.instanceId, mantisInDeck.instanceId],
              },
            ],
          },
        },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "TOO_MANY_SELECTED" });

    expect(
      engine.executeMove(
        "resolveScry",
        {
          args: { destinations: [{ zone: "hand", cardIds: [mantisInHand.instanceId] }] },
        },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });

    expect(
      engine.executeMove(
        "resolveScry",
        {
          args: { destinations: [{ zone: "hand", cardIds: [mox.instanceId] }] },
        },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "INVALID_CARD" });
  });

  it("opens no scry choice when attacking with an empty deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: 0,
        field: [{ card: welcomeToNightCityRetailSketchyRipper, spent: false, hasLag: false }],
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );

    engine.attackRival(welcomeToNightCityRetailSketchyRipper, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
  });
});

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
});

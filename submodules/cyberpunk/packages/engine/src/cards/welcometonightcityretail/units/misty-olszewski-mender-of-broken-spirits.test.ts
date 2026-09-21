import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";
import { formatActionLog, enMessages } from "../../../logging/index.ts";
import type { ActionLogEvent } from "../../../types/game-events.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const misty = welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits;

describe("Misty Olszewski - Mender of Broken Spirits", () => {
  it("is the exact blue 3-cost 0-power Mystic Unit with cantAttack and its end-turn type guess", () => {
    expect(misty).toMatchObject({
      canonicalId: "misty-olszewski-mender-of-broken-spirits",
      slug: "misty-olszewski-mender-of-broken-spirits",
      name: "Misty Olszewski",
      subname: "Mender of Broken Spirits",
      displayName: "Misty Olszewski: Mender of Broken Spirits",
      type: "unit",
      color: "blue",
      classifications: ["Mystic"],
      cost: 3,
      power: 0,
      ram: 2,
      hasSellTag: false,
      printNumber: "119",
      rulesText:
        "This Unit can't attack.\nAt the end of your turn, choose a card type. Then, reveal the top card of your deck. If it's the chosen type, add it to your hand and ready 1 Eddie. Otherwise, trash it.\n(Card types include Unit, Gear, and Program.)",
      abilities: [
        {
          kind: "static",
          effects: [
            {
              effect: "grantRule",
              target: { selector: "self" },
              rule: "cantAttack",
              duration: "continuous",
            },
          ],
        },
        {
          kind: "triggered",
          trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
          source: { selector: "self" },
          effects: [
            {
              effect: "revealTopCardType",
              player: "friendly",
              cardTypes: ["unit", "gear", "program"],
            },
          ],
        },
      ],
    });
  });

  it("cannot attack a rival Unit or Gig area", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: misty, spent: false }] },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
    );

    expect(engine.getPrompt(P1).availableMoves.some((move) => move.moveId === "attackUnit")).toBe(
      false,
    );
    expect(
      engine.expectFailure(() =>
        engine.attackUnit(misty, welcomeToNightCityRetailFieldOperator, { as: P1 }),
      ).errorCode,
    ).toBe("CANT_ATTACK");
    expect(engine.expectFailure(() => engine.attackRival(misty, { as: P1 })).errorCode).toBe(
      "CANT_ATTACK",
    );
    expect(engine.getCard(misty, "field", P1).meta.spent).toBe(false);
  });

  it.each([
    { cardType: "unit" as const, card: welcomeToNightCityRetailMoxInciters },
    { cardType: "gear" as const, card: welcomeToNightCityRetailDyingNightVSPistol },
    { cardType: "program" as const, card: welcomeToNightCityRetailCorporateSurveillance },
  ])(
    "guesses $cardType, adds the matching top card to hand, and readies exactly 1 Eddie",
    ({ cardType, card }) => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          deck: [card],
          field: [misty],
          eddies: 0,
          spentEddies: 2,
        },
        {},
        { preserveDeckOrder: true },
      );

      engine.completeTurn({ as: P1 });

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toMatchObject({
        type: "chooseCardType",
        chooserId: P1,
        payload: { cardTypes: ["unit", "gear", "program"] },
      });
      expect(
        engine.executeMove("resolveCardTypeChoice", { args: { cardType: "legend" } }, P1),
      ).toMatchObject({ success: false, errorCode: "INVALID_CARD_TYPE" });
      engine.resolveCardTypeChoice(cardType, { as: P1 });

      const revealEvents = engine.getEvents("cardsRevealed");
      expect(revealEvents).toHaveLength(1);
      expect(revealEvents[0]?.cardIds).toHaveLength(1);
      expect(engine.getEvents("cardMoved")).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cardId: revealEvents[0]?.cardIds[0],
            fromZone: "deck",
            toZone: "hand",
            playerId: P1,
          }),
        ]),
      );
      expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(card.id);
      const log = engine
        .getEvents("actionLog")
        .find(
          (event): event is ActionLogEvent => event.messageKey === "trigger.revealTopCardType.hit",
        );
      expect(log?.params).toMatchObject({
        chosenType: cardType,
        revealedCardName: card.displayName,
        revealedType: cardType,
      });
      expect(log ? formatActionLog(log, enMessages) : "").toContain("added it to hand");
      expect(engine.getEddies(P1)).toBe(1);
      expect(engine.getState().G.players[P1]?.spentEddies).toBe(1);
      expect(engine.getActivePlayerId()).toBe(P2);
    },
  );

  it("trashes the top card on a missed guess and does not ready an Eddie", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailMoxInciters],
        field: [misty],
        eddies: 0,
        spentEddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardType");
    engine.resolveCardTypeChoice("gear", { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    expect(engine.getEvents("cardMoved")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fromZone: "deck",
          toZone: "trash",
          playerId: P1,
        }),
      ]),
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getActivePlayerId()).toBe(P2);
  });

  it("does not ready an Eddie on a hit when none are spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: [welcomeToNightCityRetailMoxInciters], field: [misty], eddies: 2, spentEddies: 0 },
      {},
      { preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P1 });
    engine.resolveCardTypeChoice("unit", { as: P1 });

    expect(engine.getEddies(P1)).toBe(2);
    expect(engine.getEvents("eddiesGained")).toHaveLength(0);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
  });

  it("triggers only at the end of its controller's turn and skips cleanly with an empty deck", () => {
    const rivalTurn = CyberpunkTestEngine.createWithFixture(
      { deck: [welcomeToNightCityRetailMoxInciters], field: [misty] },
      {},
      { activePlayerId: P2, preserveDeckOrder: true },
    );

    rivalTurn.completeTurn({ as: P2 });
    expect(rivalTurn.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(rivalTurn.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    expect(rivalTurn.getEvents("cardsRevealed")).toHaveLength(0);

    const emptyDeck = CyberpunkTestEngine.createWithFixture(
      { deck: 0, field: [misty] },
      {},
      { autoGainGig: false },
    );
    emptyDeck.completeTurn({ as: P1 });

    expect(emptyDeck.getState().G.turnMetadata.pendingChoice?.type).not.toBe("chooseCardType");
    expect(emptyDeck.getEvents("cardsRevealed")).toHaveLength(0);
    expect(emptyDeck.getCardsInZone("deck", P1)).toHaveLength(0);
    expect(emptyDeck.getActivePlayerId()).toBe(P2);
  });
});

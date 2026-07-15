import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";
import { formatActionLog, enMessages } from "../../../logging/index.ts";
import type { ActionLogEvent } from "../../../types/game-events.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Misty Olszewski - Mender of Broken Spirits", () => {
  it("guesses the top card type, adds a hit to hand, and readies 1 Eddie", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailMoxInciters],
        field: [welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits],
        eddies: 0,
        spentEddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardType");
    engine.resolveCardTypeChoice("unit", { as: P1 });

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
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    const log = engine
      .getEvents("actionLog")
      .find(
        (event): event is ActionLogEvent => event.messageKey === "trigger.revealTopCardType.hit",
      );
    expect(log?.params).toMatchObject({
      chosenType: "unit",
      revealedCardName: "Mox Inciters",
      revealedType: "unit",
    });
    expect(log ? formatActionLog(log, enMessages) : "").toContain(
      "selected unit, revealed Mox Inciters (unit), and because it matched, added it to hand",
    );
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getActivePlayerId()).toBe(P2);
  });

  it("trashes the top card on a missed guess and does not ready an Eddie", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailMoxInciters],
        field: [welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits],
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
});

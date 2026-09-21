import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailAfterpartyAtLizzieS } from "@tcg/cyberpunk-cards";
import { stripPrivateFields } from "../logging/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../testing/index.ts";

describe("sellCard", () => {
  it("keeps the rules-face-down Eddie public through the turn, then hides it", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAfterpartyAtLizzieS],
    });

    const result = engine.sellCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });

    const soldCard = engine.getCardsInZone("eddieArea", P1)[0];
    expect(soldCard?.definitionId).toBe(welcomeToNightCityRetailAfterpartyAtLizzieS.id);
    expect(soldCard?.meta).toMatchObject({
      faceDown: true,
      revealed: true,
      spent: false,
    });
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getState().G.players[P1]!.soldThisTurn).toBe(true);

    const sellLog = engine.getLastActionLog();
    if (sellLog?.messageKey !== "move.sellCard") throw new Error("Expected sell action log");
    expect(stripPrivateFields(sellLog, P2)?.params).toMatchObject({
      cardName: "Afterparty at Lizzie's",
    });

    const moveLog = result.moveLogs.find((log) => log.type === "sellCard");
    expect(moveLog).toMatchObject({
      type: "sellCard",
      cardName: "Afterparty at Lizzie's",
    });

    const rivalEddiesDuringTurn = engine.getFilteredView(P2).players[P1]?.zones.eddieArea;
    if (!Array.isArray(rivalEddiesDuringTurn)) throw new Error("Expected projected Eddie cards");
    expect(rivalEddiesDuringTurn[0]).toMatchObject({
      definitionId: welcomeToNightCityRetailAfterpartyAtLizzieS.id,
      cardName: "Afterparty at Lizzie's",
      faceDown: true,
      revealed: true,
    });

    engine.completeTurn({ as: P1 });

    expect(engine.getCardsInZone("eddieArea", P1)[0]?.meta.revealed).toBe(false);
    const rivalEddiesNextTurn = engine.getFilteredView(P2).players[P1]?.zones.eddieArea;
    if (!Array.isArray(rivalEddiesNextTurn)) throw new Error("Expected projected Eddie cards");
    expect(rivalEddiesNextTurn[0]).toMatchObject({
      definitionId: "",
      cardName: null,
      faceDown: true,
      revealed: false,
    });

    // Visibility cleanup must not rewrite the permanent public history.
    expect(moveLog).toMatchObject({ cardName: "Afterparty at Lizzie's" });
  });
});

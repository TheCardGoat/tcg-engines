import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07VinsmokeSanji061, op12Sanji041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-061 Vinsmoke Sanji", () => {
  test("may return one DON!! and draw with an included Vinsmoke Family Leader trait", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: [op07VinsmokeSanji061],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: op07VinsmokeSanji061.cost + 1,
    });
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op07VinsmokeSanji061, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay DON!! with a nonmatching Leader but does not draw", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07VinsmokeSanji061],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: op07VinsmokeSanji061.cost + 1,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op07VinsmokeSanji061, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.handCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the DON!! cost entirely", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: [op07VinsmokeSanji061],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: op07VinsmokeSanji061.cost + 1,
    });

    engine.playCard(op07VinsmokeSanji061, "south");
    const beforeDecline = engine.getView("south").players.south;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(beforeDecline.activeDon);
    expect(view.players.south.donDeckCount).toBe(beforeDecline.donDeckCount);
    expect(view.players.south.handCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});

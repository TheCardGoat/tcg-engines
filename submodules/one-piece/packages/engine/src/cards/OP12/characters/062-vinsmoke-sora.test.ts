import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op12Sanji041 } from "@tcg/op-cards";
import { op12VinsmokeSora062 } from "../../../../../cards/src/cards/OP12/characters/062-vinsmoke-sora.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-062 Vinsmoke Sora", () => {
  test("with Sanji and no more DON!! than the opponent adds rested DON!! then draws", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Sanji041,
        hand: [op12VinsmokeSora062],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op12VinsmokeSora062.cost,
        donDeckCount: 1,
      },
      { activeDon: 1 },
    );
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op12VinsmokeSora062, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 2, donDeckCount: 0 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does nothing when its DON!! field exceeds the opponent's", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Sanji041,
        hand: [op12VinsmokeSora062],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op12VinsmokeSora062.cost,
        donDeckCount: 1,
      },
      {},
    );

    engine.playCard(op12VinsmokeSora062, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 0, deckCount: 2, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});

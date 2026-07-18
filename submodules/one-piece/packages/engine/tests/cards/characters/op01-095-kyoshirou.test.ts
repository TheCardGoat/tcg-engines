import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Kyoshirou095 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-095 Kyoshirou", () => {
  test("draws on play at eight DON!! cards on the field but not at seven", () => {
    const eligible = OnePieceTestEngine.create({
      hand: [op01Kyoshirou095],
      deck: [eb01Doma005],
      activeDon: op01Kyoshirou095.cost,
      restedDon: 3,
    });
    const drawnId = eligible.findCardInZone("south", "deck", eb01Doma005);
    eligible.playCard(op01Kyoshirou095, "south");

    const eligibleView = eligible.getView("south");
    expect(eligibleView.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(eligibleView.players.south.deckCount).toBe(0);

    const ineligible = OnePieceTestEngine.create({
      hand: [op01Kyoshirou095],
      deck: [eb01Doma005],
      activeDon: op01Kyoshirou095.cost,
      restedDon: 2,
    });
    ineligible.playCard(op01Kyoshirou095, "south");

    expect(ineligible.getView("south").players.south).toMatchObject({
      hand: [],
      deckCount: 1,
    });
    expect(ineligible.getView("south").prompts).toHaveLength(0);
  });
});

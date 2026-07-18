import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op04King045 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-045 King", () => {
  test("draws the physical top card on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04King045],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op04King045.cost,
    });
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op04King045, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});

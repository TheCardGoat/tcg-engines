import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op07DraculeMihawk044 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-044 Dracule Mihawk", () => {
  test("draws the top card on play without revealing it to the opponent", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07DraculeMihawk044],
      deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025, eb01Doma005],
      activeDon: op07DraculeMihawk044.cost,
    });
    const handBefore = engine.getView("south").players.south.hand.length;
    const deckIds = [...engine.getState().players.south.deck];

    engine.playCard(op07DraculeMihawk044, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(handBefore);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(deckIds[0]);
    expect(
      engine
        .getView("north")
        .logs.map((entry) => entry.message)
        .join("\n"),
    ).not.toContain(eb01Doma005.name);
    expect(view.prompts).toHaveLength(0);
  });
});

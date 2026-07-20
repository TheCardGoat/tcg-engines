import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Izo041 } from "../../../../../cards/src/cards/OP13/characters/041-izo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-041 Izo", () => {
  test("draws exactly two cards for its controller on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Izo041],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: op13Izo041.cost,
    });

    engine.playCard(op13Izo041, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 2, deckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Hina050 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-050 Hina", () => {
  test("draws on play when five cards remain in hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Hina050, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: op05Hina050.cost,
    });

    engine.playCard(op05Hina050, "south");

    expect(engine.getView("south").players.south).toMatchObject({ handCount: 6, deckCount: 1 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not draw when six cards remain in hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        op05Hina050,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
      ],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: op05Hina050.cost,
    });

    engine.playCard(op05Hina050, "south");

    expect(engine.getView("south").players.south).toMatchObject({ handCount: 6, deckCount: 2 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

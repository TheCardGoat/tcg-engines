import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06VinsmokeReiju069 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-069 Vinsmoke Reiju", () => {
  test("draws 2 on play at equal DON!! with 5 cards or fewer in hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06VinsmokeReiju069, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 4,
      },
      { activeDon: 4 },
    );
    const handBefore = engine.getView("south").players.south.handCount;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op06VinsmokeReiju069, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(handBefore - 1 + 2);
    expect(view.players.south.deckCount).toBe(deckBefore - 2);
  });

  test("does not draw when its DON!! field count is greater", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06VinsmokeReiju069], activeDon: 5 },
      { activeDon: 4 },
    );
    const handBefore = engine.getView("south").players.south.handCount;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op06VinsmokeReiju069, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(handBefore - 1);
    expect(view.players.south.deckCount).toBe(deckBefore);
  });

  test("does not draw when more than 5 cards remain in hand after play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [
          op06VinsmokeReiju069,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
        ],
        activeDon: 4,
      },
      { activeDon: 4 },
    );
    const handBefore = engine.getView("south").players.south.handCount;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op06VinsmokeReiju069, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(handBefore - 1);
    expect(view.players.south.deckCount).toBe(deckBefore);
  });
});

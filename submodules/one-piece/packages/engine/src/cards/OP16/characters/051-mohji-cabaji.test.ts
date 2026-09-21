import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-051 Mohji & Cabaji", () => {
  test("[On Play] with 5 or less cards in hand draws 2 cards", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-051", "EB01-005", "OP16-004"], activeDon: 6 },
      {},
    );

    engine.playCard("OP16-051");

    expect(engine.getView("south").players.south.hand).toHaveLength(4);
  });

  test("with 6 or more cards in hand the draw does not trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-051", "EB01-005", "OP16-004", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 6,
      },
      {},
    );

    engine.playCard("OP16-051");

    expect(engine.getView("south").players.south.hand).toHaveLength(6);
  });
});

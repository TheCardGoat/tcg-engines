import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-092 Nico.Robin", () => {
  test("[On Play] trashing a cost-8-or-more Character from hand draws 2", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-092", "OP16-003"], activeDon: 1 }, {});

    engine.playCard("OP16-092");
    engine.acceptLeadingOptional("south");
    // The lone cost-8 Character auto-pays the trash cost.

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toContain(
      "OP16-003",
    );
  });

  test("without a cost-8-or-more Character the draw is not offered", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-092", "EB01-005"], activeDon: 1 }, {});

    engine.playCard("OP16-092");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

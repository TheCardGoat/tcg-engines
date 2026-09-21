import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-083 Kouzuki Oden", () => {
  test("[On Play] trashing a cost-8-or-more Character from hand draws 2", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-083", "OP16-003"], activeDon: 5 }, {});

    engine.playCard("OP16-083");
    engine.acceptLeadingOptional("south");
    // The lone cost-8 Character auto-pays the trash cost.

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toContain(
      "OP16-003",
    );
  });

  test("without a cost-8-or-more Character the draw is not offered", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-083", "EB01-005"], activeDon: 5 }, {});

    engine.playCard("OP16-083");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-005 Thatch", () => {
  test("costs -3 in hand while an 8000+ power Whitebeard Pirates Character is on the field", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-003"], hand: ["OP16-005"], activeDon: 5 },
      {},
    );

    // Cost 8, reduced to 5: playable with exactly 5 DON!!.
    engine.playCard("OP16-005");

    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(0);
    expect(south.restedDon).toBe(5);
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-005");
  });

  test("without the Whitebeard Pirates condition the full cost is due", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-005"], activeDon: 4 }, {});

    expect(() => engine.playCard("OP16-005")).toThrow();
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
  });
});

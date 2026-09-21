import { describe, expect, test } from "vite-plus/test";
import { op15BobbyFunk050, op15KellyFunk043 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-050 Bobby Funk", () => {
  test("gains +3000 power while Kelly Funk is on the field", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15BobbyFunk050, op15KellyFunk043] },
      {},
    );

    const powers = engine
      .getView("south")
      .players.south.characters.flatMap((card) => (card ? [card.power] : []));
    expect(powers).toEqual([6000, 3000]);
  });

  test("keeps base power without Kelly Funk", () => {
    const engine = OnePieceTestEngine.create({ character: [op15BobbyFunk050] }, {});

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(3000);
  });
});

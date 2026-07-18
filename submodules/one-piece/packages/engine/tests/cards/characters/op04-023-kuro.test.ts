import { describe, expect, test } from "vite-plus/test";
import { op04Kuro023 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-023 Kuro", () => {
  test("is a vanilla 6-cost 8000-power Character with no effect prompts", () => {
    expect(op04Kuro023).toMatchObject({ cost: 6, power: 8000, counter: 1000 });
    expect(op04Kuro023.effect).toBeUndefined();
    expect(op04Kuro023.effects).toBeUndefined();

    const engine = OnePieceTestEngine.create({ hand: [op04Kuro023], activeDon: 6 });
    engine.playCard(op04Kuro023, "south");

    expect(
      engine.getView("south").players.south.characters.filter((character) => character !== null),
    ).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

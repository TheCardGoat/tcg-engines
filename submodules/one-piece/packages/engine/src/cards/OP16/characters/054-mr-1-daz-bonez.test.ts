import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-054 Mr.1 Daz.Bonez", () => {
  test("[DON!! x1] [Your Turn] with 5 or more cards in hand gains +3000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP16-054", attachedDon: 1 }],
        hand: ["EB01-005", "OP16-004", "OP13-013", "OP13-013", "OP13-013"],
      },
      {},
    );

    const power = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-054")?.power;
    // 2000 base + 1000 from the attached DON!! + 3000 effect = 6000.
    expect(power).toBe(6000);
  });

  test("with 4 or fewer cards in hand the bonus does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-054", attachedDon: 1 }], hand: ["EB01-005", "OP16-004"] },
      {},
    );

    const power = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-054")?.power;
    expect(power).toBe(3000);
  });

  test("[On Play] draws 1 card", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-054", "EB01-005"], activeDon: 2 }, {});

    engine.playCard("OP16-054");

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
  });
});

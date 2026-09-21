import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-053 Roronoa Zoro", () => {
  test("[When Attacking] with 6 or less cards in hand draws 1 card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP16-053", attachedDon: 1 }],
        hand: ["EB01-005", "OP16-004", "OP13-013"],
        activeDon: 5,
      },
      {},
    );

    engine.asSouth().attack("OP16-053", engine.asNorth().leader());

    expect(engine.getView("south").players.south.hand).toHaveLength(4);
  });

  test("with 7 or more cards in hand the draw does not trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP16-053", attachedDon: 1 }],
        hand: ["EB01-005", "OP16-004", "OP13-013", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 5,
      },
      {},
    );

    engine.asSouth().attack("OP16-053", engine.asNorth().leader());

    expect(engine.getView("south").players.south.hand).toHaveLength(7);
  });
});

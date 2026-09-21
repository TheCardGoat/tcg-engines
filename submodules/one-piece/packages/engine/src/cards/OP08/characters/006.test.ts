import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP08-006", () => {
  test("[Your Turn] with [Kuromarimo] and [Chess] in trash gains +2000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP08-006", attachedDon: 2 }],
        trash: ["OP08-004", "OP08-005"],
        activeDon: 5,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "OP08-006");

    // 6000 base + 2000 from two attached DON!! + 2000 ability boost.
    const boosted = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === selfId);
    expect(boosted?.power).toBe(10000);

    engine.asSouth().attack("OP08-006", engine.asNorth().leader());
    expect(engine.getView("south").players.north.lifeCount).toBe(3);
  });

  test("[Your Turn] without both required trash cards keeps 6000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP08-006", attachedDon: 2 }],
        trash: ["OP08-004"],
        activeDon: 5,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "OP08-006");

    // 6000 base + 2000 from two attached DON!!, no ability boost.
    const unboosted = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === selfId);
    expect(unboosted?.power).toBe(8000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

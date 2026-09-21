import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-113 Boa Marigold", () => {
  test("gains [Blocker] with 2 or less Life cards", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-113"], life: ["OP13-013", "EB01-005"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const marigoldId = engine.findCardInZone("south", "character", "OP16-113");
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseBlocker("OP16-113");

    const north = engine.getView("south").players.north;
    expect(north.lifeCount).toBe(lifeBefore);
    // Marigold is South's card: the interceptor lands in South's trash.
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      marigoldId,
    );
  });

  test("without the Life condition the Character has no [Blocker]", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-113"], life: ["OP13-013", "EB01-005", "OP16-004"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    expect(() => engine.asSouth().chooseBlocker("OP16-113")).toThrow();
  });
});

import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-057 Captain Buggy's Our Savior!", () => {
  test("[Counter] with 2+ [Prisoner of Impel Down] cards saves the Leader with +4000", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-057"],
        character: ["OP16-042", "OP16-042"],
        activeDon: 5,
      },
      { character: ["OP16-004"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-004", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-057");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );

    // 5000 + 4000 >= 8000: saved.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("with fewer than 2 [Prisoner] cards the counter does not save", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-057"], character: ["OP16-042"], activeDon: 5 },
      { character: ["OP16-004"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-004", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-057");
    // The gate leaves the +4000 unapplied: the Leader takes the damage.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
  });
});

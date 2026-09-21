import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-095 Monkey.D.Luffy", () => {
  test("[On Play] a black Land of Wano Character gains [Unblockable] for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-095"],
        character: [{ cardId: "OP16-098", attachedDon: 1 }],
        activeDon: 2,
      },
      { character: ["OP16-088"], activeDon: 5 },
    );
    const yamatoId = engine.findCardInZone("south", "character", "OP16-098");
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard("OP16-095");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the unblockable target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [yamatoId] }, "south");

    // Unblockable: the blocker cannot intercept this attack.
    engine.asSouth().attack("OP16-098", engine.asNorth().leader());
    expect(() => engine.asNorth().chooseBlocker("OP16-088")).toThrow();
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });
});

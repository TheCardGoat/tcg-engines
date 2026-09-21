import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-032 Boa Hancock", () => {
  test("[On Play] a chosen opposing Character other than [Monkey.D.Luffy] cannot be rested", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-032"], activeDon: 7 },
      { character: ["OP13-013", "OP16-004"] },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP16-032");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the cannot-be-rested target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    // While the restriction holds, the frozen Character cannot attack (an
    // attack would rest it), while its neighbour still can.
    engine.endTurn("south");
    expect(() => engine.asNorth().attack("OP13-013", engine.asSouth().leader())).toThrow();
  });

  test("untargeted Characters may still be rested", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-032"], activeDon: 7 },
      { character: ["OP13-013", "OP16-004"] },
    );

    engine.playCard("OP16-032");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the cannot-be-rested target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-004", engine.asSouth().leader());
  });
});

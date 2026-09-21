import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-063 Kuzan", () => {
  test("[On Play] adds up to 2 DON!! from the DON!! deck and rests them", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-063"], activeDon: 7, donDeckCount: 5 },
      {},
    );

    engine.playCard("OP16-063");
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "2" }, "south");

    const south = engine.getView("south").players.south;
    // Play cost rested 7, plus the 2 added rested DON!!.
    expect(south.restedDon).toBe(9);
    expect(south.donDeckCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] [Once Per Turn] DON!! 1 stops an opposing Character from using [Blocker]", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-063"], hand: [], activeDon: 5 },
      { character: ["OP16-044"], activeDon: 5 },
    );
    const kuzanId = engine.findCardInZone("south", "character", "OP16-063");
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.activateEffect(kuzanId, "activateMain", "south");
    // The DON!! 1 cost auto-pays.
    const frozen = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (frozen?.kind !== "selectEntity") throw new Error("Expected the cannot-activate target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.findCardInZone("north", "character", "OP16-044")] },
      "south",
    );

    // The blocker is denied: the attack lands on the Leader unblocked.
    engine.endTurn("south");
    engine.asNorth().attack("OP16-044", engine.asSouth().leader());
    expect(() => engine.asNorth().chooseBlocker("OP16-044")).toThrow();
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore);

    // Once per turn: a second activation is rejected.
    expect(() => engine.activateEffect(kuzanId, "activateMain", "south")).toThrow();
  });
});

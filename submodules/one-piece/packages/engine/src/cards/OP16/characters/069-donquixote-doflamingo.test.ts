import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-069 Donquixote.Doflamingo", () => {
  test("[On Play] and [When Attacking] each add up to 1 active DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-069", attachedDon: 1 }], activeDon: 5, donDeckCount: 3 },
      {},
    );

    engine.asSouth().attack("OP16-069", engine.asNorth().leader());
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(6);
    expect(south.donDeckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] alone adds up to 1 active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-069"], activeDon: 7, donDeckCount: 3 },
      {},
    );

    engine.playCard("OP16-069");
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").players.south.donDeckCount).toBe(2);
  });
});

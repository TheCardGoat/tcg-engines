import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-117 Heso!!", () => {
  test("[Main] draws 1 and gives a rested DON!! to a Sky Island card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-117", "EB01-005"],
        character: ["OP15-060"],
        restedDon: 2,
        activeDon: 5,
      },
      {},
    );
    const enelId = engine.findCardInZone("south", "character", "OP15-060");

    engine.playCard("OP15-117");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    // The lone Sky Island card auto-receives the DON!!.

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(2);
    // The play cost rested 1 DON!!; the give moved another to Enel.
    expect(south.restedDon).toBe(2);
    expect(south.characters.find((card) => card?.instanceId === enelId)?.attachedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the DON!! leave it rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-117", "EB01-005"],
        character: ["OP15-060"],
        restedDon: 2,
        activeDon: 5,
      },
      {},
    );

    engine.playCard("OP15-117");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(2);
    // Only the play cost's rested DON!!: the give was declined.
    expect(south.restedDon).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

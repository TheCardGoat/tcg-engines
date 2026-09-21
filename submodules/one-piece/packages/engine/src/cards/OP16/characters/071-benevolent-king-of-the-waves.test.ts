import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-071 Benevolent King of the Waves", () => {
  test("[On Play] trashing a hand card adds a rested DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-071", "EB01-005"], activeDon: 3, donDeckCount: 3 },
      {},
    );

    engine.playCard("OP16-071");
    engine.acceptLeadingOptional("south");
    // The lone hand card auto-pays the trash cost.
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    // Play cost rested 3, plus the added rested DON!!.
    expect(south.restedDon).toBe(4);
    expect(south.donDeckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On K.O.] adds a rested DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-071", rested: true }], activeDon: 3, donDeckCount: 3 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const kingId = engine.findCardInZone("south", "character", "OP16-071");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-071");
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(kingId);
    expect(south.restedDon).toBe(1);
    expect(south.donDeckCount).toBe(2);
  });
});

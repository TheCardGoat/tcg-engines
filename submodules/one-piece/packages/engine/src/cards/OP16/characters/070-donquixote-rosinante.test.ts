import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-070 Donquixote.Rosinante", () => {
  test("[On Play] resting 2 DON!! for a Navy Leader adds a rested DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-060", hand: ["OP16-070"], activeDon: 5, donDeckCount: 3 },
      {},
    );

    engine.playCard("OP16-070");
    engine.acceptLeadingOptional("south");
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    // Play cost 2 rested 2, the effect cost rested 2 more, and 1 joined rested.
    expect(south.restedDon).toBe(5);
    expect(south.donDeckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining rests no extra DON!! and adds none", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-060", hand: ["OP16-070"], activeDon: 5, donDeckCount: 3 },
      {},
    );

    engine.playCard("OP16-070");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.restedDon).toBe(2);
    expect(south.donDeckCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

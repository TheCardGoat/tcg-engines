import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-075 Monkey.D.Garp", () => {
  test("[On Play] for a Navy Leader adds 1 active and 1 rested DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-060", hand: ["OP16-075"], activeDon: 5, donDeckCount: 4 },
      {},
    );

    engine.playCard("OP16-075");
    const active = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (active?.kind !== "chooseOption") throw new Error("Expected the active DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    const rested = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (rested?.kind !== "chooseOption") throw new Error("Expected the rested DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.donDeckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a Navy Leader nothing is added", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-075"], activeDon: 5, donDeckCount: 4 },
      {},
    );

    engine.playCard("OP16-075");

    const south = engine.getView("south").players.south;
    expect(south.donDeckCount).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

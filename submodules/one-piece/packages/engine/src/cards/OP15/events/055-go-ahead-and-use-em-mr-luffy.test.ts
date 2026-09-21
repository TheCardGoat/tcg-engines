import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-055 Go Ahead and Use 'Em, Mr. Luffy!!", () => {
  test("[Main] choose one: draw 2 cards", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP15-055", "EB01-005"], activeDon: 3 }, {});

    engine.playCard("OP15-055");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] choose one: a Dressrosa Character gains [Blocker] until the opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-055"], character: ["OP15-014"], activeDon: 3 },
      {},
    );

    engine.playCard("OP15-055");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the blocker target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

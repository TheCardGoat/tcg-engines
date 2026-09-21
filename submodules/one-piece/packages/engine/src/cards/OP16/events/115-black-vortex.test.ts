import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-115 Black Vortex", () => {
  test("[Main] with a Blackbeard Leader returns a [Trigger] card from trash to hand", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-080", hand: ["OP16-115"], trash: ["OP15-019"], activeDon: 1 },
      {},
    );

    engine.playCard("OP16-115");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the return target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP15-019",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Black Vortex itself is excluded from the choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-080",
        hand: ["OP16-115"],
        trash: ["OP16-115", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP16-115");

    // No eligible [Trigger] card other than Black Vortex: nothing happens.
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-115");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

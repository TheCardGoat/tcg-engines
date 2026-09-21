import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-095 Gum-Gum Storm", () => {
  test("[Main] resting a DON!! with 15+ trash cards gives a Straw Hat card +3000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-022",
        hand: ["OP15-095"],
        trash: Array.from({ length: 15 }, () => "OP13-013"),
        activeDon: 5,
      },
      {},
    );
    const base = engine.getView("south").players.south.leader?.power ?? 0;

    engine.playCard("OP15-095");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );

    expect(engine.getView("south").players.south.leader?.power).toBe(base + 3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with fewer than 15 trash cards the boost does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-022", hand: ["OP15-095"], trash: 3, activeDon: 5 },
      {},
    );
    const base = engine.getView("south").players.south.leader?.power ?? 0;

    engine.playCard("OP15-095");
    engine.acceptLeadingOptional("south");
    // Resolve any target choice without a legal candidate.
    const view = engine.getView("south");
    if (view.prompts.length > 0) {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.leader?.power).toBe(base);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

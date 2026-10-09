import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-095 Gum-Gum Storm", () => {
  test("[Main] the paid Event becomes the fifteenth trash card and resting a DON!! gives a Straw Hat card +3000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-022",
        hand: ["OP15-095"],
        trash: Array.from({ length: 14 }, () => "OP13-013"),
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
  test("Counter grants its printed battle power and then expires", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP15-095", "ST02-002"], activeDon: 5, trash: 14, deck: ["ST02-003", "ST02-003"] },
      { activeDon: 2 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attachDon(e.leader("north"), 2);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP15-095");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(9000);

    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});

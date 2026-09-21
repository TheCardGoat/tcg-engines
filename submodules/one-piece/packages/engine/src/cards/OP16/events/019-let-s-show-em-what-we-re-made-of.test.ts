import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-019 Let's Show Em What We're Made Of", () => {
  test("[Main] plays up to 2 Whitebeard 8000-power Characters from hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-019", "OP16-004", "OP16-005", "OP13-013"], activeDon: 9 },
      {},
    );

    engine.playCard("OP16-019");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: play.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    const chars = engine.getView("south").players.south.characters.map((c) => c?.cardId);
    expect(chars).toContain("OP16-004");
    expect(chars).toContain("OP16-005");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Trigger] gives the Leader +1000 power when taken as Life damage", () => {
    const engine = OnePieceTestEngine.create(
      { life: ["OP16-019"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const base = engine.getView("south").players.south.leader?.power ?? 0;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    expect(engine.getView("south").players.south.leader?.power).toBe(base + 1000);
  });
});

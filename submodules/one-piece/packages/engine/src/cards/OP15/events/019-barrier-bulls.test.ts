import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-019 Barrier Bulls", () => {
  test("[Main] draws 1 and gives the Leader +1000 until the opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP15-019", "EB01-005"], activeDon: 3 }, {});
    const base = engine.getView("south").players.south.leader?.power ?? 0;

    engine.playCard("OP15-019");

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(2);
    expect(south.leader?.power).toBe(base + 1000);

    // The bonus expires at the end of the opponent's next End Phase.
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader?.power).toBe(base + 1000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader?.power).toBe(base);
  });

  test("[Trigger] may give an opposing Character -4000 power when taken as Life damage", () => {
    const engine = OnePieceTestEngine.create(
      { life: ["OP15-019"], activeDon: 5 },
      { character: ["OP13-013", "OP16-003"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(-1000);
  });
});

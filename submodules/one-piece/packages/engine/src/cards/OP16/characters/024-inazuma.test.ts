import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-024 Inazuma", () => {
  test("rests up to 1 opposing Character when K.O.'d by an opposing effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-024"] },
      { character: ["OP16-003"], hand: ["OP16-006"], activeDon: 8 },
    );
    const inazumaId = engine.findCardInZone("south", "character", "OP16-024");
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");

    engine.endTurn("south");
    engine.asNorth().play("OP16-006");
    engine.acceptLeadingOptional("north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [inazumaId] }, "north");

    // Inazuma's owner chooses the rest target from the opponent's board.
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [newgateId] }, "south");

    const southTrash = engine.getView("south").players.south.trash;
    expect(southTrash.map((card) => card.instanceId)).toContain(inazumaId);
    const north = engine.getView("south").players.north;
    expect(north.characters.find((card) => card?.instanceId === newgateId)?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the rest leaves the opposing board untouched", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-024"] },
      { character: ["OP16-003"], hand: ["OP16-006"], activeDon: 8 },
    );
    const inazumaId = engine.findCardInZone("south", "character", "OP16-024");
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");

    engine.endTurn("south");
    engine.asNorth().play("OP16-006");
    engine.acceptLeadingOptional("north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [inazumaId] }, "north");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === newgateId)
        ?.rested,
    ).toBe(false);
  });
});

import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-013 McGuy", () => {
  test("[On K.O.] may K.O. an opposing Character with 8000 base power or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-013", rested: true }] },
      { character: ["OP13-013", "OP16-003"], activeDon: 5 },
    );
    const mcguyId = engine.findCardInZone("south", "character", "OP16-013");
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-013");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([higumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      mcguyId,
    );
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      higumaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("choosing no target leaves the opposing board intact", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-013", rested: true }] },
      { character: ["OP13-013", "OP16-003"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-013");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    // "Up to 1": submitting no target declines the K.O.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.north.characters.map((c) => c?.instanceId)).toContain(
      higumaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-090 Tony Tony.Chopper", () => {
  test("[On Play] draws 2, trashes 2, then may K.O. a cost-1-or-less opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-090", "EB01-005", "OP16-004", "OP13-013", "OP13-013"],
        activeDon: 3,
      },
      { character: ["OP16-002"] },
    );
    const izoId = engine.findCardInZone("north", "character", "OP16-002");

    engine.playCard("OP16-090");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [izoId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      izoId,
    );
    expect(engine.getView("south").players.south.hand).toHaveLength(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Characters above cost 1 are not eligible", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-090", "EB01-005", "OP16-004", "OP13-013", "OP13-013"],
        activeDon: 3,
      },
      { character: ["OP16-003"] },
    );

    engine.playCard("OP16-090");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(engine.getView("south").players.north.characters.map((c) => c?.cardId)).toContain(
      "OP16-003",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

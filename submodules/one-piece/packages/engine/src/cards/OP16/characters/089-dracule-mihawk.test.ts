import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-089 Dracule Mihawk", () => {
  test("[On Play] draws 2, trashes 2, and gives an opposing Character +4 cost; [Rush] lets it attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-089", "EB01-005", "OP16-004", "OP13-013", "OP13-013"],
        activeDon: 6,
      },
      { character: [{ cardId: "OP13-013", rested: true }] },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP16-089");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the cost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.characters.find((card) => card?.instanceId === higumaId)?.cost).toBe(5);

    // [Rush (Character)]: the freshly played Character may attack a Character this turn.
    engine.asSouth().attack("OP16-089", "OP13-013");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      higumaId,
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-089", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-089",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

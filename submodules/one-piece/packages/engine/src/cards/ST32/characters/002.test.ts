import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("ST32-002", () => {
  test("[On Play] draws 1 and marks an opposing Character as unable to rest", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["ST32-002"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("ST32-002");
    const mark = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (mark?.kind !== "selectEntity") throw new Error("Expected the cannot-be-rested target.");
    expect(mark.candidates.map((c) => c.ref.id)).toContain(higumaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined marks nothing and still draws", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["ST32-002"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("ST32-002");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(1);
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId),
    ).toBeDefined();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

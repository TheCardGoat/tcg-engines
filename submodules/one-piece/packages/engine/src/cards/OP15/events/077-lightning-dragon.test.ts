import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-077 Lightning Dragon", () => {
  test("[Main] DON!! 1 draws and freezes a rested Character of 6000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-077"], activeDon: 5 },
      { character: [{ cardId: "OP13-013", rested: true }, "OP16-003"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-077");
    // The DON!! cost auto-pays from the active DON!!
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the freeze target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([higumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(1);

    engine.endTurn("south");
    engine.endTurn("north");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

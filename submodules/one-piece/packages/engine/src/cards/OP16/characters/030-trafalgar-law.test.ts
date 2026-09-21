import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-030 Trafalgar Law", () => {
  test("[On Play] a rested opposing Character will not become active in the opponent's next Refresh Phase", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-030"], activeDon: 8 },
      {
        character: [
          { cardId: "OP13-013", rested: true },
          { cardId: "OP16-004", rested: true },
        ],
      },
    );
    const frozenId = engine.findCardInZone("north", "character", "OP13-013");
    const controlId = engine.findCardInZone("north", "character", "OP16-004");

    engine.playCard("OP16-030");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the freeze target.");
    expect(target.candidates.map((candidate) => candidate.ref.id).sort()).toEqual(
      [frozenId, controlId].sort(),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [frozenId] }, "south");

    engine.endTurn("south");
    engine.endTurn("north");

    const north = engine.getView("south").players.north;
    expect(north.characters.find((card) => card?.instanceId === frozenId)?.rested).toBe(true);
    expect(north.characters.find((card) => card?.instanceId === controlId)?.rested).toBe(false);
  });

  test("[End of Your Turn] sets all green Characters with cost 5 or less as active", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "OP16-030", rested: true },
          { cardId: "OP16-026", rested: true },
        ],
      },
      {},
    );
    const ivankovId = engine.findCardInZone("south", "character", "OP16-026");

    engine.endTurn("south");

    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === ivankovId)
        ?.rested,
    ).toBe(false);
  });
});

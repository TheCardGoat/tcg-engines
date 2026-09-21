import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-043 Usopp", () => {
  test("[On K.O.] may return an opposing Character with cost 5 or less to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-043", rested: true }] },
      { character: ["OP13-013", "OP16-003"], activeDon: 5 },
    );
    const usoppId = engine.findCardInZone("south", "character", "OP16-043");
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-043");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([higumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      usoppId,
    );
    // Card identities in the opposing hand are hidden; verify via game state.
    engine.findCardInZone("north", "hand", "OP13-013");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Characters above cost 5 are not eligible", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-043", rested: true }] },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-043");

    // Cost 8 Newgate is not eligible: the up-to target auto-declines.
    expect(engine.getView("south").players.north.characters.map((c) => c?.cardId)).toContain(
      "OP16-003",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

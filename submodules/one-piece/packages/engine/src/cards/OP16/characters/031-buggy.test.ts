import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-031 Buggy", () => {
  test("[On K.O.] may play a [Prisoner of Impel Down] card from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-031", rested: true }], hand: ["OP16-042"] },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const buggyId = engine.findCardInZone("south", "character", "OP16-031");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-031");
    // Declining the counter lets the battle K.O. complete.
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Buggy's play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(buggyId);
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-042");
    expect(south.hand.map((card) => card.cardId)).not.toContain("OP16-042");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with no [Prisoner of Impel Down] in hand nothing is played", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-031", rested: true }], hand: ["OP13-013"] },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const buggyId = engine.findCardInZone("south", "character", "OP16-031");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-031");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(buggyId);
    expect(south.characters.map((card) => card?.cardId)).not.toContain("OP16-042");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

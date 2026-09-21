import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-094 Portgas.D.Ace", () => {
  test("[On K.O.] the opponent trashes 2 cards from their hand", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-031", character: [{ cardId: "OP16-094", rested: true }], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5, hand: ["OP13-013", "EB01-005"] },
    );
    const aceId = engine.findCardInZone("south", "character", "OP16-094");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-094");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the opponent trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "north",
    );

    const north = engine.getView("south").players.north;
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      aceId,
    );
    expect(north.trash.map((card) => card.cardId)).toContain("OP13-013");
    expect(north.trash.map((card) => card.cardId)).toContain("EB01-005");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] [Once Per Turn] gives a rested DON!! to a Land of Wano Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-031", character: ["OP16-094"], restedDon: 2, activeDon: 5 },
      {},
    );
    const aceId = engine.findCardInZone("south", "character", "OP16-094");

    engine.activateEffect(aceId, "activateMain", "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (recipient?.kind !== "selectEntity") throw new Error("Expected the recipient.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.restedDon).toBe(1);
    expect(south.leader?.attachedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

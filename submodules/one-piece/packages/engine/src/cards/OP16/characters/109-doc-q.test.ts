import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-109 Doc Q", () => {
  test("[On K.O.] with a Blackbeard Pirates Leader draws and K.O.s up to 2 cost-1-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-080", character: [{ cardId: "OP16-109", rested: true }] },
      { character: ["EB01-005", "OP16-002", "OP16-003"], activeDon: 5 },
    );
    const domaId = engine.findCardInZone("north", "character", "EB01-005");
    const izoId = engine.findCardInZone("north", "character", "OP16-002");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-109");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. targets.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId, izoId] }, "south");

    const northTrash = engine.getView("south").players.north.trash.map((card) => card.instanceId);
    expect(northTrash).toContain(domaId);
    expect(northTrash).toContain(izoId);
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

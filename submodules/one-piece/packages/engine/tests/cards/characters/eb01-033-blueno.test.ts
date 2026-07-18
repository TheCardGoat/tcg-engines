import { describe, expect, test } from "vite-plus/test";
import { eb01Blueno033, eb01Kalifa031, op03Iceburg058, op03Tilestone064 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-033 Blueno", () => {
  test("pays DON!! -1 and maps included Water Seven cost-5 Characters across hand and trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Iceburg058,
      hand: [eb01Blueno033, eb01Kalifa031],
      trash: [op03Tilestone064, eb01Blueno033],
      activeDon: 5,
    });
    const handId = engine.findCardInZone("south", "hand", eb01Kalifa031);
    const trashId = engine.findCardInZone("south", "trash", op03Tilestone064);
    const excludedBluenoId = engine.findCardInZone("south", "trash", eb01Blueno033);

    engine.playCard(eb01Blueno033);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") {
      throw new Error("Expected Blueno's hand-and-trash Water Seven play choice.");
    }
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([handId, trashId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedBluenoId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [trashId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(trashId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb03Ulti039, op04Ulti043, op08PageOne092 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-092 Page One", () => {
  test("on play may play an Ulti costing 4 or less from trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08PageOne092],
      activeDon: op08PageOne092.cost,
      trash: [op04Ulti043, eb03Ulti039, eb01Doma005],
    });
    const eligibleId = engine.findCardInZone("south", "trash", op04Ulti043);
    const expensiveId = engine.findCardInZone("south", "trash", eb03Ulti039);
    const wrongNameId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(op08PageOne092, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Page One's trash play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongNameId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});

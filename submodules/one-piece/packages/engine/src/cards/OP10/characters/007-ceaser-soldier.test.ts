import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10CeaserSoldier007, op10Smiley009, op10Monet016 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-007 Ceaser Soldier", () => {
  test("plays only an Punk Hazard Character costing 2 or less from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10CeaserSoldier007, op10Monet016, op10Smiley009, eb01Doma005],
      activeDon: op10CeaserSoldier007.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op10Monet016);
    const expensiveId = engine.findCardInZone("south", "hand", op10Smiley009);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op10CeaserSoldier007, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Ceaser Soldier's play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});

import {
  eb01Doma005,
  op01Crocodile067,
  op01MsAllSunday079,
  op01OfficerAgents087,
  op09Mr1DazBonez055,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Mr2BonKureiBentham091 } from "../../../../../cards/src/cards/OP14EB04/characters/091-mr-2-bon-kurei-bentham.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-091 Mr.2.Bon.Kurei(Bentham)", () => {
  test("on K.O. offers its controller eligible Baroque Works Characters from hand or trash and plays the selected physical identity", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01MsAllSunday079, op14eb04Mr2BonKureiBentham091],
        character: [op14eb04Mr2BonKureiBentham091],
        trash: [op09Mr1DazBonez055, op01Crocodile067, eb01Doma005, op01OfficerAgents087],
      },
      { hand: [op12UrsaShock096], activeDon: op12UrsaShock096.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sourceId = engine.findCardInZone("south", "character", op14eb04Mr2BonKureiBentham091);
    const handEligibleId = engine.findCardInZone("south", "hand", op01MsAllSunday079);
    const trashEligibleId = engine.findCardInZone("south", "trash", op09Mr1DazBonez055);
    const excludedNameId = engine.findCardInZone("south", "hand", op14eb04Mr2BonKureiBentham091);
    const highCostId = engine.findCardInZone("south", "trash", op01Crocodile067);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);
    const wrongCategoryId = engine.findCardInZone("south", "trash", op01OfficerAgents087);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sourceId] }, "north");

    const decision = engine.pendingDecision("effectPlaySelection", "south");
    expect(decision.actorId).toBe("south");
    const play = decision.steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Bentham's play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([handEligibleId, trashEligibleId]),
    );
    for (const excludedId of [excludedNameId, highCostId, wrongTraitId, wrongCategoryId]) {
      expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    }
    engine.resolveDecision("effectPlaySelection", { selectedIds: [trashEligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(
      trashEligibleId,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handEligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may decline the optional play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Mr2BonKureiBentham091], trash: [op09Mr1DazBonez055] },
      { hand: [op12UrsaShock096], activeDon: op12UrsaShock096.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sourceId = engine.findCardInZone("south", "character", op14eb04Mr2BonKureiBentham091);
    const candidateId = engine.findCardInZone("south", "trash", op09Mr1DazBonez055);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sourceId] }, "north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([sourceId, candidateId]),
    );
    expect(view.players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});

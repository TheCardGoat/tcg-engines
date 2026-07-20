import {
  eb01Doma005,
  eb01MountainGod018,
  op14eb04EustassCaptainKidOp14014014,
  op14eb04ShachiPenguin006,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04MonkeyDLuffyOp14013013 } from "../../../../../cards/src/cards/OP14EB04/characters/013-monkey-d-luffy-op14-013.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-013 Monkey.D.Luffy", () => {
  test("searches the top five for an included Supernovas card other than Monkey.D.Luffy and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04MonkeyDLuffyOp14013013],
      deck: [
        op14eb04EustassCaptainKidOp14014014,
        op14eb04MonkeyDLuffyOp14013013,
        eb01Doma005,
        op14eb04ShachiPenguin006,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op14eb04MonkeyDLuffyOp14013013.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op14eb04EustassCaptainKidOp14014014);
    const excludedNameId = engine.findCardInZone("south", "deck", op14eb04MonkeyDLuffyOp14013013);
    const nonTraitId = engine.findCardInZone("south", "deck", eb01Doma005);
    const wrongTraitId = engine.findCardInZone("south", "deck", op14eb04ShachiPenguin006);
    const otherRemainderId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op14eb04MonkeyDLuffyOp14013013, "south");
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    expect(decision.actorId).toBe("south");
    const search = decision.steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Luffy's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    for (const excludedId of [excludedNameId, nonTraitId, wrongTraitId]) {
      expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
        false,
      );
    }
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Luffy's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    expect(submittedOrder).toEqual(
      expect.arrayContaining([excludedNameId, nonTraitId, wrongTraitId, otherRemainderId]),
    );
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(submittedOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking gives one selected opposing Character minus 1000 power for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04MonkeyDLuffyOp14013013, playedOnTurn: 0 }],
      },
      { character: [eb01Doma005], hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op14eb04MonkeyDLuffyOp14013013);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(luffyId, engine.leader("north"), "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Luffy's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      (eb01Doma005.power ?? 0) - 1000,
    );
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
  });

  test("when attacking may choose no opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04MonkeyDLuffyOp14013013, playedOnTurn: 0 }],
      },
      { character: [eb01Doma005], hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op14eb04MonkeyDLuffyOp14013013);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(luffyId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});

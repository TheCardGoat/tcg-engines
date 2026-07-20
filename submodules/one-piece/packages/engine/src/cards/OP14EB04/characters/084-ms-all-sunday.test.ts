import { eb01Doma005, op01RoronoaZoro001 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04CrocodileOp14079079 } from "../../../../../cards/src/cards/OP14EB04/leaders/079-crocodile-op14-079.ts";
import { op14eb04MsWednesday083 } from "../../../../../cards/src/cards/OP14EB04/characters/083-ms-wednesday.ts";
import { op14eb04MsAllSunday084 } from "../../../../../cards/src/cards/OP14EB04/characters/084-ms-all-sunday.ts";
import { op14eb04Mr4Babe093 } from "../../../../../cards/src/cards/OP14EB04/characters/093-mr-4-babe.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-084 Ms. All Sunday", () => {
  test("with an included Baroque Works Leader plays distinct cost-4-or-less and cost-1 Characters from trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op14eb04CrocodileOp14079079,
      hand: [op14eb04MsAllSunday084],
      trash: [op14eb04Mr4Babe093, op14eb04MsWednesday083, eb01Doma005],
      activeDon: op14eb04MsAllSunday084.cost,
    });
    const costFourId = engine.findCardInZone("south", "trash", op14eb04Mr4Babe093);
    const costOneId = engine.findCardInZone("south", "trash", op14eb04MsWednesday083);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(op14eb04MsAllSunday084, "south");
    let play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the first trash-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([costFourId, costOneId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [costFourId] }, "south");

    play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the cost-1 trash-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([costOneId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [costOneId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([costFourId, costOneId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("with a non-Baroque Works Leader offers no trash-play choice", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      hand: [op14eb04MsAllSunday084],
      trash: [op14eb04Mr4Babe093, op14eb04MsWednesday083],
      activeDon: op14eb04MsAllSunday084.cost,
    });

    engine.playCard(op14eb04MsAllSunday084, "south");

    expect(engine.getView("south").players.south.trash).toHaveLength(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

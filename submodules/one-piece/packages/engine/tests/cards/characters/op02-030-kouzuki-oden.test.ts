import { describe, expect, test } from "vite-plus/test";
import {
  op01Shanks120,
  op02Carrot029,
  op02Inuarashi027,
  op02KouzukiOden030,
  op02Usopp028,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-030 Kouzuki Oden", () => {
  test("once per turn, rests 3 DON!! to set itself active", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op02KouzukiOden030, rested: true, playedOnTurn: 0 }],
      activeDon: 3,
    });
    const odenId = engine.findCardInZone("south", "character", op02KouzukiOden030);

    engine.activateEffect(odenId, "activateMain", "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === odenId)?.rested).toBe(
      false,
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3 });

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: odenId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
  });

  test("on battle K.O., plays a green cost-3 included Land of Wano Character from deck and shuffles", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02KouzukiOden030, rested: true, playedOnTurn: 0 }],
        deck: [op02Inuarashi027, op02Usopp028, op02Carrot029],
      },
      {
        character: [{ card: op01Shanks120, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const odenId = engine.findCardInZone("south", "character", op02KouzukiOden030);
    const eligibleId = engine.findCardInZone("south", "deck", op02Inuarashi027);
    const wrongTraitId = engine.findCardInZone("south", "deck", op02Usopp028);
    const wrongCostId = engine.findCardInZone("south", "deck", op02Carrot029);

    engine.declareAttack(attackerId, odenId, "north");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Oden's deck-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(odenId);
    expect(view.players.south.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(view.players.south.deckCount).toBe(2);
    expect(view.logs.some((entry) => entry.message.includes("shuffles their deck"))).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});

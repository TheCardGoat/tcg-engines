import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02EdwardNewgate001,
  op02Squard009,
  op11ScaledNeptunian026,
  op12Kalgara099,
  op13LordOfTheCoast010,
  op14eb04ScaledNeptunian011,
  op14eb04Killer005,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-011 Scaled Neptunian", () => {
  test("trashes the number actually drawn when own-effect draws are locked", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EdwardNewgate001,
      character: [op12Kalgara099, op11ScaledNeptunian026],
      hand: [op02Squard009, op14eb04ScaledNeptunian011, eb01Doma005],
      life: [op14eb04Killer005],
      deck: [eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
      activeDon: op02Squard009.cost + op14eb04ScaledNeptunian011.cost,
    });

    engine.playCard(op02Squard009, "south");
    const handBeforeNeptunian = engine.getState().players.south.hand.length;
    const deckBeforeNeptunian = engine.getState().players.south.deck.length;

    engine.playCard(op14eb04ScaledNeptunian011, "south");

    expect(engine.getState().players.south.hand).toHaveLength(handBeforeNeptunian - 1);
    expect(engine.getState().players.south.deck).toHaveLength(deckBeforeNeptunian);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("draws and trashes once for each exact or compound Neptunian Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04ScaledNeptunian011, eb01Doma005],
      deck: [eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
      character: [op11ScaledNeptunian026, op13LordOfTheCoast010],
      activeDon: op14eb04ScaledNeptunian011.cost,
    });
    const originalHandId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnIds = [...engine.getState().players.south.deck];

    engine.playCard(op14eb04ScaledNeptunian011, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected the matching trash selection.");
    expect(trash).toMatchObject({ min: 3, max: 3 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([originalHandId, ...drawnIds]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [originalHandId, drawnIds[0]!, drawnIds[1]!] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([originalHandId, drawnIds[0], drawnIds[1]]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnIds[2]]);
    expect(view.prompts).toHaveLength(0);
  });

  test("Rush: Character attacks a Character but not the Leader on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04ScaledNeptunian011, eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005],
        activeDon: op14eb04ScaledNeptunian011.cost,
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op14eb04ScaledNeptunian011, "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");
    const neptunianId = engine.findCardInZone("south", "character", op14eb04ScaledNeptunian011);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: neptunianId,
        targetId: engine.leader("north"),
      }).reason,
    ).toContain("cannot be attacked");
    engine.declareAttack(neptunianId, targetId, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });
});

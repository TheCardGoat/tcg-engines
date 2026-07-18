import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op09Franky072 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-072 Franky", () => {
  test("may return two DON!! and trash a chosen hand card to draw two", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Franky072, eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      activeDon: op09Franky072.cost + 2,
    });
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const keptId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op09Franky072, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const returnDon = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(returnDon).toMatchObject({ kind: "payCost", min: 2, max: 2 });
    if (returnDon?.kind !== "payCost") throw new Error("Expected Franky's DON!! return cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: returnDon.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );
    const trash = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(trash).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (trash?.kind !== "payCost") throw new Error("Expected Franky's hand-trash cost.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual([discardId, keptId]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: donDeckBefore + 2 });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([keptId, ...drawnIds]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("can decline the On Play cost and later block an attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09Franky072, eb01Doma005],
        activeDon: op09Franky072.cost + 2,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const handId = engine.findCardInZone("south", "hand", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op09Franky072, "south");
    const frankyId = engine.findCardInZone("south", "character", op09Franky072);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      handId,
    );

    engine.endTurn("south");
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [frankyId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(frankyId);
    expect(view.prompts).toHaveLength(0);
  });
});

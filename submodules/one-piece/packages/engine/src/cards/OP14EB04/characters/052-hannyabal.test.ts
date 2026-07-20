import {
  eb01ArmyWolves032,
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02EmporioIvankov051,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Hannyabal052 } from "../../../../../cards/src/cards/OP14EB04/characters/052-hannyabal.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-052 Hannyabal", () => {
  test("may trash three selected hand cards to play an included Impel Down Character costing 6 or less", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        op14eb04Hannyabal052,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01ArmyWolves032,
        op02EmporioIvankov051,
        eb01MountainGod018,
      ],
      activeDon: op14eb04Hannyabal052.cost,
    });
    const paymentIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === eb01Doma005.id)
      .map((card) => card.instanceId)
      .filter((id): id is string => Boolean(id));
    const eligibleId = engine.findCardInZone("south", "hand", eb01ArmyWolves032);
    const expensiveId = engine.findCardInZone("south", "hand", op02EmporioIvankov051);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.playCard(op14eb04Hannyabal052, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected Hannyabal's hand-trash cost.");
    expect(payment).toMatchObject({ min: 3, max: 3 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: paymentIds }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Hannyabal's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(paymentIds),
    );
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([expensiveId, wrongTraitId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing or playing a hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Hannyabal052, eb01Doma005, eb01Fourtricks025, eb01ArmyWolves032],
      activeDon: op14eb04Hannyabal052.cost,
    });
    const hannyabalId = engine.findCardInZone("south", "hand", op14eb04Hannyabal052);
    const retainedIds = engine
      .getView("south")
      .players.south.hand.map((card) => card.instanceId)
      .filter((id): id is string => Boolean(id) && id !== hannyabalId);

    engine.playCard(op14eb04Hannyabal052, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(retainedIds);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and redirects an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Hannyabal052] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hannyabalId = engine.findCardInZone("south", "character", op14eb04Hannyabal052);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Hannyabal's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(hannyabalId);
    engine.resolveDecision("battleBlocker", { selectedIds: [hannyabalId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hannyabalId);
    expect(view.prompts).toHaveLength(0);
  });
});

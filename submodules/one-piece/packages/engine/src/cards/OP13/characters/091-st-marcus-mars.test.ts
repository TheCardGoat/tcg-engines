import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Kaido094, op04GumGumRedRoc056 } from "@tcg/op-cards";
import { op13StMarcusMars091 } from "../../../../../cards/src/cards/OP13/characters/091-st-marcus-mars.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-091 St. Marcus Mars", () => {
  test("on play may trash one selected hand card to K.O. an opposing base-cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13StMarcusMars091, eb01Doma005, eb01Fourtricks025],
        activeDon: op13StMarcusMars091.cost,
      },
      { character: [eb01Doma005, op01Kaido094] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", op01Kaido094);

    engine.playCard(op13StMarcusMars091, "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Mars's hand-trash payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Mars's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(eligibleId);
    expect(candidates).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the hand cost and K.O. effect", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13StMarcusMars091, eb01Fourtricks025], activeDon: op13StMarcusMars091.cost },
      { character: [eb01Doma005] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13StMarcusMars091, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("at seven trash resists an opponent effect, then blocks and can be K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op13StMarcusMars091, eb01Doma005],
        trash: Array.from({ length: 7 }, () => eb01Fourtricks025),
      },
      {
        hand: [op04GumGumRedRoc056],
        character: [{ card: op01Kaido094, playedOnTurn: 0 }],
        activeDon: op04GumGumRedRoc056.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const marsId = engine.findCardInZone("south", "character", op13StMarcusMars091);
    const removableId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op04GumGumRedRoc056, "north");
    const removal = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (removal?.kind !== "selectEntity") throw new Error("Expected Red Roc's removal target.");
    expect(removal.candidates.map((candidate) => candidate.ref.id)).not.toContain(marsId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [removableId] }, "north");

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Mars's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(marsId);
    engine.resolveDecision("battleBlocker", { selectedIds: [marsId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(marsId);
    expect(view.prompts).toHaveLength(0);
  });
});

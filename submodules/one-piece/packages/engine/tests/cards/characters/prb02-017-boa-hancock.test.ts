import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01MonkeyDLuffy024,
  prb02BoaHancock017,
  prb02Otama016,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-017 Boa Hancock", () => {
  test("trashes only a Trigger card to stop a chosen non-Luffy Character through the next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02BoaHancock017, prb02Otama016, prb02Otama016, eb01Doma005],
        activeDon: prb02BoaHancock017.cost,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op01MonkeyDLuffy024, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const triggerIds = engine
      .getState()
      .players.south.hand.filter(
        (instanceId) => engine.getState().cards[instanceId]?.cardId === prb02Otama016.id,
      );
    const nonTriggerId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const luffyId = engine.findCardInZone("north", "character", op01MonkeyDLuffy024);

    engine.playCard(prb02BoaHancock017, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Hancock's Trigger-card cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(triggerIds);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonTriggerId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [triggerIds[0]!] }, "south");

    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Hancock's Character target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(luffyId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: targetId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(targetId, engine.leader("south"), "north");
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger K.O.s only an opponent Character with cost 4 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        life: [prb02BoaHancock017],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Hancock's Trigger target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });
});

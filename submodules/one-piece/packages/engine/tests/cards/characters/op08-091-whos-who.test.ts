import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op08WhosWho091 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-091 Whos.Who", () => {
  test("on play may trash a chosen hand card to K.O. an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08WhosWho091, eb01Doma005, eb01Fourtricks025],
        activeDon: op08WhosWho091.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op08WhosWho091, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Whos.Who's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
  });

  test("Life Trigger K.O.s the attacking player's eligible Character without the hand cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op08WhosWho091] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const triggerId = engine.findCardInZone("north", "life", op08WhosWho091);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Whos.Who's Trigger target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
  });
});

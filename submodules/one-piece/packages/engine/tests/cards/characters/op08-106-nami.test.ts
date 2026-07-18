import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Shanks120,
  op08CharlottePoire104,
  op08Nami106,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-106 Nami", () => {
  test("trashes only a Trigger card, K.O.s a cost-5 Character, then draws at three hand cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08Nami106, op08CharlottePoire104, op08CharlottePoire104, eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005],
        activeDon: op08Nami106.cost,
      },
      { character: [eb01MountainGod018, op01Shanks120] },
    );
    const triggerCostId = engine.findCardInZone("south", "hand", op08CharlottePoire104);
    const excludedCostId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedTargetId = engine.findCardInZone("north", "character", op01Shanks120);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op08Nami106, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Nami's Trigger-card cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(triggerCostId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedCostId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [triggerCostId] }, "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected Nami's K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedTargetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger activates the same filtered On Play cost and result", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true },
        ],
      },
      {
        hand: [op08CharlottePoire104, op08CharlottePoire104],
        deck: [eb01Fourtricks025, eb01Doma005, eb01Doma005, eb01Doma005],
        life: [op08Nami106],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const costId = engine.findCardInZone("north", "hand", op08CharlottePoire104);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(costId);
    expect(view.prompts).toHaveLength(0);
  });
});

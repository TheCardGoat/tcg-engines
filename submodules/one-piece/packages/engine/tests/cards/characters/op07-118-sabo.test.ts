import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07Foxy071,
  op07Sabo118,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-118 Sabo", () => {
  test("trashes a chosen hand card to resolve both independent K.O. clauses", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Sabo118, eb01Doma005, eb01Fourtricks025],
        activeDon: op07Sabo118.cost,
      },
      { character: [eb01MountainGod018, eb01Fourtricks025, op07Foxy071] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const costFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const costThreeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", op07Foxy071);

    engine.playCard(op07Sabo118, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Sabo's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const firstKo = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (firstKo?.kind !== "selectEntity") throw new Error("Expected Sabo's cost-5 K.O.");
    expect(firstKo.candidates.map((candidate) => candidate.ref.id)).toContain(costFiveId);
    expect(firstKo.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costFiveId] }, "south");

    const secondKo = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (secondKo?.kind !== "selectEntity") throw new Error("Expected Sabo's cost-3 K.O.");
    expect(secondKo.candidates.map((candidate) => candidate.ref.id)).toEqual([costThreeId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costThreeId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([costFiveId, costThreeId]),
    );
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing a hand card or K.O.'ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07Sabo118, eb01Doma005], activeDon: op07Sabo118.cost },
      { character: [eb01MountainGod018] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op07Sabo118, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});

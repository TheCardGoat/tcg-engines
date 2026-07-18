import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Shanks120 } from "@tcg/op-cards";
import { op11Zeus106 } from "../../../../../cards/src/cards/OP11/characters/106-zeus.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-106 Zeus", () => {
  test("pays with either end of Life before K.O.'ing only a cost-5-or-less opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11Zeus106],
        life: [eb01Doma005, eb01MountainGod018],
        activeDon: op11Zeus106.cost,
      },
      { character: [eb01MountainGod018, op01Shanks120] },
    );
    const bottomLifeId = engine.findCardInZone("south", "life", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.playCard(op11Zeus106, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    expect(cost?.kind).toBe("chooseOption");
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Zeus's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});

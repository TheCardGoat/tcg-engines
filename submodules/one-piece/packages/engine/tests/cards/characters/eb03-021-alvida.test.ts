import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb03Alvida021 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-021 Alvida", () => {
  test("pays the hand cost, bottoms a low-power opponent, then an own low-cost Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Alvida021, eb01Doma005, eb01MountainGod018],
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: 4,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const ownLowCostId = engine.findCardInZone("south", "character", eb01Doma005);
    const otherOwnLowCostId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const opposingLowPowerId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb03Alvida021, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Alvida's hand-trash cost.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const lowPower = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(lowPower?.kind).toBe("selectEntity");
    if (lowPower?.kind !== "selectEntity") throw new Error("Expected Alvida's low-power target.");
    expect(lowPower.candidates.map((candidate) => candidate.ref.id)).toContain(opposingLowPowerId);
    expect(lowPower.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingLowPowerId] }, "south");

    const lowCost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(lowCost?.kind).toBe("selectEntity");
    if (lowCost?.kind !== "selectEntity") throw new Error("Expected Alvida's low-cost target.");
    expect(lowCost.candidates.map((candidate) => candidate.ref.id)).toContain(ownLowCostId);
    expect(lowCost.candidates.map((candidate) => candidate.ref.id)).toContain(otherOwnLowCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownLowCostId] }, "south");

    expect(engine.getState().players.north.deck).toContain(opposingLowPowerId);
    expect(engine.getState().players.south.deck).toContain(ownLowCostId);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardedId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

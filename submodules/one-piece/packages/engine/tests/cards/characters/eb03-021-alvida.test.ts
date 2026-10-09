import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb03Alvida021 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-021 Alvida", () => {
  test("selects both groups before either moves and lets their owner order the deck bottom", () => {
    let engine = OnePieceTestEngine.create(
      { hand: [eb03Alvida021, eb01Doma005], activeDon: 4 },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    engine.playCard(eb03Alvida021);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId] }, "south");
    expect(
      engine.getView("south").players.north.characters.some((card) => card?.instanceId === firstId),
    ).toBe(true);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    const step = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected second target group.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(firstId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [secondId] }, "south");
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: [secondId, firstId] },
      "north",
    );
    expect(engine.getState().players.north.deck.slice(-2)).toEqual([secondId, firstId]);
  });

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

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Alvida021, eb01Doma005, eb01MountainGod018],
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: 4,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    engine.playCard(eb03Alvida021, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: current cost reduced to three does not satisfy base-cost-three group", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-117", "EB03-021", "EB01-005"], activeDon: 10 },
      { character: ["P-040", "EB01-025"] },
    );
    const big = e.findCardInZone("north", "character", "P-040"),
      small = e.findCardInZone("north", "character", "EB01-025");
    e.asSouth().play("OP02-117");
    e.asSouth().chooseTargets(big);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === big)?.cost,
    ).toBe(3);
    e.asSouth().play("EB03-021");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("second group");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([small]);
    e.asSouth().chooseTargets(small);
    expect(e.findCardInZone("north", "deck", "EB01-025")).toBe(small);
    expect(e.findCardInZone("north", "character", "P-040")).toBe(big);
  });
});

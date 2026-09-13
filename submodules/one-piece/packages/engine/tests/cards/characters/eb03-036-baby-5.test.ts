import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, eb01PrinceBellett026, eb03Baby5036 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-036 Baby 5", () => {
  test("returns chosen DON!! before mapping up to two opposing base-cost-3 K.O. targets", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Baby5036],
        activeDon: 5,
      },
      {
        character: [eb01Doma005, eb01PrinceBellett026, eb01MountainGod018],
      },
    );
    const firstEligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondEligibleId = engine.findCardInZone("north", "character", eb01PrinceBellett026);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(eb03Baby5036);

    engine.acceptLeadingOptional("south");
    const cost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Baby 5's DON!! payment choice.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain("active-don:0");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    engine.acceptLeadingOptional("south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") throw new Error("Expected Baby 5's K.O. choice.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstEligibleId,
      secondEligibleId,
    ]);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstEligibleId, secondEligibleId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstEligibleId, secondEligibleId]),
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Baby5036],
        activeDon: 5,
      },
      {
        character: [eb01Doma005, eb01PrinceBellett026, eb01MountainGod018],
      },
    );

    engine.playCard(eb03Baby5036);
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
});

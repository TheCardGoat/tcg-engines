import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005 } from "@tcg/op-cards";
import { op15Laboon035 } from "../../../../../cards/src/cards/characters/op15-035-laboon.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-035 Laboon", () => {
  test("keeps a 7000-or-less base power Character and rests 2 own cards instead", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Laboon035, eb01Doma005], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const laboonId = engine.findCardInZone("south", "character", op15Laboon035);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [laboonId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const rest = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected the rest-2 payment.");
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const restTargets = [engine.leader("south"), domaId];
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: restTargets }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === laboonId)).toBe(true);
    expect(south.leader?.rested).toBe(true);
    expect(south.characters.find((card) => card?.instanceId === domaId)?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the replacement lets the K.O. through", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Laboon035], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const laboonId = engine.findCardInZone("south", "character", op15Laboon035);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [laboonId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(laboonId);
    expect(south.leader?.rested).toBe(false);
  });
});

import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Kaido061,
  op08ConquestOfTheSea077,
  op14eb04Kaido030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-077 Conquest of the Sea", () => {
  test("Main accepts an included Leader trait, returns two chosen DON!!, and K.O.s up to two cost-6-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01Kaido061,
        hand: [op08ConquestOfTheSea077],
        activeDon: 9,
        restedDon: 1,
      },
      { character: [eb01Doma005, eb01MountainGod018, op14eb04Kaido030] },
    );
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op14eb04Kaido030);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op08ConquestOfTheSea077);
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "rested-don:0"] },
      "south",
    );

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose up to two eligible Characters.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstTargetId,
      secondTargetId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstTargetId, secondTargetId] },
      "south",
    );

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstTargetId, secondTargetId]),
    );
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("pays the DON!! cost before a nonmatching Leader makes the post-colon K.O. do nothing", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08ConquestOfTheSea077],
        activeDon: 8,
      },
      { character: [eb01Doma005] },
    );
    const eventId = engine.findCardInZone("south", "hand", op08ConquestOfTheSea077);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op08ConquestOfTheSea077);
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "active-don:1"] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

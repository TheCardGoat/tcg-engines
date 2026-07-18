import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  eb02Enel052,
  op02Smoker093,
  op14eb04IceTime028,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-028 Ice Time", () => {
  test("maps the hand cost and prevents up to 2 power-10000-or-less Characters from attacking through the next opposing End Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02Smoker093,
        hand: [op14eb04IceTime028, eb01Fourtricks025, eb01Sanji014],
        activeDon: 5,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb02Enel052, playedOnTurn: 0 },
        ],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", op14eb04IceTime028);
    const costId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const keptHandId = engine.findCardInZone("south", "hand", eb01Sanji014);
    const firstSelectedId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondSelectedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooPowerfulId = engine.findCardInZone("north", "character", eb02Enel052);

    engine.playCard(op14eb04IceTime028);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Ice Time to publish its hand-trash cost.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([costId, keptHandId]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Ice Time to publish its opposing Character choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 2 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstSelectedId,
      secondSelectedId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstSelectedId, secondSelectedId] },
      "south",
    );

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, costId]),
    );
    engine.endTurn("south");
    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "north",
      attackerId: firstSelectedId,
      targetId: engine.leader("south"),
    });
    expect(failure.reason).toBe("The selected attacker cannot attack.");

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(firstSelectedId, engine.leader("south"), "north");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === firstSelectedId)?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("pays the pre-colon hand cost before a non-Navy Leader makes the restriction do nothing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04IceTime028, eb01Fourtricks025, eb01Sanji014],
      activeDon: 5,
    });
    const eventId = engine.findCardInZone("south", "hand", op14eb04IceTime028);
    const costId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const keptHandId = engine.findCardInZone("south", "hand", eb01Sanji014);

    engine.playCard(op14eb04IceTime028);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, costId]),
    );
    expect(view.players.south.hand.some((card) => card.instanceId === keptHandId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

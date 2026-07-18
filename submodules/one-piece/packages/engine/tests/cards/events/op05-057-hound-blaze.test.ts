import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05HoundBlaze057 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-057 Hound Blaze", () => {
  test("Main powers first, then offers either field and routes the chosen card to its owner's deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05HoundBlaze057],
        character: [eb01Doma005],
        activeDon: 2,
      },
      {
        character: [eb01Doma005],
      },
    );
    const selfId = engine.findCardInZone("south", "character", eb01Doma005);
    const opponentId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op05HoundBlaze057);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected a low-cost Character choice from either field.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selfId,
      opponentId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selfId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(selfId);
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === opponentId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger returns an opposing cost-3-or-less Character to that opponent's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        life: [op05HoundBlaze057],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

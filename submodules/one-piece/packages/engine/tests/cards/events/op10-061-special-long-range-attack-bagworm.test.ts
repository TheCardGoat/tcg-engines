import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Pell014,
  op09DocQ090,
  op09Pierre110,
  op10SpecialLongRangeAttackBagworm061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-061 Special Long-Range Attack!! Bagworm", () => {
  test("Main draws before returning an opposing cost-2 Character to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10SpecialLongRangeAttackBagworm061],
        deck: [eb01Doma005],
        activeDon: 3,
      },
      { character: [op09DocQ090, op05Pell014] },
    );
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", op09DocQ090);

    engine.playCard(op10SpecialLongRangeAttackBagworm061);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers cost-2 Characters from either field and returns the chosen card to its owner", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op09DocQ090],
      },
      {
        life: [op10SpecialLongRangeAttackBagworm061],
        character: [op09Pierre110],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingId = engine.findCardInZone("south", "character", op09DocQ090);
    const ownId = engine.findCardInZone("north", "character", op09Pierre110);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const decision = engine.pendingDecision("effectTargetSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the owner-neutral cost-2 Trigger choice.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      ownId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

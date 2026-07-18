import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op05Pell014,
  op09IceBlockPartisan115,
  op09Pierre110,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-115 Ice Block Partisan", () => {
  test("Main offers only a cost-3-or-less Character with a printed Trigger for K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09IceBlockPartisan115], activeDon: 1 },
      { character: [op09Pierre110, op05Pell014] },
    );
    const eligibleId = engine.findCardInZone("north", "character", op09Pierre110);
    const noTriggerId = engine.findCardInZone("north", "character", op05Pell014);

    engine.playCard(op09IceBlockPartisan115);

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the filtered Trigger Character choice.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(noTriggerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one card without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op09IceBlockPartisan115] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const handBefore = engine.getView("north").players.north.hand.length;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand).toHaveLength(handBefore + 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

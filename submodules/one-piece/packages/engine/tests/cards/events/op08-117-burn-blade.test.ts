import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op08BurnBlade117,
  op08Wyper110,
  op09BennBeckman009,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-117 Burn Blade", () => {
  test("Main trashes top Life before mapping the cost-7 K.O. boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08BurnBlade117], life: [eb01Doma005, op08Wyper110], activeDon: 5 },
      { character: [op09BennBeckman009] },
    );
    const topLifeId = engine.getState().players.south.life[0]!;
    const targetId = engine.findCardInZone("north", "character", op09BennBeckman009);

    engine.playCard(op08BurnBlade117);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      topLifeId,
    );
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger adds top Life to hand before choosing a replacement for top Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op08Wyper110],
        life: [op08BurnBlade117, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const replacementId = engine.findCardInZone("north", "hand", op08Wyper110);
    const paidLifeId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const lifeDecision = engine.pendingDecision("effectTargetSelection", "north");
    const lifeStep = lifeDecision.steps[0];
    expect(lifeStep?.kind).toBe("selectEntity");
    if (lifeStep?.kind !== "selectEntity") {
      throw new Error("Expected the replacement hand-card choice.");
    }
    expect(lifeStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([replacementId, paidLifeId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [replacementId] }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      paidLifeId,
    );
    expect(engine.getState().players.north.life[0]).toBe(replacementId);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

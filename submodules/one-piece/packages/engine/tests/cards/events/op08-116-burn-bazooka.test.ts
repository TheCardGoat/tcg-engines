import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Pell014,
  op08BurnBazooka116,
  op08Wyper110,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-116 Burn Bazooka", () => {
  test("Counter powers the defender, maps the optional top-or-bottom Life cost, and sets a chosen Shandian Warrior face-up", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op08BurnBazooka116, op08Wyper110],
        life: [eb01Doma005, op05Pell014],
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op08BurnBazooka116);
    const shandianId = engine.findCardInZone("north", "hand", op08Wyper110);
    const bottomLifeId = engine.getState().players.north.life.at(-1)!;
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const costDecision = engine.pendingDecision("effectCostAddLifeToHand", "north");
    expect(costDecision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [
        { id: "top", value: "top" },
        { id: "bottom", value: "bottom" },
      ],
    });
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "north");

    const lifeDecision = engine.pendingDecision("effectTargetSelection", "north");
    const lifeStep = lifeDecision.steps[0];
    expect(lifeStep?.kind).toBe("selectEntity");
    if (lifeStep?.kind !== "selectEntity") {
      throw new Error("Expected the filtered Shandian Warrior hand choice.");
    }
    expect(lifeStep.candidates.map((candidate) => candidate.ref.id)).toEqual([shandianId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [shandianId] }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      bottomLifeId,
    );
    expect(engine.getState().players.north.life[0]).toBe(shandianId);
    expect(engine.getState().cards[shandianId]?.faceUp).toBe(true);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

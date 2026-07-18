import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Hack012,
  op07SnakeDance055,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-055 Snake Dance", () => {
  test("Counter maps the battle recipient before the optional own-Character return", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op07SnakeDance055],
        character: [eb01Doma005],
        life: 2,
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op07SnakeDance055);
    const returnId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      returnId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger returns the chosen own Character as cost before the cost-5 opposing return", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Hack012],
      },
      {
        life: [op07SnakeDance055],
        character: [eb01Doma005, eb01Fourtricks025],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const ownCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const opponentId = engine.findCardInZone("south", "character", op05Hack012);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const costDecision = engine.pendingDecision("effectCostReturnCharacter", "north");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the Trigger controller's Character-return cost choice.");
    }
    expect(costStep.candidates).toHaveLength(2);
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [ownCostId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opponentId] }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      ownCostId,
    );
    expect(engine.getState().players.south.hand).toContain(opponentId);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05BartholomewKuma011,
  op05Pell014,
  op08ImperialFlame094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-094 Imperial Flame", () => {
  test("Counter uses the trashed Event in its ordered three-card cost before K.O.ing the attacker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05BartholomewKuma011, playedOnTurn: 0 }] },
      {
        hand: [op08ImperialFlame094],
        trash: [eb01Doma005, op05Pell014],
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op05BartholomewKuma011);
    const eventId = engine.findCardInZone("north", "hand", op08ImperialFlame094);
    const firstCostId = engine.findCardInZone("north", "trash", eb01Doma005);
    const secondCostId = engine.findCardInZone("north", "trash", op05Pell014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const costDecision = engine.pendingDecision("effectCostReturnTrashToDeck", "north");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected an ordered three-card Trash cost.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstCostId,
      secondCostId,
      eventId,
    ]);
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [eventId, firstCostId, secondCostId] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    expect(engine.getState().players.north.deck.slice(-3)).toEqual([
      eventId,
      firstCostId,
      secondCostId,
    ]);
    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      attackerId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main while the Trigger card remains unavailable to its Trash cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05BartholomewKuma011],
      },
      {
        life: [op08ImperialFlame094],
        trash: [eb01Doma005, op05Pell014, op05BartholomewKuma011],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op05BartholomewKuma011);
    const triggerId = engine.findCardInZone("north", "life", op08ImperialFlame094);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const costDecision = engine.pendingDecision("effectCostReturnTrashToDeck", "north");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the activated Main effect's Trash cost.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(triggerId);
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: costStep.candidates.map((candidate) => candidate.ref.id) },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      triggerId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

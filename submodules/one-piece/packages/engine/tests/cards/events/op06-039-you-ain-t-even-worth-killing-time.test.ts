import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01Crocodile067,
  op05Sabo007,
  op06YouAinTEvenWorthKillingTime039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-039 You Ain't Even Worth Killing Time!!", () => {
  test("Main lets the controller choose the rested cost-6 K.O. branch", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06YouAinTEvenWorthKillingTime039],
        activeDon: 4,
      },
      {
        character: [{ card: op05Sabo007, rested: true }],
      },
    );
    const targetId = engine.findCardInZone("north", "character", op05Sabo007);

    engine.playCard(op06YouAinTEvenWorthKillingTime039);

    const choiceDecision = engine.pendingDecision("effectActionChoice", "south");
    const choiceStep = choiceDecision.steps[0];
    expect(choiceStep?.kind).toBe("chooseOption");
    if (choiceStep?.kind !== "chooseOption") {
      throw new Error("Expected the rest-or-K.O. Main choice.");
    }
    expect(choiceStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main and maps the rest branch without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Sabo007, op01Crocodile067],
      },
      {
        life: [op06YouAinTEvenWorthKillingTime039],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", op05Sabo007);
    const excludedId = engine.findCardInZone("south", "character", op01Crocodile067);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "north");

    const restDecision = engine.pendingDecision("effectTargetSelection", "north");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the Trigger controller's cost-6 rest choice.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toContain(selectedId);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});

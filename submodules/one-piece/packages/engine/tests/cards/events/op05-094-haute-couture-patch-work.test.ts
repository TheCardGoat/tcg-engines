import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op03SoapSheep095,
  op05HauteCouturePatchWork094,
  op05Pell014,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-094 Haute Couture Patch Work", () => {
  test("Main reduces cost before mapping and freezing the effective cost-0 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05HauteCouturePatchWork094],
        activeDon: 1,
      },
      {
        character: [
          { card: op05Pell014, rested: true },
          { card: op01Hajrudin018, rested: true },
        ],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op05Pell014);
    const excludedId = engine.findCardInZone("north", "character", op01Hajrudin018);

    engine.playCard(op05HauteCouturePatchWork094);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const freezeDecision = engine.pendingDecision("effectTargetSelection", "south");
    const freezeStep = freezeDecision.steps[0];
    expect(freezeStep?.kind).toBe("selectEntity");
    if (freezeStep?.kind !== "selectEntity") {
      throw new Error("Expected the effective cost-0 freeze choice after reduction.");
    }
    expect(freezeStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(freezeStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    engine.endTurn("south");
    engine.endTurn("north");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === excludedId)?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("declining the first up-to choice still allows the independent Then freeze", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03SoapSheep095, op05HauteCouturePatchWork094],
        activeDon: 2,
      },
      {
        character: [{ card: eb01Doma005, rested: true }],
      },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op03SoapSheep095);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(0);

    engine.playCard(op05HauteCouturePatchWork094);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const freezeDecision = engine.pendingDecision("effectTargetSelection", "south");
    const freezeStep = freezeDecision.steps[0];
    expect(freezeStep?.kind).toBe("selectEntity");
    if (freezeStep?.kind !== "selectEntity") {
      throw new Error("Expected the independent Then freeze after declining the first choice.");
    }
    expect(freezeStep.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    engine.endTurn("south");
    engine.endTurn("north");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws 2 before the controller chooses the mandatory hand trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op05HauteCouturePatchWork094],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trashDecision = engine.pendingDecision("effectTrashFromHandSelection", "north");
    const trashStep = trashDecision.steps[0];
    expect(trashStep).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [firstDrawId] }, "north");

    expect(engine.getView("north").players.north.hand).toHaveLength(1);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      firstDrawId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
